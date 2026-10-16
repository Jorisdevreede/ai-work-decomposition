"""Generic task graph generator. Defaults to v4; v3 schema and stored runs stay intact.

    python3 tools/fleet_v3.py --jobs 13-1022.00 43-3051.00 --model sol --workers 2
    python3 tools/fleet_v3.py --validate runs/v4/sol/*.json

V4 uses schema/taskgraph-v4.schema.json. All schema and semantic failures block
publication: <code>__<n>.blocked.json stores the candidate plus reasons. A second
attempt receives the actual failures. Existing published files are revalidated
before skipping. No v3 files are changed by the default run.
"""

import argparse
import hashlib
from pathlib import Path

from jsonschema import Draft202012Validator
import json
import os
import re
import signal
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from reimagine import CODEX_OFFLINE, codex_tool_calls  # noqa: E402

AIISCO = os.path.expanduser("~/Projects/AI-ISCO")
MODELS = {"sol": "gpt-6.1-sol", "astra": "gpt-6-astra"}
SCHEMA = os.path.join(ROOT, "schema", "taskgraph-v4.schema.json")
TIMEOUT = 1800
CHUNK = 4

WORKFLOWS = [
    "hire-to-productive", "employee-lifecycle", "absence-to-return", "pay-cycle", "learning-to-certified",
    "performance-cycle", "offboarding", "procure-to-pay", "order-to-cash", "record-to-report",
    "plan-to-forecast", "expense-to-reimburse", "tax-and-filing", "treasury-and-cash", "audit-and-controls",
    "campaign-to-lead", "content-to-publish", "brand-and-pr", "market-insight", "lead-to-opportunity",
    "opportunity-to-order", "account-to-renewal", "inquiry-to-answer", "ticket-to-resolution",
    "complaint-to-resolution", "contract-to-renewal", "supplier-to-contract", "project-intake-to-delivery",
    "meetings-and-calendar", "documents-and-records", "facilities-and-workplace", "compliance-and-risk",
    "data-to-report", "strategy-and-planning", "other",
]
PRODUCTS = ["AFAS", "Recruitee", "Studytube", "Workday", "SuccessFactors", "SAP", "Salesforce", "HubSpot",
            "Outlook", "Microsoft Teams", "SharePoint", "Excel", "Power BI", "Zendesk", "Slack",
            "Jira", "DocuSign", "Databricks", "Snowflake", "Google Sheets", "Gmail", "Marketo", "Shopify",
            "NetSuite", "Coupa", "Basware", "Personio", "Nmbrs", "Loket", "ADP", "Greenhouse", "Rabobank",
            "Dynamics", "Freshdesk", "ServiceNow", "Tableau", "Looker", "Mailchimp", "Asana",
            "Medius", "Onguard", "Microsoft Copilot", "ChatGPT", "OpenAI", "UiPath", "Workato", "Nintex"]

