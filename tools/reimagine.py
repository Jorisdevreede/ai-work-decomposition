"""
Experiment E2/E4: reimagine every automate and amplify task of a role through the seven
lenses, with Opus 5.5 (claude CLI), Sol 6.1 (codex CLI) and Grok 4.7 (grok CLI), all
constrained to schema/reimagine.schema.json.

  inmemory  the model works from what it knows; web tools off            (E2)
  grounded  the role's research digest from research/digests/<role>.md
            is added to the prompt; web tools still off                   (E4)

Writes runs/<variant>/<model>/<role>__<n>.json (the parsed answer) and keeps the raw
CLI output next to it on failure. Existing answers are skipped, so a rerun resumes.

Usage:
    python3 tools/reimagine.py --models opus sol grok --roles hrbp --chunk 8
    python3 tools/reimagine.py --models sol --team hr --workers 3
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SCHEMA_PATH = os.path.join(ROOT, "schema", "reimagine.schema.json")
SCHEMA_V1_PATH = os.path.join(ROOT, "schema", "reimagine-v1.schema.json")
SCHEMA_V2_PATH = os.path.join(ROOT, "schema", "taskgraph-v2.schema.json")
JEV_V2 = os.path.join(ROOT, "data", "jev_anatomy_v2.json")
#: Codex settings that keep a run off the web: no search tool, no app or browser plugins.
CODEX_OFFLINE = ["-c", 'web_search="disabled"',
                 "-c", 'plugins."codex-app-tools@openai-bundled".enabled=false',
                 "-c", 'plugins."browser@openai-bundled".enabled=false',
                 "-c", 'plugins."computer-use@openai-bundled".enabled=false',
                 "-c", 'plugins."unified-computer-use@openai-bundled".enabled=false']
MODELS = {"opus": "claude-opus-5-5", "sol": "gpt-6.1-sol", "grok": "grok-4.7"}
TIMEOUT = 1500

METHOD = """\
Method (seven lenses, asked of each task from the point of view of the person doing it):
1 faster: the same result in a fraction of the time; which steps disappear.
2 autonomous: what runs without the person, triggered by an event instead of a reminder.
3 ambitious: if this cost a tenth, what would the company want ten times more of, or done properly for the first time.
4 joy: take out the drudgery; what nobody misses, and what is left that people like.
5 options: instead of one draft, five; instead of one plan, scenarios.
6 altitude: one layer of abstraction up; the person stops doing the task and designs, checks and improves the system that does it.
7 reach: tasks of adjacent roles (in this team or another) this person can now take on.
Patterns: deterministic_software (rules can be written down, structured input, checkable output: build it fast with AI coding, run it without a model); llm_step (unstructured input to structured, checkable output inside a deterministic workflow); agent_with_gate (several steps, tools, exceptions; a person approves before it counts); copilot (the person stays the lead: briefings, drafts, options, practice); keep_human (presence, trust, liability).
Autonomy: 0 manual, 1 assisted, 2 partial (AI drafts, person does), 3 conditional (AI does, person approves each), 4 high (person handles exceptions), 5 full.
Evidence grades: E0 imagined, E1 plausible from model knowledge, E2 a named product does this today, E3 a documented case. Never invent a product, a customer case or a URL; if unsure, grade E0 or E1 and say 'model knowledge'.
speedup: how many times faster the task is end to end after the change (1 = no change).
"""

METHOD_V1 = """\
Method v1. For each task, from the point of view of the person doing it:
faster: which steps disappear, and how long the steps that stay will take. Give time_saved_pct for the whole task, including the review the person still does.
autonomous: which event starts it, what runs without the person, and where the gate is.
ambitious: pick one and name it: a decision made far more often than today; a group of people served for the first time (flex workers, night shifts, a site); or a new service to a named internal or external customer. Say whether demand for it would grow if it got cheaper. "Do it for every case" is not an answer.
joy: what nobody would miss, and which part of the work the person wants more of.
options: where several drafts or scenarios change the decision itself, not just the effort.
altitude: what the person's week looks like after the change, which decision rights they gain, and whether the job becomes more or less expert. "Owns the rules" is not an answer on its own.
reach: which task of which adjacent role this person can absorb, and what they would need to learn.
human_edge: where the person beats the machine and must stay. Always fill it.
Patterns (pick the simplest that works): deterministic_software (rules can be written down; build it fast with AI coding, run it without a model); llm_step (one model call turns messy input into a checkable output inside a fixed workflow); agent_with_gate (only when the steps cannot be predicted in advance; a person approves before it counts); copilot (the person stays the lead). Whether a task stays fully human is decided elsewhere; do not decide it here.
Autonomy: 0 manual, 1 assisted, 2 partial (AI drafts, person does), 3 conditional (AI does, person approves each), 4 high (person handles exceptions), 5 full.
Evidence: E1 model knowledge, or a product named without a link; E2 a product that does this today, with its link from the research digest; E3 a documented case, with its link from the digest. Never invent a product, case, number or link.
"""

METHOD_V2 = """\
Method v2: the task graph. Owner's bets: most tasks are best solved with deterministic technology,
now built 10 to 100 times faster with AI coding, plus small bounded model loops where a step truly
needs reading free text, judging or writing. Autonomous agents are allowed but rare: harder, riskier
and more expensive. Prefer, in order: eliminate the step, configure existing software, deterministic
code, deterministic code with a bounded loop, an agent.

