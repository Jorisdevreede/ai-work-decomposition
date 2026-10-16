#!/usr/bin/env python3
"""Build the compact, static O*NET explorer. Python standard library only.

Run from any directory. --isco-dir can override the default sibling source repo.
Choice answers use the highest supplied probability; ties prefer Jev's choice.
No missing answers or splits are imputed. LLM estimates are retained as supplied.
"""
import argparse
import ast
import collections
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LABELS = {
    "core_work": "Core work", "shape_main": "Main shape",
    "shape_support": "Supporting shape", "model_needed": "Model needed at run time",
    "comp_part": "Complementarity (part)", "accountable": "Accountability",
}


def read(path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    return path.stat().st_size


def label(key):
    return LABELS.get(key, key.replace("_", " ").capitalize())


def group_names(isco):
    # Read the constant without importing another project's build script.
    tree = ast.parse((isco / "build_onet_site.py").read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == "MAJOR_GROUPS" for t in node.targets):
            return ast.literal_eval(node.value)
    raise ValueError("MAJOR_GROUPS was not found")


def build(isco):
    facts = read(isco / "data/onet_tasks.json")
    scores = {r["uri"]: r for r in read(isco / "data/task_scores_v2.json")}
    anatomy_rows = read(ROOT / "data/jev_anatomy_v2_onet.json")
    anatomy = {r["key"]: r["answers"] for r in anatomy_rows}
    shares = {r["key"]: r for r in read(ROOT / "data/jev_shares_onet.json")}
    consensus = read(ROOT / "data/synthesis/v1/tasks.json")["tasks"]
    uids = {f"{r['code']}:{r['task_id']}" for r in facts}
    if len(facts) != 18838 or len(uids) != len(facts):
        raise ValueError("Expected 18,838 unique O*NET tasks")
    if set(anatomy) != uids:
        raise ValueError("Anatomy coverage does not match O*NET")

    questions = []
    keys = list(anatomy_rows[0]["answers"])
    keys += sorted({k for a in anatomy.values() for k in a} - set(keys))
    for key in keys:
        samples = [a[key] for a in anatomy.values() if key in a]
        boolean = "yes" in samples[0]
        options = list(dict.fromkeys(o for a in samples for o in a.get("probs", {})))
        questions.append({"k": key, "l": label(key), "b": boolean, "o": options})

    occupations = sorted({(r["code"], r["occupation"], r["code"][:2]) for r in facts})
    occupation_index = {o[0]: i for i, o in enumerate(occupations)}
    kinds = list(dict.fromkeys(k for r in shares.values() for k in r.get("kind", {})))
    means = list(dict.fromkeys(k for r in shares.values() for k in r.get("means", {})))
    graphs = collections.defaultdict(list)
    for path in sorted((ROOT / "runs/v2/opus").glob("*.json")):
        role = path.stem.rsplit("__", 1)[0]
        for task in read(path).get("tasks", []):
            if task["uid"] not in uids:
                raise ValueError(f"Unknown graph uid in {path}: {task['uid']}")
            graphs[task["uid"]].append({"role": role, **task})
    roles = sorted({g["role"] for gs in graphs.values() for g in gs})
    rungs = sorted({step["rung"] for gs in graphs.values() for g in gs for step in g.get("steps", [])})
    patterns = sorted({t["consensus"]["pattern"] for t in consensus.values() if t.get("consensus")})
    task_types = sorted({r["task_type"] for r in facts})
    frequencies = sorted({r.get("frequency_label") for r in facts if r.get("frequency_label")})
    rows, detail = [], collections.defaultdict(dict)
    for task in facts:
        uid = f"{task['code']}:{task['task_id']}"
        score = scores.get(task["uri"], {})
        a, probabilities = [], []
        for question in questions:
            answer = anatomy[uid].get(question["k"])
            if not answer:
                a.append(None)
                probabilities.append(None)
            elif question["b"]:
                a.append(None)
                probabilities.append(round(answer["yes"], 2))
            else:
                probs = answer["probs"]
                top = max(probs, key=lambda k: (probs[k], k == answer.get("choice")))
                a.append(question["o"].index(top))
                probabilities.append(round(probs[top], 2))
        row = {"o": occupation_index[task["code"]], "i": str(task["task_id"]),
               "t": task["statement"], "y": task_types.index(task["task_type"]),
               "im": task.get("importance"),
               "f": frequencies.index(task["frequency_label"]) if task.get("frequency_label") else None,
               "c": score.get("class"),
               "s": [round(score[k], 2) if score.get(k) is not None else None for k in ("sub", "comp", "comp_part", "mech")],
               "a": a, "p": probabilities}
        split = shares.get(uid, {})
        for short, name, columns in (("k", "kind", kinds), ("m", "means", means)):
            if split.get(name):
                row[short] = [round(split[name][k], 2) if k in split[name] else None for k in columns]
        if uid in graphs:
            row["l"] = [{"r": roles.index(g["role"]), "t": g.get("time_saved_pct"),
                         "s": g.get("speedup"), "n": len(g.get("steps", [])),
                         "u": sorted({rungs.index(s["rung"]) for s in g.get("steps", [])})} for g in graphs[uid]]
            detail[task["code"]][uid] = graphs[uid]
        v1 = consensus.get(uid, {}).get("consensus")
        if v1:
            row["v"] = [patterns.index(v1["pattern"]), v1.get("time_saved_pct"), v1.get("speedup"), v1.get("n")]
        rows.append(row)
    output = ROOT / "prototypes/data"
    detail_sizes = {code: write(output / "task-detail" / f"{code}.json", data) for code, data in sorted(detail.items())}
    meta = {"version": 1, "rows": len(rows), "q": questions, "o": occupations,
            "g": group_names(isco), "k": kinds, "m": means, "r": roles, "u": rungs,
            "v": patterns, "y": task_types, "f": frequencies,
            "fields": {"o": "occupation index", "i": "task id", "t": "statement", "y": "task type index",
                       "im": "importance", "f": "frequency index", "c": "S/A/M/I class",
                       "s": "sub, comp, comp_part, mech", "a": "question choice indices; null for yes/no",
                       "p": "top choice probabilities or yes probabilities", "k": "kind percentages", "m": "means percentages",
                       "l": "graph summaries: role, time saved %, speedup, step count, rung indices",
                       "v": "v1 consensus: pattern index, time saved %, speedup, model count"},
            "coverage": {"anatomy": len(anatomy), "questions": len(questions),
                         "kind": sum("k" in r for r in rows), "means": sum("m" in r for r in rows),
                         "llm_tasks": len(graphs), "llm_graphs": sum(map(len, graphs.values())),
                         "consensus": sum("v" in r for r in rows)},
            "notes": ["Source anatomy has 22 questions per task; the order describes 30.",
                      "Top choice is the maximum supplied probability; ties prefer the source choice.",
                      "Yes/no values show the probability of yes. Model-needed bands use a 0.5 threshold.",
                      "Splits are supplied estimates. Missing splits are not imputed.",
                      "LLM v2 graphs and v1 consensus are estimates for the fictional teams, not measured savings."]}
    size = write(output / "task-table.json", {"meta": meta, "rows": rows})
    print(f"Rows: {len(rows):,}; occupations: {len(occupations):,}; anatomy questions: {len(questions)}")
    print(f"Splits: kind {meta['coverage']['kind']:,}, means {meta['coverage']['means']:,}; graph tasks: {len(graphs)}; v1 consensus: {meta['coverage']['consensus']}")
    print(f"prototypes/data/task-table.json: {size:,} bytes ({size / 1048576:.2f} MiB)")
    for code, size in detail_sizes.items():
        print(f"prototypes/data/task-detail/{code}.json: {size:,} bytes")
    print(f"Detail total: {sum(detail_sizes.values()):,} bytes in {len(detail_sizes)} occupation files")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--isco-dir", type=Path, default=Path.home() / "Projects/AI-ISCO")
    build(parser.parse_args().isco_dir.resolve())
