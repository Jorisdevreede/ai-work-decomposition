"""
The task graph (method v2): merge the step-level answers into one graph and its roll-ups.

Reads data/teams.json (roles, FTE, task shares) and runs/<variant>/<model>/<role>__<n>.json (each task
split into steps with actor, today's means, systems, input and output artefacts, handoff, fate,
building block, rung and loop). Standard library only. Writes, in data/graph/:

  graph.json        nodes for steps (with task, role, team), artefacts, systems and roles, and edges:
                    step -> artefact (produces), artefact -> step (feeds), step -> role (handoff),
                    step -> system (uses); plus the answered tasks. Artefact names are normalised:
                    lower case, singular, and merged through ALIASES below (shown in _meta too).
  glue.json         the glue: steps done today in a spreadsheet, mail or document that connect two or
                    more systems, or hand work to another role, team or outside party; ranked by
                    hours, each with its proposed block and rung and the task's design text
  blocks.json       hours and step counts per building block x rung, per role, team and overall, and
                    the share of hours each rung covers: how far deterministic with a few small loops
                    gets us
  consistency.json  Finance answered twice (runs/v2 and runs/v2-repeat, batched differently): per task
                    time saved, step-by-step rung and block agreement, design overlap

Hours: a task's hours are hours per FTE x role FTE x task share (data/teams.json). A step's hours are
the task's hours x its share of the task; the hours it frees are its hours x (1 - remaining_pct / 100),
so a task's freed hours match its time_saved_pct. Tasks without an answer yet are reported as missing
coverage, never counted as hours. Rerun as batches land; the script only reads the runs.

Usage:
  python3 tools/graph.py [--variant v2] [--repeat v2-repeat] [--model opus]
"""
import argparse
import glob
import json
import os
import re
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "graph")

RUNGS = ["eliminate", "configure", "deterministic", "deterministic_plus_loop", "agent", "stays_manual"]
BLOCKS = ["none", "artefact_generator", "workflow_automation", "crud_app", "dashboard", "answer_desk",
          "integration", "judgement_step", "conversation", "notification"]
FATES = ["gone", "machine", "person_reviews", "person_does"]
MEANS = ["system_screen", "spreadsheet", "email_chat", "document", "meeting_call", "paper_phone", "in_person"]
LOOP_RUNGS = {"deterministic_plus_loop", "agent"}
NO_MODEL = {"eliminate", "configure", "deterministic"}

# Glue is work done in these means ...
GLUE_MEANS = {"spreadsheet", "email_chat", "document"}
# ... and these office tools carry it: they do not count among the systems a glue step connects.
OFFICE = {"Excel", "Outlook", "Word", "Teams", "PowerPoint", "SharePoint", "Microsoft 365",
          "Microsoft Forms", "OneDrive", "OneNote"}

# Artefact synonyms, after lower-casing and singularising: variant -> the name kept.
# Only obvious synonyms; an artefact in a different state (draft, approved, posted) stays its own node.
ALIASES = {
    # the collective labour agreement
    "cao agreement": "cao text",
    "cao rule": "cao text",
    "cao table": "cao wage table",
    "cao salary scale": "cao wage table",
    "cao pay scale": "cao wage table",
    # hours from the staffing agencies
    "agency hours": "agency hours export",
    "agency timesheet": "agency hours export",
    "agency timesheet export": "agency hours export",
    # Recruitee
    "pipeline export": "candidate pipeline export",
    "recruitee export": "candidate pipeline export",
    "recruitee pipeline export": "candidate pipeline export",
    # vacancies and job descriptions
    "vacancy text": "job ad",
    "vacancy ad": "job ad",
    "posted job ad": "published vacancy",
    "published job ad": "published vacancy",
    "job description": "job profile",
    "function profile": "job profile",
    "role profile": "job profile",
    "cv": "cv",
    "resume": "cv",
    # people data
    "hr data extract": "employee data extract",
    "employee extract": "employee data extract",
    "personnel data extract": "employee data extract",
    "absence data": "absence record",
    "absence registration": "absence record",
    "headcount plan": "workforce plan",
    "formation plan": "workforce plan",
    "leaving reasons summary": "leaver theme summary",
    "exit theme summary": "leaver theme summary",
    "certificate export": "certificate list",
    "hr policy document": "policy document",
    "hr policy": "policy document",
    "policy": "policy document",
    "afas employee record": "employee record",
    "employee record update": "updated employee record",
    "afas employee mutation": "afas mutation",
    "afas data dictionary": "data dictionary",
    "data issue": "data quality issue",
    "metric extract": "hr metric extract",
    "intake note": "vacancy intake note",
    "job intake note": "vacancy intake note",
    "offer accepted": "accepted offer",
    "new starter list": "new hire list",
    "team update": "team status update",
    "policy proposal": "policy change proposal",
    "policy update proposal": "policy change proposal",
    "salary survey report": "salary survey",
    "power bi semantic model": "semantic model",
    # payroll
    "cao scale table": "cao wage table",
    "cao rate table": "cao wage table",
    "afas salary export": "salary export",
    "flex hours export": "agency hours export",
    "test payroll run": "trial payroll run",
    "draft payroll run": "trial payroll run",
    "payroll cut-off calendar": "payroll calendar",
    "payroll journal entry": "payroll journal",
    "loonaangifte": "payroll tax return",
    # finance
    "gl extract": "general ledger extract",
    "ledger extract": "general ledger extract",
    "general ledger export": "general ledger extract",
    "ledger export": "general ledger extract",
    "ledger detail": "general ledger detail",
    "ledger balance": "general ledger balance",
    "account mapping table": "account mapping",
    "open items": "open items list",
    "open items export": "open items list",
    "afas open items": "open items list",
    "bank statement export": "bank statement",
    "sepa payment batch": "payment batch",
    "correcting journal": "correcting entry",
    "correcting journal entry": "correcting entry",
    "management report pack": "management pack",
    "budget report pack": "budget pack",
    "budget vs actual report": "budget vs actual",
    "supplier master": "supplier master data",
    "credit request": "credit note request",
    "reply to customer": "customer reply",
    "trial balance export": "trial balance",
    "camt statement": "bank statement",
    "camt.053 file": "bank statement",
    "camt.053 statement": "bank statement",
    "bank statement file": "bank statement",
    "supplier invoice pdf": "supplier invoice",
    "purchase invoice": "supplier invoice",
    "open item list": "open items list",
    "aged debtor list": "aged receivables list",
    "aging report": "aged receivables list",
    "ageing report": "aged receivables list",
    "debtor ageing report": "aged receivables list",
    "payment reminder": "reminder letter",
    "dunning letter": "reminder letter",
}

