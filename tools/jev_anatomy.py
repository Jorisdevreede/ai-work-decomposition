"""
Experiment E1: fixed questions with probabilistic answers. Asks TypeSafe's jev model eleven
questions about the anatomy of every task in data/teams.json (what kind of work it is, how
much drudgery, how structured and checkable, what an error costs, whether there is room for
more), so a rule can pick a solution pattern reproducibly. Writes data/jev_anatomy.json.

Runs inside the AI-ISCO environment, which has the TypeSafe SDK and the key loader:
    uv run --project ~/Projects/AI-ISCO python tools/jev_anatomy.py
"""

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
OUT = os.path.join(ROOT, "data", "jev_anatomy.json")
MODEL = "jev-1.13.0"

Q = {
    "drudgery": Question(CHOICE, "Drudgery", (
        "What share of the time spent on this task goes to repetitive work that needs little "
        "judgement: copying or re-typing information, chasing people, formatting, scheduling, "
        "looking things up?"), {
        "none": "Almost none: nearly all the time goes to work that needs thought or contact.",
        "under_quarter": "Some: less than a quarter of the time is repetitive work.",
        "quarter_to_half": "A lot: a quarter to half of the time is repetitive work.",
        "over_half": "Most: more than half of the time is repetitive work.",
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
    "rules": Question(CHOICE, "Rules", (
        "Could the rules for doing this task be written down completely enough for software to "
        "follow them?"), {
        "fully": "Yes: the steps and conditions can be written down completely.",
        "mostly": "Mostly: written rules cover the common cases, with a list of exceptions.",
        "partly": "Partly: rules give a frame, but each case needs judgement.",
        "no": "No: the task is judgement throughout.",
    }),
    "verifiable": Question(CHOICE, "Checkable", "How quickly can someone check that the result is right?", {
        "instantly": "At once, against a rule, a total or a source.",
        "with_review": "A knowledgeable person can review it in minutes.",
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
    "data_in_systems": Question(CHOICE, "Data in systems", (
        "Is the information needed for this task already in business systems?"), {
        "yes": "Yes, in systems the organisation runs.",
        "partly": "Partly: some in systems, some in mailboxes, spreadsheets, paper or heads.",
        "no": "No: it lives in people's heads, conversations or on paper.",
    }),
    "volume": Question(CHOICE, "How it arrives", "How does this task arrive?", {
        "stream": "As a stream: many similar cases every week.",
        "batches": "In cycles: monthly, quarterly or yearly batches.",
        "cases": "As individual cases that each differ.",
        "projects": "Occasionally, as one-off projects.",
    }),
    "ambition_headroom": Question(CHOICE, "Room for more", (
        "If this task cost a tenth of what it costs now, would the organisation want much more of "
        "it, or want it done much better?"), {
        "no": "No: the amount needed is fixed, and doing it better adds little.",
        "somewhat": "Somewhat: a bit more or a bit better would help.",
        "a_lot": "A lot: there is far more of it worth doing, or doing properly, than gets done today.",
    }),
    "accountable": Question(NOUL, "Named accountability", (
        "Must a named person formally answer for the outcome of this task, by signing off, by law "
        "or by professional duty?"), {
        "true": "Yes: a named person signs off or is legally or professionally accountable.",
        "false": "No: the outcome is not tied to a named person's formal accountability.",
    }),
}
QUESTIONS = {name: primitive(q) for name, q in Q.items()}


def state(company, team, role, task):
    return {"task": {
        "statement": task["statement"], "role": role["title"], "team": team["name"],
        "occupation": task["onet_title"],
        "company": company["summary"],
    }}


def serialise(name, answer):
    if Q[name].kind == NOUL:
        return {"yes": round(answer.noul, 4)}
    return {"choice": answer.choice,
            "probs": {k: round(answer.probabilities.get(k, 0.0), 4) for k in Q[name].criteria},
            "confidence": round(answer.confidence, 3)}


def main():
    data = json.load(open(os.path.join(ROOT, "data", "teams.json"), encoding="utf-8"))
    done = {}
    if os.path.exists(OUT):
        done = {e["uid"] + "|" + e["role_id"]: e for e in json.load(open(OUT, encoding="utf-8"))}
    client = TypeSafeClient(api_key=load_api_key())
    limiter = RateLimiter(4)
    todo = [(team, role, task) for team in data["teams"] for role in team["roles"]
            for task in role["tasks"] if f"{task['uid']}|{role['id']}" not in done]
    print(f"{len(done)} done, {len(todo)} to ask", flush=True)

    def ask(item):
        team, role, task = item
        for attempt in range(4):
            try:
                limiter.wait()
                response = client.system_one(state=state(data["company"], team, role, task),
                                             questions=QUESTIONS, model=MODEL)
                return {"uid": task["uid"], "role_id": role["id"], "statement": task["statement"],
                        "answers": {n: serialise(n, response.answers[n]) for n in Q},
                        "model": response.model, "input_tokens": response.usage.input_tokens}
            except Exception as error:  # back off and retry
                print(f"  retry {task['uid']}: {error!r}", flush=True)
                time.sleep(2 ** attempt)
        return None

    with ThreadPoolExecutor(max_workers=4) as pool:
        for n, entry in enumerate(pool.map(ask, todo), 1):
            if entry:
                done[entry["uid"] + "|" + entry["role_id"]] = entry
            if n % 25 == 0:
                print(f"{n}/{len(todo)}", flush=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(list(done.values()), f, indent=1, ensure_ascii=False)
    tokens = sum(e["input_tokens"] for e in done.values())
    print(f"Wrote {len(done)} answers to {OUT} ({tokens:,} input tokens)")


if __name__ == "__main__":
    main()
