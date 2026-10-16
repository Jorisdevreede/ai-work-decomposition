"""
Jev anatomy rubric v2: fixed questions with probabilistic answers about every task, for a
deterministic-first method. Changes from v1 (tools/jev_anatomy.py), after E1 and the Fable and
Astra reviews of 2026-10-14:

- steps and rules: "what share of cases would written rules handle" and "what makes the rest
  hard" replace "can the rules be written down" (which bunched on "partly"); added interfaces,
  standard software, exceptions, and whether the task would vanish with structured input;
  checking split into automatic validation, review and later; ambition headroom dropped.
- risk (Joris): reach and write access, reversibility, human approval, exposure, data sensitivity.
- solution shapes (Joris): yes/no per shape, because one task is often several stitched together
  (artefact generator, workflow automation, CRUD app, dashboard, answer desk, integration,
  a judgement step, conversation).

Two inputs:
  default    the 268 tasks of data/teams.json, asked with the role and the company
  --onet     every O*NET task (AI-ISCO data/onet_tasks.json), asked with the occupation only
Writes data/jev_anatomy_v2.json or data/jev_anatomy_v2_onet.json, checkpointing every 500, and
resumes from what is there.

    uv run --project ~/Projects/AI-ISCO python tools/jev_anatomy_v2.py [--onet] [--limit N]
"""

import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

AIISCO = os.environ.get("AIISCO", os.path.expanduser("~/Projects/AI-ISCO"))
sys.path.insert(0, AIISCO)

from typesafe_sdk import TypeSafeClient  # noqa: E402

from aiisco.rubric_v2 import CHOICE, NOUL, Question, primitive  # noqa: E402
from aiisco.systemone import RateLimiter, load_api_key  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MODEL = "jev-1.13.0"
CHECKPOINT = 500


def yesno(label, question, yes, no):
    return Question(NOUL, label, question, {"true": yes, "false": no})


