# HANDOFF: team-reimagine

Last updated: 2026-10-14 21:30. Exploration, local only, untracked. **Home decided 2026-10-14: an AgentLabs product**
(`decisions/2026-10-14-team-reimagine-is-agentlabs.md`).

## Goal (Joris, 2026-10-14)

From self-service inputs (tasks people do, applications they use) to advice and actionable
opportunities, built as deterministic software (faster with AI), an AI step, or an agent. Like the
Tenex 5-day agent sprint, but self-service, tied to lean and North Star, with thought leaders. Focus on
automate and amplify tasks; the amplify lenses: faster, autonomous, ambitious, fun, options,
abstraction up, adjacent tasks (polyvalent player), team and individual ceiling, human edge,
priorities. Simulate one or two teams, enrich each task with a narrative; compare deterministic
questions (jev), an LLM fleet from memory, and research (web, X via Grok, last30days).

## State (2026-10-14 23:05, run complete)

- Method: `method/model-v1.md` (current), `model-v0.md` (tested), `findings.md` (evidence),
  `e1-jev-notes.md`, `e4-notes.md`.
- Data: `data/teams.json`, `data/jev_anatomy.json` + `data/patterns_rule.json` (E1),
  `runs/inmemory/{opus,sol,grok}` 27 batches each (E2), `runs/grounded/opus` 27 + `sol` 4 (E4),
  `data/synthesis/*` (E5/E6, 29 opportunities), `research/` (signals, 14 digests, frameworks, last30days).
- Prototypes (serve this folder on 8790): team-canvas, task-explorer, intake, opportunities.
- Fleet stopped (ntm session killed after convergence). Mac crashed once mid-run; nothing lost.

## Next (in progress 2026-10-14 night)

- Running: `runs/inmemory-noweb/sol` (Sol from memory, web really off: codex plugins disabled, tool
  calls logged in `_meta.tool_calls`) and `runs/v1/{opus,sol,grok}` (v1 prompt, grounded, schema v1).
- Done: pattern rule v1 (batches reach the agent branch, headroom dropped).
- A sub-agent is adding `--variant v1` to `tools/synthesize.py` (simplest-first vote, keep_human from
  the rule, adoption weight, potential vs expected) writing `data/synthesis/v1/`.
- Then: findings on v1 vs v0, point the prototypes at `data/synthesis/v1/`, a method page.

## Night of 2026-10-15 (Joris asleep; permission: first ~100 jobs with Sol/Astra after inspection)

- Claude budget low (18% weekly): Codex (Sol 6.1 generate, Astra review) and Grok only; no Fable.
- v3 = generic task graph: `config/system-slots.json` ({ATS},{HCM},{ERP}...), company profile
  `config/company-noordhaven.json`, schema `schema/taskgraph-v3.schema.json` (boundary-based steps,
  workflow ids, approver, new_work), runner `tools/fleet_v3.py` (checks: placeholders only, shares,
  rung/loop, gates). Jobs: `config/jobs-batch1.json` (98 jobs, 1,957 tasks; HR, Finance,
  Procurement, Marketing, Sales, Customer support, Office/ops, Legal, Management).
- Pilot (3 jobs, Sol) -> inspect -> job page `prototypes/job.html` (Sol builds) -> browser check ->
  scale to all 98 with Sol, Astra review on a sample.
- Jev v2 anatomy done for all 18,838; jev shares onet still running.

## Morning 2026-10-15: batch 1 done

- 98 jobs, 1,953 of 1,957 tasks (Desktop Publishers batch 4 rerunning), 12,445 steps, Sol 6.1, web off.
- Time share by rung: stays manual 38%, configure 24%, deterministic 21%, deterministic + loop 15%,
  eliminate 1%; agents 0 (1,601 bounded loops). Steps per task 2-13 (mode 6). Mean time saved 52% (gross).
- Checks: 51 "judgement step marked deterministic", 1 product name. Astra sample review (26 files):
  14 good, 12 fix, 0 redo; `fleet/v3-review/REVIEW.md`.
- Next fixes (Astra): evidence kind (capability vs legal/benchmark, not all E2), approval references
  bound to actions, incremental vs already-counted new work, supplier/other-actor labour excluded from
  role savings, exact 100% and machine/gone = 0 checks that block publication, conservative range,
  weight job time saved by importance x frequency in `build_jobs_view.py`.
