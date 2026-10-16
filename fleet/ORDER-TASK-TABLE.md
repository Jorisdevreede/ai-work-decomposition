# Order: the full task table (Jev + LLM), to explore

Read `AGENTS.md` first (rules for prototypes: static, no CDN, `prototypes/style.css`, same top bar as
`prototypes/task-explorer.html` plus a "Task table" link; add that link to the other pages' top bars
too). Python standard library only. Write only the files named here.

## 1. `tools/build_task_table.py` → `prototypes/data/task-table.json` (+ a details folder)

One row per O*NET task, all 18,838. Sources:

- `~/Projects/AI-ISCO/data/onet_tasks.json`: code, task_id, occupation, statement, task_type,
  importance, frequency_label. Major group = first two digits of the code (names: see
  `MAJOR_GROUPS` in `~/Projects/AI-ISCO/build_onet_site.py`).
- `~/Projects/AI-ISCO/data/task_scores_v2.json` (key `uri` = `onet:task:<code>:<task_id>`): class
  (S automate, A amplify, M machines, I human), sub, comp, comp_part, mech.
- `data/jev_anatomy_v2_onet.json` (key `<code>:<task_id>`): 30 fixed questions; choice answers have
  `choice`, `probs`, `confidence`; yes/no answers have `yes`. Keep per question the top choice and its
  probability (or the yes probability).
- `data/jev_shares_onet.json` (same key; may be incomplete, use what is there): `kind` and `means`
  splits in percent.
- LLM enrichment, only for the tasks of the simulated teams (key from `uid` = `<code>:<task_id>`,
  role from the file name `<role>__<n>.json`):
  - `runs/v2/opus/*.json`: the task graph: `time_saved_pct`, `speedup`, `design`, `steps` (each with
    what, actor, today_means, systems, inputs, outputs, handoff_to, share_pct, fate, remaining_pct,
    block, rung, loop, authority, human_gate), previous_blocker, enabler_now, still_hard, human_edge,
    ambition, altitude, build_days, run_cost.
  - `data/synthesis/v1/tasks.json`: the three-model v1 consensus pattern and time saved, if present.

Keep the main file small: short field names, codes instead of repeated strings, probabilities rounded
to 2 decimals. Put the long LLM fields (steps, design, texts) in `prototypes/data/task-detail/<code>.json`
per occupation, loaded when a row with LLM data is opened. Print row count and file sizes.

## 2. `prototypes/task-table.html`

A table to explore all 18,838 tasks:

- Columns (toggle groups on and off): occupation, major group, task, class; jev: drudgery, core, rule
  coverage, hard part, checking, interface, standard software, vanishes, reach, reversibility, human
  approval, exposure, data sensitivity, main shape, supporting shape, model needed; kind and means
  splits as small stacked bars; LLM: has task graph, time saved, number of steps, rungs used.
- Search (task or occupation text), filters (major group, class, main shape, rule coverage, model
  needed, reach, data sensitivity, "has LLM"), sortable columns, a count of matching rows, and
  paging or windowed rendering so it stays fast.
- Click a row: a side panel with every jev answer and its probability, the two splits, and, when
  there is LLM data, the task graph: steps as a table (today → fate, block, rung, loop, gate) and the
  design and the texts.
- A summary strip for the current filter: counts per main shape, per rule coverage band, share where
  a model is needed at run time.
- Works at 1440 and 390 px; console clean. Serve with `python3 -m http.server 8790` from this folder.

Append one line to `fleet/STATUS.md` when done.