Q = {
    # --- the work and its steps -------------------------------------------------------
    "drudgery": Question(CHOICE, "Drudgery", (
        "What share of the time spent on this task goes to repetitive work that needs little "
        "judgement: copying or re-typing information, chasing people, formatting, scheduling, "
        "looking things up?"), {
        "none": "Almost none: nearly all the time goes to work that needs thought or contact.",
        "under_quarter": "Less than a quarter of the time is repetitive work.",
        "quarter_to_half": "A quarter to half of the time is repetitive work.",
        "over_half": "More than half of the time is repetitive work.",
    }),
    "core_work": Question(CHOICE, "Core of the work", "What is the core of this task?", {
        "gather": "Finding and collecting information from people, systems or documents.",
        "transform": "Processing information: checking, reconciling, calculating, entering or updating records.",
        "decide": "Judging and choosing: assessing a case, approving, setting priorities.",
        "create": "Making something new: writing, designing, planning, building a programme.",
        "communicate": "Explaining, advising, persuading or negotiating with people.",
        "coordinate": "Organising: scheduling, following up, aligning people and steps.",
    }),
    "input_structure": Question(CHOICE, "Input", "What does the person mostly work from?", {
        "structured": "Records and fields in a system, or tables with a fixed layout.",
        "documents": "Forms, PDFs or e-mails with a known, repeating layout.",
        "unstructured": "Free text, conversations, or documents that differ every time.",
        "situational": "What happens in the room, on the shop floor or on site.",
    }),
    "rule_coverage": Question(CHOICE, "Rule coverage", (
        "If the organisation wrote down its rules for this task as precisely as it could, what share "
        "of the cases would those rules handle completely, without a person deciding?"), {
        "under_half": "Fewer than half of the cases.",
        "half_to_80": "Between half and 80 percent of the cases.",
        "80_to_95": "Between 80 and 95 percent of the cases.",
        "over_95": "More than 95 percent of the cases.",
    }),
    "hard_part": Question(CHOICE, "What makes the rest hard", (
        "For the cases written rules would not handle, what mostly makes them hard?"), {
        "missing_data": "Information is missing, late or wrong and has to be chased or repaired.",
        "judgement": "Weighing circumstances, risks or quality needs expert judgement.",
        "people": "It depends on persuading, reassuring or agreeing with people.",
        "odd_inputs": "Documents or requests arrive in unusual, varying forms.",
        "nothing": "Almost nothing: nearly every case fits the rules.",
    }),
    "exceptions": Question(CHOICE, "Exceptions", "How often does a case fall outside the normal path?", {
        "rare": "Rarely: almost every case follows the usual steps.",
        "sometimes": "Sometimes: one case in five to ten needs special handling.",
        "often": "Often: a large share of cases needs special handling.",
    }),
    "checking": Question(CHOICE, "Checking", "How can someone tell that the result is right?", {
        "automatic": "Automatically: against a rule, a total, a source record or a validation.",
        "review": "A knowledgeable person can review it in minutes.",
        "only_later": "Only later, when the outcome shows after weeks or months.",
        "hardly": "Hardly at all: it is a matter of opinion or trust.",
    }),
    "error_cost": Question(CHOICE, "Cost of an error", "What happens when this task is done wrong?", {
        "undo": "Easily noticed and corrected, little harm.",
        "rework": "It costs time or money to repair.",
        "legal_financial": "Legal, compliance or financial damage to the organisation.",
        "harm_people": "It harms a person's job, income, health or trust.",
    }),
    "relationship": Question(CHOICE, "Relationship", (
        "Does the value of this task depend on a relationship or trust between people?"), {
        "no": "No: the result is what counts, whoever delivers it.",
        "partly": "Partly: trust helps, but the result matters most.",
        "largely": "Largely: the value is in the relationship, the presence or the trust.",
    }),
    "arrival": Question(CHOICE, "How it arrives", "How does this task arrive?", {
        "stream": "As a stream: many similar cases every week.",
        "batches": "In cycles: monthly, quarterly or yearly batches.",
        "cases": "As individual cases that each differ.",
        "projects": "Occasionally, as one-off projects.",
    }),
    "interface": Question(CHOICE, "Interface", (
        "How could software reach the information and systems this task uses?"), {
        "api": "Through business systems with interfaces or exports software can use directly.",
        "files": "Through files: spreadsheets, PDFs, e-mails or exports that are passed around.",
        "screen": "Only through screens people click through; no interface or export.",
        "offline": "Mostly not digital: paper, phone or face to face.",
    }),
    "standard_software": Question(CHOICE, "Standard software", (
        "Does standard business software (an ERP, HR, finance, CRM or office suite) already do most "
        "of this task when it is set up properly?"), {
        "yes": "Yes: it is a standard feature that mainly needs configuring.",
        "partly": "Partly: standard software covers some steps; the rest is manual.",
        "no": "No: standard software does not do this.",
    }),
    "vanishes": yesno("Would vanish", (
        "Would most of this task disappear if the information arrived complete, correct and "
        "structured in the first place?"),
        "Yes: the task exists mainly to repair, re-key or chase information.",
        "No: the task has value of its own even with perfect information."),
    "accountable": yesno("Named accountability", (
        "Must a named person formally answer for the outcome of this task, by signing off, by law "
        "or by professional duty?"),
        "Yes: a named person signs off or is legally or professionally accountable.",
        "No: the outcome is not tied to a named person's formal accountability."),
    # --- risk -----------------------------------------------------------------------------
    "reach": Question(CHOICE, "Reach", (
        "If software did this task, what would it need to be allowed to do?"), {
        "read": "Only read and look things up.",
        "draft": "Prepare drafts or proposals that a person then uses.",
        "write_internal": "Change records in the organisation's own systems.",
        "act_external": "Act outside the organisation: send messages, submit filings, make payments.",
    }),
    "reversibility": Question(CHOICE, "Reversibility", "Once the result of this task takes effect, can it be undone?", {
        "easily": "Easily: it can be corrected or reversed with little effort.",
        "with_effort": "With effort: reversing it costs time, money or an awkward conversation.",
        "irreversible": "Not really: a payment, a decision told to a person, a filing or a public statement stays.",
    }),
    "human_approval": yesno("Human approval", (
        "Once a well-tested system does this task reliably, would it still be irresponsible to let its "
        "results take effect without a person approving each one?"),
        "Yes: even then, each result needs a person's approval before it takes effect.",
        "No: once proven, results can take effect with spot checks and exception handling only."),
    "exposure": Question(CHOICE, "Exposure", "Who sees the result of this task?", {
        "self": "Only the person doing it.",
        "team": "The team or department.",
        "company": "People across the organisation.",
        "external": "People outside it: customers, candidates, suppliers, authorities or the public.",
    }),
    "data_sensitivity": Question(CHOICE, "Data sensitivity", "How sensitive is the information this task handles?", {
        "public": "Public or non-confidential information.",
        "internal": "Internal business information.",
        "confidential": "Confidential: personal data, pay, contracts, finances or trade secrets.",
        "special": "Special categories: health, criminal records, biometrics, union membership, or similar.",
    }),
}