# Last words that stay plural: their singular reads wrong or means something else.
KEEP_PLURAL = {"hours", "terms", "data", "news", "minutes", "statistics", "sales", "goods", "details",
               "analytics", "series", "means", "facts", "findings", "actuals", "accounts", "items",
               "costs", "earnings", "payables", "receivables", "savings", "proceedings", "premises"}
IRREGULAR = {"analyses": "analysis", "bases": "basis", "criteria": "criteria", "people": "people",
             "children": "child", "theses": "thesis"}

# Systems written in more than one way.
SYSTEM_ALIASES = {
    "afas": "AFAS Profit", "afas profit": "AFAS Profit", "afas profit 8": "AFAS Profit",
    "afas pocket": "AFAS Profit", "afas insite": "AFAS Profit",
    "staffing agency portals": "Staffing agency portals", "staffing agency portal": "Staffing agency portals",
    "agency portals": "Staffing agency portals", "agency portal": "Staffing agency portals",
    "excel": "Excel", "microsoft excel": "Excel", "ms excel": "Excel",
    "outlook": "Outlook", "microsoft outlook": "Outlook", "e-mail": "Outlook", "email": "Outlook",
    "word": "Word", "microsoft word": "Word", "ms word": "Word",
    "teams": "Teams", "microsoft teams": "Teams",
    "powerpoint": "PowerPoint", "microsoft powerpoint": "PowerPoint",
    "sharepoint": "SharePoint", "microsoft sharepoint": "SharePoint",
    "microsoft 365": "Microsoft 365", "m365": "Microsoft 365", "office 365": "Microsoft 365",
    "microsoft forms": "Microsoft Forms", "forms": "Microsoft Forms",
    "power bi": "Power BI", "powerbi": "Power BI",
    "recruitee": "Recruitee", "studytube": "Studytube",
    "rabobank": "Rabobank", "rabo internet banking": "Rabobank", "rabobank portal": "Rabobank",
    "kvk": "KvK Handelsregister", "kvk register": "KvK Handelsregister", "kvk handelsregister": "KvK Handelsregister",
    "web": "Web browser", "web browser": "Web browser", "browser": "Web browser",
}

STOP = {"the", "and", "for", "with", "from", "into", "that", "this", "their", "them", "then", "they",
        "each", "every", "per", "one", "two", "its", "are", "was", "will", "can", "not", "but", "all",
        "any", "has", "have", "how", "what", "when", "which", "who", "out", "off", "via", "onto", "over",
        "than", "too", "use", "uses", "used", "using", "own", "new", "only", "more", "most", "some",
        "such", "also", "both", "where", "while", "about", "so", "a", "an", "of", "to", "in", "on",
        "or", "by", "is", "be", "as", "at", "it", "if", "no"}


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


def r1(x):
    return None if x is None else round(x, 1)


def r3(x):
    return None if x is None else round(x, 3)


def share(part, whole):
    return round(part / whole, 3) if whole else None


def tokens(text):
    """Content words, crudely stemmed (trailing s), for overlap scores."""
    words = re.findall(r"[a-z0-9&]+", (text or "").lower())
    return {w[:-1] if len(w) > 4 and w.endswith("s") and not w.endswith("ss") else w
            for w in words if len(w) > 2 and w not in STOP}


def jaccard(a, b):
    a, b = set(a), set(b)
    return len(a & b) / len(a | b) if a and b else 0.0


def singular(word):
    if word in IRREGULAR:
        return IRREGULAR[word]
    if len(word) <= 2 or word in KEEP_PLURAL or not word.endswith("s"):
        return word
    if word.endswith(("ss", "us", "is")):
        return word
    if word.endswith("ies") and len(word) > 4:
        return word[:-3] + "y"
    if word.endswith(("sses", "xes", "ches", "shes")):
        return word[:-2]
    return word[:-1]


def norm_artefact(name):
    s = re.sub(r"[\"“”‘’]", "", (name or "").strip().lower())
    s = re.sub(r"\s+", " ", s).strip(" .")
    if not s:
        return ""
    words = s.split(" ")
    words[-1] = singular(words[-1])
    s = " ".join(words)
    return ALIASES.get(s, s)


def norm_system(name):
    s = re.sub(r"\s+", " ", (name or "").strip())
    return SYSTEM_ALIASES.get(s.lower(), s)


# ---------------------------------------------------------------- inputs

def load_org():
    """Roles and tasks with their hours: hours per FTE x role FTE x task share."""
    data = load(os.path.join(ROOT, "data", "teams.json"))
    per_fte = data["company"]["hours_per_fte"]
    teams, roles, tasks = {}, {}, {}
    for team in data["teams"]:
        teams[team["id"]] = {"id": team["id"], "name": team["name"], "fte": team["fte"]}
        for role in team["roles"]:
            roles[role["id"]] = {"id": role["id"], "title": role["title"], "team": team["id"], "fte": role["fte"]}
            for t in role["tasks"]:
                tasks[t["uid"]] = {
                    "uid": t["uid"], "role": role["id"], "team": team["id"], "statement": t["statement"],
                    "class": t["class"], "in_scope": t["class"] in ("S", "A"),
                    "hours": per_fte * role["fte"] * t["share"],
                }
    return teams, roles, tasks