METHOD = """\
You decompose and reimagine work for a product that gives any person or team a head start,
independent of the company they work for. Describe the job as it is typically done in a mid-size
European company (200 to 2,000 staff). Never name a product or vendor outside the evidence list:
systems are slots. In 'systems' use slot ids from the slot list; in text write the slot in braces,
for example "the {ATS}", "an export from the {ERP}". Use generic role names ("hiring manager",
"finance team", "candidate"), not company names.

Owner's bets: most tasks are best solved with deterministic technology, now built 10 to 100 times
faster with AI coding (artefact generators, workflow automations, records apps, dashboards,
integrations, stitched together), plus small bounded model loops where a step truly needs reading
free text, judging or writing. Autonomous agents are allowed but rare. Prefer, in order: eliminate
the step, configure existing software, deterministic code, deterministic code with a bounded loop, an
agent. Gates go on actions, not on whole tasks: a conversation that must stay human keeps its
preparation and paperwork open to change.

For each task:
1. steps: the task as typically done today. A new step starts only when the actor, the system or
   means, the artefact produced, or a decision or approval point changes; give the reason in
   'boundary'. As many steps as that gives: one is fine, so are twelve. share_pct adds up to 100.
   Name inputs and outputs as short reusable nouns ('timesheet export', 'supplier invoice'), and give
   each step the workflow id it belongs to from the workflow list, so steps of different tasks and
   jobs connect. Describe today's means as they are; do not assume spreadsheets where a system is
   used, but say so where a spreadsheet or mailbox ties systems or teams together.
2. The future of each step: fate, remaining_pct (the person's remaining time; review counts), the
   building block, the cheapest rung, and for a loop its input, output, check, stop and why nothing
   simpler works. Authority (read, draft, write_internal, act_external), human_gate, and the
   approver role when there is a gate.
3. design: the stitched solution in two or three sentences with {SLOT} placeholders.
4. previous_blocker, enabler_now, still_hard; do not assume a breakthrough.
5. new_work: separate already_counted review/exception work from incremental upkeep, with hours.
6. human_edge always. ambition: one named thing (a decision made far more often, a group served for
   the first time, a new service) or 'none'. altitude: the person's week after, decision rights
   gained, or say nothing changes. reach: a task of a named adjacent role and what to learn. "Do it
   for every case" and "owns the rules" are not answers.
7. build_days as ranges, including integration, testing and rollout, works-council or employee
   consultation where it applies, and access.
8. Evidence: E1 model knowledge or a product named without a source; E2 a product that does this,
   cited with a digest source id like [S3]; E3 a documented case with a digest source id. Only use
   source ids that appear in the digest. Never invent a product, case, number or link. Legal notes:
   EU law (GDPR, EU AI Act) applies everywhere; national rules (works councils, employment law)
   vary, say "national rules" unless the digest names the country. Put facts only a customer can
   confirm in unknowns.
The 'jev' block per task holds fixed-question answers with probabilities; 'jev_shares' splits the
time by kind and by means (its mail share is weak). Use them as priors; disagree when the steps
show otherwise. Plain, short sentences.
"""


METHOD += """
V4 contract (overrides the old new_work string-list instruction):
- The focal role is the Job above. State its workflow boundary and structured-input
  contracts in assumptions: exact fields, producer, and manual/extraction fallback.
  Test native system configuration before custom code. Existing system runtime is
  not human effort and earns no labour saving.
- Mark EVERY step labour_scope: focal_role, other_role, supplier, customer, system.
  Today's workflow shares still total exactly 100; only focal_role time is the
  role's denominator. Outside labour never enters the role's savings. Use stable
  shared_step_id for shared work (empty otherwise); a team roll-up must resolve
  ownership rather than add duplicated workflow effort.
- human_gate iff approval_refs is nonempty. Add task.approvals: id, action_step_id,
  approved_version (version/snapshot bound to approval), approval_step_id, approver.
  Each referenced approval covers that exact action and version; any change voids it.
  Human approval time MUST sit in a person_does/person_reviews step with positive
  share and remaining time and an actor matching the approver. A machine/gone
  action can reuse a prior human approval through this reference; it cannot carry
  hidden approval time. Multiple actions may reuse one time-counted approval step.
- new_work is an object: already_counted and incremental arrays. Each entry has
  description, labour_scope and hours_per_100_baseline_hours (numeric). Already
  counted entries also have counted_step_ids; those hours are in remaining time
  and MUST NOT be deducted again. Incremental entries are additional ongoing
  upkeep/exception work, deducted once if focal_role. Include a numerical upkeep
  allowance, or justify zero in assumptions. Hours are per 100 focal-role baseline
  hours for THIS task, not company/year hours. No free transferred work.
- Derive central saving yourself to set the conservative range: focal baseline B =
  sum focal share_pct; remaining R = sum focal share_pct * remaining_pct/100;
  gross = 100*(B-R)/B; net = gross - incremental focal hours per 100 baseline.
  time_saved_range_pct = {low, high, basis}, low <= high <= central NET saving;
  allow negative net saving when upkeep exceeds returns. Include real conservative
  scenario assumptions, not a confidence interval. The script calculates central.
- Evidence has kind capability/case/legal/benchmark/survey. E2/E3 are ONLY for
  capability/case with digest sources. Legal, benchmark and survey context is E0/E1
  even when sourced. source is exactly 'model knowledge' or '[S3], [S4]'; use only
  ids in the digest's Sources list. Source existence does not verify claim support.
- Exact shares 100; bounded percentages; machine/gone remaining_pct exactly 0;
  loop non-null iff rung deterministic_plus_loop/agent. Judgement is never plain
  deterministic. No product names anywhere outside task.evidence, including role.
"""


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def compact_jev(entry):
    out = {}
    for name, a in entry["answers"].items():
        if "probs" in a:
            out[name] = {k: round(v, 2) for k, v in sorted(a["probs"].items(), key=lambda kv: -kv[1])[:2]}
        else:
            out[name] = round(a["yes"], 2)
    return out