For each task:
1. steps: split the task as it is done today into three to seven steps (share_pct adds up to 100).
   For each step say who does it, with what (spreadsheet, mail, system screen...), which systems,
   which artefacts go in and come out (short reusable nouns, so steps of different tasks and roles
   connect: 'timesheet export', 'agency invoice', 'absence case'), and to whom it is handed off.
2. Then the future of each step: fate, remaining_pct (the person's time left, review time counts),
   the building block that replaces or supports it (artefact_generator, workflow_automation,
   crud_app, dashboard, answer_desk, integration, judgement_step, conversation, notification), the
   cheapest rung that handles it, and for a loop its input, output, check, stop condition and why
   nothing simpler works. Give each step the authority it needs (read, draft, write_internal,
   act_external) and whether a person approves it. Gates go on actions, not on whole tasks: a hard
   conversation stays human, its preparation and paperwork need not.
3. design: the stitched solution in two or three sentences, concrete about platform and blocks.
   Describe today's means as they are; do not assume spreadsheets where a system is used. Where a
   spreadsheet or mailbox does tie systems or teams together, say so (for example: an Excel sheet
   that ties two systems becomes a scheduled Python job on a governed data platform with
   notifications and a dashboard). The 'jev_shares' block gives a prior for how the task's time
   splits by kind of work and by means (system screens, spreadsheets, mail, documents, meetings);
   its mail share is a weak signal.
4. previous_blocker, enabler_now, still_hard: why this was not automated before, what changed, what
   stays hard. Do not assume a breakthrough.
5. human_edge always. ambition: one named thing (a decision made far more often, a group served for
   the first time, or a new service), or 'none'. altitude: the person's week after, decision rights
   gained, or say nothing changes. reach: a task of a named adjacent role and what to learn.
   "Do it for every case" and "owns the rules" are not answers.
6. build_days as ranges, including integration, testing, rollout, works-council consent and access.
7. Evidence: E1 model knowledge or a product named without a source; E2 a product that does this,
   cited with a digest source id like [S3]; E3 a documented case with a digest source id. Never
   invent a product, case, number or link. Put facts only the customer can confirm in unknowns.
The 'jev' block per task holds fixed-question answers with probabilities (rule coverage, what makes
the rest hard, interfaces, standard software, risk, the likely main and supporting solution shapes,
whether a model is needed at run time). Use it as a prior; disagree when the steps show otherwise.
Write plain, short sentences.
"""

RULES = """\
Rules: write plain, concrete English for this company, its systems and its Dutch context (CAO, works council, Wet verbetering poortwachter, AVG/GDPR, EU AI Act where it applies). No hype words. Keep each lens to one or two sentences. Steps lists have three to six items. Give two to four research questions per task that would confirm or kill the idea. Return the tasks in the order given, with their uid unchanged, and fill the role block for the role as a whole.
"""


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def chunks(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]


def task_facts(task):
    return {
        "uid": task["uid"], "statement": task["statement"], "class": task["class_name"],
        "onet_occupation": task["onet_title"], "type": task["type"],
        "hours_per_fte_per_year": task["hours_per_fte"], "share_of_role_time": task["share"],
        "frequency": task["frequency_label"], "importance_1_5": task["importance"],
        "p_ai_does_nearly_all": task["ai_does_nearly_all"], "p_clear_gain_most": task["clear_gain_most"],
        "p_clear_gain_part": task["clear_gain_part"], "mostly_done": task["mode"],
        "software_maturity": task["deployment"], "work_activities": task["dwas"],
    }


def jev_v2_block(role, task, cache={}):
    """The jev v2 answers for one task of a role, compact: top answers with their probability."""
    if "all" not in cache:
        cache["all"] = ({e["key"]: e for e in load(JEV_V2)} if os.path.exists(JEV_V2) else {})
    entry = cache["all"].get(f"{task['uid']}|{role['id']}")
    if not entry:
        return None
    out = {}
    for name, a in entry["answers"].items():
        if "probs" in a:
            top = sorted(a["probs"].items(), key=lambda kv: -kv[1])[:2]
            out[name] = {k: round(v, 2) for k, v in top}
        else:
            out[name] = round(a["yes"], 2)
    return out


def jev_shares_block(role, task, cache={}):
    """jev's split of the task's time by kind of work and by means, in percent."""
    if "all" not in cache:
        path = os.path.join(ROOT, "data", "jev_shares.json")
        cache["all"] = {e["key"]: e for e in load(path)} if os.path.exists(path) else {}
    entry = cache["all"].get(f"{task['uid']}|{role['id']}")
    return {"kind": entry["kind"], "means": entry["means"]} if entry else None


def build_prompt(data, team, role, tasks, digest=None, method=None):
    company = data["company"]
    systems = "; ".join(f"{s['name']} ({s['holds']})" for s in company["systems"])
    others = ", ".join(f"{r['title']} ({r['fte']})" for t in data["teams"] for r in t["roles"]
                       if r["id"] != role["id"])
    apps = ", ".join(a["name"] for a in role["apps"])
    parts = [
        f"Company: {company['name']} (fictional). {company['summary']}",
        f"Systems: {systems}.",
        f"Team: {team['name']}, {team['fte']} FTE. North Star: {team['north_star']}. "
        f"Input metrics: {', '.join(team['input_metrics'])}. Value streams: {', '.join(team['value_streams'])}.",
        f"Role: {role['title']} ({role['fte']} FTE, loaded cost EUR {role['cost_per_hour']}/hour). "
        f"Software O*NET lists for this kind of role: {apps}.",
        f"Other roles in the company's HR and Finance teams: {others}.",
        "The tasks below are O*NET task statements this role does, with what an earlier scoring "
        "found: class 'automate' means AI can produce nearly all of the result; 'amplify' means the "
        "work stays with the person and AI makes much of it clearly faster or better. Probabilities are 0-1.",
        method or METHOD, RULES,
    ]
    if digest:
        parts.append("Research digest for this role (recent practice, products and cases; cite it "
                     "in evidence where you use it):\n" + digest)
    facts = [task_facts(t) for t in tasks]
    if method is METHOD_V2:
        for f, t in zip(facts, tasks):
            f["jev"] = jev_v2_block(role, t)
            f["jev_shares"] = jev_shares_block(role, t)
        parts.append("Role ids for actor and handoff_to: " + ", ".join(
            r["id"] for tm in data["teams"] for r in tm["roles"]))
    parts.append(f"role_id: {role['id']}\nTasks:\n" + json.dumps(facts, indent=1))
    parts.append("Answer with the JSON object only.")
    return "\n\n".join(parts)


def decode_any(text):
    """Every JSON value in a CLI's output: the whole text, or each object it contains."""
    try:
        return [json.loads(text)]
    except (json.JSONDecodeError, TypeError):
        pass
    decoder, values, i = json.JSONDecoder(), [], 0
    while text and (i := text.find("{", i)) != -1:
        try:
            value, end = decoder.raw_decode(text, i)
            values.append(value)
            i = end
        except json.JSONDecodeError:
            i += 1
    return values


def find_answer(value):
    """The first object with 'tasks' and 'role', searched through envelopes and JSON strings."""
    if isinstance(value, list):
        for item in value:
            found = find_answer(item)
            if found:
                return found
    elif isinstance(value, dict):
        if "tasks" in value and "role" in value:
            return value
        for item in value.values():
            found = find_answer(item)
            if found:
                return found
    elif isinstance(value, str) and value.lstrip().startswith("{"):
        return find_answer(decode_any(value))
    return None


def run_cli(model, prompt, schema_text, workdir):
    """Run one model; return (parsed JSON or None, raw text)."""
    if model == "opus":
        cmd = ["claude", "-p", "--model", MODELS["opus"], "--output-format", "json",
               "--json-schema", schema_text,
               "--disallowed-tools", "WebSearch", "WebFetch", "Bash", "Read", "Write", "Edit",
               "Glob", "Grep", "Task", "Agent", "Skill"]
        proc = subprocess.run(cmd, input=prompt, capture_output=True, text=True, timeout=TIMEOUT,
                              cwd=workdir)
        raw = proc.stdout
        try:
            envelope = json.loads(raw)
            answer = envelope.get("structured_output")
            if answer is None and isinstance(envelope.get("result"), str):
                answer = json.loads(envelope["result"])
            return answer, raw
        except (json.JSONDecodeError, TypeError):
            return None, raw + proc.stderr[-2000:]
    if model == "sol":
        out = os.path.join(workdir, "last.json")
        schema_file = os.path.join(workdir, "schema.json")
        with open(schema_file, "w", encoding="utf-8") as f:
            f.write(schema_text)
        cmd = ["codex", "exec", "-m", MODELS["sol"], "--skip-git-repo-check", "--sandbox", "read-only",
               "-c", 'model_reasoning_effort="high"', "--output-schema", schema_file, "-o", out, *CODEX_OFFLINE, "-"]
        proc = subprocess.run(cmd, input=prompt, capture_output=True, text=True, timeout=TIMEOUT,
                              cwd=workdir)
        raw = proc.stdout[-3000:] + proc.stderr[-3000:]
        try:
            with open(out, encoding="utf-8") as f:
                text = f.read()
            return json.loads(text), raw
        except (OSError, json.JSONDecodeError):
            return None, raw
    if model == "grok":
        cmd = ["grok", "-m", MODELS["grok"], "--disable-web-search", "--json-schema", schema_text,
               "-p", prompt]
        env = {k: v for k, v in os.environ.items() if k not in ("XAI_API_KEY", "GROK_CODE_XAI_API_KEY")}
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=TIMEOUT, cwd=workdir, env=env)
        raw = proc.stdout
        return find_answer(decode_any(raw)), raw + proc.stderr[-2000:]
    raise ValueError(model)