def load_answers(variant, model, problems):
    """uid -> the task answer, with the file it came from and the runner's warnings for it."""
    answers = {}
    paths = sorted(glob.glob(os.path.join(ROOT, "runs", variant, model, "*.json")))
    for path in paths:
        rel = os.path.relpath(path, ROOT)
        try:
            doc = load(path)
        except (OSError, ValueError) as error:
            problems.append(f"{rel}: unreadable ({error})")
            continue
        role = doc.get("role_id") or os.path.basename(path).split("__")[0]
        warnings = (doc.get("_meta") or {}).get("warnings") or []
        for t in doc.get("tasks", []):
            uid = t.get("uid")
            if not uid or uid in answers:
                problems.append(f"{rel}: task {uid!r} missing or answered twice, skipped")
                continue
            answers[uid] = dict(t, _file=rel, _role=role,
                                _warnings=[w.split(" ", 1)[1] for w in warnings if w.startswith(uid + " ")])
    return answers, len(paths)


# ---------------------------------------------------------------- one task's steps

def step_checks(s):
    """Cross-field consistency of one step (flags, not fixes)."""
    flags = []
    rung, fate, remaining = s.get("rung"), s.get("fate"), s.get("remaining_pct")
    if rung not in RUNGS:
        flags.append(f"unknown rung {rung!r}")
    if s.get("block") not in BLOCKS:
        flags.append(f"unknown block {s.get('block')!r}")
    if fate not in FATES:
        flags.append(f"unknown fate {fate!r}")
    if fate in ("gone", "machine") and (remaining or 0) > 0:
        flags.append(f"{fate} but {remaining}% of the time remains")
    if rung in LOOP_RUNGS and not s.get("loop"):
        flags.append(f"{rung} without a loop")
    if rung not in LOOP_RUNGS and s.get("loop"):
        flags.append(f"loop on a {rung} step")
    if rung == "agent" and not ((s.get("loop") or {}).get("why_not_simpler") or "").strip():
        flags.append("agent without a reason it is not simpler")
    if rung == "eliminate" and fate != "gone":
        flags.append(f"eliminated but fate {fate}")
    if rung == "stays_manual" and fate in ("gone", "machine"):
        flags.append(f"stays manual but fate {fate}")
    if s.get("block") == "none" and rung not in ("eliminate", "stays_manual"):
        flags.append(f"no block for a {rung} step")
    if s.get("authority") == "act_external" and not s.get("human_gate"):
        flags.append("acts outside without a human gate")
    return flags


def task_steps(answer, org_task):
    """The task's steps with hours today and hours freed."""
    steps = answer.get("steps") or []
    total = sum(max(s.get("share_pct") or 0, 0) for s in steps)
    rows = []
    for i, s in enumerate(steps):
        part = (max(s.get("share_pct") or 0, 0) / total) if total else 1 / len(steps)
        remaining = min(max(s.get("remaining_pct", 100) if s.get("remaining_pct") is not None else 100, 0), 100)
        hours = org_task["hours"] * part
        rows.append((i, s, hours, hours * (1 - remaining / 100), remaining))
    return rows, total


def time_saved(answer):
    """time_saved_pct as the runner derived it; derived the same way when missing."""
    if answer.get("time_saved_pct") is not None:
        return answer["time_saved_pct"]
    steps = answer.get("steps") or []
    total = sum(s.get("share_pct", 0) for s in steps) or 100
    left = sum(s.get("share_pct", 0) * min(max(s.get("remaining_pct", 100), 0), 100) / 100 for s in steps)
    return round(100 * (1 - left / total))


# ---------------------------------------------------------------- the graph

def party(value, teams, roles, titles):
    """Resolve a handoff or actor value to a role-node id and its kind."""
    raw = (value or "").strip()
    key = re.sub(r"[\s_]+", "-", raw.lower())
    if key in ("", "none", "n/a", "-", "nobody", "same"):
        return None, None
    if key in roles:
        return key, "role"
    if key in teams:
        return key, "team"
    if key in ("external", "outside", "external-party"):
        return "external", "external"
    if key in ("system", "systems", "machine"):
        return "system", "system"
    if key in titles:
        return titles[key], "role"
    return key, "other"


def cross_kind(actor, target, target_kind, roles):
    if target is None:
        return "none"
    if target == actor:
        return "same_role"
    if target_kind in ("external", "system"):
        return target_kind
    if actor in ("external", "system"):  # work coming in from outside, or from a machine
        return actor
    actor_team = roles[actor]["team"] if actor in roles else None
    target_team = roles[target]["team"] if target in roles else (target if target_kind == "team" else None)
    if actor_team and target_team == actor_team:
        return "role"
    return "team"


