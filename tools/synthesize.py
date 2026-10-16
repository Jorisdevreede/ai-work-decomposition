"""
Experiments E5 and E6: merge the model answers, roll them up per role and team, price the
opportunities.

Reads data/teams.json (the O*NET facts per role), runs/<variant>/<model>/<role>__<n>.json (each
model's answer for a batch of a role's tasks) and data/synthesis/opportunity-clusters.json (the
hand-made clustering: which tasks make one thing to build, its build brief and golden demo, and the
labelled business-case assumptions). The arithmetic is all here; the judgement is in that file.
When data/synthesis/url-check.json exists (whether each cited link resolves), the critic only
penalises links that are dead or were never checked.

Writes, in data/synthesis/:
  tasks.json          per task uid: the models side by side, consensus pattern and autonomy, an
                      agreement score, median speedup and time saved, the strongest line per lens with
                      its model, research questions, evidence; the grounded answers next to them
  roles.json          per role: hours freed, Amdahl speedup and ceiling, altitude, reach (mapped to the
                      roles it reaches into), skills to grow, ambitious version
  teams.json          per team: FTE capacity returned, team ceiling, the three redesign options
  opportunities.json  the clusters with their business case, priority, build brief and golden demo
  experiments.json    the numbers behind method/findings.md (models compared, probes, grounding)

Roll-ups use the in-memory answers (--variant grounded or --variant v1 to switch). The in-memory
variant takes Sol's web-off rerun (runs/inmemory-noweb/sol) batch by batch where it exists, in place of
runs/inmemory/sol (--sol-with-web keeps the old Sol). --variant v1 merges runs/v1 under the model-v1
rules (method/findings.md, "What to change in model-v0.md"; method/model-v1.md):
  - simplest first after the vote: when any model chose deterministic_software or llm_step, the
    consensus takes the simplest such pattern, unless two or more models chose agent_with_gate and the
    models' mean anatomy puts coordinate + decide above 50%; every override is recorded
  - keep_human comes from the jev rule (data/patterns_rule.json) only: those tasks free 0 hours and keep
    the models' human_edge
  - copilot value is multiplied by ADOPTION_SHARE in the priority
  - every hours-freed and capacity figure gets an `_expected` twin {year1, year2, year3} = potential x
    the adoption ramp (0.5, 0.8, 1.0); the potential itself is kept as is
and writes to data/synthesis/v1/, so the v0 merge stays next to it for comparison. A task's freed hours follow from
its median speedup s as hours x (1 - 1/s), so hours freed and the Amdahl ceiling always agree; the
models' own time_saved_pct is kept as a cross-check. An automate or amplify task nobody has answered
yet counts at a fallback speedup (automate 4, amplify 1.8) and is marked, so the roll-ups exist while
the runs land. Rerun as more answers arrive; the script only reads.

Usage:
    python3 tools/synthesize.py                    # in-memory, writes data/synthesis/
    python3 tools/synthesize.py --variant grounded
    python3 tools/synthesize.py --variant v1       # writes data/synthesis/v1/
"""

import argparse
import glob
import json
import math
import os
import re
import statistics
import sys
import zlib
from collections import Counter, defaultdict
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "data", "synthesis")
CLUSTERS = os.path.join(OUT, "opportunity-clusters.json")
MODELS = ("opus", "sol", "grok")
MODEL_NAMES = {"opus": "Opus 5.5", "sol": "Sol 6.1", "grok": "Grok 4.7"}
VARIANTS = ("inmemory", "grounded", "v1")
#: The variant each one is set beside on every task (the `<other>` block) and in experiments.json.
COMPARE = {"inmemory": "grounded", "grounded": "inmemory", "v1": "inmemory"}
#: Where each variant's merge goes; v1 has its own folder so the v0 merge stays for comparison.
OUT_DIR = {"inmemory": OUT, "grounded": OUT, "v1": os.path.join(OUT, "v1")}
#: Sol rerun with web search really off: replaces runs/inmemory/sol batch by batch where it exists.
NOWEB = {"variant": "inmemory", "model": "sol", "folder": "inmemory-noweb"}
#: Variants merged under the model-v1 rules (simplest first, keep_human by rule, adoption share, adoption ramp).
V1_RULES = {"v1"}
#: Simplest first (findings.md change 8): a fixed workflow wins unless the steps cannot be predicted,
#: read as "two or more agent votes and the anatomy is mostly coordinate + decide".
SIMPLEST = ("deterministic_software", "llm_step")
AGENT_VOTES_TO_HOLD = 2
COORDINATE_DECIDE_TO_HOLD = 50
#: Share of a copilot's value that is realised, because people must choose to use it. findings.md E6
#: (change 13): without it the short copilot band alone puts copilots first in the priority.
ADOPTION_SHARE = 0.5
#: Expected = potential x the share of it realised in each year as people adopt the change.
#: Joris 2026-10-14: adoption ramp, capability assumed to hold. This is adoption, not a discount on what
#: the AI can do; public field figures on time saved are not used to shrink the potential.
EXPECTED_YEAR1 = 0.5
EXPECTED_YEAR2 = 0.8
EXPECTED_YEAR3 = 1.0
ADOPTION_RAMP = {"year1": EXPECTED_YEAR1, "year2": EXPECTED_YEAR2, "year3": EXPECTED_YEAR3}
AI_CLASSES = ("automate", "amplify")
LENSES = ("faster", "autonomous", "ambitious", "joy", "options", "altitude")
PATTERNS = ("deterministic_software", "llm_step", "agent_with_gate", "copilot", "keep_human")
BUILD_PATTERNS = ("deterministic_software", "llm_step", "agent_with_gate")
#: Speedup for an automate or amplify task no model has answered yet (the canvas fallback).
FALLBACK_SPEEDUP = {"automate": 4.0, "amplify": 1.8}
CONFIDENCE = {"low": 0.3, "medium": 0.6, "high": 0.9}
GRADE_SCORE = {"E0": 0.1, "E1": 0.3, "E2": 0.7, "E3": 0.9, "E4": 1.0}
#: Months to first value per build pattern: the method's effort band (an assumption).
TIME_TO_VALUE = {"deterministic_software": 2.0, "llm_step": 3.0, "agent_with_gate": 4.0,
                 "copilot": 1.5, "keep_human": 1.0}
#: Extra months when the works council must consent (WOR art. 27) or the EU AI Act calls the
#: system high risk (recruitment, worker management: risk file, logging, human oversight).
EXTRA_MONTHS = {"or_consent": 1.0, "ai_act_high_risk": 2.0}
#: Euros resting on assumptions (financial and quality lines) count at this weight in the priority.
ASSUMPTION_WEIGHT = 0.5
#: Runs that are not what their folder says, found in the CLI session logs (2026-10-14).
CAVEATS = {"inmemory/sol": "codex exec searched the web in every batch (1-5 web__run calls per session in "
                           "~/.codex/sessions): tools/reimagine.py gives codex no web-off switch, so these "
                           "answers are Sol with web search, not from memory",
           "grounded/sol": "the same codex call: Sol had the role digest and web search too"}
#: Whether the links in the answers resolve (GET on 2026-10-14); a link nobody checked counts as unverified.
URL_CHECK = os.path.join(OUT, "url-check.json")
URL = re.compile(r"https?://[^\s)\]\"'>]+")
URLS = {}

SPECIFIC = re.compile(
    r"\b(afas|recruitee|studytube|power bi|sharepoint|outlook|excel|rabobank|camt(?:\.053)?|sepa|"
    r"microsoft 365|m365|copilot|microsoft graph|dax|cao|works council|ondernemingsraad|poortwachter|"
    r"uwv|avg|gdpr|ai act|arbo\w*|bedrijfsarts|loonaangifte|btw|vat|belastingdienst|pension\w*|wkr|"
    r"verzuim|flex workers?|staffing agenc(?:y|ies)|agency|rotterdam|tilburg|venlo|shifts?|warehouses?|"
    r"forklift|vca|drivers?|kvk|iban|ubl|peppol)\b", re.I)
HYPE = re.compile(r"revolution|unlock|seamless|game.?chang|supercharg|empower|cutting.edge|leverag|"
                  r"transformative|next.level|paradigm", re.I)
STOP = set("the and for with from that this into than then each per are can will would could should "
           "more most less who what which when where how all any our your their they them its has have "
           "had was were been does done not also only about over just same every".split())
#: Which of the 14 roles a reach line points at (first the role, then words that name it).
ROLE_WORDS = [
    ("hr-director", r"hr director|director of hr|head of hr"),
    ("hrbp", r"business partner|hrbp"),
    ("recruiter", r"recruit|talent acquisition"),
    ("hr-admin", r"hr admin|administrator|hr administration"),
    ("payroll", r"payroll"),
    ("cnb", r"compensation|benefits specialist|c&b|reward"),
    ("ld", r"learning|l&d|training specialist|trainers?\b"),
    ("people-analyst", r"people analyt|hris|analytics analyst"),
    ("finance-director", r"finance director|cfo"),
    ("controller", r"(?<!credit )controller"),
    ("accountant", r"accountant"),
    ("bookkeeper", r"bookkeep|accounts payable|accounts receivable|ap clerk"),
    ("collections", r"collections|credit officer|credit control"),
    ("fpa", r"fp&a|fpa\b|financial planning|budget analyst"),
]
#: Value stream of a task, from words in its statement; first match wins, then the role default.
VALUE_STREAM_RULES = {
    "hr": [
        ("pay cycle (month close of payroll)", r"payroll|wage|paycheck|time sheet|deduction|earnings|"
         r"hours worked|attendance|pay adjust|tax return"),
        ("absence to return (verzuim, Wet verbetering poortwachter)", r"sick|leave time|absence|"
         r"worker'?s'? compensation|disabilit|injur"),
        ("hire to productive (vacancy to day 90)", r"recruit|applicant|candidate|hiring|hire\b|job order|"
         r"vacanc|interview|orientation|staffing needs|job fairs"),
    ],
    "finance": [
        ("procure to pay", r"invoices? for payment|purchase|disburse|vendor|supplier|order forms|"
         r"checks for|expense report"),
        ("order to cash", r"collect|customer|delinquent|overdue|credit accounts|bills|payments and post|"
         r"loan|payments are up to date|account statements"),
        ("plan to forecast", r"budget|forecast|appropriation|cost-benefit|financial resources required|"
         r"funds|investment|profits|financial objectives|financial planning|future revenues"),
    ],
}
VALUE_STREAM_DEFAULT = {
    "recruiter": "hire to productive (vacancy to day 90)", "payroll": "pay cycle (month close of payroll)",
    "collections": "order to cash", "fpa": "plan to forecast",
    "hr": "hire to retire (employee lifecycle)", "finance": "record to report (month close)",
}