def sources():
    tasks = load(os.path.join(AIISCO, "data", "onet_tasks.json"))
    scores = {e["uri"]: e for e in load(os.path.join(AIISCO, "data", "task_scores_v2.json"))}
    jev = {e["key"]: e for e in load(os.path.join(ROOT, "data", "jev_anatomy_v2_onet.json"))}
    shares_path = os.path.join(ROOT, "data", "jev_shares_onet.json")
    shares = {e["key"]: e for e in load(shares_path)} if os.path.exists(shares_path) else {}
    occ = {o["code"]: o for o in load(os.path.join(AIISCO, "data", "onet_occupations.json"))}
    return tasks, scores, jev, shares, occ


def task_facts(t, scores, jev, shares):
    key = f"{t['code']}:{t['task_id']}"
    s = scores.get(t["uri"], {})
    names = {"S": "automate", "A": "amplify", "M": "machines", "I": "human"}
    return {"uid": key, "statement": t["statement"], "type": t["task_type"], "importance": t["importance"],
            "frequency": t["frequency_label"], "class": names.get(s.get("class"), "unscored"),
            "p_ai_does_nearly_all": s.get("sub"), "p_clear_gain_most": s.get("comp"),
            "work_activities": [d["name"] for d in t["dwas"]],
            "jev": compact_jev(jev[key]) if key in jev else None,
            "jev_shares": ({"kind": shares[key]["kind"], "means": shares[key]["means"]} if key in shares else None)}


def prompt_for(job, batch_jobs, occ, facts, slots):
    o = occ[job["code"]]
    digest_path = os.path.join(ROOT, "research", "digests-minor", f"{job['code'][:4]}.md")
    digest = open(digest_path, encoding="utf-8").read() if os.path.exists(digest_path) else "(no digest)"
    adjacent = [j["title"] for j in batch_jobs if j["function"] == job["function"] and j["code"] != job["code"]]
    slot_list = "; ".join(f"{k}: {v['label']} ({v['holds']})" for k, v in slots.items())
    return "\n\n".join([
        METHOD,
        f"System slots: {slot_list}.",
        f"Workflow ids: {', '.join(WORKFLOWS)}.",
        f"Job: {o['title']} (O*NET {job['code']}), function: {job['function']}. {o['description']}",
        f"Adjacent jobs in the same function: {', '.join(adjacent)}.",
        "Research digest for this job's group (cite only its source ids):\n" + digest,
        f"job_code: {job['code']}\nTasks:\n" + json.dumps(facts, indent=1),
        "Answer with the JSON object only.",
    ])


def digest_for(code):
    path = Path(ROOT) / "research" / "digests-minor" / f"{code[:4]}.md"
    return path.read_text(encoding="utf-8") if path.exists() else ""


def digest_source_ids(digest):
    # Only source definitions count; stray citations in prose are not a registry.
    return set(re.findall(r"^\s*\[S(\d+)\]\s+\S", digest, re.M))


