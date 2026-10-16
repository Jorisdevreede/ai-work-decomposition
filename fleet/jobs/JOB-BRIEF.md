# Job brief: work out one job entirely, then reflect

You are one of five models (Fable 5.1, Astra, Sol 6.1, Opus 5.5, Grok 4.7) given the same job.
Three reviewers will compare all five answers afterwards, so show your reasoning in the files and
be honest about uncertainty. Work alone; do not read the other models' folders.

## The job

The **Recruiter (talent acquisition)** at Noordhaven Logistics B.V. (fictional; Dutch logistics,
1,200 staff on three sites, 150 to 300 flex workers through agencies, AFAS Profit, Recruitee,
Studytube, Microsoft 365, Power BI). Two recruiters, EUR 65 an hour loaded.

## Read

- `fleet/jobs/recruiter/input.json`: company, team, North Star, the role, and all 12 O*NET tasks
  with their time share, the class scores (automate, amplify, human) and the **jev measures**
  (`jev_v2`: fixed questions with probabilities: drudgery, core of the work, input, rule coverage,
  what makes the rest hard, exceptions, checking, error cost, relationship, arrival, interfaces,
  standard software, whether it would vanish with clean input, accountability, reach, reversibility,
  human approval, exposure, data sensitivity, main and supporting solution shape, model needed).
- `research/digests/recruiter.md` and `research/signals/recruiter.md`: research with sources.
- `method/model-v1.md`, `fleet/review-fable.md`, `fleet/review-astra.md`: the method and its reviews.
- `schema/taskgraph-v2.schema.json` and the example `runs/v2/opus/bookkeeper__1.json`.

## The owner's bets (take as given)

Most work is best solved with deterministic technology built 10 to 100 times faster with AI coding:
artefact generators, workflow automations, records (CRUD) apps, interactive dashboards and
integrations, stitched together, with small bounded model loops where a step truly needs reading free
text, judging or writing. Autonomous agents are allowed but rare. Do not discount potential with
public field studies; show an adoption ramp instead. Gates go on actions, not whole tasks.

## Produce, in your folder `fleet/jobs/recruiter/<your-name>/`

1. `taskgraph.json`: an object `{"role_id": "recruiter", "tasks": [...], "role": {...}}` following
   `schema/taskgraph-v2.schema.json`, covering **all 12 tasks** (human ones too: their preparation
   and paperwork may change even when the core stays human). Valid JSON.
2. `job.md` (at most 1,200 words): the job reimagined as a whole.
   - The job's task graph in words: the main flows (vacancy to hire, candidate communication,
     agencies), where spreadsheets and mailboxes glue systems and people, what the stitched solution
     is (blocks, platform, loops, gates), and in what order to build it.
   - Hours: today per task and after (from your steps), the role's ceiling (Amdahl: `1 / Σ share ÷
     speedup`), and what the two recruiters do with the time.
   - Where you agree and disagree with the jev measures, task by task where it matters.
   - The three opportunities you would build first, each with a business case (hours × % removed ×
     EUR 65 = capacity; plus any financial or quality line), a North Star input, and a golden demo:
     event trigger, messy case, real artefact, approval gate, closes the loop, ends on a number.
   - EU AI Act (recruitment is high risk in annex III), GDPR and works council: what this means for
     each opportunity.
3. `reflection.md` (at most 600 words): what was hard, what you are unsure about, where the method,
   the schema or the jev questions got in your way or were missing something, and the three changes
   you would make before this runs on all 4,400 automate and amplify tasks of O*NET.

Plain English, short sentences, no hype words. Never invent a product, case, number or link;
cite digest sources as [S1] etc., or say "model knowledge".