# ---------------------------------------------------------------- small helpers

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write(name, data, out=OUT):
    os.makedirs(out, exist_ok=True)
    path = os.path.join(out, name)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    os.replace(tmp, path)  # readers never see a half-written file
    return path


def mean(values):
    values = [v for v in values if v is not None]
    return sum(values) / len(values) if values else None


def r2(x):
    return None if x is None else round(x, 2)


def tokens(text):
    return {w for w in re.findall(r"[a-z0-9&]+", text.lower()) if len(w) > 2 and w not in STOP}


def similar(a, b):
    ta, tb = tokens(a), tokens(b)
    return len(ta & tb) / len(ta | tb) if ta and tb else 0.0


def specificity(text):
    """A plain critic for one line: named systems and Dutch context, a number, sane length, no hype."""
    if not text:
        return 0.0
    words = len(text.split())
    score = 2.0 * len({m.lower() for m in SPECIFIC.findall(text)})
    score += 1.5 if re.search(r"\d", text) else 0.0
    score += 1.0 if 12 <= words <= 45 else (-1.0 if words > 70 or words < 6 else 0.0)
    return score - 3.0 * len(HYPE.findall(text))


def merge_lines(items, threshold=0.45):
    """Group near-duplicate (text, model) pairs: [{text, models, count}], most widely held first."""
    groups = []
    for text, model in items:
        if not text or not text.strip():
            continue
        for group in groups:
            if similar(text, group["text"]) >= threshold:
                if model not in group["models"]:
                    group["models"].append(model)
                group["count"] += 1
                if specificity(text) > specificity(group["text"]):
                    group["text"] = text
                break
        else:
            groups.append({"text": text, "models": [model], "count": 1})
    groups.sort(key=lambda g: (-len(g["models"]), -g["count"], -specificity(g["text"])))
    return groups


def strongest(items, key=""):
    """The most specific of (text, model) pairs, as {text, model, score, of, tied}. The critic scores in
    coarse steps, so ties are common (about half the lens lines); a tie is broken by a fixed rotation on
    `key`, so no model wins ties by its place in MODELS."""
    items = [(t, m) for t, m in items if t]
    if not items:
        return None
    top = max(specificity(t) for t, _ in items)
    tied = [(t, m) for t, m in items if specificity(t) == top]
    text, model = tied[zlib.crc32(key.encode()) % len(tied)] if key else tied[0]
    return {"text": text, "model": model, "score": top, "of": len(items),
            "tied": [m for _, m in tied] if len(tied) > 1 else []}


def reach_targets(text, own_role):
    hits = [rid for rid, pattern in ROLE_WORDS if rid != own_role and re.search(pattern, text, re.I)]
    return hits or ["outside"]


def value_stream(task, role_id, team_id):
    for stream, pattern in VALUE_STREAM_RULES[team_id]:
        if re.search(pattern, task["statement"], re.I):
            return stream
    return VALUE_STREAM_DEFAULT.get(role_id, VALUE_STREAM_DEFAULT[team_id])


def fmt_eur(x):
    return f"EUR {x:,.0f}"


# ---------------------------------------------------------------- loading

def answer_paths(variant, model, noweb=True):
    """The batch files of one variant and model. For in-memory Sol a web-off batch replaces the web-on
    batch of the same name (runs/inmemory-noweb/sol); the second value lists which source each used."""
    own = {os.path.basename(p): p for p in glob.glob(os.path.join(ROOT, "runs", variant, model, "*__*.json"))}
    if not (noweb and variant == NOWEB["variant"] and model == NOWEB["model"]):
        return [own[k] for k in sorted(own)], None
    rerun = {os.path.basename(p): p
             for p in glob.glob(os.path.join(ROOT, "runs", NOWEB["folder"], model, "*__*.json"))}
    names = sorted(set(own) | set(rerun))
    return ([rerun.get(k) or own[k] for k in names],
            {"noweb": sorted(k for k in names if k in rerun), "web": sorted(k for k in names if k not in rerun)})


def load_answers(noweb=True):
    """Every model answer by variant, model and uid; the role blocks by variant, model and role; files read
    per variant and model; and which in-memory Sol batches came from the web-off rerun."""
    answers = {v: {m: {} for m in MODELS} for v in VARIANTS}
    blocks = {v: {m: defaultdict(list) for m in MODELS} for v in VARIANTS}
    files = {v: {m: 0 for m in MODELS} for v in VARIANTS}
    sol_source = None
    for variant in VARIANTS:
        for model in MODELS:
            paths, source = answer_paths(variant, model, noweb)
            sol_source = source or sol_source
            for path in paths:
                try:
                    answer = load(path)
                except (OSError, json.JSONDecodeError):  # being written right now; next run picks it up
                    continue
                files[variant][model] += 1
                role_id = os.path.basename(path).split("__")[0]
                for task in answer.get("tasks", []):
                    if isinstance(task, dict) and "uid" in task:
                        if task.get("speedup") is None and "time_saved_pct" in task:  # v1 asks one number
                            saved = min(max(task["time_saved_pct"], 0), 95)
                            task["speedup"] = round(1 / (1 - saved / 100), 2)
                        answers[variant][model][task["uid"]] = task
                if isinstance(answer.get("role"), dict):
                    blocks[variant][model][role_id].append(answer["role"])
    return answers, blocks, files, sol_source


# ---------------------------------------------------------------- per task (E5)

def speed(answer):
    try:
        return max(float(answer.get("speedup") or 1.0), 1.0)
    except (TypeError, ValueError):
        return 1.0


def consensus(by_model):
    """Merged pattern, autonomy and numbers over the models that answered; None when none did."""
    if not by_model:
        return None
    names = [m for m in MODELS if m in by_model]
    votes = Counter(by_model[m]["pattern"] for m in names)
    top = max(votes.values())
    tied = [p for p in votes if votes[p] == top]
    # a tie goes to the more careful answer: the tied pattern given with the lowest autonomy
    pattern = min(tied, key=lambda p: (min(by_model[m]["autonomy_level"] for m in names
                                           if by_model[m]["pattern"] == p), PATTERNS.index(p)))
    autos = sorted(int(by_model[m]["autonomy_level"]) for m in names)
    speeds = sorted(speed(by_model[m]) for m in names)
    saved = sorted(int(by_model[m].get("time_saved_pct", 0)) for m in names)
    out = {
        "models": names, "n": len(names), "pattern": pattern, "pattern_votes": dict(votes),
        "pattern_unanimous": len(votes) == 1,
        "autonomy": statistics.median_low(autos), "autonomy_range": [autos[0], autos[-1]],
        "speedup": r2(statistics.median(speeds)), "speedup_range": [r2(speeds[0]), r2(speeds[-1])],
        "time_saved_pct": statistics.median(saved), "time_saved_range": [saved[0], saved[-1]],
        "confidence": r2(mean(CONFIDENCE.get(by_model[m].get("confidence"), 0.3) for m in names)),
        "agreement": None, "agreement_parts": None,
    }
    if len(names) > 1:
        parts = {"pattern": top / len(names), "autonomy": 1 - (autos[-1] - autos[0]) / 5,
                 "speedup": speeds[0] / speeds[-1]}
        out["agreement_parts"] = {k: r2(v) for k, v in parts.items()}
        out["agreement"] = r2(sum(parts.values()) / 3)
    return out


def critic(answer):
    """One number per answer: specific lenses, graded evidence, numbers that hang together."""
    lens_score = mean(specificity(answer["lenses"].get(k, "")) for k in LENSES) or 0
    grades = [e.get("grade") for e in answer.get("evidence", [])]
    evidence = max((GRADE_SCORE.get(g, 0) for g in grades), default=0)
    s, pct = speed(answer), answer.get("time_saved_pct", 0)
    gap = abs(pct / 100 - (1 - 1 / s))
    penalty = (2 if gap > 0.15 else 0) + (2 if answer.get("autonomy_level", 0) >= 4
                                          and answer.get("confidence") == "low" else 0)
    penalty += 2 * sum(1 for e in answer.get("evidence", []) for u in URL.findall(e.get("source", ""))
                       if url_state(u) in ("dead", "unchecked"))
    return r2(lens_score + 4 * evidence - penalty)


def url_state(url):
    """ok, dead (404, 410, a not-found page), unknown (blocked or no answer) or unchecked."""
    r = URLS.get(url.rstrip(".,;"))
    if r is None:
        return "unchecked"
    if r.get("soft_404") or r.get("status") in (404, 410):
        return "dead"
    return "ok" if r.get("status") in (200, 202) else "unknown"


def load_probes():
    """The jev anatomy answers (E1) and the rung-3 rule pattern per task uid, when they exist."""
    jev, rule = {}, {}
    path = os.path.join(ROOT, "data", "jev_anatomy.json")
    if os.path.exists(path):
        for entry in load(path):
            answers = entry["answers"]
            jev[entry["uid"]] = {k: ({"choice": v["choice"], "confidence": v["confidence"]} if "choice" in v else v)
                                 for k, v in answers.items()}
    path = os.path.join(ROOT, "data", "patterns_rule.json")
    if os.path.exists(path):
        for entry in load(path):
            rule[entry["uid"]] = {"pattern": entry["pattern"], "why": entry["why"], "features": entry["features"],
                                  "role_id": entry.get("role_id")}
    return jev, rule