def build_graph(teams, roles, tasks, answers):
    titles = {re.sub(r"[\s_]+", "-", r["title"].lower()): r["id"] for r in roles.values()}
    nodes, edges, task_rows = {}, [], []
    raw_names = {}
    checks = {}

    def role_node(rid, kind):
        nid = "role:" + rid
        if nid not in nodes:
            r = roles.get(rid)
            nodes[nid] = {"id": nid, "kind": "role", "party": kind, "name": r["title"] if r else
                          (teams[rid]["name"] if rid in teams else rid.replace("-", " ")),
                          "team": r["team"] if r else (rid if rid in teams else None),
                          "fte": r["fte"] if r else None, "steps_done": 0, "handoffs_in": 0}
        return nid

    for rid in roles:
        role_node(rid, "role")

    for uid, a in answers.items():
        org = tasks.get(uid)
        if not org:
            checks.setdefault("task not in data/teams.json", []).append(uid)
            continue
        rows, total = task_steps(a, org)
        if total != 100:
            checks.setdefault("step shares do not add to 100", []).append(f"{uid} ({total})")
        step_ids = []
        for i, s, hours, saved, remaining in rows:
            sid = s.get("id") or f"s{i + 1}"
            nid = f"step:{org['role']}/{uid}/{sid}"
            actor, actor_kind = party(s.get("actor"), teams, roles, titles)
            actor = actor or org["role"]
            target, target_kind = party(s.get("handoff_to"), teams, roles, titles)
            systems = list(dict.fromkeys(norm_system(x) for x in s.get("systems") or [] if x and x.strip()))
            inputs = list(dict.fromkeys(n for n in (norm_artefact(x) for x in s.get("inputs") or []) if n))
            outputs = list(dict.fromkeys(n for n in (norm_artefact(x) for x in s.get("outputs") or []) if n))
            for x in (s.get("inputs") or []) + (s.get("outputs") or []):
                if norm_artefact(x):
                    raw_names.setdefault(norm_artefact(x), set()).add(x.strip())
            flags = step_checks(s) + [w[len(sid) + 2:] for w in a["_warnings"] if w.startswith(sid + ": ")]
            for f in flags:
                checks.setdefault(re.sub(r"\d+", "N", f), []).append(f"{nid}: {f}")
            nodes[nid] = {
                "id": nid, "kind": "step", "task": uid, "role": org["role"], "team": org["team"],
                "order": i + 1, "sid": sid, "what": s.get("what", ""), "actor": actor,
                "today_means": s.get("today_means"), "systems": systems, "inputs": inputs, "outputs": outputs,
                "handoff_to": s.get("handoff_to"), "handoff": ("role:" + target) if target else None,
                "cross": cross_kind(actor, target, target_kind, roles), "share_pct": s.get("share_pct"),
                "hours": r1(hours), "hours_saved": r1(saved), "fate": s.get("fate"), "remaining_pct": remaining,
                "block": s.get("block"), "rung": s.get("rung"), "loop": s.get("loop"),
                "authority": s.get("authority"), "human_gate": bool(s.get("human_gate")), "checks": flags,
            }
            step_ids.append(nid)
            nodes[role_node(actor, actor_kind or "other")]["steps_done"] += 1
            for name in outputs:
                edges.append({"from": nid, "to": "art:" + name, "kind": "produces"})
            for name in inputs:
                edges.append({"from": "art:" + name, "to": nid, "kind": "feeds"})
            if target:
                rn = role_node(target, target_kind)
                nodes[rn]["handoffs_in"] += 1
                edges.append({"from": nid, "to": rn, "kind": "handoff", "cross": nodes[nid]["cross"]})
            for name in systems:
                edges.append({"from": nid, "to": "sys:" + name, "kind": "uses"})
        task_rows.append({
            "uid": uid, "role": org["role"], "team": org["team"], "short": a.get("short", ""),
            "statement": org["statement"], "hours": r1(org["hours"]), "time_saved_pct": time_saved(a),
            "hours_saved": r1(sum(r[3] for r in rows)), "speedup": a.get("speedup"), "steps": step_ids,
            "design": a.get("design", ""), "previous_blocker": a.get("previous_blocker", ""),
            "enabler_now": a.get("enabler_now", ""), "still_hard": a.get("still_hard", ""),
            "human_edge": a.get("human_edge", ""), "ambition": a.get("ambition"), "altitude": a.get("altitude", ""),
            "build_days": a.get("build_days"), "run_cost": a.get("run_cost"), "file": a["_file"],
            "warnings": [w for w in a["_warnings"] if not re.match(r"s\d+: ", w)],
        })

    # artefact and system nodes from the edges
    steps = {n["id"]: n for n in nodes.values() if n["kind"] == "step"}
    for e in edges:
        for end in (e["from"], e["to"]):
            if end.startswith("art:") and end not in nodes:
                name = end[4:]
                nodes[end] = {"id": end, "kind": "artefact", "name": name,
                              "raw": sorted(raw_names.get(name, {name})), "produced_by": [], "fed_to": []}
            if end.startswith("sys:") and end not in nodes:
                name = end[4:]
                nodes[end] = {"id": end, "kind": "system", "name": name, "office": name in OFFICE,
                              "steps": 0, "hours": 0.0, "roles": []}
    for e in edges:
        if e["kind"] == "produces":
            nodes[e["to"]]["produced_by"].append(e["from"])
        elif e["kind"] == "feeds":
            nodes[e["from"]]["fed_to"].append(e["to"])
        elif e["kind"] == "uses":
            sysn, st = nodes[e["to"]], steps[e["from"]]
            sysn["steps"] += 1
            sysn["hours"] += st["hours"] or 0
            if st["role"] not in sysn["roles"]:
                sysn["roles"].append(st["role"])
    for n in nodes.values():
        if n["kind"] == "artefact":
            ends = [steps[s] for s in n["produced_by"] + n["fed_to"]]
            n["tasks"] = len({s["task"] for s in ends})
            n["roles"] = sorted({s["role"] for s in ends})
            n["teams"] = sorted({s["team"] for s in ends})
            # links two tasks: made in one, used in another
            made = {steps[s]["task"] for s in n["produced_by"]}
            used = {steps[s]["task"] for s in n["fed_to"]}
            n["links_tasks"] = any(u != m for u in used for m in made)
        if n["kind"] == "system":
            n["hours"] = r1(n["hours"])
    task_rows.sort(key=lambda t: (t["team"], t["role"], -(t["hours"] or 0)))
    return nodes, edges, task_rows, checks, raw_names


# ---------------------------------------------------------------- glue

