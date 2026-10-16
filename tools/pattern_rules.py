"""
Rung 3 of the model: pick a solution pattern for every task with a fixed rule over the jev
anatomy answers (data/jev_anatomy.json), so the pattern is reproducible and can be set
against what the LLM fleet chose. Writes data/patterns_rule.json.

The jev answers bunch on the middle option for several questions (rules: "partly" for 190 of
268 tasks), so the rule reads probability-weighted features, not the top answer:

  codify      P(rules fully or mostly)
  structured  P(structured input) + half of P(documents)
  messy_in    P(documents or unstructured input)
  checkable   P(checked instantly) + 0.6 × P(checked by review in minutes)
  stakes      P(harm to people) + half of P(legal or financial damage)
  relational  P(largely relational) + half of P(partly)
  drudgery    expected share of repetitive time (none 0, <1/4 .125, 1/4-1/2 .375, >1/2 .7)
  (ambition headroom is no longer read: it tracked nothing in E1, r = -0.15 with speedup)

  keep_human              relational ≥ 0.6, or core is communicate and stakes ≥ 0.6
  deterministic_software  codify ≥ 0.5, structured ≥ 0.6, core is transform or gather
  llm_step                messy_in ≥ 0.35, checkable ≥ 0.45, core is transform, gather or create
  agent_with_gate         core is coordinate, gather or transform, arriving as a stream, cases or batches
                          (v1: batches added; E1 showed the rule sent batch work to copilot)
  copilot                 everything else (judging, creating, advising)

Usage:
    python3 tools/pattern_rules.py
"""

import collections
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DRUDGERY = {"none": 0.0, "under_quarter": 0.125, "quarter_to_half": 0.375, "over_half": 0.7}


def p(answer, *options):
    return sum(answer["probs"].get(o, 0.0) for o in options)


def features(a):
    return {
        "core": a["core_work"]["choice"],
        "volume": a["volume"]["choice"],
        "codify": round(p(a["rules"], "fully", "mostly"), 3),
        "structured": round(p(a["input_structure"], "structured") + 0.5 * p(a["input_structure"], "documents"), 3),
        "messy_in": round(p(a["input_structure"], "documents", "unstructured"), 3),
        "checkable": round(p(a["verifiable"], "instantly") + 0.6 * p(a["verifiable"], "with_review"), 3),
        "stakes": round(p(a["error_cost"], "harm_people") + 0.5 * p(a["error_cost"], "legal_financial"), 3),
        "relational": round(p(a["relationship"], "largely") + 0.5 * p(a["relationship"], "partly"), 3),
        "drudgery": round(sum(DRUDGERY[k] * v for k, v in a["drudgery"]["probs"].items()), 3),
        "data_in_systems": round(p(a["data_in_systems"], "yes") + 0.5 * p(a["data_in_systems"], "partly"), 3),
        "accountable": a["accountable"]["yes"],
    }


def pattern(f):
    if f["relational"] >= 0.6 or (f["core"] == "communicate" and f["stakes"] >= 0.6):
        return "keep_human", "the value is in the relationship, or advice where errors hurt people"
    if f["codify"] >= 0.5 and f["structured"] >= 0.6 and f["core"] in ("transform", "gather"):
        return "deterministic_software", "rules can be written down and the input is structured"
    if f["messy_in"] >= 0.35 and f["checkable"] >= 0.45 and f["core"] in ("transform", "gather", "create"):
        return "llm_step", "messy input into a checkable output"
    if f["core"] in ("coordinate", "gather", "transform") and f["volume"] in ("stream", "cases", "batches"):
        return "agent_with_gate", "several steps over a stream of cases, with exceptions"
    return "copilot", "judging, creating or advising: the person stays the lead"


def main():
    teams = json.load(open(os.path.join(ROOT, "data", "teams.json"), encoding="utf-8"))
    classes = {(t["uid"], r["id"]): t["class_name"] for team in teams["teams"]
               for r in team["roles"] for t in r["tasks"]}
    out = []
    for entry in json.load(open(os.path.join(ROOT, "data", "jev_anatomy.json"), encoding="utf-8")):
        f = features(entry["answers"])
        name, why = pattern(f)
        out.append({"uid": entry["uid"], "role_id": entry["role_id"],
                    "class": classes[(entry["uid"], entry["role_id"])],
                    "pattern": name, "why": why, "features": f})
    with open(os.path.join(ROOT, "data", "patterns_rule.json"), "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=1)
    for klass in ("automate", "amplify", "human", "machines"):
        counts = collections.Counter(e["pattern"] for e in out if e["class"] == klass)
        if counts:
            print(f"{klass:<9} " + ", ".join(f"{k} {v}" for k, v in counts.most_common()))


if __name__ == "__main__":
    main()