def probe_check(task, c, rule=None, anatomy=None, jev=None):
    """Where the fixed probes (rung 2 class scores, jev, the rung-3 rule) and the models part ways."""
    if c is None:
        return None
    out = class_check(task, c)
    if rule:
        out["rule_pattern"] = rule["pattern"]
        out["rule_agrees"] = rule["pattern"] == c["pattern"]
        out["rule_same_family"] = (rule["pattern"] in BUILD_PATTERNS) == (c["pattern"] in BUILD_PATTERNS)
    if jev and anatomy:
        top = max(anatomy, key=anatomy.get)
        out["jev_core"] = jev["core_work"]["choice"]
        out["models_core"] = top
        out["core_agrees"] = top == jev["core_work"]["choice"]
    return out


def class_check(task, c):
    """Where the O*NET class scores (rung 2) and the models' consensus (rung 4) part ways."""
    if task["class_name"] == "automate":
        disagrees = c["pattern"] in ("copilot", "keep_human") or c["autonomy"] <= 1
        note = ("the probes say AI can produce nearly all of the result; the models keep the person "
                f"in the lead ({c['pattern']}, autonomy {c['autonomy']})")
    else:
        if c["autonomy"] >= 4 and c["pattern"] in BUILD_PATTERNS:
            disagrees, note = True, ("the probes say the person keeps the work; the models let AI run it "
                                     f"and leave the person the exceptions (autonomy {c['autonomy']})")
        elif c["pattern"] == "keep_human" or c["speedup"] < 1.15:
            disagrees, note = True, ("the probes see a clear gain; the models see little "
                                     f"({c['pattern']}, speedup {c['speedup']})")
        else:
            disagrees, note = False, ""
    return {"probe_class": task["class_name"], "p_ai_does_nearly_all": task["ai_does_nearly_all"],
            "p_clear_gain_most": task["clear_gain_most"], "disagrees": disagrees,
            "note": note if disagrees else ""}


def mean_anatomy(by_model):
    """The models' mean anatomy (percent per kind of work), or None when no model gave one."""
    anatomies = [a["anatomy"] for a in by_model.values() if isinstance(a.get("anatomy"), dict)]
    if not anatomies:
        return None
    keys = ("gather", "transform", "decide", "create", "communicate", "coordinate")
    return {k: round(mean(a.get(k, 0) for a in anatomies)) for k in keys}


def simplest_first(c, by_model, anatomy):
    """v1 rule (findings.md change 8): after the vote, the simplest fixed workflow any model chose wins,
    unless AGENT_VOTES_TO_HOLD models chose agent_with_gate and coordinate + decide is above
    COORDINATE_DECIDE_TO_HOLD percent. Changes c in place; returns the record of what it did, or None."""
    chosen = [by_model[m]["pattern"] for m in c["models"]]
    fixed = [p for p in SIMPLEST if p in chosen]
    if not fixed or c["pattern"] == fixed[0]:
        return None
    agents = chosen.count("agent_with_gate")
    cd = (anatomy or {}).get("coordinate", 0) + (anatomy or {}).get("decide", 0)
    held = agents >= AGENT_VOTES_TO_HOLD and cd > COORDINATE_DECIDE_TO_HOLD
    record = {"vote": c["pattern"], "simplest": fixed[0], "agent_votes": agents, "coordinate_decide": cd,
              "overrode": not held,
              "why": (f"{agents} agent votes and coordinate + decide {cd}% > {COORDINATE_DECIDE_TO_HOLD}%: "
                      "the steps cannot be predicted, the vote stands") if held else
                     (f"a model chose {fixed[0]}; a fixed workflow does it (agent votes {agents}, "
                      f"coordinate + decide {cd}%)")}
    if not held:
        c["pattern"] = fixed[0]
    return record


def merged_view(by_model, uid="", c=None):
    """The answers as one: strongest line per lens, unions of reach, risks, questions, evidence."""
    names = [m for m in MODELS if m in by_model]
    view = {"lenses": {}, "anatomy": None, "anatomy_spread": None}
    for lens in LENSES:
        view["lenses"][lens] = strongest([(by_model[m]["lenses"].get(lens, ""), m) for m in names], uid + lens)
    view["short"] = strongest([(by_model[m].get("short", ""), m) for m in names], uid + "short")
    view["human_edge"] = strongest([(by_model[m].get("human_edge", ""), m) for m in names], uid + "human_edge")
    view["reach"] = merge_lines([(x, m) for m in names for x in by_model[m]["lenses"].get("reach", [])])
    view["risks"] = merge_lines([(x, m) for m in names for x in by_model[m].get("risks", [])])
    view["research_questions"] = merge_lines(
        [(x, m) for m in names for x in by_model[m].get("research_questions", [])])
    evidence = [dict(e, model=m) for m in names for e in by_model[m].get("evidence", [])]
    view["evidence"] = sorted(evidence, key=lambda e: -GRADE_SCORE.get(e.get("grade"), 0))
    grades = Counter(e.get("grade") for e in evidence)
    view["evidence_grades"] = dict(grades)
    view["best_grade"] = max(grades, key=lambda g: GRADE_SCORE.get(g, 0)) if grades else None
    # how it works in practice: the most specific answer among those with the consensus pattern
    c = c or consensus(by_model)
    pick = [m for m in names if by_model[m]["pattern"] == c["pattern"]] or names
    best = max(pick, key=lambda m: specificity(" ".join(by_model[m]["in_practice"].get("steps", []))
                                                + " " + by_model[m]["in_practice"].get("trigger", "")))
    view["in_practice"] = dict(by_model[best]["in_practice"], model=best)
    anatomies = [by_model[m]["anatomy"] for m in names if isinstance(by_model[m].get("anatomy"), dict)]
    if anatomies:
        keys = ("gather", "transform", "decide", "create", "communicate", "coordinate")
        view["anatomy"] = mean_anatomy(by_model)
        view["anatomy_spread"] = {k: max(a.get(k, 0) for a in anatomies) - min(a.get(k, 0) for a in anatomies)
                                  for k in keys}
    view["critic"] = {m: critic(by_model[m]) for m in names}
    return view


def expected(x, digits=1, scale=1.0):
    """The adoption-ramp twin of a potential figure: {year1, year2, year3} (see ADOPTION_RAMP).
    `scale` converts on the way (1 / hours per FTE, or cost per hour)."""
    return {y: round(x * share * scale, digits or None) for y, share in ADOPTION_RAMP.items()}


def task_records(data, answers, primary):
    """Per task uid: facts, models side by side, consensus, merged view, roll-up numbers."""
    other = COMPARE[primary]
    v1 = primary in V1_RULES
    jev, rule = load_probes()
    records = {}
    for team in data["teams"]:
        for role in team["roles"]:
            for task in role["tasks"]:
                uid = task["uid"]
                hours = task["hours_per_fte"] * role["fte"]
                rec = {
                    "uid": uid, "role_id": role["id"], "role_title": role["title"], "team_id": team["id"],
                    "statement": task["statement"], "onet_code": task["onet_code"],
                    "onet_title": task["onet_title"], "class": task["class_name"], "type": task["type"],
                    "importance": task["importance"], "frequency": task["frequency_label"],
                    "share": task["share"], "hours_per_fte": task["hours_per_fte"], "hours": round(hours, 1),
                    "work_activities": task["dwas"], "value_stream": value_stream(task, role["id"], team["id"]),
                    "probe": {"p_ai_does_nearly_all": task["ai_does_nearly_all"],
                              "p_clear_gain_most": task["clear_gain_most"],
                              "p_clear_gain_part": task["clear_gain_part"],
                              "mostly_done": task["mode"], "software_maturity": task["deployment"],
                              "jev": jev.get(uid), "rule_pattern": (rule.get(uid) or {}).get("pattern"),
                              "rule_why": (rule.get(uid) or {}).get("why"),
                              "rule_features": (rule.get(uid) or {}).get("features")},
                }
                if task["class_name"] not in AI_CLASSES:
                    rec["roll_up"] = {"speedup": 1.0, "speedup_low": 1.0, "speedup_high": 1.0,
                                      "source": "not asked (class " + task["class_name"] + ")",
                                      "hours_freed": 0.0, "hours_freed_low": 0.0, "hours_freed_high": 0.0}
                    if v1:
                        rec["roll_up"]["hours_freed_expected"] = expected(0.0)
                    records[uid] = rec
                    continue
                by_model = {m: answers[primary][m][uid] for m in MODELS if uid in answers[primary][m]}
                rec["models"] = {m: {k: v for k, v in a.items() if k != "uid"} for m, a in by_model.items()}
                c = consensus(by_model)
                gate = rule.get(uid) if v1 else None
                keep = bool(gate and gate["pattern"] == "keep_human" and gate.get("role_id") in (None, role["id"]))
                if v1 and c:
                    c["vote_pattern"] = c["pattern"]
                    c["simplest_first"] = simplest_first(c, by_model, mean_anatomy(by_model))
                    c["pattern_source"] = ("simplest first" if (c["simplest_first"] or {}).get("overrode")
                                           else "vote")
                    if keep:  # rung 4: the gate decides keep_human, never the models
                        c["pattern"], c["pattern_source"] = "keep_human", "jev rule"
                rec["consensus"] = c
                if v1:
                    rec["gate"] = ({"pattern": "keep_human", "why": gate["why"], "source": "data/patterns_rule.json"}
                                   if keep else None)
                if c:
                    rec.update(merged_view(by_model, uid, c))
                    s, lo, hi, source = c["speedup"], c["speedup_range"][0], c["speedup_range"][1], "models"
                else:
                    s = lo = hi = FALLBACK_SPEEDUP[task["class_name"]]
                    source = "fallback (no model answer yet)"
                if keep:
                    s = lo = hi = 1.0
                    source = "keep_human (jev rule): the person keeps the work; the models' human_edge says why"
                rec["roll_up"] = {
                    "speedup": s, "speedup_low": lo, "speedup_high": hi, "source": source,
                    "hours_freed": round(hours * (1 - 1 / s), 1),
                    "hours_freed_low": round(hours * (1 - 1 / lo), 1),
                    "hours_freed_high": round(hours * (1 - 1 / hi), 1),
                    "hours_freed_from_pct": round(hours * c["time_saved_pct"] / 100, 1) if c and not keep else None,
                }
                if v1:
                    rec["roll_up"]["hours_freed_expected"] = expected(rec["roll_up"]["hours_freed"])
                rec["probe_check"] = probe_check(task, c, rule.get(uid), rec.get("anatomy"), jev.get(uid))
                alt = {m: answers[other][m][uid] for m in MODELS if uid in answers[other][m]}
                if alt:
                    ca = consensus(alt)
                    rec[other] = {"models": {m: {k: v for k, v in a.items() if k != "uid"} for m, a in alt.items()},
                                  "consensus": ca, "lenses": {lens: strongest([(alt[m]["lenses"].get(lens, ""), m)
                                                                               for m in alt], uid + lens) for lens in LENSES},
                                  "evidence_grades": dict(Counter(e.get("grade") for a in alt.values()
                                                                  for e in a.get("evidence", [])))}
                    if c:
                        rec[other]["shift"] = {
                            "pattern_changed": ca["pattern"] != c["pattern"],
                            "speedup_ratio": r2(ca["speedup"] / c["speedup"]),
                            "autonomy_change": ca["autonomy"] - c["autonomy"],
                        }
                records[uid] = rec
    return records


