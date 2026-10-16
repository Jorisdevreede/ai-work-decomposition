"""
Jev decomposition: what share of a task's time goes to each kind of work and to each means of work.

Jev answers one question at a time (yes/no, a level, or one choice), so a split is asked as one
level question per part: "what share of the time goes to X?" on five levels. The expected share of
each part (level midpoints 0, 5, 20, 45, 75 percent) is normalised so the parts add up to 100.

  kind of work   gather, transform, decide, create, communicate, coordinate
  means of work  system screens, spreadsheets, mail and chat, documents, meetings and in person

Spreadsheet and mail time is the glue signal: work that ties systems or teams together by hand.

Inputs as in tools/jev_anatomy_v2.py: the 268 team tasks (default) or every O*NET task (--onet).
Writes data/jev_shares.json or data/jev_shares_onet.json, checkpointing, resumable.

    uv run --project ~/Projects/AI-ISCO python tools/jev_shares.py [--onet] [--limit N]
"""

import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from jev_anatomy_v2 import (  # noqa: E402  (also puts AI-ISCO on the path)
    CHECKPOINT, MODEL, onet_items, save, team_items)
from typesafe_sdk import TypeSafeClient  # noqa: E402

from aiisco.rubric_v2 import SCORE, Question, primitive  # noqa: E402
from aiisco.systemone import RateLimiter, load_api_key  # noqa: E402

#: Midpoint share in percent for each of the five levels.
MIDPOINTS = [0, 5, 20, 45, 75]


def levels(what):
    return [
        f"None of the time goes to {what}.",
        f"Under a tenth of the time goes to {what}.",
        f"A tenth to almost a third of the time goes to {what}.",
        f"A third to well over half of the time goes to {what}.",
        f"Most of the time, more than 60 percent, goes to {what}.",
    ]


KINDS = {
    "gather": "finding and collecting information from people, systems or documents",
    "transform": "processing information: checking, reconciling, calculating, entering or updating records",
    "decide": "judging and choosing: assessing cases, approving, setting priorities",
    "create": "making something new: writing, designing, planning",
    "communicate": "explaining, advising, persuading or negotiating with people",
    "coordinate": "organising: scheduling, following up, aligning people and steps",
}
MEANS = {
    "system_screens": "working in business systems on screen (ERP, HR, finance, CRM, specialist software)",
    "spreadsheets": "working in spreadsheets",
    "mail_chat": "e-mail, chat and messages",
    "documents": "writing and reading documents, forms and reports",
    "meetings_in_person": "meetings, calls and work in person or on site",
}

Q = {}
for key, what in KINDS.items():
    Q[f"kind_{key}"] = Question(SCORE, f"Share: {key}", (
        f"Of all the time spent on this task, what share goes to {what}?"), levels(what))
for key, what in MEANS.items():
    Q[f"means_{key}"] = Question(SCORE, f"Share: {key}", (
        f"Of all the time spent on this task, what share is spent {what}?"), levels(what))
QUESTIONS = {name: primitive(q) for name, q in Q.items()}


def split(answers, prefix):
    """Expected shares of one family of questions, normalised to 100."""
    raw = {name[len(prefix):]: sum(p * m for p, m in zip(a["probs"], MIDPOINTS))
           for name, a in answers.items() if name.startswith(prefix)}
    total = sum(raw.values()) or 1
    return {k: round(100 * v / total, 1) for k, v in raw.items()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--onet", action="store_true")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--rps", type=float, default=6)
    args = parser.parse_args()
    out = os.path.join(ROOT, "data", "jev_shares_onet.json" if args.onet else "jev_shares.json")
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
                answers = {n: {"probs": [round(r.answers[n].probabilities[lv], 4)
                                         for lv in sorted(r.answers[n].probabilities)],
                               "confidence": round(r.answers[n].confidence, 3)} for n in Q}
                return {"key": key, "statement": state["task"]["statement"], "answers": answers,
                        "kind": split(answers, "kind_"), "means": split(answers, "means_"),
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
                print(f"{n}/{len(items)}", flush=True)
    save(out, done)
    tokens = sum(e["input_tokens"] for e in done.values())
    print(f"Wrote {len(done)} answers to {out} ({tokens:,} input tokens)")


if __name__ == "__main__":
    main()