def labour_metrics(task):
    focal = [s for s in task["steps"] if s["labour_scope"] == "focal_role"]
    baseline = sum(s["share_pct"] for s in focal)
    left = sum(s["share_pct"] * s["remaining_pct"] / 100 for s in focal)
    extra = sum(w["hours_per_100_baseline_hours"] for w in task["new_work"]["incremental"]
                if w["labour_scope"] == "focal_role")
    gross = 100 * (baseline - left) / baseline if baseline else 0
    net = gross - extra
    remaining = 100 - net
    return {"focal_role_share_pct": baseline, "excluded_labour_share_pct": 100 - baseline,
            "gross_time_saved_pct": round(gross, 6), "incremental_hours_per_100_baseline_hours": extra,
            "time_saved_pct": round(net, 6), "speedup": round(100 / remaining, 6) if remaining else None,
            "savings_basis": "100 focal-role baseline hours; external labour excluded; incremental focal work deducted once; provisional"}


def derive_v4(answer):
    for task in answer["tasks"]:
        task.update(labour_metrics(task))


def checks(answer, facts, digest=None, schema=None):
    schema = schema or load(SCHEMA)
    # Generator-added fields are never part of the model's schema.
    payload = {k: v for k, v in answer.items() if k != "_meta"} if isinstance(answer, dict) else answer
    if isinstance(payload, dict) and isinstance(payload.get("tasks"), list):
        derived = {"focal_role_share_pct", "excluded_labour_share_pct", "gross_time_saved_pct",
                   "incremental_hours_per_100_baseline_hours", "time_saved_pct", "speedup", "savings_basis"}
        payload = dict(payload, tasks=[{k: v for k, v in task.items() if k not in derived}
                                      if isinstance(task, dict) else task for task in payload["tasks"]])
    problems = ["schema " + "/".join(map(str, e.absolute_path)) + ": " + e.message
                for e in Draft202012Validator(schema).iter_errors(payload)]
    if problems:
        return problems  # Do not perform arithmetic or references on malformed payloads.
    want = sorted(f["uid"] for f in facts)
    got = sorted(t["uid"] for t in answer["tasks"])
    if want != got:
        problems.append(f"uids differ: expected {want}, got {got}")
    codes = {uid.split(":")[0] for uid in want}
    if codes != {answer["job_code"]}:
        problems.append("job_code differs from requested tasks")
    digest = digest_for(answer["job_code"]) if digest is None else digest
    allowed_sources = digest_source_ids(digest)
    # Include product titles from this digest's capability section, in addition to
    # the known-name list. This is a name check, not semantic claim verification.
    section = re.search(r"^## 1\..*?(?=^## 2\.|\Z)", digest, re.M | re.S)
    named = re.findall(r"^- \*\*([^*]+)\*\*", section.group() if section else "", re.M)
    names = set(PRODUCTS)
    names.update(name.split(" (")[0].strip().rstrip(":") for name in named)
    product = re.compile(r"\b(" + "|".join(re.escape(name) for name in sorted(names, key=len, reverse=True) if name) + r")\b", re.I)
    outside = {k: v for k, v in payload.items() if k != "tasks"}
    outside["tasks"] = [{k: v for k, v in task.items() if k != "evidence"} for task in payload["tasks"]]
    for name in sorted(set(product.findall(json.dumps(outside, ensure_ascii=False)))):
        problems.append(f"product name '{name}' outside evidence")
    for task in answer["tasks"]:
        uid, steps = task["uid"], task["steps"]
        total = sum(s["share_pct"] for s in steps)
        if total != 100:
            problems.append(f"{uid}: step shares add to {total}, expected 100")
        by_id = {s["id"]: s for s in steps}
        if len(by_id) != len(steps):
            problems.append(f"{uid}: duplicate step id")
        approvals = {a["id"]: a for a in task["approvals"]}
        if len(approvals) != len(task["approvals"]):
            problems.append(f"{uid}: duplicate approval id")
        used = set()
        for step in steps:
            label = f"{uid}/{step['id']}"
            loop_rung = step["rung"] in ("deterministic_plus_loop", "agent")
            if loop_rung != (step["loop"] is not None):
                problems.append(f"{label}: loop must be present iff loop rung")
            if step["rung"] == "deterministic" and step["block"] == "judgement_step":
                problems.append(f"{label}: judgement step marked deterministic")
            if step["fate"] in ("gone", "machine") and step["remaining_pct"] != 0:
                problems.append(f"{label}: machine/gone remaining must be 0")
            if step["workflow"] not in WORKFLOWS:
                problems.append(f"{label}: unknown workflow {step['workflow']}")
            refs = step["approval_refs"]
            if step["human_gate"] != bool(refs) or (step["human_gate"] and step["approver"].casefold() in ("none", "system", "external", "")):
                problems.append(f"{label}: gate requires approval references and a human approver")
            if not step["human_gate"] and step["approver"] != "none":
                problems.append(f"{label}: ungated step has an approver")
            if len(refs) != len(set(refs)):
                problems.append(f"{label}: duplicate approval reference")
            for ref in refs:
                used.add(ref)
                approval = approvals.get(ref)
                if not approval:
                    problems.append(f"{label}: unknown approval {ref}")
                    continue
                if approval["action_step_id"] != step["id"] or approval["approver"] != step["approver"]:
                    problems.append(f"{label}: approval {ref} not bound to this action/approver")
                if not approval["approved_version"].strip() or approval["approved_version"].lower() in ("none", "n/a"):
                    problems.append(f"{label}: approval {ref} lacks version binding")
                counted = by_id.get(approval["approval_step_id"])
                if not counted or counted["fate"] not in ("person_reviews", "person_does") or counted["remaining_pct"] <= 0 or counted["labour_scope"] == "system" or counted["actor"].casefold() != approval["approver"].casefold():
                    problems.append(f"{label}: approval {ref} has no time-counted human approval step")
        for ref in approvals.keys() - used:
            problems.append(f"{uid}: orphan approval {ref}")
        metrics = labour_metrics(task)
        focal = metrics["focal_role_share_pct"]
        counted_by_scope = {}
        referenced_by_scope = {}
        for work in task["new_work"]["already_counted"]:
            ids = work["counted_step_ids"]
            if len(ids) != len(set(ids)):
                problems.append(f"{uid}: duplicate already-counted step reference")
            available = 0
            scope = work["labour_scope"]
            counted_by_scope[scope] = counted_by_scope.get(scope, 0) + work["hours_per_100_baseline_hours"]
            referenced_by_scope.setdefault(scope, set()).update(ids)
            for sid in ids:
                step = by_id.get(sid)
                if not step or step["remaining_pct"] <= 0 or step["labour_scope"] != scope:
                    problems.append(f"{uid}: already-counted work must reference remaining labour of the same scope")
                elif focal:
                    available += step["share_pct"] * step["remaining_pct"] / focal
            if work["hours_per_100_baseline_hours"] > available + 1e-6:
                problems.append(f"{uid}: already-counted hours exceed referenced remaining time")
        if focal:
            # No invented equal allocation across references: step capacities can differ.
            for scope, hours in counted_by_scope.items():
                available = sum(by_id[sid]["share_pct"] * by_id[sid]["remaining_pct"] / focal
                                for sid in referenced_by_scope[scope] if sid in by_id and by_id[sid]["labour_scope"] == scope)
                if hours > available + 1e-6:
                    problems.append(f"{uid}: already-counted allocations overlap/exceed remaining {scope} time")
        elif metrics["incremental_hours_per_100_baseline_hours"]:
            problems.append(f"{uid}: incremental focal work without focal baseline")
        span = task["time_saved_range_pct"]
        if not span["low"] <= span["high"] <= metrics["time_saved_pct"] + 1e-6 or not span["basis"].strip():
            problems.append(f"{uid}: conservative range must satisfy low <= high <= central net saving and explain basis")
        for evidence in task["evidence"]:
            grade, source = evidence["grade"], evidence["source"]
            ids = re.findall(r"\[S(\d+)\]", source)
            if source != "model knowledge" and not re.fullmatch(r"\[S\d+\](?:,?\s*\[S\d+\])*", source):
                problems.append(f"{uid}: evidence source must be digest ids or model knowledge")
            if set(ids) - allowed_sources:
                problems.append(f"{uid}: source ids absent from digest: {sorted(set(ids) - allowed_sources)}")
            if grade in ("E2", "E3") and (evidence["kind"] not in ("capability", "case") or not ids):
                problems.append(f"{uid}: E2/E3 needs capability/case and digest source")
    return problems