def glue_steps(nodes, task_rows):
    tasks = {t["uid"]: t for t in task_rows}
    steps = [n for n in nodes.values() if n["kind"] == "step"]
    users = {}  # artefact -> roles whose steps take it in
    for s in steps:
        for name in s["inputs"]:
            users.setdefault(name, set()).add(s["role"])
    rows = []
    for s in steps:
        if s["today_means"] not in GLUE_MEANS:
            continue
        reasons = []
        business = [x for x in s["systems"] if x not in OFFICE]
        if len(business) >= 2:
            reasons.append("connects " + " + ".join(business))
        if s["cross"] in ("role", "team", "external"):
            target = nodes.get(s["handoff"], {}).get("name", s["handoff_to"])
            reasons.append({"role": f"hands off to {target}", "team": f"hands off to {target}, another team",
                            "external": "comes in from outside the company" if s["actor"] == "external"
                            else "hands off outside the company"}[s["cross"]])
        if not reasons:
            continue
        t = tasks[s["task"]]
        rows.append({
            "step": s["id"], "task": s["task"], "short": t["short"], "role": s["role"], "team": s["team"],
            "what": s["what"], "actor": s["actor"], "today_means": s["today_means"], "systems": s["systems"],
            "business_systems": business, "inputs": s["inputs"], "outputs": s["outputs"],
            "handoff_to": s["handoff_to"], "cross": s["cross"], "reasons": reasons,
            "feeds_roles": sorted({r for name in s["outputs"] for r in users.get(name, ()) if r != s["role"]}),
            "hours": s["hours"], "hours_saved": s["hours_saved"], "share_pct": s["share_pct"],
            "fate": s["fate"], "remaining_pct": s["remaining_pct"], "block": s["block"], "rung": s["rung"],
            "loop": s["loop"], "authority": s["authority"], "human_gate": s["human_gate"],
            "design": t["design"], "task_time_saved_pct": t["time_saved_pct"],
        })
    rows.sort(key=lambda r: -(r["hours"] or 0))
    for i, r in enumerate(rows, 1):
        r["rank"] = i
    return rows


# ---------------------------------------------------------------- blocks x rungs

def tally(steps):
    hours = sum(s["hours"] or 0 for s in steps)
    saved = sum(s["hours_saved"] or 0 for s in steps)
    return {"steps": len(steps), "hours": r1(hours), "hours_saved": r1(saved)}


def scope_summary(steps, scope_tasks, answered):
    """The building-block roll-up for one scope (a role, a team or all)."""
    hours = sum(s["hours"] or 0 for s in steps)
    saved = sum(s["hours_saved"] or 0 for s in steps)
    in_scope = [t for t in scope_tasks if t["in_scope"]]
    done = [t for t in scope_tasks if t["uid"] in answered]
    by_rung, by_block, matrix, by_means, by_fate, loops = {}, {}, [], {}, {}, {}
    for rung in RUNGS + sorted({s["rung"] for s in steps} - set(RUNGS), key=str):
        part = [s for s in steps if s["rung"] == rung]
        if part or rung in RUNGS:
            row = tally(part)
            row["share_hours"] = share(row["hours"], hours)
            row["share_saved"] = share(row["hours_saved"], saved)
            by_rung[rung] = row
    for block in BLOCKS + sorted({s["block"] for s in steps} - set(BLOCKS), key=str):
        part = [s for s in steps if s["block"] == block]
        if part:
            row = tally(part)
            row["share_hours"] = share(row["hours"], hours)
            row["share_saved"] = share(row["hours_saved"], saved)
            by_block[block] = row
            for rung in by_rung:
                cell = [s for s in part if s["rung"] == rung]
                if cell:
                    matrix.append(dict(tally(cell), block=block, rung=rung))
    for key, field, out in (("today_means", MEANS, by_means), ("fate", FATES, by_fate)):
        for value in field:
            part = [s for s in steps if s[key] == value]
            if part:
                out[value] = dict(tally(part), share_hours=share(sum(s["hours"] or 0 for s in part), hours))
    for s in steps:
        if s["rung"] in LOOP_RUNGS:
            purpose = ((s["loop"] or {}).get("purpose") or "unstated").strip().lower()
            row = loops.setdefault(purpose, {"steps": 0, "hours": 0.0, "hours_saved": 0.0, "gated": 0})
            row["steps"] += 1
            row["hours"] += s["hours"] or 0
            row["hours_saved"] += s["hours_saved"] or 0
            row["gated"] += 1 if s["human_gate"] else 0
    for row in loops.values():
        row["hours"], row["hours_saved"] = r1(row["hours"]), r1(row["hours_saved"])

    def group(rungs, field):
        return share(sum(by_rung[r][field] or 0 for r in rungs if r in by_rung), saved if field == "hours_saved" else hours)

    ladder, reach = [], []
    for r in RUNGS:
        reach.append(r)
        ladder.append({"upto": r, "share_saved": group(reach, "hours_saved"), "share_hours": group(reach, "hours")})
    return {
        "coverage": {
            "tasks_in_scope": len(in_scope), "tasks_answered": len(done),
            "hours_in_scope": r1(sum(t["hours"] for t in in_scope)), "hours_answered": r1(sum(t["hours"] for t in done)),
            "share_hours_answered": share(sum(t["hours"] for t in done if t["in_scope"]), sum(t["hours"] for t in in_scope)),
        },
        "totals": {"steps": len(steps), "hours": r1(hours), "hours_saved": r1(saved),
                   "time_saved_pct": round(100 * saved / hours) if hours else None,
                   "gated_steps": sum(1 for s in steps if s["human_gate"]),
                   "act_external_steps": sum(1 for s in steps if s["authority"] == "act_external")},
        "headline": {
            "no_model": {"share_saved": group(NO_MODEL, "hours_saved"), "share_hours": group(NO_MODEL, "hours")},
            "bounded_loop": {"share_saved": group({"deterministic_plus_loop"}, "hours_saved"),
                             "share_hours": group({"deterministic_plus_loop"}, "hours")},
            "deterministic_with_loops": {"share_saved": group(NO_MODEL | {"deterministic_plus_loop"}, "hours_saved"),
                                         "share_hours": group(NO_MODEL | {"deterministic_plus_loop"}, "hours")},
            "agent": {"share_saved": group({"agent"}, "hours_saved"), "share_hours": group({"agent"}, "hours")},
            "stays_manual": {"share_saved": group({"stays_manual"}, "hours_saved"), "share_hours": group({"stays_manual"}, "hours")},
        },
        "ladder": ladder,
        "by_rung": by_rung, "by_block": by_block, "matrix": matrix,
        "by_means": by_means, "by_fate": by_fate, "loops": loops,
    }


