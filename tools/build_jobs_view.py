#!/usr/bin/env python3
"""Build the static job view from completed v3 Sol batches. Standard library only.

Run: python3 tools/build_jobs_view.py
Rerun as batches land. No model or network calls. O*NET statements/classes come
from the existing task-table export; --onet-dir can supply the original data.
Task weights are O*NET importance × interpolated frequency weight (a proxy,
not a measured time allocation). Default facts: ~/Projects/AI-ISCO/data.
Hours in summaries are normalized to 100 baseline hours, never annual estimates.
"""
import argparse
from collections import Counter, defaultdict
import json
import math
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
CLASSES = {"S": "automate", "A": "amplify", "M": "machines", "I": "human"}


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


FREQUENCY_WEIGHTS = (1, 1.5, 2.5, 4, 6, 8, 10)
FREQUENCY_LABELS = {"Yearly or less": 1, "More than yearly": 2, "More than monthly": 3,
                    "More than weekly": 4, "Daily": 5, "Several times daily": 6, "Hourly or more": 7}
WEIGHTING = "O*NET importance × interpolated frequency weight; normalized over loaded tasks; estimated time proxy"


def frequency_weight(value):
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value) or not 1 <= value <= 7:
        return 4.0
    lower = math.floor(value)
    if lower == 7:
        return 10.0
    return FREQUENCY_WEIGHTS[lower - 1] + (value - lower) * (FREQUENCY_WEIGHTS[lower] - FREQUENCY_WEIGHTS[lower - 1])


def task_weight(importance=None, frequency=None):
    if not isinstance(importance, (int, float)) or isinstance(importance, bool) or not math.isfinite(importance) or importance <= 0:
        importance = 3.0
    return importance * frequency_weight(frequency)


def task_facts(root, onet_dir=None):
    table = read(root / "prototypes/data/task-table.json") if (root / "prototypes/data/task-table.json").exists() else None
    facts = {}
    if table:
        occupations = table["meta"]["o"]
        frequencies = table["meta"]["f"]
        for task in table["rows"]:
            frequency_label = frequencies[task["f"]] if task.get("f") is not None else None
            # Table stores only the rounded frequency label. Original numeric facts override below.
            frequency = FREQUENCY_LABELS.get(frequency_label)
            facts[f"{occupations[task['o']][0]}:{task['i']}"] = {
                "statement": task["t"], "class": CLASSES.get(task.get("c"), "unscored"),
                "importance": task.get("im"), "frequency": frequency,
                "frequency_label": frequency_label, "weight_source": "task table frequency label fallback"}
    onet_dir = onet_dir or Path.home() / "Projects/AI-ISCO/data"
    source = onet_dir / "onet_tasks.json"
    scores_path = onet_dir / "task_scores_v2.json"
    scores = {s["uri"]: s for s in read(scores_path)} if scores_path.exists() else {}
    if source.exists():
        for task in read(source):
            uid = f"{task['code']}:{task['task_id']}"
            previous = facts.get(uid, {})
            facts[uid] = {"statement": task["statement"],
                          "class": CLASSES.get(scores.get(task["uri"], {}).get("class"), previous.get("class", "unscored")),
                          "importance": task.get("importance"), "frequency": task.get("frequency"),
                          "frequency_label": task.get("frequency_label"), "weight_source": "O*NET numeric facts"}
    elif not table:
        raise FileNotFoundError("No O*NET numeric facts or task-table fallback available")
    for fact in facts.values():
        fact["frequency_weight"] = frequency_weight(fact["frequency"])
        fact["task_weight"] = task_weight(fact["importance"], fact["frequency"])
    return facts


def task_shares(tasks):
    weights = [task.get("task_weight", task_weight(task.get("importance"), task.get("frequency"))) for task in tasks]
    total = sum(weights)
    return [weight / total for weight in weights] if total else []


def saved_pct(task):
    steps = task.get("steps", [])
    total = sum(s["share_pct"] for s in steps)
    if not total:
        return None
    return round(sum(s["share_pct"] * (100 - s["remaining_pct"]) for s in steps) / total, 4)


def summary(tasks):
    fates = defaultdict(lambda: {"baseline_hours": 0, "remaining_hours": 0})
    blocks, rungs = Counter(), Counter()
    for task, task_share in zip(tasks, task_shares(tasks)):
        steps = task.get("steps", [])
        share_total = sum(s["share_pct"] for s in steps)
        for step in steps:
            hours = 100 * step["share_pct"] / share_total * task_share if share_total else 0
            fates[step["fate"]]["baseline_hours"] += hours
            fates[step["fate"]]["remaining_hours"] += hours * step["remaining_pct"] / 100
            blocks[step["block"]] += 1
            rungs[step["rung"]] += 1
    total = sum(rungs.values())
    return {
        "basis": "100 baseline hours; " + WEIGHTING + "; step shares normalized within each task",
        "hours_by_fate": {k: {n: round(v, 4) for n, v in values.items()} for k, values in sorted(fates.items())},
        "steps_by_block": dict(sorted(blocks.items())), "steps_by_rung": dict(sorted(rungs.items())),
        "step_count": total,
        "step_shares_pct": {k: round(100 * count / total, 4) if total else 0 for k, count in {
            "deterministic": rungs["deterministic"], "deterministic_plus_loop": rungs["deterministic_plus_loop"],
            "deterministic_combined": rungs["deterministic"] + rungs["deterministic_plus_loop"], "agent": rungs["agent"]
        }.items()},
    }


