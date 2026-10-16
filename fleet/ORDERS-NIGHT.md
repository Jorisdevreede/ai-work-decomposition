# Night orders, 2026-10-15

Read `AGENTS.md` and `method/model-v1.md` first. The method has moved to v2: the **task graph**.
Every task is split into steps; each step has an actor, today's means (spreadsheet, mail, system
screen...), systems, input and output artefacts, a handoff, and its future: fate, the building block
(artefact generator, workflow automation, records app, dashboard, answer desk, integration, judgement
step, conversation, notification), the cheapest build rung (eliminate, configure, deterministic,
deterministic plus a bounded model loop, agent, stays manual) and the loop's check and stop
condition. Schema: `schema/taskgraph-v2.schema.json`; example: `runs/v2/opus/bookkeeper__1.json`.
Owner's bet: most work is best solved with deterministic technology built 10–100× faster with AI
coding, plus small bounded model loops; autonomous agents are rare. Read `fleet/review-fable.md` and
`fleet/review-astra.md` for the reviews this follows.

---

## DIGEST-A, DIGEST-B, DIGEST-C (Opus 5.5): research digests per O*NET minor group

`data/minor-groups.json` lists 91 minor groups (code like `13-1`, its occupations and the number of
automate and amplify tasks), biggest first. DIGEST-A takes positions 1, 4, 7, …; DIGEST-B 2, 5, 8, …;
DIGEST-C 3, 6, 9, … Skip a group whose file already exists.

Write `research/digests-minor/<group>.md` (e.g. `13-1.md`), at most 600 words, in exactly these four
blocks, then the sources:

1. **Products that do this today**: named products and features for the group's tasks (for
   European and Dutch companies where relevant), each with a source you opened.
2. **Cases with numbers**: documented deployments with a measured result, each with a source you
   opened. Say "none found" rather than stretch.
3. **Deterministic first**: which of the group's tasks are best solved by configuration, plain code,
   integrations, records apps and dashboards, and where a bounded model step (reading free text,
   judging, drafting) is needed. Where do spreadsheets and mailboxes glue systems or teams together?
4. **Gates**: legal and works-council constraints in the Netherlands and the EU (GDPR, EU AI Act
   annex III, WOR article 27, sector rules), risks and failures reported.

Sources as `[S1] title, publisher, date, URL`, numbered in order of use. Only links you opened in
this session. Plain English, no hype. Append one line per digest to `fleet/STATUS.md`.

## XSCOUT (Grok 4.7): practitioner signals on X for the biggest groups

For the 20 biggest groups in `data/minor-groups.json`, search X and the web for what practitioners in
those jobs did with AI and automation in the last 90 days: tools, numbers, failures, and especially
spreadsheets or manual glue replaced by scripts, integrations or small apps. Write
`research/signals-minor/<group>.md`, 5 to 10 items, each with date, link (opened), who, what, a
number if any, and a grade. The DIGEST panes read these if they exist. Append to `fleet/STATUS.md`.

## GRAPH (Opus 5.5): the task graph merge and its prototype

The v2 pilot is landing in `runs/v2/opus/` (HR and Finance, batches of four) and
`runs/v2-repeat/opus/` (Finance again, batched differently, for a self-consistency check).

1. `tools/graph.py` (standard library only) writing `data/graph/`:
   - `graph.json`: nodes for steps (with task, role, team), artefacts (normalised names: lower case,
     singular, merge obvious synonyms with a small explicit alias table you show in the file), systems
     and roles; edges step→artefact (produces), artefact→step (feeds), step→role (handoff), step→system.
   - `glue.json`: the glue: steps done today in a spreadsheet, mail or document that connect two or
     more systems, or hand off across roles or teams; with their hours (role FTE × hours per FTE ×
     task share × step share), and the proposed block and rung.
   - `blocks.json`: hours and step counts per building block × rung, per team and overall; the share
     of hours covered by eliminate, configure, deterministic and deterministic-plus-loop versus agent.
     This answers "how far does deterministic with a few small loops get us".
   - `consistency.json`: for Finance, compare `runs/v2` with `runs/v2-repeat` per task: time saved,
     per-step rung and block agreement, design overlap.
   - Hours per task: role hours per FTE × FTE × task share from `data/teams.json`; time saved per
     task is in each answer (`time_saved_pct`, derived from the steps).
2. `prototypes/task-graph.html`: the same top bar as the other prototypes plus a "Task graph" link
   (add that link to the other four pages' top bars too). Views: pick a team or role; see the graph
   of steps, artefacts, systems and handoffs (an SVG you lay out yourself, readable at 1440 px; a list
   view at 390 px); click a step for its today, fate, block, rung, loop (input, output, check, stop),
   authority and gate; a "glue" list ranked by hours, each with the task's design text; and the
   building-block summary from `blocks.json`. Rerun the merge as more files land.
3. Append to `fleet/STATUS.md` per deliverable. Stop when the pilot is merged and the page works.