def blocks_rollup(teams, roles, tasks, nodes, answers):
    steps = [n for n in nodes.values() if n["kind"] == "step"]
    answered = {uid for uid in answers if uid in tasks}
    scopes = {"all": scope_summary(steps, list(tasks.values()), answered)}
    for tid in teams:
        scopes["team:" + tid] = scope_summary([s for s in steps if s["team"] == tid],
                                              [t for t in tasks.values() if t["team"] == tid], answered)
    for rid in roles:
        scopes["role:" + rid] = scope_summary([s for s in steps if s["role"] == rid],
                                              [t for t in tasks.values() if t["role"] == rid], answered)
    return scopes


# ---------------------------------------------------------------- self-consistency

def step_sim(a, b):
    what = jaccard(tokens(a.get("what")), tokens(b.get("what")))
    arts = jaccard({norm_artefact(x) for x in (a.get("inputs") or []) + (a.get("outputs") or [])},
                   {norm_artefact(x) for x in (b.get("inputs") or []) + (b.get("outputs") or [])})
    syst = jaccard({norm_system(x) for x in a.get("systems") or []}, {norm_system(x) for x in b.get("systems") or []})
    return 0.5 * what + 0.3 * arts + 0.2 * syst


def align(sa, sb, floor=0.15):
    """Order-preserving best match of two step lists (steps may be left unmatched)."""
    n, m = len(sa), len(sb)
    score = [[0.0] * (m + 1) for _ in range(n + 1)]
    move = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            score[i][j], move[i][j] = (score[i - 1][j], "a") if score[i - 1][j] >= score[i][j - 1] else (score[i][j - 1], "b")
            sim = step_sim(sa[i - 1], sb[j - 1])
            if sim >= floor and score[i - 1][j - 1] + sim > score[i][j]:
                score[i][j], move[i][j] = score[i - 1][j - 1] + sim, ("m", sim)
    pairs, i, j = [], n, m
    while i > 0 and j > 0:
        mv = move[i][j]
        if isinstance(mv, tuple):
            pairs.append((i - 1, j - 1, mv[1]))
            i, j = i - 1, j - 1
        elif mv == "a":
            i -= 1
        else:
            j -= 1
    return pairs[::-1]


def mix(steps, field):
    total = sum(s.get("share_pct") or 0 for s in steps) or 1
    out = {}
    for s in steps:
        out[s.get(field)] = out.get(s.get(field), 0) + (s.get("share_pct") or 0) / total
    return out


def overlap(p, q):
    return sum(min(p.get(k, 0), q.get(k, 0)) for k in set(p) | set(q))


def pearson(xs, ys):
    n = len(xs)
    if n < 3:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sx = sum((x - mx) ** 2 for x in xs) ** 0.5
    sy = sum((y - my) ** 2 for y in ys) ** 0.5
    return sxy / (sx * sy) if sx and sy else None


def rung_groups(rows, which):
    """Share of the compared tasks' freed hours by rung group in one run."""
    saved = {"no_model": 0.0, "bounded_loop": 0.0, "agent": 0.0, "stays_manual": 0.0}
    for row in rows:
        for s in row["_steps_" + which]:
            rung = s.get("rung")
            key = "no_model" if rung in NO_MODEL else "bounded_loop" if rung == "deterministic_plus_loop" else rung
            if key in saved:
                saved[key] += s["_saved"]
    total = sum(saved.values())
    return {k: share(v, total) for k, v in saved.items()}