SHAPES = {
    "artefact_generator": ("Artefact generator", "documents, reports, letters, plans, analyses or other artefacts produced from data and templates"),
    "workflow_automation": ("Workflow automation", "cases moving through steps, people and systems with triggers, routing, reminders and approvals"),
    "crud_app": ("Records app", "a simple application where structured records are entered, edited, checked and looked up"),
    "dashboard": ("Interactive dashboard", "an interactive view on data to monitor, compare and decide"),
    "answer_desk": ("Answer desk", "answering questions from policies, documents and records, with the source shown"),
    "integration": ("Integration", "data moved, matched or synchronised between systems without a person"),
    "judgement_step": ("Judgement step", "a model judging, classifying, scoring or reasoning about a case inside a fixed workflow"),
    "conversation": ("Conversation", "talking with people by chat or voice: asking, explaining, guiding"),
}
Q["shape_main"] = Question(CHOICE, "Main solution shape", (
    "Software built for this task would be several pieces stitched together. Which kind of "
    "software would do most of the work and carry most of the value?"),
    {key: f"{label}: {what}." for key, (label, what) in SHAPES.items()})
Q["shape_support"] = Question(CHOICE, "Supporting solution shape", (
    "Apart from the main piece, which kind of software would be the most important supporting "
    "piece? Choose 'none' if a single piece would do."),
    {**{key: f"{label}: {what}." for key, (label, what) in SHAPES.items()},
     "none": "None: one kind of software would do the job on its own."})
Q["model_needed"] = yesno("Model needed at run time", (
    "Once built, would the software need an AI model while it runs (to read free text, judge, write "
    "or talk), or could ordinary programmed rules do all of it?"),
    "Yes: some step needs an AI model to read, judge, write or talk while it runs.",
    "No: ordinary programmed rules, queries and templates could do all of it.")

QUESTIONS = {name: primitive(q) for name, q in Q.items()}


def team_items():
    data = json.load(open(os.path.join(ROOT, "data", "teams.json"), encoding="utf-8"))
    for team in data["teams"]:
        for role in team["roles"]:
            for task in role["tasks"]:
                key = f"{task['uid']}|{role['id']}"
                yield key, {"task": {"statement": task["statement"], "role": role["title"],
                                     "team": team["name"], "occupation": task["onet_title"],
                                     "company": data["company"]["summary"]}}


def onet_items():
    for task in json.load(open(os.path.join(AIISCO, "data", "onet_tasks.json"), encoding="utf-8")):
        yield f"{task['code']}:{task['task_id']}", {"task": {
            "statement": task["statement"], "occupation": task["occupation"],
            "occupation_description": task["occupation_description"]}}


def serialise(name, answer):
    if Q[name].kind == NOUL:
        return {"yes": round(answer.noul, 4)}
    return {"choice": answer.choice,
            "probs": {k: round(answer.probabilities.get(k, 0.0), 4) for k in Q[name].criteria},
            "confidence": round(answer.confidence, 3)}


def save(path, done):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(list(done.values()), f, ensure_ascii=False)
    os.replace(tmp, path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--onet", action="store_true")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--rps", type=float, default=6)
    args = parser.parse_args()
    out = os.path.join(ROOT, "data", "jev_anatomy_v2_onet.json" if args.onet else "jev_anatomy_v2.json")
    done = {}
    if os.path.exists(out):
        done = {e["key"]: e for e in json.load(open(out, encoding="utf-8"))}
    items = [(k, s) for k, s in (onet_items() if args.onet else team_items()) if k not in done]
    if args.limit:
        items = items[:args.limit]
    print(f"{len(done)} done, {len(items)} to ask, {len(Q)} questions each", flush=True)
    client = TypeSafeClient(api_key=load_api_key())
    limiter = RateLimiter(args.rps)

    def ask(item):
        key, state = item
        for attempt in range(5):
            try:
                limiter.wait()
                r = client.system_one(state=state, questions=QUESTIONS, model=MODEL)
                return {"key": key, "statement": state["task"]["statement"],
                        "answers": {n: serialise(n, r.answers[n]) for n in Q},
                        "model": r.model, "input_tokens": r.usage.input_tokens}
            except Exception as error:  # back off and retry
                print(f"  retry {key}: {error!r}"[:200], flush=True)
                time.sleep(2 ** attempt)
        return None

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for n, entry in enumerate(pool.map(ask, items), 1):
            if entry:
                done[entry["key"]] = entry
            if n % CHECKPOINT == 0:
                save(out, done)
                tokens = sum(e["input_tokens"] for e in done.values())
                print(f"{n}/{len(items)} ({tokens:,} input tokens so far)", flush=True)
    save(out, done)
    tokens = sum(e["input_tokens"] for e in done.values())
    print(f"Wrote {len(done)} answers to {out} ({tokens:,} input tokens)")


if __name__ == "__main__":
    main()