# ---------------------------------------------------------------- per role and team (E6)

def merge_role_blocks(blocks, role_id):
    """The role blocks of every model and batch, merged."""
    items = {k: [] for k in ("altitude", "ambitious_version", "ceiling_note")}
    lists = {k: [] for k in ("reach", "skills_to_grow")}
    for model in MODELS:
        for block in blocks.get(model, {}).get(role_id, []):
            for k in items:
                if block.get(k):
                    items[k].append((block[k], model))
            for k in lists:
                lists[k].extend((x, model) for x in block.get(k, []))
    out = {}
    for k, pairs in items.items():
        pairs = sorted(pairs, key=lambda tm: -specificity(tm[0]))
        out[k] = [{"text": t, "model": m} for t, m in pairs]
        out[k + "_best"] = strongest(pairs, role_id + k)
    for k, pairs in lists.items():
        out[k] = merge_lines(pairs)
    return out


def role_rollup(team, role, records, blocks, blocks_other, other_key, v1=False):
    hours = role["hours"]
    tasks = [records[t["uid"]] for t in role["tasks"]]
    inv = {"": 0.0, "_low": 0.0, "_high": 0.0}
    freed = {"": 0.0, "_low": 0.0, "_high": 0.0}
    by_class = defaultdict(lambda: {"hours": 0.0, "hours_freed": 0.0})
    patterns = defaultdict(float)
    answered = Counter()
    for rec in tasks:
        share = rec["hours"] / hours
        ru = rec["roll_up"]
        for suffix in inv:
            inv[suffix] += share / ru["speedup" + suffix]
            freed[suffix] += ru["hours_freed" + suffix]
        by_class[rec["class"]]["hours"] += rec["hours"]
        by_class[rec["class"]]["hours_freed"] += ru["hours_freed"]
        if rec.get("gate") and not rec.get("consensus"):  # keep_human by rule, no model answer yet
            patterns["keep_human"] += rec["hours"]
        if rec.get("consensus"):
            patterns[rec["consensus"]["pattern"]] += rec["hours"]
            for m in rec["consensus"]["models"]:
                answered[m] += 1
    ai_tasks = [r for r in tasks if r["class"] in AI_CLASSES]
    non_ai = sum(r["hours"] for r in tasks if r["class"] not in AI_CLASSES) / hours
    ceiling = 1 / inv[""]
    limit = 1 / non_ai if non_ai > 0 else None
    merged = merge_role_blocks(blocks, role["id"])
    task_reach = [(g["text"], m) for r in ai_tasks for g in r.get("reach", []) for m in g["models"]]
    targets = defaultdict(lambda: {"count": 0, "models": set(), "examples": []})
    for text, model in [(g["text"], m) for g in merged["reach"] for m in g["models"]] + task_reach:
        for target in reach_targets(text, role["id"]):
            entry = targets[target]
            entry["count"] += 1
            entry["models"].add(model)
            if text not in entry["examples"] and len(entry["examples"]) < 6:
                entry["examples"].append(text)
    out = {
        "id": role["id"], "team_id": team["id"], "title": role["title"], "fte": role["fte"],
        "cost_per_hour": role["cost_per_hour"], "hours": hours, "annual_cost": role["annual_cost"],
        "hours_by_class": {k: round(v["hours"], 1) for k, v in by_class.items()},
        "hours_freed_by_class": {k: round(v["hours_freed"], 1) for k, v in by_class.items()},
        "coverage": {"ai_tasks": len(ai_tasks),
                     "answered": sum(1 for r in ai_tasks if r.get("consensus")),
                     "by_model": {m: answered[m] for m in MODELS},
                     "fallback_hours": round(sum(r["hours"] for r in ai_tasks if not r.get("consensus")), 1)},
        "hours_freed": round(freed[""], 1), "hours_freed_low": round(freed["_low"], 1),
        "hours_freed_high": round(freed["_high"], 1),
        "fte_freed": r2(freed[""] / 1600), "capacity_returned_eur": round(freed[""] * role["cost_per_hour"]),
        "share_not_ai": r2(non_ai), "ceiling": r2(ceiling), "ceiling_low": r2(1 / inv["_low"]),
        "ceiling_high": r2(1 / inv["_high"]), "ceiling_limit": r2(limit),
        "ceiling_formula": "1 / sum(share_i / speedup_i), human tasks at speedup 1",
        "ceiling_explained": (
            f"{non_ai:.0%} of this role's time is work that stays as it is today (human tasks) and keeps "
            f"its speed. With the models' median speedups the role as a whole gets {ceiling:.1f}x faster: "
            f"{freed['']:,.0f} of {hours:,.0f} hours a year come back. "
            + (f"Even if AI did every automate and amplify task instantly, the role could not go faster "
               f"than {limit:.1f}x; past that, redesign the human part." if limit else
               "Every task is automate or amplify, so the limit is set by the approval and checking time "
               "inside each task, not by a human-only share.")),
        "patterns_by_hours": {k: round(v, 1) for k, v in sorted(patterns.items(), key=lambda kv: -kv[1])},
        "altitude": merged["altitude"], "altitude_best": merged["altitude_best"],
        "ambitious_version": merged["ambitious_version"], "ambitious_best": merged["ambitious_version_best"],
        "ceiling_note": merged["ceiling_note"], "reach": merged["reach"],
        "reach_targets": {k: {"count": v["count"], "models": sorted(v["models"]), "examples": v["examples"]}
                          for k, v in sorted(targets.items(), key=lambda kv: -kv[1]["count"])},
        "skills_to_grow": merged["skills_to_grow"],
        "tasks": sorted([{"uid": r["uid"], "short": (r.get("short") or {}).get("text") or r["statement"],
                          "class": r["class"], "hours": r["hours"],
                          "speedup": r["roll_up"]["speedup"], "hours_freed": r["roll_up"]["hours_freed"],
                          "source": r["roll_up"]["source"],
                          "pattern": (r.get("consensus") or {}).get("pattern"),
                          "autonomy": (r.get("consensus") or {}).get("autonomy"),
                          "agreement": (r.get("consensus") or {}).get("agreement")} for r in tasks],
                         key=lambda t: -t["hours_freed"]),
    }
    if v1:
        out.update({"hours_freed_expected": expected(freed[""]), "fte_freed_expected": expected(freed[""], 2, 1 / 1600),
                    "capacity_returned_eur_expected": expected(freed[""], 0, role["cost_per_hour"]),
                    "keep_human_tasks": sum(1 for r in ai_tasks if r.get("gate")),
                    "keep_human_hours": round(sum(r["hours"] for r in ai_tasks if r.get("gate")), 1)})
    other = [r for r in ai_tasks if r.get(other_key)]
    if other:
        key = other_key
        alt_freed = sum(r["hours"] * (1 - 1 / r[key]["consensus"]["speedup"]) if r.get(key) else
                        r["roll_up"]["hours_freed"] for r in ai_tasks)
        out[key] = {"tasks_answered": len(other), "hours_freed": round(alt_freed, 1),
                    "ceiling": r2(hours / (hours - alt_freed)),
                    "role_block": merge_role_blocks(blocks_other, role["id"])["altitude_best"]}
    return out