def run_codex(model, prompt, schema_text, workdir):
    out = os.path.join(workdir, "last.json")
    schema_file = os.path.join(workdir, "schema.json")
    with open(schema_file, "w", encoding="utf-8") as f:
        f.write(schema_text)
    cmd = ["codex", "exec", "-m", MODELS[model], "--skip-git-repo-check", "--sandbox", "read-only",
           "-c", 'model_reasoning_effort="high"', "--output-schema", schema_file, "-o", out, *CODEX_OFFLINE, "-"]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            text=True, cwd=workdir, start_new_session=True)
    try:
        stdout, stderr = proc.communicate(prompt, timeout=TIMEOUT)
    except subprocess.TimeoutExpired:
        # Codex starts helper processes; terminating only the parent leaks them.
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        proc.communicate()
        raise
    try:
        return load(out), stderr[-2000:]
    except (OSError, json.JSONDecodeError):
        return None, stdout[-2000:] + stderr[-3000:]


def write_json(path, value):
    temporary = path + ".tmp"
    with open(temporary, "w", encoding="utf-8") as stream:
        json.dump(value, stream, indent=1, ensure_ascii=False)
        stream.write("\n")
    os.replace(temporary, path)


def job_batch(model, job, n, facts, prompt, schema_text):
    out_dir = os.path.join(ROOT, "runs", "v4", model)
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f"{job['code']}__{n}.json")
    blocked = out.replace(".json", ".blocked.json")
    schema = json.loads(schema_text)
    digest = digest_for(job["code"])
    if os.path.exists(out):
        existing = load(out)
        problems = checks(existing, facts, digest, schema)
        if not problems:
            return "skipped (revalidated)"
        existing.setdefault("_meta", {})["checks"] = problems
        write_json(blocked, existing)
        os.unlink(out)
    started = time.time()
    rejection_history = []
    for attempt in (1, 2):
        with tempfile.TemporaryDirectory() as workdir:
            try:
                answer, raw = run_codex(model, prompt, schema_text, workdir)
            except subprocess.TimeoutExpired:
                answer, raw = None, "timeout"
            calls = codex_tool_calls(workdir, started)
        problems = checks(answer, facts, digest, schema) if answer else ["no valid JSON answer: " + (raw or "")[-2000:]]
        meta = {"model": MODELS[model], "variant": "v4", "seconds": round(time.time() - started),
                "attempts": attempt, "checks": problems, "rejected_attempts": list(rejection_history), "web": "off", "tool_calls": calls, "job": job,
                "digest": f"research/digests-minor/{job['code'][:4]}.md",
                "digest_sha256": hashlib.sha256(digest.encode()).hexdigest(),
                "schema_sha256": hashlib.sha256(schema_text.encode()).hexdigest()}
        if not problems:
            derive_v4(answer)
            answer["_meta"] = meta
            write_json(out, answer)
            if os.path.exists(blocked):
                os.unlink(blocked)
            return f"ok in {round(time.time() - started)}s, all checks passed, {len(calls)} tool calls"
        rejection_history.append({"attempt": attempt, "reasons": problems})
        meta["rejected_attempts"] = list(rejection_history)
        candidate = dict(answer) if isinstance(answer, dict) else {"candidate": answer}
        candidate["_meta"] = meta
        write_json(blocked, candidate)
        prompt += "\n\nThe previous answer was blocked. Correct these failures and return the full JSON:\n" + "\n".join(problems)
    return f"blocked after two attempts: {len(problems)} failures (see {os.path.basename(blocked)})"