def check(answer, tasks):
    """Problems with an answer, empty when it is usable."""
    if not isinstance(answer, dict) or "tasks" not in answer:
        return ["no tasks"]
    want = [t["uid"] for t in tasks]
    got = [t.get("uid") for t in answer["tasks"]]
    problems = [] if sorted(got) == sorted(want) else [f"uids differ: {set(want) ^ set(got)}"]
    for t in answer["tasks"]:
        if "steps" in t:
            total = sum(st.get("share_pct", 0) for st in t["steps"])
            if not 90 <= total <= 110:
                problems.append(f"{t.get('uid')}: step shares add to {total}")
            for st in t["steps"]:
                if st.get("rung") in ("deterministic_plus_loop", "agent") and not st.get("loop"):
                    problems.append(f"{t.get('uid')} {st.get('id')}: {st.get('rung')} without a loop")
                if st.get("rung") == "deterministic" and st.get("block") == "judgement_step":
                    problems.append(f"{t.get('uid')} {st.get('id')}: judgement step marked deterministic")
            continue
        total = sum(t.get("anatomy", {}).values()) if isinstance(t.get("anatomy"), dict) else 0
        if not 90 <= total <= 110:
            problems.append(f"{t.get('uid')}: anatomy adds to {total}")
    return problems


def codex_tool_calls(workdir, since):
    """The tool calls a codex run made, read from its session log (matched on the run's folder)."""
    import glob
    calls = []
    for path in glob.glob(os.path.expanduser("~/.codex/sessions/*/*/*/*.jsonl")):
        if os.path.getmtime(path) < since:
            continue
        with open(path, encoding="utf-8") as f:
            lines = [json.loads(line) for line in f if line.strip()]
        meta = next((l.get("payload", {}) for l in lines if l.get("type") == "session_meta"), {})
        if os.path.realpath(meta.get("cwd", "")) != os.path.realpath(workdir):
            continue
        for l in lines:
            payload = l.get("payload", {})
            if payload.get("type") in ("custom_tool_call", "function_call", "web_search_call"):
                calls.append(str(payload.get("input") or payload.get("arguments") or payload.get("type"))[:200])
    return calls