def team_rollup(team, roles, records, hours_per_fte, v1=False):
    hours = sum(r["hours"] for r in roles)
    freed = sum(r["hours_freed"] for r in roles)
    freed_low = sum(r["hours_freed_low"] for r in roles)
    freed_high = sum(r["hours_freed_high"] for r in roles)
    not_ai = sum(r["share_not_ai"] * r["hours"] for r in roles)
    capacity_eur = sum(r["capacity_returned_eur"] for r in roles)
    by_class = defaultdict(float)
    for r in roles:
        for k, v in r["hours_by_class"].items():
            by_class[k] += v
    # option 2: smaller team, same output, people in half-FTE steps (part-time is normal in NL)
    smaller_roles = []
    for r in roles:
        need = (r["hours"] - r["hours_freed"]) / hours_per_fte
        whole = max(0.5, math.ceil(need * 2) / 2)
        smaller_roles.append({"id": r["id"], "title": r["title"], "fte_today": r["fte"],
                              "fte_needed": r2(need), "fte_after": min(whole, r["fte"]),
                              "saved_eur": round((r["fte"] - min(whole, r["fte"])) * hours_per_fte
                                                 * r["cost_per_hour"])})
    fte_after = sum(x["fte_after"] for x in smaller_roles)
    # option 3: pods per value stream, from each task's value stream
    pods = defaultdict(lambda: {"hours": 0.0, "hours_after": 0.0, "roles": defaultdict(float), "tasks": 0})
    for role in roles:
        for t in role["tasks"]:
            rec = records[t["uid"]]
            pod = pods[rec["value_stream"]]
            pod["hours"] += rec["hours"]
            pod["hours_after"] += rec["hours"] - rec["roll_up"]["hours_freed"]
            pod["roles"][role["id"]] += rec["hours"] - rec["roll_up"]["hours_freed"]
            pod["tasks"] += 1
    pod_list = []
    for stream in team["value_streams"]:
        if stream not in pods:
            continue
        p = pods[stream]
        pod_list.append({
            "value_stream": stream, "tasks": p["tasks"], "fte_today": r2(p["hours"] / hours_per_fte),
            "fte_after": r2(p["hours_after"] / hours_per_fte),
            "roles": [{"id": rid, "fte_after": r2(h / hours_per_fte)}
                      for rid, h in sorted(p["roles"].items(), key=lambda kv: -kv[1]) if h >= 40],
        })
    ambitious = sorted([{"id": r["id"], "title": r["title"], "hours_freed": r["hours_freed"],
                         "fte_freed": r["fte_freed"],
                         "ambitious_version": (r.get("ambitious_best") or {}).get("text"),
                         "model": (r.get("ambitious_best") or {}).get("model")} for r in roles],
                       key=lambda x: -x["hours_freed"])
    out = {
        "id": team["id"], "name": team["name"], "fte": team["fte"], "annual_cost": team["annual_cost"],
        "north_star": team["north_star"], "input_metrics": team["input_metrics"],
        "value_streams": team["value_streams"], "hours": hours,
        "hours_by_class": {k: round(v, 1) for k, v in by_class.items()},
        "hours_freed": round(freed, 1), "hours_freed_low": round(freed_low, 1),
        "hours_freed_high": round(freed_high, 1),
        "fte_returned": r2(freed / hours_per_fte), "fte_returned_low": r2(freed_low / hours_per_fte),
        "fte_returned_high": r2(freed_high / hours_per_fte), "capacity_returned_eur": capacity_eur,
        "share_of_cost_returned": r2(capacity_eur / team["annual_cost"]),
        "ceiling": r2(hours / (hours - freed)), "ceiling_low": r2(hours / (hours - freed_low)),
        "ceiling_high": r2(hours / (hours - freed_high)),
        "ceiling_limit": r2(hours / not_ai) if not_ai else None, "share_not_ai": r2(not_ai / hours),
        "ceiling_explained": (
            f"The team spends {not_ai / hours:.0%} of its {hours:,.0f} hours on human tasks that stay at "
            f"today's speed. With the models' median speedups it gets {hours / (hours - freed):.1f}x faster "
            f"({freed:,.0f} hours, {freed / hours_per_fte:.1f} FTE a year). The hard limit is "
            f"{hours / not_ai:.1f}x: approval gates and handoffs inside the AI tasks already sit in the "
            f"models' speedups, so this is the ceiling before the work itself is redesigned."),
        "by_role": [{"id": r["id"], "title": r["title"], "fte": r["fte"], "hours_freed": r["hours_freed"],
                     "fte_freed": r["fte_freed"], "ceiling": r["ceiling"]} for r in roles],
        "options": {
            "ambitious": {
                "label": "Same team, more ambitious work (Jevons)",
                "fte": team["fte"], "fte_redeployed": r2(freed / hours_per_fte),
                "hours_redeployed": round(freed), "value_eur": capacity_eur,
                "text": (f"Keep all {team['fte']} people. The {freed:,.0f} hours a year that come back "
                         f"({freed / hours_per_fte:.1f} FTE, {fmt_eur(capacity_eur)} of loaded cost) go to "
                         f"work that was never done properly, moving the North Star: {team['north_star'].lower()}."),
                "by_role": ambitious,
            },
            "smaller": {
                "label": "Smaller team, same output",
                "fte_today": team["fte"], "fte_needed": r2((hours - freed) / hours_per_fte),
                "fte_after": fte_after, "fte_reduction": r2(team["fte"] - fte_after),
                "saved_eur": sum(x["saved_eur"] for x in smaller_roles),
                "text": (f"The same output needs {(hours - freed) / hours_per_fte:.1f} FTE of work. Kept in "
                         f"half-FTE steps per role that is {fte_after:g} FTE instead of {team['fte']}, through "
                         f"natural turnover rather than dismissals. One-person roles keep at least half an FTE "
                         f"and need cover for holidays and absence."),
                "by_role": smaller_roles,
            },
            "pods": {
                "label": "Polyvalent pods per value stream",
                "fte_after": r2(sum(p["fte_after"] or 0 for p in pod_list)),
                "text": ("Instead of functional roles, one small pod owns each value stream end to end and "
                         "covers its tasks across today's roles; each person takes the adjacent tasks that "
                         "the models' reach lines point to."),
                "pods": pod_list,
            },
        },
    }
    if v1:
        eur = {y: sum(r["capacity_returned_eur_expected"][y] for r in roles) for y in ADOPTION_RAMP}
        out.update({
            "hours_freed_expected": expected(freed), "fte_returned_expected": expected(freed, 2, 1 / hours_per_fte),
            "capacity_returned_eur_expected": eur, "adoption_ramp": ADOPTION_RAMP,
            "potential_vs_expected": (
                f"Potential (the models' speedups): {freed:,.0f} hours, {freed / hours_per_fte:.1f} FTE a year. "
                "Expected as people adopt it (capability assumed to hold): "
                + ", ".join(f"{y.replace('year', 'year ')} {freed * k / hours_per_fte:.1f} FTE"
                            for y, k in ADOPTION_RAMP.items()) + "."),
        })
        for r in out["by_role"]:
            r["fte_freed_expected"] = next(x["fte_freed_expected"] for x in roles if x["id"] == r["id"])
        amb = out["options"]["ambitious"]
        amb.update({"fte_redeployed_expected": expected(freed, 2, 1 / hours_per_fte),
                    "hours_redeployed_expected": expected(freed, 0), "value_eur_expected": eur})
        out["options"]["smaller"]["fte_needed_expected"] = {
            y: r2((hours - freed * k) / hours_per_fte) for y, k in ADOPTION_RAMP.items()}
    return out


# ---------------------------------------------------------------- opportunities (E6)

def assumption_value(assumptions, key):
    if isinstance(key, (int, float)):
        return float(key), str(key), None
    a = assumptions[key]
    return float(a["value"]), a.get("label", key), a.get("grade")


def money_line(line, assumptions):
    """A financial or quality line: the product of named inputs, divided by an optional constant."""
    value, parts, grades = 1.0, [], []
    for key in line["inputs"]:
        v, label, grade = assumption_value(assumptions, key)
        value *= v
        if abs(v) >= 100:
            shown = f"{v:,.0f}"
        elif v < 1:
            shown = f"{v * 100:.2f}".rstrip("0").rstrip(".") + "%"
        else:
            shown = f"{v:g}"
        parts.append(f"{label} {shown}")
        if grade:
            grades.append(grade)
    divide = line.get("divide_by", 1)
    value /= divide
    formula = " x ".join(parts) + (f" / {divide}" if divide != 1 else "") + f" = {fmt_eur(value)} a year"
    return {"name": line["name"], "formula": formula, "value_eur": round(value), "note": line.get("note", ""),
            "grade": min(grades, key=lambda g: GRADE_SCORE[g]) if grades else "E0", "assumption": True,
            "inputs": [{"key": k, "value": assumption_value(assumptions, k)[0],
                        "label": assumption_value(assumptions, k)[1]} for k in line["inputs"]]}


def fill(text, numbers):
    class Safe(dict):
        def __missing__(self, key):
            return "{" + key + "}"
    return text.format_map(Safe(numbers)) if isinstance(text, str) else text