PANE_HEADER = """\
<!-- Pane instructions: answer this prompt yourself with web search OFF (use only the digest below and model
knowledge). Write ONE JSON object valid against schema/taskgraph-v4.schema.json to
runs/v4/<your-label>/<name>.json, then run
  python3 tools/fleet_v3.py --batch config/jobs-batch2.json --label <your-label> --finalize runs/v4/<your-label>/<name>.json
Fix every reported failure and finalize again (at most 3 tries; a blocked file stays .blocked.json). -->

"""


def _words(text):
    return {w for w in re.findall(r"[a-z]{5,}", (text or "").lower())}


def _step_signature(task):
    return tuple(re.sub(r"\W+", " ", (s.get("what") or s.get("name") or "").lower()).strip() for s in task.get("steps", []))


def template_checks(answer, facts, out_dir, name):
    """Pane answers must be written per task: no shared step sequences, steps grounded in the statement."""
    problems = []
    statements = {f["uid"]: f.get("statement") or f.get("task") or "" for f in facts}
    seen = {}
    for task in answer.get("tasks", []):
        sig = _step_signature(task)
        if sig in seen:
            problems.append(f"{task['uid']}: same step names as {seen[sig]}; write steps for this task")
        seen[sig] = task["uid"]
        step_text = " ".join(" ".join(str(s.get(k) or "") for k in ("what", "name", "description", "output", "input"))
                             for s in task.get("steps", []))
        if statements.get(task["uid"]) and not (_words(statements[task["uid"]]) & _words(step_text)):
            problems.append(f"{task['uid']}: no step mentions the task's own work; derive the steps from the task statement")
    for other in Path(out_dir).glob("*.json"):
        if other.name in (name, "manifest.json") or other.name.endswith(".blocked.json"):
            continue
        try:
            other_sigs = {_step_signature(t) for t in load(other).get("tasks", [])}
        except Exception:
            continue
        for task in answer.get("tasks", []):
            if len(_step_signature(task)) > 1 and _step_signature(task) in other_sigs:
                problems.append(f"{task['uid']}: step names identical to a task in {other.name}; templates are not allowed")
    return problems


