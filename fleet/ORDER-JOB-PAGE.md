# Order: the job page, generic and company-specific

Read `AGENTS.md` (prototype rules, top bar; add a "Jobs" link to every page's top bar). Python
standard library only. Write only the files named here.

Generic task graphs (v3) land in `runs/v3/sol/<code>__<n>.json` (schema
`schema/taskgraph-v3.schema.json`; `_meta.job` holds code, title, function; `_meta.checks` the
mechanical check notes). Systems are slot ids (`config/system-slots.json`: id → label, holds,
examples) and text fields contain `{SLOT}` placeholders. A company profile
(`config/company-noordhaven.json`) maps slot ids to products.

1. `tools/build_jobs_view.py` → `prototypes/data/jobs/index.json` (jobs with data: code, title,
   function, task count, time saved weighted by task, slots used) and
   `prototypes/data/jobs/<code>.json` (all tasks of the job, merged across its batches, with the
   O*NET statement, class, steps, design and texts, check notes). Copy `config/system-slots.json` and
   `config/company-noordhaven.json` to `prototypes/data/`. Rerunnable as more files land.
2. `prototypes/job.html`:
   - Pick a job (grouped by function). Header: title, function, tasks, time saved, the workflows its
     steps belong to.
   - A presentation switch: **Generic** (every `{SLOT}` and slot id shown as its label, e.g. "the
     recruitment system (ATS)") and **Your company**. "Your company" uses a profile: the Noordhaven
     sample, or **your own**: a short intake that asks only for the slots this job's tasks use
     ("Which recruitment system do you use?"), with free text, stored in localStorage. Unfilled slots
     fall back to the label, shown in a muted style so the gap is visible.
   - Tasks as cards: statement, class, time saved; open a card to see the steps as a flow (today →
     fate, block, rung, loop check and stop, gate and approver), the design, blocker, enabler, still
     hard, new work, human edge, ambition, altitude, reach, build days, evidence, unknowns, and any
     check notes in a warning style.
   - A job summary: hours by fate, steps by block and rung, the share of steps that are
     deterministic or deterministic plus loop versus agent.
   - Works at 1440 and 390 px, console clean.
3. Append one line to `fleet/STATUS.md`. You cannot open a browser in your sandbox; say so instead of
   claiming the visual check.
