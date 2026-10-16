"""
Expand config/teams.json into data/teams.json: every role as a bundle of O*NET tasks with
an estimated share of the role's time, the task's class (automate, amplify, machines,
human) from the AI-ISCO task scores, its work activities and the role's software.

Reads the AI-ISCO build (site/onet/occ/<code>.json and data/onet_tasks.json) from
../../../AI-ISCO, or from $AIISCO. Nothing here calls a model.

Time share is an assumption the self-service flow would let a person correct: a task's
weight is its O*NET importance (1-5, 3 when unrated) times a compressed frequency scale
(yearly 1 ... hourly 10), and a role's hours are split in proportion to the weights.

Usage:
    python3 tools/build_teams.py
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
AIISCO = os.environ.get("AIISCO", os.path.expanduser("~/Projects/AI-ISCO"))
CLASS_NAMES = {"S": "automate", "A": "amplify", "M": "machines", "I": "human", None: "unscored"}
#: Weight per O*NET frequency category 1 (yearly or less) .. 7 (hourly or more).
FREQUENCY_WEIGHT = [1, 1.5, 2.5, 4, 6, 8, 10]
MAX_APPS = 12


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def frequency_weight(mean):
    """Interpolated weight for a mean frequency category, or the middle when unrated."""
    if mean is None:
        return FREQUENCY_WEIGHT[3]
    low = int(mean)
    if low >= 7:
        return FREQUENCY_WEIGHT[-1]
    frac = mean - low
    return FREQUENCY_WEIGHT[low - 1] + frac * (FREQUENCY_WEIGHT[low] - FREQUENCY_WEIGHT[low - 1])


def occupation(code, cache={}):
    if code not in cache:
        cache[code] = load(os.path.join(AIISCO, "site", "onet", "occ", f"{code}.json"))
    return cache[code]


def role_tasks(spec, frequencies):
    tasks = []
    for code, wanted in spec["tasks"].items():
        occ = occupation(code)
        by_id = {int(t["id"]): t for t in occ["tasks"]}
        ids = list(by_id) if wanted == "all" else wanted
        for task_id in ids:
            if task_id not in by_id:
                sys.exit(f"ERROR: task {task_id} is not a task of {code} {occ['title']}")
            t = by_id[task_id]
            freq = frequencies.get((code, str(task_id)))
            tasks.append({
                "uid": f"{code}:{task_id}", "onet_code": code, "onet_title": occ["title"],
                "task_id": task_id, "statement": t["statement"], "type": t["type"],
                "importance": t["importance"], "frequency": freq, "frequency_label": t["frequency"],
                "class": t.get("class"), "class_name": CLASS_NAMES[t.get("class")],
                "ai_does_nearly_all": t.get("sub"), "clear_gain_most": t.get("comp"),
                "clear_gain_part": t.get("comp_part"), "machines_nearly_all": t.get("mech"),
                "mode": t.get("mode"), "deployment": t.get("deployment"), "dwas": t["dwas"],
                "weight": (t["importance"] or 3.0) * frequency_weight(freq),
            })
    return tasks


def role_apps(spec):
    """The software O*NET lists for the role's occupations: in demand, then hot, then the rest."""
    seen, apps = set(), []
    for code in spec["tasks"]:
        for group in occupation(code).get("computer", []):
            for item in group["items"]:
                if item["name"] not in seen:
                    seen.add(item["name"])
                    apps.append({"name": item["name"], "category": item["category"],
                                 "in_demand": item["in_demand"], "hot": item["hot"],
                                 "postings_pct": item["pct"]})
    apps.sort(key=lambda a: (not a["in_demand"], -(a["postings_pct"] or 0), not a["hot"], a["name"]))
    return apps[:MAX_APPS]


def hours_by_class(tasks, key="hours_per_fte", fte=1):
    out = {name: 0.0 for name in CLASS_NAMES.values()}
    for t in tasks:
        out[t["class_name"]] += t[key] * fte
    return {k: round(v, 1) for k, v in out.items() if v}


def build():
    company = load(os.path.join(ROOT, "config", "company.json"))
    config = load(os.path.join(ROOT, "config", "teams.json"))
    frequencies = {(t["code"], t["task_id"]): t["frequency"]
                   for t in load(os.path.join(AIISCO, "data", "onet_tasks.json"))}
    hours = company["hours_per_fte"]
    teams = []
    for team_spec in config["teams"]:
        roles = []
        for spec in team_spec["roles"]:
            tasks = role_tasks(spec, frequencies)
            total = sum(t["weight"] for t in tasks)
            for t in tasks:
                t["share"] = round(t["weight"] / total, 4)
                t["hours_per_fte"] = round(t["weight"] / total * hours, 1)
                del t["weight"]
            tasks.sort(key=lambda t: -t["share"])
            role_hours = spec["fte"] * hours
            roles.append({
                "id": spec["id"], "title": spec["title"], "fte": spec["fte"],
                "cost_per_hour": spec["cost_per_hour"], "hours": role_hours,
                "annual_cost": round(role_hours * spec["cost_per_hour"]),
                "onet": [{"code": c, "title": occupation(c)["title"]} for c in spec["tasks"]],
                "apps": role_apps(spec), "tasks": tasks,
                "hours_by_class": hours_by_class(tasks, fte=spec["fte"]),
            })
        info = company["teams"][team_spec["id"]]
        team_hours = {}
        for role in roles:
            for name, value in role["hours_by_class"].items():
                team_hours[name] = round(team_hours.get(name, 0) + value, 1)
        teams.append({"id": team_spec["id"], **info,
                      "fte": sum(r["fte"] for r in roles),
                      "annual_cost": sum(r["annual_cost"] for r in roles),
                      "hours_by_class": team_hours, "roles": roles})
    out = {"company": {k: v for k, v in company.items() if k != "teams"}, "teams": teams}
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    with open(os.path.join(ROOT, "data", "teams.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    for team in teams:
        total = sum(team["hours_by_class"].values())
        mix = ", ".join(f"{k} {v / total:.0%}" for k, v in team["hours_by_class"].items())
        print(f"{team['name']}: {team['fte']} FTE, {sum(len(r['tasks']) for r in team['roles'])} tasks, "
              f"EUR {team['annual_cost']:,}/yr; hours: {mix}")
        for role in team["roles"]:
            t = sum(role["hours_by_class"].values())
            print(f"  {role['title']:<45} {role['fte']} FTE {len(role['tasks']):>3} tasks  "
                  + " ".join(f"{k[:4]} {v / t:.0%}" for k, v in role["hours_by_class"].items()))


if __name__ == "__main__":
    build()