def finalize(paths, batch_path, label):
    batch = {j["code"]: j for j in load(os.path.join(ROOT, batch_path))["jobs"]}
    schema_text = json.dumps(load(SCHEMA))
    schema = json.loads(schema_text)
    tasks, scores, jev, shares, occ = sources()
    failed = 0
    for path in paths:
        name = Path(path).name.replace(".blocked.json", ".json")
        code, n = name[:-5].split("__")
        n = int(n)
        expected = [t for t in tasks if t["code"] == code]
        facts = [task_facts(t, scores, jev, shares) for t in expected][(n - 1) * CHUNK:n * CHUNK]
        digest = digest_for(code)
        try:
            answer = load(path)
        except Exception as error:
            answer, problems = None, [f"not valid JSON: {error}"]
        else:
            answer.pop("_meta", None)
            problems = checks(answer, facts, digest, schema)
            if not problems:
                problems = template_checks(answer, facts, os.path.dirname(path), name)
        out = os.path.join(os.path.dirname(path), name)
        blocked = out.replace(".json", ".blocked.json")
        meta = {"model": label, "variant": "v4", "author": "ntm-pane", "checks": problems, "web": "off",
                "job": batch.get(code, {"code": code}), "digest": f"research/digests-minor/{code[:4]}.md",
                "digest_sha256": hashlib.sha256(digest.encode()).hexdigest(),
                "schema_sha256": hashlib.sha256(schema_text.encode()).hexdigest(),
                "finalized": time.strftime("%Y-%m-%dT%H:%M:%S")}
        if not problems:
            derive_v4(answer)
            answer["_meta"] = meta
            write_json(out, answer)
            if os.path.exists(blocked):
                os.unlink(blocked)
        else:
            failed += 1
            candidate = dict(answer) if isinstance(answer, dict) else {"candidate": answer}
            candidate["_meta"] = meta
            write_json(blocked, candidate)
            if os.path.exists(out) and out != path:
                os.unlink(out)
            elif os.path.exists(out):
                os.unlink(out)
        print(json.dumps({"file": name, "passed": not problems, "reasons": problems}))
    return 1 if failed else 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate", nargs="+", help="Check existing v4 candidates without model calls")
    parser.add_argument("--model", default="sol", choices=list(MODELS))
    parser.add_argument("--jobs", nargs="+")
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--batch", default="config/jobs-batch1.json", help="Job list (relative to the folder root)")
    parser.add_argument("--emit-prompts", metavar="DIR", help="Write one prompt file per task chunk plus manifest.json; no model calls")
    parser.add_argument("--finalize", nargs="+", metavar="PATH", help="Check pane-written answers; publish passing ones with _meta, block the rest")
    parser.add_argument("--label", default="pane", help="Model label recorded in _meta by --finalize")
    args = parser.parse_args()
    if args.finalize:
        raise SystemExit(finalize(args.finalize, args.batch, args.label))
    if args.validate:
        failed = False
        for path in args.validate:
            answer = load(path)
            code = answer.get("job_code", "")
            raw_tasks = load(os.path.join(AIISCO, "data", "onet_tasks.json"))
            expected = [t for t in raw_tasks if t["code"] == code]
            n = int(Path(path).name.split("__")[1].split(".")[0])
            facts = [{"uid": f"{code}:{t['task_id']}"} for t in expected[(n-1)*CHUNK:n*CHUNK]]
            reasons = checks(answer, facts)
            print(json.dumps({"file": path, "passed": not reasons, "reasons": reasons}))
            failed |= bool(reasons)
        raise SystemExit(1 if failed else 0)
    batch = load(os.path.join(ROOT, args.batch))["jobs"]
    jobs = [j for j in batch if not args.jobs or j["code"] in args.jobs]
    slots = load(os.path.join(ROOT, "config", "system-slots.json"))["slots"]
    schema_text = json.dumps(load(SCHEMA))
    tasks, scores, jev, shares, occ = sources()
    by_code = {}
    for t in tasks:
        by_code.setdefault(t["code"], []).append(t)
    work = []
    for job in jobs:
        facts = [task_facts(t, scores, jev, shares) for t in by_code.get(job["code"], [])]
        for n, i in enumerate(range(0, len(facts), CHUNK), 1):
            part = facts[i:i + CHUNK]
            work.append((job, n, part, prompt_for(job, batch, occ, part, slots)))
    print(f"{len(jobs)} jobs, {sum(len(w[2]) for w in work)} tasks, {len(work)} batches", flush=True)
    if args.emit_prompts:
        out_dir = os.path.join(ROOT, args.emit_prompts)
        os.makedirs(out_dir, exist_ok=True)
        manifest = []
        for job, n, part, p in work:
            name = f"{job['code']}__{n}"
            with open(os.path.join(out_dir, name + ".md"), "w", encoding="utf-8") as fh:
                fh.write(PANE_HEADER + p)
            manifest.append({"name": name, "code": job["code"], "title": job["title"], "function": job.get("function"),
                             "n": n, "uids": [f["uid"] for f in part]})
        write_json(os.path.join(out_dir, "manifest.json"), manifest)
        print(f"wrote {len(manifest)} prompts to {args.emit_prompts}")
        return
    failed = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(job_batch, args.model, j, n, part, p, schema_text): (j, n) for j, n, part, p in work}
        for future in as_completed(futures):
            j, n = futures[future]
            try:
                status = future.result()
            except Exception as error:  # report and keep going
                status = f"error {error!r}"
            failed += not status.startswith(("ok ", "skipped"))
            print(f"{args.model} {j['code']}__{n} {j['title'][:40]}: {status}", flush=True)
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
