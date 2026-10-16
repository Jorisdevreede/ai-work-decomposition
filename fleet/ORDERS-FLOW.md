# Orders: the team flow (2026-10-15)

Everyone: read `AGENTS.md` and `fleet/FLOW-SPEC.md` first. Write only your files. Append one line to
`fleet/STATUS.md` per deliverable. Coordinate through files: MODEL publishes the contract in
`prototypes/flow/MODEL.md` first (within your first 20 minutes), UI builds against it.

## MODEL (Sol 6.1): the computation

- `tools/build_flow_data.py` → `prototypes/flow/data/jobs/<code>.json` + `index.json`: per job its
  tasks with O*NET importance and frequency (from `~/Projects/AI-ISCO/data/onet_tasks.json`), the
  task-share weight, and the v3 steps and texts (from `prototypes/data/jobs/<code>.json` or
  `runs/v3/sol/`), compact.
- `prototypes/flow/model.js`: `computeTeam(setup, jobs, slots, profile)` and helpers as specified
  (hours, before/after, ceilings, opportunities, initiatives with action types, effort bands,
  priority, quarters, business case with the 50/80/100 adoption ramp, slot rendering).
- `prototypes/flow/MODEL.md`: the input and output shapes, the formulas, the action-type mapping.
- `prototypes/flow/model.test.mjs`: checks with Node on the default HR team (sums, shares, every
  initiative traced to steps, no step counted twice, ramp arithmetic). Run it.

## UI (Opus 5.5): the flow and the twin pages

- `prototypes/flow/index.html` (+ `flow.css`, `flow.js` if you split): the five-step flow and the
  results tabs (Team twin, Roles, Initiatives, Opportunities, Tasks), using `model.js`. Until
  `MODEL.md` exists, lay out the screens with the default HR team and wire the model when it lands.
- Use the `/impeccable` and `/ux-principles` skills; meet the UX checklist in the spec. Same top bar
  as the other prototypes plus a "Team flow" link (add it to the other pages' top bars).
- Check in a browser at 1440 and 390 px (Playwright is available to you), clean console, and the
  full flow from an empty start to "Your plan is ready".

## FIXES (Sol 6.1): apply the review fixes to the v3 generator for the next batch

From `fleet/v3-review/REVIEW.md` and `fleet/jobs/REVIEW-SYNTHESIS.md`, in `tools/fleet_v3.py` and a
new `schema/taskgraph-v4.schema.json` (keep v3 intact):
- evidence gets a `kind` (capability, case, legal, benchmark, survey); E2/E3 only for capability and
  case; source ids validated against the digest;
- approvals as references bound to the action they cover; no gate on a machine/gone step without
  a reference to where the human approval time is counted;
- `new_work` split into already counted and incremental, with hours;
- labour of suppliers, customers and other roles marked, excluded from the role's savings;
- a conservative range next to time saved;
- checks: shares exactly 100, machine/gone remaining 0, loop present iff loop rung, judgement
  steps not deterministic, product names outside evidence; failed checks block the file (written
  as `.blocked.json` with the reasons) instead of passing with notes;
- `tools/build_jobs_view.py`: weight a job's time saved by task share (importance × frequency).
- Test the generator on 2 jobs into `runs/v4/sol/` (not more), and report the check results.