def derive_from_steps(answer):
    """v2: time saved and speedup follow from the steps' shares and remaining time."""
    for t in answer.get("tasks", []):
        steps = t.get("steps", [])
        total = sum(st.get("share_pct", 0) for st in steps) or 100
        left = sum(st.get("share_pct", 0) * min(max(st.get("remaining_pct", 100), 0), 100) / 100 for st in steps)
        t["time_saved_pct"] = round(100 * (1 - left / total))
        t["speedup"] = round(total / left, 2) if left > 0 else 20.0


def derive_speedup(answer):
    """v1 asks only for time saved; the speedup follows from it."""
    for t in answer.get("tasks", []):
        saved = min(max(t.get("time_saved_pct", 0), 0), 95)
        t["speedup"] = round(1 / (1 - saved / 100), 2)


def job(model, variant, data, team, role, n, tasks, schema_text):
    out_dir = os.path.join(ROOT, "runs", variant + os.environ.get("RUN_SUFFIX", ""), model)
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f"{role['id']}__{n}.json")
    if os.path.exists(out):
        return out, "skipped"
    digest = None
    if variant in ("grounded", "v1", "v2"):
        path = os.path.join(ROOT, "research", "digests", f"{role['id']}.md")
        if not os.path.exists(path):
            return out, f"no digest at {path}"
        with open(path, encoding="utf-8") as f:
            digest = f.read()
    method = {"v1": METHOD_V1, "v2": METHOD_V2}.get(variant)
    prompt = build_prompt(data, team, role, tasks, digest, method)
    started = time.time()
    for attempt in (1, 2):
        with tempfile.TemporaryDirectory() as workdir:
            try:
                answer, raw = run_cli(model, prompt, schema_text, workdir)
            except subprocess.TimeoutExpired:
                answer, raw = None, "timeout"
            tool_calls = codex_tool_calls(workdir, started) if model == "sol" else []
        problems = check(answer, tasks) if answer is not None else ["unparsed"]
        if answer is not None and not any(p.startswith(("no tasks", "uids")) for p in problems):
            if variant == "v1":
                derive_speedup(answer)
            if variant == "v2":
                derive_from_steps(answer)
            answer["_meta"] = {"model": MODELS[model], "variant": variant, "seconds": round(time.time() - started),
                               "attempts": attempt, "warnings": problems,
                               "web": "off", "tool_calls": tool_calls}
            with open(out, "w", encoding="utf-8") as f:
                json.dump(answer, f, indent=1, ensure_ascii=False)
            return out, f"ok in {round(time.time() - started)}s, {len(tool_calls)} tool calls" + (
                f" ({len(problems)} warnings)" if problems else "")
        with open(out.replace(".json", f".failed{attempt}.txt"), "w", encoding="utf-8") as f:
            f.write("\n".join(problems) + "\n\n" + (raw or "")[-20000:])
    return out, "failed twice"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--models", nargs="+", default=["opus", "sol", "grok"], choices=list(MODELS))
    parser.add_argument("--team")
    parser.add_argument("--roles", nargs="+")
    parser.add_argument("--chunk", type=int, default=8)
    parser.add_argument("--workers", type=int, default=3, help="parallel calls per model")
    parser.add_argument("--variant", default="inmemory", choices=["inmemory", "inmemory-noweb", "grounded", "v1", "v2"])
    parser.add_argument("--limit", type=int, help="only the first N chunks per role (for a smoke test)")
    args = parser.parse_args()

    data = load(os.path.join(ROOT, "data", "teams.json"))
    schema_path = {"v1": SCHEMA_V1_PATH, "v2": SCHEMA_V2_PATH}.get(args.variant, SCHEMA_PATH)
    with open(schema_path, encoding="utf-8") as f:
        schema_text = json.dumps(json.load(f))
    jobs = []
    for team in data["teams"]:
        if args.team and team["id"] != args.team:
            continue
        for role in team["roles"]:
            if args.roles and role["id"] not in args.roles:
                continue
            todo = [t for t in role["tasks"] if t["class"] in ("S", "A")]
            if os.environ.get("RUN_SUFFIX"):
                todo = todo[1::2] + todo[0::2]  # a repeat run batches the tasks differently
            for n, part in enumerate(chunks(todo, args.chunk)[:args.limit], 1):
                for model in args.models:
                    jobs.append((model, args.variant, data, team, role, n, part, schema_text))
    print(f"{len(jobs)} jobs", flush=True)
    with ThreadPoolExecutor(max_workers=args.workers * len(args.models)) as pool:
        futures = {pool.submit(job, *j): j for j in jobs}
        for future in as_completed(futures):
            model, _v, _d, _t, role, n, part, _s = futures[future]
            try:
                path, status = future.result()
            except Exception as error:  # report and keep going
                status = f"error {error!r}"
            print(f"{model:<5} {role['id']}__{n} ({len(part)} tasks): {status}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