def build(root=ROOT, onet_dir=None):
    slots_path = root / "config/system-slots.json"
    slots = read(slots_path)["slots"]
    configured = {j["code"]: j for j in read(root / "config/jobs-batch1.json")["jobs"]}
    batches, pending = defaultdict(list), []
    for path in sorted((root / "runs/v3/sol").glob("*__*.json")):
        if not re.fullmatch(r"\d{2}-\d{4}\.\d{2}__\d+\.json", path.name):
            continue
        try:
            answer = read(path)
        except (OSError, json.JSONDecodeError):
            pending.append(f"{path.name}: unreadable or still being written; rerun the builder")
            continue
        code = path.stem.split("__")[0]
        if answer.get("job_code") != code or not isinstance(answer.get("tasks"), list):
            pending.append(f"{path.name}: missing tasks or mismatched job code")
            continue
        batches[code].append((int(path.stem.split("__")[1]), path, answer))
    facts = task_facts(root, onet_dir) if batches else {}
    output = root / "prototypes/data/jobs"
    output.mkdir(parents=True, exist_ok=True)
    index = []
    for code, parts in sorted(batches.items()):
        tasks, roles, notes, sources = {}, [], [], []
        job = dict(configured.get(code, {}))
        for _, path, answer in sorted(parts):
            meta = answer.get("_meta", {})
            job.update(meta.get("job", {}))
            sources.append(str(path.relative_to(root)))
            batch_notes = [str(n) for n in meta.get("checks", [])]
            notes.extend({"batch": path.name, "note": n} for n in batch_notes)
            if answer.get("role"):
                roles.append({"batch": path.name, **answer["role"]})
            for original in answer["tasks"]:
                uid = original.get("uid", "")
                if not uid.startswith(code + ":") or not original.get("steps"):
                    notes.append({"batch": path.name, "note": f"Skipped invalid task {uid or '(missing uid)'}"})
                    continue
                task = dict(original)
                task.update(facts.get(uid, {"statement": None, "class": "unscored"}))
                task["check_notes"] = [n for n in batch_notes if uid in n]
                if not task["statement"]:
                    task["check_notes"].append("O*NET statement unavailable; showing the model's short description.")
                total = sum(s["share_pct"] for s in task["steps"])
                if total != 100:
                    task["check_notes"].append(f"Step shares total {total}%; normalized to 100% for roll-ups.")
                task["time_saved_pct"] = saved_pct(task)
                task["source_batch"] = path.name
                if uid in tasks:
                    notes.append({"batch": path.name, "note": f"Duplicate {uid}; last numbered batch used once."})
                tasks[uid] = task
        ordered = sorted(tasks.values(), key=lambda t: (int(t["uid"].split(":")[-1]) if t["uid"].split(":")[-1].isdigit() else 0, t["uid"]))
        if not ordered:
            pending.extend(f"{n['batch']}: {n['note']}" for n in notes)
            continue
        text = json.dumps(ordered, ensure_ascii=False)
        used = set(re.findall(r"\{([A-Z][A-Z_]+)\}", text))
        used.update(s for t in ordered for step in t["steps"] for s in step.get("systems", []))
        for slot in sorted(used - slots.keys()):
            notes.append({"batch": "builder", "note": f"Unknown system slot {slot}"})
        for task, share in zip(ordered, task_shares(ordered)):
            task["task_share_pct"] = round(100 * share, 8)
        saved = [t["time_saved_pct"] for t in ordered if t["time_saved_pct"] is not None]
        record = {"code": code, "title": job.get("title", code), "function": job.get("function", "Other"),
                  "task_count": len(ordered), "expected_task_count": job.get("tasks"),
                  "time_saved_pct": round(sum(t["time_saved_pct"] * share for t, share in zip(ordered, task_shares(ordered))), 4) if len(saved) == len(ordered) else None,
                  "weighting": WEIGHTING, "slots_used": sorted(used), "batch_count": len(parts),
                  "workflows": sorted({s["workflow"] for t in ordered for s in t["steps"] if s.get("workflow")})}
        detail = {**record, "tasks": ordered, "role_batches": roles, "check_notes": notes,
                  "sources": sources, "summary": summary(ordered)}
        write(output / f"{code}.json", detail)
        index.append(record)
    # Copy the supplied profiles exactly; do not invent products or defaults.
    for path in (slots_path, root / "config/company-noordhaven.json"):
        shutil.copyfile(path, output.parent / path.name)
    write(output / "index.json", {"version": 1, "source": "runs/v3/sol", "weighting": WEIGHTING,
                                   "jobs": index, "build_notes": pending})
    print(f"Built {len(index)} jobs, {sum(j['task_count'] for j in index)} tasks; {len(pending)} build notes.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--onet-dir", type=Path, help="Directory containing onet_tasks.json and task_scores_v2.json")
    args = parser.parse_args()
    build(onet_dir=args.onet_dir)