def consistency(tasks, roles, first, second, labels, team="finance"):
    rows = []
    for uid in sorted(set(first) & set(second)):
        org = tasks.get(uid)
        if not org or org["team"] != team:
            continue
        a, b = first[uid], second[uid]
        sa, sb = a.get("steps") or [], b.get("steps") or []
        for ans in (a, b):
            for _i, s, _h, saved, _r in task_steps(ans, org)[0]:
                s["_saved"] = saved
        pairs = align(sa, sb)
        ta = sum(s.get("share_pct") or 0 for s in sa) or 100
        tb = sum(s.get("share_pct") or 0 for s in sb) or 100
        weight = lambda i, j: ((sa[i].get("share_pct") or 0) / ta + (sb[j].get("share_pct") or 0) / tb) / 2
        matched = sum(weight(i, j) for i, j, _ in pairs)
        rung_hit = sum(weight(i, j) for i, j, _ in pairs if sa[i].get("rung") == sb[j].get("rung"))
        block_hit = sum(weight(i, j) for i, j, _ in pairs if sa[i].get("block") == sb[j].get("block"))
        fate_hit = sum(weight(i, j) for i, j, _ in pairs if sa[i].get("fate") == sb[j].get("fate"))
        ts_a, ts_b = time_saved(a), time_saved(b)
        rows.append({
            "uid": uid, "role": org["role"], "short": a.get("short", ""), "hours": r1(org["hours"]),
            "time_saved_pct": {labels[0]: ts_a, labels[1]: ts_b, "diff": ts_b - ts_a},
            "hours_saved": {labels[0]: r1(org["hours"] * ts_a / 100), labels[1]: r1(org["hours"] * ts_b / 100)},
            "steps": {labels[0]: len(sa), labels[1]: len(sb), "matched": len(pairs)},
            "share_matched": r3(matched),
            "rung_agreement": r3(rung_hit), "block_agreement": r3(block_hit), "fate_agreement": r3(fate_hit),
            "rung_mix_overlap": r3(overlap(mix(sa, "rung"), mix(sb, "rung"))),
            "block_mix_overlap": r3(overlap(mix(sa, "block"), mix(sb, "block"))),
            "design_overlap": r3(jaccard(tokens(a.get("design")), tokens(b.get("design")))),
            "blocks_jaccard": r3(jaccard({s.get("block") for s in sa}, {s.get("block") for s in sb})),
            "systems_jaccard": r3(jaccard({norm_system(x) for s in sa for x in s.get("systems") or []},
                                          {norm_system(x) for s in sb for x in s.get("systems") or []})),
            "pairs": [{labels[0]: sa[i].get("id"), labels[1]: sb[j].get("id"), "similarity": r3(sim),
                       "what": [sa[i].get("what"), sb[j].get("what")],
                       "rung": [sa[i].get("rung"), sb[j].get("rung")], "block": [sa[i].get("block"), sb[j].get("block")],
                       "same_rung": sa[i].get("rung") == sb[j].get("rung"),
                       "same_block": sa[i].get("block") == sb[j].get("block")} for i, j, sim in pairs],
            "unmatched": {labels[0]: [sa[i].get("what") for i in range(len(sa)) if i not in {p[0] for p in pairs}],
                          labels[1]: [sb[j].get("what") for j in range(len(sb)) if j not in {p[1] for p in pairs}]},
            "design": {labels[0]: a.get("design", ""), labels[1]: b.get("design", "")},
            "_steps_a": sa, "_steps_b": sb,
        })
    summary = summarise_consistency(rows, labels, first, second)
    for row in rows:
        del row["_steps_a"], row["_steps_b"]
    by_role = {}
    for rid in sorted({r["role"] for r in rows}):
        part = [r for r in rows if r["role"] == rid]
        by_role[rid] = {"tasks": len(part),
                        "mean_abs_diff_time_saved": r1(sum(abs(r["time_saved_pct"]["diff"]) for r in part) / len(part)),
                        "rung_agreement": r3(sum(r["rung_agreement"] * r["hours"] for r in part) / (sum(r["hours"] for r in part) or 1)),
                        "block_agreement": r3(sum(r["block_agreement"] * r["hours"] for r in part) / (sum(r["hours"] for r in part) or 1))}
    for s in (first, second):
        for t in s.values():
            for st in t.get("steps") or []:
                st.pop("_saved", None)
    return {"summary": summary, "by_role": by_role, "tasks": rows}


