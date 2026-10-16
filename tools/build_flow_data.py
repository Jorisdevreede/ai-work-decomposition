#!/usr/bin/env python3
"""Build compact, O*NET-weighted flow data. No API calls or dependencies.

Run from anywhere: python3 tools/build_flow_data.py
The existing job-view export supplies v3 graphs and texts. Every O*NET task for
each exported job is retained, even if its graph is unavailable.
"""
import argparse
import json
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
FREQUENCY_WEIGHTS = (1, 1.5, 2.5, 4, 6, 8, 10)


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def frequency_weight(category):
    if category is None:
        return 4
    category = min(7, max(1, float(category)))
    lower = math.floor(category)
    upper = min(7, lower + 1)
    return FREQUENCY_WEIGHTS[lower - 1] + (category - lower) * (
        FREQUENCY_WEIGHTS[upper - 1] - FREQUENCY_WEIGHTS[lower - 1])


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n",
                         encoding="utf-8")
    temporary.replace(path)


def build(onet_path):
    facts = {}
    for task in read(onet_path):
        facts.setdefault(task["code"], {})[f"{task['code']}:{task['task_id']}"] = task
    source = ROOT / "prototypes/data/jobs"
    output = ROOT / "prototypes/flow/data/jobs"
    index, build_notes = [], []
    for item in read(source / "index.json")["jobs"]:
        code = item["code"]
        original = read(source / f"{code}.json")
        graphs = {task["uid"]: task for task in original["tasks"]}
        job_facts = facts.get(code, {})
        if not job_facts:
            build_notes.append(f"{code}: O*NET facts unavailable; default weights used.")
        tasks = []
        for uid in sorted(set(graphs) | set(job_facts), key=lambda uid: int(uid.rsplit(":", 1)[1])):
            fact = job_facts.get(uid, {})
            task = dict(graphs.get(uid, {"uid": uid, "steps": []}))
            importance = fact.get("importance")
            frequency = fact.get("frequency")
            weight = frequency_weight(frequency)
            task.update(importance=importance, frequency=frequency, frequency_weight=weight,
                        task_weight=(3 if importance is None else importance) * weight,
                        graph_available=bool(task.get("steps")))
            task["statement"] = fact.get("statement") or task.get("statement") or task.get("short", uid)
            task.setdefault("short", task["statement"])
            tasks.append(task)
        total_weight = sum(task["task_weight"] for task in tasks)
        if total_weight <= 0:
            raise ValueError(f"{code}: nonpositive task weights")
        for task in tasks:
            task["task_share"] = task["task_weight"] / total_weight
        slots = {slot for task in tasks for step in task["steps"] for slot in step.get("systems", [])}
        slots.update(re.findall(r"\{([A-Z][A-Z_]+)\}", json.dumps(tasks)))
        graph_count = sum(task["graph_available"] for task in tasks)
        record = {"code": code, "title": original["title"], "function": original.get("function", "Other"),
                  "task_count": len(tasks), "graph_task_count": graph_count,
                  "step_count": sum(len(task["steps"]) for task in tasks),
                  "expected_task_count": len(job_facts) or original.get("expected_task_count"),
                  "slots_used": sorted(slots)}
        notes = list(original.get("check_notes", []))
        if graph_count < len(tasks):
            notes.append({"batch": "flow builder", "note": f"{len(tasks) - graph_count} tasks have no graph; their time stays human."})
        detail = {**record, "tasks": tasks, "role_batches": original.get("role_batches", []),
                  "check_notes": notes, "sources": original.get("sources", [])}
        write(output / f"{code}.json", detail)
        index.append(record)
    write(output / "index.json", {"version": 1, "weighting": "importance × interpolated frequency weight; all O*NET tasks per job",
                                  "jobs": index, "build_notes": build_notes})
    print(f"Built {len(index)} jobs, {sum(j['task_count'] for j in index)} tasks, "
          f"{sum(j['step_count'] for j in index)} source steps; {len(build_notes)} build notes.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--onet-tasks", type=Path, default=Path("~/Projects/AI-ISCO/data/onet_tasks.json").expanduser())
    args = parser.parse_args()
    build(args.onet_tasks)