def opportunity(spec, records, roles_by_id, team_info, assumptions, hours_per_fte, v1=False):
    members = [records[uid] for uid in spec["tasks"] if uid in records]
    missing = [uid for uid in spec["tasks"] if uid not in records]
    per_role = defaultdict(lambda: {"hours": 0.0, "freed": 0.0, "low": 0.0, "high": 0.0})
    for rec in members:
        pr = per_role[rec["role_id"]]
        pr["hours"] += rec["hours"]
        pr["freed"] += rec["roll_up"]["hours_freed"]
        pr["low"] += rec["roll_up"]["hours_freed_low"]
        pr["high"] += rec["roll_up"]["hours_freed_high"]
    lines, labour_eur, hours, freed, freed_low, freed_high = [], 0.0, 0.0, 0.0, 0.0, 0.0
    for rid, pr in sorted(per_role.items(), key=lambda kv: -kv[1]["freed"]):
        cost = roles_by_id[rid]["cost_per_hour"]
        eur = pr["freed"] * cost
        pct = pr["freed"] / pr["hours"] if pr["hours"] else 0
        lines.append({"role_id": rid, "title": roles_by_id[rid]["title"], "hours": round(pr["hours"]),
                      "pct_removed": r2(pct), "hours_removed": round(pr["freed"]), "cost_per_hour": cost,
                      "eur": round(eur),
                      "formula": f"{pr['hours']:,.0f} h x {pct:.0%} removed x EUR {cost}/h = {fmt_eur(eur)}"})
        labour_eur += eur
        hours += pr["hours"]
        freed += pr["freed"]
        freed_low += pr["low"] * cost
        freed_high += pr["high"] * cost
    financial = [money_line(x, assumptions) for x in spec.get("financial", [])]
    quality = [money_line(x, assumptions) for x in spec.get("quality", [])]
    for q in spec.get("quality_text", []):
        quality.append({"name": q, "formula": "not priced", "value_eur": 0, "grade": "E1", "assumption": True})
    fin_eur = sum(x["value_eur"] for x in financial)
    qual_eur = sum(x["value_eur"] for x in quality)
    quality_counts = labour_eur + fin_eur > 0  # quality never carries a case alone
    value = labour_eur + fin_eur + (qual_eur if quality_counts else 0)

    answered = [r for r in members if r.get("consensus")]
    weight = sum(r["hours"] for r in answered) or 1.0
    agreement = mean([r["consensus"]["agreement"] for r in answered if r["consensus"]["agreement"] is not None])
    model_conf = sum(r["consensus"]["confidence"] * r["hours"] for r in answered) / weight if answered else 0.3
    evidence = (sum(GRADE_SCORE.get(r.get("best_grade"), 0.1) * r["hours"] for r in answered) / weight
                if answered else 0.1)
    coverage = sum(r["hours"] for r in answered) / hours if hours else 0
    parts = {"agreement": r2(agreement if agreement is not None else 0.5), "model_confidence": r2(model_conf),
             "evidence": r2(evidence), "coverage": r2(coverage)}
    confidence = (parts["agreement"] + parts["model_confidence"] + parts["evidence"]) / 3
    confidence *= 0.5 + 0.5 * coverage  # tasks still on the fallback speedup halve their weight
    ttv = TIME_TO_VALUE[spec["pattern"]] + sum(EXTRA_MONTHS[f] for f in EXTRA_MONTHS if spec.get("flags", {}).get(f))
    weighted = labour_eur * confidence + (fin_eur + (qual_eur if quality_counts else 0)) * confidence * ASSUMPTION_WEIGHT
    adoption = ADOPTION_SHARE if v1 and spec["pattern"] == "copilot" else 1.0  # people must choose to use it
    weighted *= adoption
    priority = weighted / ttv

    votes = defaultdict(float)
    autonomy = []
    systems = Counter()
    for r in answered:
        votes[r["consensus"]["pattern"]] += r["hours"]
        autonomy.append(r["consensus"]["autonomy"])
        for m, a in r["models"].items():
            systems.update({s.strip() for s in a.get("in_practice", {}).get("systems", []) if s.strip()})
    model_pattern = max(votes, key=votes.get) if votes else None
    numbers = {"hours_removed": f"{freed:,.0f}", "fte": f"{freed / hours_per_fte:.1f}",
               "labour_eur": fmt_eur(labour_eur), "value_eur": fmt_eur(value),
               "pct_removed": f"{(freed / hours if hours else 0):.0%}"}
    for x in financial + quality:
        numbers.setdefault("first_extra_eur", fmt_eur(x["value_eur"]))
    team_hours = Counter()
    for r in members:
        team_hours[roles_by_id[r["role_id"]]["team_id"]] += r["hours"]
    teams = [t for t, _ in team_hours.most_common()]
    team = spec.get("north_star_team", teams[0] if teams else "hr")
    out = {
        "id": spec["id"], "name": spec["name"], "summary": spec["summary"], "teams": teams,
        "roles": [{"id": l["role_id"], "title": l["title"], "hours": l["hours"],
                   "hours_removed": l["hours_removed"], "eur": l["eur"]} for l in lines],
        "tasks": [{"uid": r["uid"], "role_id": r["role_id"],
                   "short": (r.get("short") or {}).get("text") or r["statement"], "statement": r["statement"],
                   "class": r["class"], "hours": r["hours"], "hours_removed": r["roll_up"]["hours_freed"],
                   "speedup": r["roll_up"]["speedup"], "source": r["roll_up"]["source"],
                   "pattern": (r.get("consensus") or {}).get("pattern"),
                   "autonomy": (r.get("consensus") or {}).get("autonomy"),
                   "agreement": (r.get("consensus") or {}).get("agreement")}
                  for r in sorted(members, key=lambda r: -r["roll_up"]["hours_freed"])],
        "missing_tasks": missing,
        "pattern": spec["pattern"], "autonomy": spec["autonomy"], "pattern_why": spec["pattern_why"],
        "model_patterns_by_hours": {k: round(v) for k, v in sorted(votes.items(), key=lambda kv: -kv[1])},
        "model_pattern": model_pattern, "model_autonomy_median": statistics.median_low(autonomy) if autonomy else None,
        "pattern_matches_models": model_pattern == spec["pattern"] if model_pattern else None,
        "systems": spec["systems"],
        "systems_named_by_models": [{"name": k, "count": v} for k, v in systems.most_common(10)],
        "business_case": {
            "labour": {"lines": lines, "hours": round(hours), "hours_removed": round(freed),
                       "pct_removed": r2(freed / hours if hours else 0), "fte": r2(freed / hours_per_fte),
                       "eur": round(labour_eur), "eur_low": round(freed_low), "eur_high": round(freed_high),
                       "formula": "sum over roles of hours x % removed x loaded cost per hour = capacity returned"},
            "financial": financial, "quality": quality,
            "quality_counted": quality_counts,
            "route_to_cash": spec["route_to_cash"],
            "value_eur": round(value),
            "formula": (f"capacity {fmt_eur(labour_eur)} + financial {fmt_eur(fin_eur)}"
                        + (f" + quality {fmt_eur(qual_eur)}" if quality_counts and qual_eur else "")
                        + f" = {fmt_eur(value)} a year"),
        },
        "north_star": {"team": team, "metric": team_info[team]["north_star"], "input_metric": spec["input_metric"]},
        "value_stream": spec["value_stream"], "value_stream_step": spec["value_stream_step"],
        "lean_waste": spec["lean_waste"],
        "flags": spec.get("flags", {}),
        "confidence": r2(confidence), "confidence_parts": parts,
        "time_to_value_months": ttv,
        "time_to_value_why": (f"{spec['pattern']} band {TIME_TO_VALUE[spec['pattern']]:g} months"
                              + "".join(f" + {EXTRA_MONTHS[f]:g} for {f.replace('_', ' ')}" for f in EXTRA_MONTHS
                                        if spec.get("flags", {}).get(f))),
        "priority": round(priority),
        "priority_formula": (f"({fmt_eur(labour_eur)} x {confidence:.2f} + {fmt_eur(fin_eur + (qual_eur if quality_counts else 0))}"
                             f" x {confidence:.2f} x {ASSUMPTION_WEIGHT})"
                             + (f" x adoption {adoption:g}" if adoption != 1 else "")
                             + f" / {ttv:g} months = {fmt_eur(priority)} "
                             "of confidence-weighted value per month of waiting"),
        "risks": [g["text"] for g in merge_lines([(g["text"], m) for r in answered for g in r.get("risks", [])
                                                  for m in g["models"]])[:6]],
        "research_questions": [g["text"] for g in merge_lines(
            [(g["text"], m) for r in answered for g in r.get("research_questions", []) for m in g["models"]])[:6]],
        "build_brief": {k: fill(v, numbers) for k, v in spec["build_brief"].items()},
        "golden_demo": {k: fill(v, numbers) for k, v in spec["golden_demo"].items()},
    }
    if v1:
        out["adoption_share"] = adoption
        out["keep_human_tasks"] = [r["uid"] for r in members if r.get("gate")]
        out["business_case"]["labour"].update({
            "hours_removed_expected": expected(freed, 0), "fte_expected": expected(freed, 2, 1 / hours_per_fte),
            "eur_expected": expected(labour_eur, 0), "adoption_ramp": ADOPTION_RAMP})
    return out


# ---------------------------------------------------------------- experiments (numbers for findings)