def summarise_consistency(rows, labels, first, second):
    if not rows:
        return {"tasks": 0}
    hours = sum(r["hours"] for r in rows) or 1
    diffs = [abs(r["time_saved_pct"]["diff"]) for r in rows]
    xs = [r["time_saved_pct"][labels[0]] for r in rows]
    ys = [r["time_saved_pct"][labels[1]] for r in rows]
    weighted = lambda key: r3(sum(r[key] * r["hours"] for r in rows) / hours)
    # chance level: one run's design against the other run's designs of different tasks
    chance = [jaccard(tokens(first[a["uid"]].get("design")), tokens(second[b["uid"]].get("design")))
              for a in rows for b in rows if a["uid"] != b["uid"]]
    return {
        "tasks": len(rows), "hours": r1(sum(r["hours"] for r in rows)),
        "time_saved": {
            "mean_" + labels[0]: r1(sum(xs) / len(xs)), "mean_" + labels[1]: r1(sum(ys) / len(ys)),
            "mean_abs_diff": r1(sum(diffs) / len(diffs)), "median_abs_diff": sorted(diffs)[len(diffs) // 2],
            "within_10_points": share(sum(1 for d in diffs if d <= 10), len(diffs)),
            "pearson_r": r3(pearson(xs, ys)),
            "hours_saved_" + labels[0]: r1(sum(r["hours_saved"][labels[0]] for r in rows)),
            "hours_saved_" + labels[1]: r1(sum(r["hours_saved"][labels[1]] for r in rows)),
        },
        "steps": {"mean_" + labels[0]: r1(sum(r["steps"][labels[0]] for r in rows) / len(rows)),
                  "mean_" + labels[1]: r1(sum(r["steps"][labels[1]] for r in rows) / len(rows)),
                  "same_count": share(sum(1 for r in rows if r["steps"][labels[0]] == r["steps"][labels[1]]), len(rows)),
                  "share_matched": weighted("share_matched")},
        "rung_agreement": weighted("rung_agreement"), "block_agreement": weighted("block_agreement"),
        "fate_agreement": weighted("fate_agreement"),
        "rung_mix_overlap": weighted("rung_mix_overlap"), "block_mix_overlap": weighted("block_mix_overlap"),
        "design_overlap": r3(sum(r["design_overlap"] for r in rows) / len(rows)),
        "design_overlap_chance": r3(sum(chance) / len(chance)) if chance else None,
        "rung_groups_saved": {labels[0]: rung_groups(rows, "a"), labels[1]: rung_groups(rows, "b")},
    }


# ---------------------------------------------------------------- main

def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--variant", default="v2")
    parser.add_argument("--repeat", default="v2-repeat")
    parser.add_argument("--model", default="opus")
    args = parser.parse_args()

    teams, roles, tasks = load_org()
    problems = []
    answers, files = load_answers(args.variant, args.model, problems)
    repeat, repeat_files = load_answers(args.repeat, args.model, problems)
    nodes, edges, task_rows, checks, raw_names = build_graph(teams, roles, tasks, answers)
    stamp = time.strftime("%Y-%m-%d %H:%M %Z")
    source = f"runs/{args.variant}/{args.model}"
    steps = [n for n in nodes.values() if n["kind"] == "step"]
    kinds = {}
    for n in nodes.values():
        kinds[n["kind"]] = kinds.get(n["kind"], 0) + 1
    merged = {k: sorted(v) for k, v in raw_names.items() if len(v) > 1}

    graph = {
        "_meta": {
            "generated": stamp, "source": source, "files": files, "tasks": len(task_rows),
            "tasks_in_scope": sum(1 for t in tasks.values() if t["in_scope"]), "nodes": kinds,
            "edges": {k: sum(1 for e in edges if e["kind"] == k) for k in ("produces", "feeds", "handoff", "uses")},
            "hours": "task hours = hours per FTE x role FTE x task share; step hours = task hours x step share; "
                     "hours saved = step hours x (1 - remaining_pct / 100)",
            "artefact_names": "lower case, last word singular (except " + ", ".join(sorted(KEEP_PLURAL)) +
                              "), then the alias table",
            "aliases": ALIASES, "system_aliases": SYSTEM_ALIASES, "office_tools": sorted(OFFICE),
            "merged_names": merged,
            "checks": {k: {"count": len(v), "examples": v[:5]} for k, v in sorted(checks.items(), key=lambda kv: -len(kv[1]))},
            "problems": problems,
        },
        "teams": teams,
        "tasks": task_rows,
        "nodes": sorted(nodes.values(), key=lambda n: (["step", "artefact", "system", "role"].index(n["kind"]), n["id"])),
        "edges": edges,
    }
    write("graph.json", graph)

    glue = glue_steps(nodes, task_rows)
    glue_summary = {}
    for scope, part in [("all", glue)] + [("team:" + t, [g for g in glue if g["team"] == t]) for t in teams]:
        all_hours = sum(s["hours"] or 0 for s in steps if scope == "all" or s["team"] == scope[5:])
        gh = sum(g["hours"] or 0 for g in part)
        glue_summary[scope] = {
            "steps": len(part), "hours": r1(gh), "hours_saved": r1(sum(g["hours_saved"] or 0 for g in part)),
            "share_of_answered_hours": share(gh, all_hours),
            "by_means": {m: r1(sum(g["hours"] or 0 for g in part if g["today_means"] == m)) for m in sorted(GLUE_MEANS)},
            "by_rung": {r: r1(sum(g["hours"] or 0 for g in part if g["rung"] == r)) for r in RUNGS},
            "by_cross": {c: sum(1 for g in part if g["cross"] == c) for c in ("same_role", "role", "team", "external", "system", "none")},
        }
    write("glue.json", {
        "_meta": {"generated": stamp, "source": source,
                  "rule": "today_means is spreadsheet, email_chat or document, and the step either touches two or "
                          "more business systems (office tools not counted: " + ", ".join(sorted(OFFICE)) +
                          ") or hands its output to another role, another team or an outside party",
                  "hours": "role FTE x hours per FTE x task share x step share"},
        "summary": glue_summary, "steps": glue,
    })

    scopes = blocks_rollup(teams, roles, tasks, nodes, answers)
    write("blocks.json", {
        "_meta": {"generated": stamp, "source": source, "rungs": RUNGS, "blocks": BLOCKS,
                  "groups": {"no_model": sorted(NO_MODEL), "bounded_loop": ["deterministic_plus_loop"],
                             "deterministic_with_loops": sorted(NO_MODEL) + ["deterministic_plus_loop"],
                             "agent": ["agent"], "stays_manual": ["stays_manual"]},
                  "note": "share_saved is the share of the scope's freed hours; share_hours the share of its answered "
                          "hours today. Coverage counts automate and amplify tasks; unanswered tasks are left out "
                          "of every total, not estimated."},
        "scopes": scopes,
    })

    labels = (args.variant, args.repeat)
    result = consistency(tasks, roles, answers, repeat, labels)
    finance_in_scope = sum(1 for t in tasks.values() if t["team"] == "finance" and t["in_scope"])
    write("consistency.json", {
        "_meta": {"generated": stamp, "runs": [f"runs/{l}/{args.model}" for l in labels],
                  "files": {labels[0]: files, labels[1]: repeat_files}, "team": "finance",
                  "finance_tasks_in_scope": finance_in_scope,
                  "method": "steps aligned in order by similarity (0.5 words of 'what', 0.3 artefacts, 0.2 systems; "
                            "pairs under 0.15 left unmatched); agreement = share of the task's time (mean of both "
                            "runs' step shares) on matched steps with the same rung or block, unmatched steps count "
                            "as disagreement; mix overlap = sum over rungs (blocks) of the smaller time share; design "
                            "overlap = word Jaccard of the two design texts, with the chance level from pairs of "
                            "different tasks; hour-weighted means"},
        **result,
    })

    every = scopes["all"]
    head = every["headline"]
    print(f"graph: {files} files, {len(task_rows)} of {graph['_meta']['tasks_in_scope']} tasks, {kinds}")
    print(f"hours answered {every['totals']['hours']} h, freed {every['totals']['hours_saved']} h "
          f"({every['totals']['time_saved_pct']}%); of freed hours no model {head['no_model']['share_saved']}, "
          f"+loop {head['deterministic_with_loops']['share_saved']}, agent {head['agent']['share_saved']}")
    print(f"glue: {len(glue)} steps, {glue_summary['all']['hours']} h; checks: "
          + ", ".join(f"{k} {len(v)}" for k, v in sorted(checks.items(), key=lambda kv: -len(kv[1]))[:6]))
    s = result["summary"]
    print(f"consistency: {s.get('tasks', 0)} finance tasks in both runs ({repeat_files} repeat files)")
    for p in problems:
        print("problem:", p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