def pearson(xs, ys):
    pairs = [(x, y) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < 3:
        return None
    mx, my = mean([p[0] for p in pairs]), mean([p[1] for p in pairs])
    sxy = sum((x - mx) * (y - my) for x, y in pairs)
    sx = math.sqrt(sum((x - mx) ** 2 for x, _ in pairs))
    sy = math.sqrt(sum((y - my) ** 2 for _, y in pairs))
    return r2(sxy / (sx * sy)) if sx and sy else None


def model_profile(answers_m, records):
    """How one model answers: numbers, patterns, evidence honesty, specificity, sameness."""
    tasks = [a for uid, a in answers_m.items() if uid in records]
    if not tasks:
        return None
    lens_lines = [a["lenses"].get(k, "") for a in tasks for k in LENSES]
    sources = [e.get("source", "") for a in tasks for e in a.get("evidence", [])]
    grades = Counter(e.get("grade") for a in tasks for e in a.get("evidence", []))
    products = Counter(s.strip() for s in sources if s and not re.search(r"model knowledge", s, re.I))
    # sameness: how alike a model's lines for one lens are across the tasks of one role
    by_role_lens = defaultdict(list)
    for uid, a in answers_m.items():
        if uid in records:
            for k in LENSES:
                by_role_lens[(records[uid]["role_id"], k)].append(a["lenses"].get(k, ""))
    sims = []
    for lines in by_role_lens.values():
        for i in range(len(lines)):
            for j in range(i + 1, len(lines)):
                sims.append(similar(lines[i], lines[j]))
    gaps = [abs(a.get("time_saved_pct", 0) / 100 - (1 - 1 / speed(a))) for a in tasks]
    # templated phrasing: a line shares a four-word run with at least three other lines of this model
    grams = [{" ".join(w[i:i + 4]) for i in range(len(w) - 3)}
             for w in (re.findall(r"[a-z0-9']+", x.lower()) for x in lens_lines)]
    seen = Counter(g for line in grams for g in line)
    stock = {g for g, n in seen.items() if n >= 4 and len(set(g.split()) - STOP - {"the", "a", "to", "of", "and", "in", "is"}) >= 2}
    return {
        "tasks": len(tasks),
        "speedup_mean": r2(mean(speed(a) for a in tasks)),
        "speedup_median": r2(statistics.median(speed(a) for a in tasks)),
        "time_saved_mean": r2(mean(a.get("time_saved_pct", 0) for a in tasks)),
        "autonomy_mean": r2(mean(a.get("autonomy_level", 0) for a in tasks)),
        "patterns": dict(Counter(a["pattern"] for a in tasks).most_common()),
        "confidence": dict(Counter(a.get("confidence") for a in tasks)),
        "evidence_per_task": r2(len(sources) / len(tasks)),
        "evidence_grades": dict(sorted(grades.items())),
        "share_tasks_with_e2_plus": r2(mean(1.0 if any(GRADE_SCORE.get(e.get("grade"), 0) >= 0.7
                                                       for e in a.get("evidence", [])) else 0.0 for a in tasks)),
        "share_sources_model_knowledge": r2(mean(1.0 if re.search(r"model knowledge", s, re.I) else 0.0
                                                  for s in sources)) if sources else None,
        "urls_in_sources": sum(1 for s in sources if re.search(r"https?://", s)),
        "url_states": dict(Counter(url_state(u) for s in sources for u in URL.findall(s))),
        "top_sources": products.most_common(20),
        "specificity_mean": r2(mean(specificity(x) for x in lens_lines)),
        "words_per_lens_line": r2(mean(len(x.split()) for x in lens_lines)),
        "hype_hits": sum(len(HYPE.findall(x)) for x in lens_lines),
        "sameness_within_role": r2(mean(sims)),
        "templated_line_share": r2(mean(1.0 if line & stock else 0.0 for line in grams)),
        "stock_phrases": [g for g, _ in Counter({g: seen[g] for g in stock}).most_common(12)],
        "speedup_pct_inconsistent_share": r2(mean(1.0 if g > 0.15 else 0.0 for g in gaps)),
        "critic_mean": r2(mean(critic(a) for a in tasks)),
        "reach_per_task": r2(mean(len(a["lenses"].get("reach", [])) for a in tasks)),
        "research_questions_per_task": r2(mean(len(a.get("research_questions", [])) for a in tasks)),
    }


def experiments(answers, records, primary, files):
    out = {"files": files, "primary": primary, "profiles": {}, "pairs": {}, "agreement": {}, "probes": {},
           "grounding": {}}
    for variant in VARIANTS:
        out["profiles"][variant] = {m: model_profile(answers[variant][m], records) for m in MODELS}
    a = answers[primary]
    common = {u for u in records if all(u in a[m] for m in MODELS)}
    out["profiles_common"] = {"tasks": len(common), "note": "the same tasks for all three models",
                              **{m: model_profile({u: a[m][u] for u in common}, records) for m in MODELS}}
    for i, m1 in enumerate(MODELS):
        for m2 in MODELS[i + 1:]:
            both = [u for u in a[m1] if u in a[m2] and u in records]
            if not both:
                continue
            out["pairs"][f"{m1}-{m2}"] = {
                "tasks": len(both),
                "same_pattern": r2(mean(1.0 if a[m1][u]["pattern"] == a[m2][u]["pattern"] else 0.0 for u in both)),
                "autonomy_abs_diff": r2(mean(abs(a[m1][u]["autonomy_level"] - a[m2][u]["autonomy_level"]) for u in both)),
                "speedup_ratio": r2(mean(min(speed(a[m1][u]), speed(a[m2][u])) / max(speed(a[m1][u]), speed(a[m2][u]))
                                         for u in both)),
                "lens_text_similarity": r2(mean(similar(a[m1][u]["lenses"].get(k, ""), a[m2][u]["lenses"].get(k, ""))
                                                for u in both for k in LENSES)),
            }
    ai = [r for r in records.values() if r["class"] in AI_CLASSES]
    full = [r for r in ai if r.get("consensus") and r["consensus"]["n"] == 3]
    out["agreement"] = {
        "ai_tasks": len(ai), "answered_by_any": sum(1 for r in ai if r.get("consensus")),
        "answered_by_all_three": len(full),
        "pattern_unanimous": r2(mean(1.0 if r["consensus"]["pattern_unanimous"] else 0.0 for r in full)),
        "pattern_two_of_three": r2(mean(1.0 if max(r["consensus"]["pattern_votes"].values()) >= 2 else 0.0
                                        for r in full)),
        "agreement_mean": r2(mean(r["consensus"]["agreement"] for r in full)),
        "lowest": [{"uid": r["uid"], "role_id": r["role_id"], "statement": r["statement"][:120],
                    "agreement": r["consensus"]["agreement"], "votes": r["consensus"]["pattern_votes"],
                    "speedups": r["consensus"]["speedup_range"]}
                   for r in sorted(full, key=lambda r: r["consensus"]["agreement"])[:8]],
        "strongest_lens_by_model": dict(Counter(r["lenses"][k]["model"] for r in full
                                                for k in LENSES if r["lenses"].get(k))),
        "strongest_lens_sole_by_model": dict(Counter(r["lenses"][k]["model"] for r in full for k in LENSES
                                                     if r["lenses"].get(k) and not r["lenses"][k]["tied"])),
        "strongest_lens_ties": sum(1 for r in full for k in LENSES if r["lenses"].get(k) and r["lenses"][k]["tied"]),
        "best_critic_by_model": dict(Counter(max(r["critic"], key=r["critic"].get) for r in full)),
        "consensus_patterns_by_class": {c: dict(Counter(r["consensus"]["pattern"] for r in ai
                                                        if r.get("consensus") and r["class"] == c))
                                        for c in AI_CLASSES},
    }
    answered = [r for r in ai if r.get("consensus")]
    out["probes"] = {
        "disagreements": sum(1 for r in answered if r["probe_check"]["disagrees"]),
        "of": len(answered),
        "by_class": {c: sum(1 for r in answered if r["class"] == c and r["probe_check"]["disagrees"])
                     for c in AI_CLASSES},
        "speedup_median_by_class": {c: r2(statistics.median([r["consensus"]["speedup"] for r in answered
                                                             if r["class"] == c] or [0])) for c in AI_CLASSES},
        "r_p_ai_does_nearly_all_vs_time_saved": pearson([r["probe"]["p_ai_does_nearly_all"] for r in answered],
                                                        [r["consensus"]["time_saved_pct"] for r in answered]),
        "r_p_clear_gain_most_vs_time_saved": pearson([r["probe"]["p_clear_gain_most"] for r in answered],
                                                     [r["consensus"]["time_saved_pct"] for r in answered]),
        "examples": [{"uid": r["uid"], "role_id": r["role_id"], "statement": r["statement"][:120],
                      "note": r["probe_check"]["note"]} for r in answered if r["probe_check"]["disagrees"]][:12],
    }
    ruled = [r for r in answered if "rule_pattern" in r["probe_check"]]
    if ruled:
        confusion = defaultdict(Counter)
        for r in ruled:
            confusion[r["probe_check"]["rule_pattern"]][r["consensus"]["pattern"]] += 1
        feats = [r["probe"]["rule_features"] for r in ruled]
        out["probes"]["rule"] = {
            "tasks": len(ruled),
            "same_pattern": r2(mean(1.0 if r["probe_check"]["rule_agrees"] else 0.0 for r in ruled)),
            "same_family": r2(mean(1.0 if r["probe_check"]["rule_same_family"] else 0.0 for r in ruled)),
            "same_pattern_by_class": {c: r2(mean([1.0 if r["probe_check"]["rule_agrees"] else 0.0
                                                  for r in ruled if r["class"] == c])) for c in AI_CLASSES},
            "rule_vs_models": {k: dict(v) for k, v in confusion.items()},
            "rule_keep_human_models_build": [{"uid": r["uid"], "role_id": r["role_id"],
                                              "statement": r["statement"][:110], "models": r["consensus"]["pattern"],
                                              "speedup": r["consensus"]["speedup"]}
                                             for r in ruled if r["probe_check"]["rule_pattern"] == "keep_human"
                                             and r["consensus"]["pattern"] in BUILD_PATTERNS][:10],
            "core_agrees": r2(mean(1.0 if r["probe_check"].get("core_agrees") else 0.0
                                   for r in ruled if "core_agrees" in r["probe_check"])),
            "r_drudgery_vs_time_saved": pearson([f["drudgery"] for f in feats],
                                                [r["consensus"]["time_saved_pct"] for r in ruled]),
            "r_codify_vs_autonomy": pearson([f["codify"] for f in feats], [r["consensus"]["autonomy"] for r in ruled]),
            "r_relational_vs_speedup": pearson([f["relational"] for f in feats],
                                               [r["consensus"]["speedup"] for r in ruled]),
            "r_headroom_vs_speedup": pearson([f.get("headroom") for f in feats], [r["consensus"]["speedup"] for r in ruled]),
        }
    other = COMPARE[primary]
    out["grounding_compares"] = [primary, other]
    for m in MODELS:
        both = [u for u in answers[other][m] if u in answers[primary][m] and u in records]
        if not both:
            continue
        p, g = answers[primary][m], answers[other][m]
        def e2(ans):
            return 1.0 if any(GRADE_SCORE.get(e.get("grade"), 0) >= 0.7 for e in ans.get("evidence", [])) else 0.0
        out["grounding"][m] = {
            "tasks": len(both),
            "pattern_changed": r2(mean(1.0 if p[u]["pattern"] != g[u]["pattern"] else 0.0 for u in both)),
            "speedup_mean": [r2(mean(speed(p[u]) for u in both)), r2(mean(speed(g[u]) for u in both))],
            "autonomy_mean": [r2(mean(p[u]["autonomy_level"] for u in both)),
                              r2(mean(g[u]["autonomy_level"] for u in both))],
            "share_e2_plus": [r2(mean(e2(p[u]) for u in both)), r2(mean(e2(g[u]) for u in both))],
            "evidence_citing_digest": r2(mean(1.0 if any(re.search(r"\[S\d+\b|digest", e.get("source", "") + e.get("claim", ""), re.I)
                                                       for e in g[u].get("evidence", [])) else 0.0 for u in both)),
            "specificity": [r2(mean(specificity(p[u]["lenses"].get(k, "")) for u in both for k in LENSES)),
                            r2(mean(specificity(g[u]["lenses"].get(k, "")) for u in both for k in LENSES))],
            "lens_similarity_to_inmemory": r2(mean(similar(p[u]["lenses"].get(k, ""), g[u]["lenses"].get(k, ""))
                                                   for u in both for k in LENSES)),
        }
    return out


def v1_summary(records, teams, opportunities, files, primary):
    """Coverage and the effect of each v1 rule, for findings.md."""
    ai = [r for r in records.values() if r["class"] in AI_CLASSES]
    answered = [r for r in ai if r.get("consensus")]
    rules = [r for r in answered if r["consensus"].get("simplest_first")]
    return {
        "variant": primary, "runs_still_landing": True,
        "coverage": {"ai_tasks": len(ai), "answered_by_any": len(answered),
                     "answered_by_all_three": sum(1 for r in answered if r["consensus"]["n"] == 3),
                     "by_model": {m: sum(1 for r in answered if m in r["consensus"]["models"]) for m in MODELS},
                     "files": files[primary],
                     "fallback_hours": round(sum(r["hours"] for r in ai if not r.get("consensus")), 1)},
        "consensus_patterns": dict(Counter(r["consensus"]["pattern"] for r in answered).most_common()),
        "vote_patterns": dict(Counter(r["consensus"]["vote_pattern"] for r in answered).most_common()),
        "simplest_first": {
            "overrode": sum(1 for r in rules if r["consensus"]["simplest_first"]["overrode"]),
            "held_for_agent": sum(1 for r in rules if not r["consensus"]["simplest_first"]["overrode"]),
            "moves": dict(Counter(f"{r['consensus']['simplest_first']['vote']} -> {r['consensus']['simplest_first']['simplest']}"
                                  for r in rules if r["consensus"]["simplest_first"]["overrode"])),
            "tasks": [{"uid": r["uid"], "role_id": r["role_id"], **r["consensus"]["simplest_first"]} for r in rules]},
        "keep_human_by_rule": {"tasks": sum(1 for r in ai if r.get("gate")),
                               "hours": round(sum(r["hours"] for r in ai if r.get("gate")), 1),
                               "answered": sum(1 for r in ai if r.get("gate") and r.get("consensus"))},
        "teams": {t["id"]: {"hours_freed_potential": t["hours_freed"], "hours_freed_expected": t["hours_freed_expected"],
                            "fte_potential": t["fte_returned"], "fte_expected": t["fte_returned_expected"],
                            "eur_potential": t["capacity_returned_eur"],
                            "eur_expected": t["capacity_returned_eur_expected"]} for t in teams},
        "adoption_ramp": ADOPTION_RAMP, "adoption_share": ADOPTION_SHARE,
        "copilots_in_top5": [o["name"] for o in opportunities[:5] if o["pattern"] == "copilot"],
    }


# ---------------------------------------------------------------- main

def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--variant", default="inmemory", choices=VARIANTS,
                        help="which answers the roll-ups and opportunities use (v1 writes data/synthesis/v1/)")
    parser.add_argument("--primary", choices=VARIANTS, help="old name for --variant")
    parser.add_argument("--sol-with-web", action="store_true",
                        help="in-memory Sol from runs/inmemory/sol only, ignoring the web-off rerun")
    args = parser.parse_args()
    args.primary = args.primary or args.variant
    v1 = args.primary in V1_RULES
    out_dir = OUT_DIR[args.primary]
    if os.path.exists(URL_CHECK):
        URLS.update(load(URL_CHECK)["urls"])
    data = load(os.path.join(ROOT, "data", "teams.json"))
    hours_per_fte = data["company"]["hours_per_fte"]
    answers, blocks, files, sol_source = load_answers(noweb=not args.sol_with_web)
    other = COMPARE[args.primary]
    records = task_records(data, answers, args.primary)
    stamp = datetime.now().isoformat(timespec="seconds")
    meta = {"generated": stamp, "primary_variant": args.primary, "answer_files": files,
            "models": MODEL_NAMES, "by": "tools/synthesize.py",
            "caveats": {k: v for k, v in CAVEATS.items() if files[k.split("/")[0]][k.split("/")[1]]},
            "inmemory_sol_source": sol_source}
    if sol_source and sol_source["noweb"]:
        meta["caveats"]["inmemory/sol"] = (
            f"{len(sol_source['noweb'])} of {len(sol_source['noweb']) + len(sol_source['web'])} in-memory Sol batches "
            f"come from runs/{NOWEB['folder']}/sol (web off); the other {len(sol_source['web'])} still had web search: "
            + CAVEATS["inmemory/sol"])
    if v1:
        meta["v1_rules"] = {"simplest_first": {"order": SIMPLEST, "agent_votes_to_hold": AGENT_VOTES_TO_HOLD,
                                               "coordinate_decide_to_hold": COORDINATE_DECIDE_TO_HOLD},
                            "keep_human": "data/patterns_rule.json, never the models",
                            "adoption_share": ADOPTION_SHARE, "adoption_ramp": ADOPTION_RAMP,
                            "compared_with": other}

    ai = [r for r in records.values() if r["class"] in AI_CLASSES]
    write("tasks.json", {"_meta": dict(meta, note=(
        "Keyed by task uid. 'models' holds each model's answer; 'consensus' merges them (modal pattern, a tie "
        "goes to the lower autonomy; median autonomy, speedup and time saved; agreement = mean of pattern "
        "share, 1 - autonomy spread / 5, and min/max speedup). 'lenses' holds the strongest line per lens by "
        "a plain specificity critic (named systems, Dutch context, a number, length, no hype). Human tasks "
        "carry facts and roll_up only."
        + (" v1: 'vote_pattern' is the vote, 'pattern' follows simplest first ('simplest_first' records it) and "
           "the keep_human gate ('gate'); hours_freed_expected = potential x the adoption ramp per year." if v1 else "")),
        ai_tasks=len(ai), answered=sum(1 for r in ai if r.get("consensus"))), "tasks": records}, out_dir)

    roles, teams = [], []
    roles_by_id = {}
    for team in data["teams"]:
        team_roles = [role_rollup(team, role, records, blocks[args.primary], blocks[other], other, v1)
                      for role in team["roles"]]
        roles.extend(team_roles)
        teams.append(team_rollup(team, team_roles, records, hours_per_fte, v1))
    roles_by_id = {r["id"]: r for r in roles}
    write("roles.json", {"_meta": dict(meta, note=(
        "hours_freed = sum of task hours x (1 - 1/median speedup), per year for all FTE in the role; low and "
        "high use each task's lowest and highest model speedup. ceiling = 1 / sum(share_i / speedup_i) with "
        "human tasks at 1; ceiling_limit = the same with every AI task infinitely fast (1 / human share). "
        "reach_targets maps reach lines to the role they point at ('outside' = beyond the 14 roles).")),
        "roles": roles}, out_dir)
    write("teams.json", {"_meta": dict(meta, note=(
        "Team ceiling = team hours / (team hours - hours freed). Smaller team keeps half-FTE steps per role. "
        "Pods group every task by value stream (keyword rules on the task statement, then the role default).")),
        "teams": teams}, out_dir)

    opportunities = []
    if os.path.exists(CLUSTERS):
        clusters = load(CLUSTERS)
        assumptions = clusters.get("assumptions", {})
        team_info = {t["id"]: t for t in data["teams"]}
        opportunities = [opportunity(spec, records, roles_by_id, team_info, assumptions, hours_per_fte, v1)
                         for spec in clusters["opportunities"]]
        opportunities.sort(key=lambda o: -o["priority"])
        top = opportunities[0]["priority"] if opportunities and opportunities[0]["priority"] else 1
        for rank, o in enumerate(opportunities, 1):
            o["rank"] = rank
            o["priority_score"] = round(100 * o["priority"] / top)
        clustered = {uid for spec in clusters["opportunities"] for uid in spec["tasks"]}
        unclustered = [{"uid": r["uid"], "role_id": r["role_id"], "statement": r["statement"], "hours": r["hours"],
                        "hours_freed": r["roll_up"]["hours_freed"]} for r in ai if r["uid"] not in clustered]
        doubles = [uid for uid, n in Counter(uid for spec in clusters["opportunities"] for uid in spec["tasks"]).items()
                   if n > 1]
        write("opportunities.json", {
            "_meta": dict(meta, note=(
                "Ranked by priority = (capacity EUR x confidence + financial and quality EUR x confidence x "
                f"{ASSUMPTION_WEIGHT}) / months to value. confidence = mean(model agreement, model-stated "
                "confidence, evidence grade score) x (0.5 + 0.5 x share of hours with model answers). Time to "
                "value comes from the build pattern's effort band plus months for works council consent and "
                "EU AI Act high-risk duties. Financial and quality inputs are assumptions for a fictional "
                "company, each graded; replace them with measured figures (E4)."),
                time_to_value_months=TIME_TO_VALUE, extra_months=EXTRA_MONTHS,
                assumptions=assumptions, clusters_file=os.path.relpath(CLUSTERS, ROOT),
                tasks_in_two_clusters=doubles),
            "totals": {
                "opportunities": len(opportunities),
                "hours_removed": round(sum(o["business_case"]["labour"]["hours_removed"] for o in opportunities)),
                "capacity_eur": round(sum(o["business_case"]["labour"]["eur"] for o in opportunities)),
                "value_eur": round(sum(o["business_case"]["value_eur"] for o in opportunities)),
                "ai_hours_freed_all_tasks": round(sum(r["roll_up"]["hours_freed"] for r in ai)),
                "unclustered_hours_freed": round(sum(u["hours_freed"] for u in unclustered)),
            },
            "opportunities": opportunities, "unclustered": unclustered}, out_dir)

    exp = experiments(answers, records, args.primary, files)
    exp["inmemory_sol_source"] = dict(sol_source or {}, note=(
        f"runs/{NOWEB['folder']}/sol replaces runs/inmemory/sol batch by batch where it exists (Sol with web "
        "search really off); the batches under 'web' are still the web-on answers") if not args.sol_with_web
        else "--sol-with-web: the web-on answers only")
    if v1:
        exp["v1"] = v1_summary(records, teams, opportunities, files, args.primary)
    write("experiments.json", {"_meta": meta, **exp}, out_dir)

    answered = sum(1 for r in ai if r.get("consensus"))
    full = sum(1 for r in ai if r.get("consensus") and r["consensus"]["n"] == 3)
    print(f"answers: " + ", ".join(f"{v} " + "/".join(f"{m} {files[v][m]}" for m in MODELS) for v in VARIANTS))
    if sol_source:
        print(f"in-memory sol: {len(sol_source['noweb'])} batches web off, {len(sol_source['web'])} web on")
    print(f"variant {args.primary} -> {os.path.relpath(out_dir, ROOT)}/")
    print(f"tasks: {len(ai)} automate+amplify, {answered} answered by a model, {full} by all three; by model "
          + ", ".join(f"{m} {sum(1 for r in ai if r.get('consensus') and m in r['consensus']['models'])}" for m in MODELS))
    if v1:
        x = exp["v1"]
        print(f"consensus patterns: {x['consensus_patterns']} (vote: {x['vote_patterns']})")
        print(f"simplest first: {x['simplest_first']['overrode']} overrides {x['simplest_first']['moves']}, "
              f"{x['simplest_first']['held_for_agent']} held for agent")
        print(f"keep_human by rule: {x['keep_human_by_rule']['tasks']} tasks, {x['keep_human_by_rule']['hours']:,.0f} h")
    for t in teams:
        print(f"{t['name']}: {t['hours_freed']:,.0f} h freed ({t['fte_returned']} FTE, {fmt_eur(t['capacity_returned_eur'])}), "
              f"ceiling {t['ceiling']}x, limit {t['ceiling_limit']}x"
              + ("; expected FTE " + "/".join(f"{y} {v}" for y, v in t["fte_returned_expected"].items()) if v1 else ""))
    for o in opportunities[:10]:
        print(f"  {o['rank']:>2} {o['priority_score']:>3} {o['name'][:60]:<60} {fmt_eur(o['business_case']['value_eur'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
