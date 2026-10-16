# Team flow model contract

`model.js` is a browser ES module with no DOM, network or storage access. Import
`computeTeam`, `DEFAULT_SETUP`, `frequencyWeight`, `renderText`, `classifyAction`, `portfolioGrid`.
Run checks with `node prototypes/flow/model.test.mjs` from the project root.

## Inputs

```js
computeTeam(
  {name: 'HR', function: 'HR', roles: [
    {code: '11-3121.00', fte: 1, cost_per_hour: 95}
  ]},
  jobs,    // object keyed by code, Map, or array of loaded job detail objects
  slots,   // existing ../data/system-slots.json: {slots: {HCM: {label, ...}}}
  profile  // existing ../data/company-noordhaven.json: {systems: {HCM: '...'}}
)
```

`DEFAULT_SETUP` contains the six HR roles and prices in FLOW-SPEC (10 FTE).
Each role may have `id` and `title`; otherwise code and job title are used. Repeated
codes receive distinct role IDs, so each staffed role's capacity is counted once.
FTE and costs must be finite and nonnegative. Zero FTE is allowed. Missing jobs
throw an error rather than silently omitting capacity.

Fetch `data/jobs/index.json`, then `data/jobs/<code>.json` relative to this page.
Index shape: `{version, weighting, jobs: [{code,title,function,task_count,
graph_task_count,step_count,slots_used,expected_task_count}], build_notes}`.
Job detail adds `tasks`, `role_batches`, `check_notes`, `sources`. Each task keeps
the source v3 fields and adds `importance`, `frequency`, `frequency_weight`,
`task_weight`, `task_share`, `graph_available`. These are generic estimates.
The builder includes O*NET tasks without graphs; their time stays human, explicitly
marked unavailable. It never extrapolates savings from completed tasks to missing ones.

## Output (version 1)

```js
{
  version: 1, name, function,
  assumptions: [/* visible limitations */], warnings: [/* data gaps */],
  counts: {roles, tasks, steps, source_steps, initiatives},
  team: summary,
  roles: [{id, code, title, fte, cost_per_hour, ...summary,
    tasks, opportunities, initiative_ids,
    twin: {drudgery, altitude, ambitions, reach, human_edge, skills_to_grow}}],
  tasks: [taskResult],
  opportunities: [taskResult], // descending value, then hours, then ID
  initiatives: [initiative],  // descending value / effort.days, then ID
  systems: [{id,label,product,filled,step_count}], // most used first
  gaps: [{id,label}],         // selected slots with no supplied product
  business_case: businessCase // same as team.business_case
}
```

`summary` = `{baseline_hours, remaining_hours, hours_returned, fte_returned,
value_eur, baseline_cost_eur, remaining_cost_eur, time_saved_pct, speedup,
amdahl_ceiling, human_only_share, theoretical_ceiling, by_fate, by_kind,
by_means, by_rung, business_case}`. Groupings are objects keyed by source category,
with values `{baseline_hours,remaining_hours,hours_returned,value_eur}`.
Kind is `unspecified` when absent; no kind is inferred. `speedup` and
`amdahl_ceiling` use the specified finite improvement assumptions. The separate
`theoretical_ceiling` assumes all improvable time disappears and protects manual
time. Unbounded speedups are `null`, accompanied by `human_only_share: 0` for the
theoretical ceiling; no Infinity occurs in JSON. Empty teams have speedup 1.

`taskResult` keeps rendered task texts, including `short`, `statement`, `design`,
`ambition`, `altitude`, `reach`, `human_edge`, `new_work`, plus
`{id,uid,role_id,role_title,code,task_share,baseline_hours,remaining_hours,
hours_returned,value_eur,time_saved_pct,speedup,rung_mix,steps,initiative_ids}`.
Each step keeps source fields and adds `{id,source_step_id,task_id,task_uid,role_id,
role_title,baseline_hours,remaining_hours,hours_returned,value_eur,action_type,
initiative_id}`. Global step IDs combine role ID, task UID and original step ID.
`rung_mix` uses the same group shape as `by_rung`.

Twin `drudgery` is an array of `{task_id,short,design,hours_returned}` (top three
task opportunities). `altitude`, `ambitions`, `human_edge`, `skills_to_grow` are
arrays of source strings. `reach` combines role-level strings and task-level
`{role,task,learn}` objects. These texts are rendered, not newly generated.

`initiative` = `{id,name,action_type,main_system,systems,flows,workflow,effort,
priority,quarter,hours_returned,fte_returned,value_eur,role_ids,roles,task_ids,
tasks,step_ids,steps,business_case}`. `roles` are `{id,code,title}` and `tasks`
are `{id,uid,role_id,short}`. `steps` are references to the computed step objects.
Every contributing step belongs to exactly one initiative. Initiatives with zero
returned hours are omitted. Task opportunities and initiatives are two views of
the same savings: never add them together. Task opportunities can include savings
on retained human work, so initiative savings need not equal total capacity.
`flows` is the sorted unique list of all contributing workflow IDs. `workflow`
is that ID when there is exactly one flow, otherwise `null`. `systems` includes
every system used by contributing steps, including all integration peers.

`effort` = `{band,days,days_low,days_high,label}`. S = 5 days, M = 15 days,
L = 30 days; checked AI = M/L (15–30, midpoint 22.5 for priority). These are
planning assumptions, not build quotes. Stop-doing is S. The top five initiatives
go to Q1, the next five to Q2, the next five to Q3, the rest to Q4. This is a
rank-based suggested roadmap, not a delivery-capacity promise.

`businessCase` = `{gross:true,label,annual_hours,annual_fte,annual_value_eur,
years:[{year,adoption_pct,hours_returned,fte_returned,value_eur}],
three_year_value_eur}`. Year 1/2/3 adoption is 50/80/100%. Values represent gross
capacity, not cash savings or profit; build, licence and upkeep costs are not known.

## Formulas and action mapping

Role baseline = FTE × 1,600 hours. Task weight = importance × frequency weight.
Missing importance defaults to 3; missing frequency weight to 4. Frequency category
1…7 maps to 1, 1.5, 2.5, 4, 6, 8, 10, with linear interpolation and endpoint
clamping. Task share = weight / sum of all job task weights. Step baseline =
task hours × share_pct / 100; after = baseline × remaining_pct / 100.
Non-100 source step shares are normalised with a warning and retained as
`source_share_pct`. Missing graphs become one 100% manual placeholder, marked
`estimated_placeholder`, excluded from source step counts. Remaining percentages
outside 0…100 and nonpositive total step shares throw errors.

Time returned = before − after; gross value = returned hours × role hourly cost.
Amdahl = 1 / Σ(share / step speedup) = baseline hours / remaining hours, weighted
across every task and staffed role. No averaging of task or role percentages.

Mapping precedence: manual rung or conversation → no initiative; eliminate →
`stop_doing`; configure → `configure_system`; otherwise checked AI rung →
`checked_ai_step`; otherwise blocks map as follows:

| Block | Action |
|---|---|
| artefact_generator | generate_artefact |
| workflow_automation | build_workflow |
| crud_app | build_records_app |
| dashboard | build_dashboard |
| integration | connect_systems |
| judgement_step | checked_ai_step |
| answer_desk | answer_desk |
| notification | notifications |

Unknown blocks and `none` have no initiative and produce a warning if they save
time. Group only by action type + first system slot (or `null` for no slot).
Neither workflow nor integration peers affect initiative identity. Steps from
different flows and roles therefore share one initiative when action and main
slot match. All member steps, task/role references, systems and flow IDs remain
available. The highest-value contributing step supplies the representative text.

Configuration names use `Configure <product>` when a product is supplied, or
`Configure the <generic slot>` otherwise. Checked-AI names use a conjugated verb
and the representative step's output artefact, followed by `checked by <role>`.
The role is the named approver, otherwise the actor, otherwise the staffed role.
Supported purposes read as drafts, extracts, classifies, reviews, reconciles or
reads; other purposes use prepares. Raw loop input is never used as the name.
One-slot integrations read `Connect <slot> to the other systems`; multi-slot
integrations name the union of the group's systems. Other labels use actual
output, workflow or event from the representative step.
Slots are rendered recursively in texts from profile product, then generic slot
label plus `[not supplied]`. Unknown slots show `[unknown slot: ID]`. The original
IDs in `systems` remain unchanged. No external source claims are added or verified.

## Verification (2026-10-15)

- `python3 tools/build_flow_data.py`: 98 jobs, 1,957 tasks, 12,462 source steps,
  zero missing graphs or build notes. Checked all exported shares, weights and
  percentage ranges. A second build produced identical file hashes.
- `node prototypes/flow/model.test.mjs`: passes fixture arithmetic, default HR
  sums, grouping totals, unique initiative assignment, step/task/role traces,
  frequency interpolation, slot rendering, missing graphs, duplicate staffed
  roles, input purity, zero FTE, full elimination, and adoption ramp arithmetic.
- Default HR after consolidation: six roles, 10 FTE, 134 tasks, 945 steps,
  66 initiatives (previously 233);
  8,853.45 gross annual hours returned, 5.53 FTE, EUR 585,623.83 capacity value,
  2.24× speedup. These are computed estimates, not measured evidence.
- Computed all 98 jobs together and checked baseline capacity, unique step
  assignment and initiative back-references. About 156 ms in local Node.
- Imported the actual ES module and fetched its six HR job files through
  `http://localhost:8790` in Chromium. Same totals; about 19 ms computation.
  No model exceptions. The direct module tab had an unrelated `/favicon.ico`
  404. Layout checks belong to the UI order.
- Default HR retains two upstream warnings about judgment steps labelled
  deterministic (`13-1071.00:18868/s4` and `13-1071.00:18876/s4`). The action
  mapping puts these in checked AI initiatives; their source estimates remain
  unchanged. Approval-time attribution, other actors' labour and unquantified
  new work remain source-model limitations, disclosed in `assumptions`.
- Follow-up checks: different flows and integration peers merge by action/main
  slot; IDs survive flow changes; every eligible step is assigned exactly once;
  all flow IDs, systems, task/role traces and summed business cases survive.
  Product, checked-AI and one-slot integration names have focused assertions.
  The exact grouping rule yields 66 distinct HR pairs, rather than the hoped-for
  20–40. Reaching that smaller range would require merging action types or main
  slots; no initiative or capacity has been dropped to force a count.

## Portfolio grid

`portfolioGrid(result, profile, overrides)` scores the initiatives `computeTeam`
already returned. It does not change grouping, hours, value, effort or the
roadmap quarters. It does not read the DOM, the network or storage. The page
passes the same `profile` object it passed to `computeTeam`, and an `overrides`
map `{[initiativeId]: {call, owner_wants}}` that the page keeps in
`localStorage` under `team-reimagine.flow.grid.v1`.

Each row keeps `readiness` and `prize` from 0 to 100, the four readiness parts,
the weakest part (`blocker`), the quadrant, the `suggested_call`, the `call`
after overrides, and `first_wave`. The return value is `{items, by_quadrant,
first_wave, quick_wins_hours, counts}`. `items` follows the input initiative
order. `by_quadrant` has `accelerate_now`, `invest_to_unlock`, `quick_wins` and
`deprioritize`.

**Readiness** is the mean of four parts, then the owner adjustment, then clamped
to 0…100. The quadrant uses that clamped number. The blocker is the lowest part
*before* the owner adjustment. Ties break in the order data, process, contained,
effort.

- **data.** Share of the initiative's system ids that the profile has named
  (a non-empty string in `profile.systems`). An initiative with no systems scores
  100. No profile — the argument is `null`, missing, or not an object — gives
  `null`: data is left out of the readiness mean and is never the blocker.
  An empty systems map is a profile that names nothing, so every named slot is
  unfilled and the share is 0.
- **process**, by action type: `stop_doing` and `configure_system` 90;
  `generate_artefact` and `notifications` 75; `build_records_app`,
  `build_dashboard` and `answer_desk` 60; `build_workflow` 55; `connect_systems`
  40; `checked_ai_step` 35. Any other action type scores 20.
- **contained.** One role 100, two roles 70, three or more 40, then minus 10 for
  each system beyond two, with a floor of 0. Role count is `role_ids.length`.
- **effort.** Band S is 90, M is 60, L is 30. Band `M/L` counts as L (30) when
  `days_high` is 30, and as M (60) otherwise. Checked AI is the `M/L` band.

**Prize** is `0.80 × value + 0.10 × evidence + 0.10 × unlocks`,
clamped to 0…100. Each term is on a 0…100 scale. Value dominates so that a
small saving cannot become a big prize on evidence and shared systems alone.

- **Value** is `100 × √(value_eur ÷ the largest value_eur in the team)`. The
  largest initiative scores 100, one at a quarter of its value 50, one at 4 % of
  it 20. Absolute, not a rank, so a team of small fixes does not get "big prizes"
  by splitting at the median. No positive value anywhere scores 0.
- **Evidence** is the best grade on the initiative's tasks. Task refs on the
  initiative are `{id, uid, role_id, short}` and do not carry grades; the grade
  is read from `result.tasks`, matched by task id, field `evidence[].grade`.
  E4 is 100, E3 is 85, E2 is 65, E1 is 35. E0 and a missing grade both score 20.
  Unknown grades are ignored.
- **Unlocks** is the share of *other* initiatives that share at least one
  non-empty system id or at least one flow id, times 100. Flows are
  `initiative.flows`, or `[workflow]` when `flows` is missing. Empty ids do not
  match. A single initiative scores 0.

**Goal link**, applied after that weighted prize and before the quadrant. The
page passes an optional fourth argument, the goal list `{id, text}[]`, and
`overrides[id].goal`. No fourth argument, or a goal id that is not in the list,
leaves the prize unchanged and sets `goal_link` to `unset` with the note
"not linked to a goal yet". `none` caps the prize at 49, so the initiative can
still land as a Quick Win: an initiative that moves no goal is not part of the
strategy. A listed goal id adds 10, then the prize is clamped to 100. `none`
does not also receive the 10.

**Quadrant.** Readiness ≥ 50 is ready. Prize ≥ 50 is big. Ready and big is
Accelerate Now. Not ready and big is Invest to Unlock. Ready and small is Quick
Wins. Not ready and small is Deprioritize. Exactly 50 is the high side.

**Goal suggestion.** `suggestGoal` compares each goal's content words with the
initiative name and its three tasks with the most hours returned (stop words and
words common to almost every office task are ignored). Two or more shared words
suggest that goal; the lead accepts it with one click. A broad initiative is not
matched on all its tasks, because a long text matches any goal.

**Suggested call.** Accelerate Now and Quick Wins suggest Start. Invest to Unlock
suggests Edit. Deprioritize suggests Merge when any other initiative, in any
quadrant, has the same action type and shares a system id; otherwise Stop.

**Overrides.** `owner_wants: true` adds 10 to readiness, `false` subtracts 20,
and `null` or a missing flag adds 0. The adjustment is applied to the mean, then
clamped, and only then is the quadrant chosen, so an owner can move an initiative
across the line at 50. An explicit `call` of start, continue, edit, merge or stop
(any letter case) replaces the suggested call and does not by itself move the
quadrant. Any other call string is ignored. The same initiative id can appear in
another team, because ids are action type plus main system slot.

**Order.** Accelerate Now and Quick Wins sort by readiness descending, then
`value_eur` descending, then id. Invest to Unlock sorts by prize descending, then
value, then id. Deprioritize sorts by value descending, then id. The first wave
is the first `min(5, n)` Accelerate Now rows after that sort. Invest to Unlock
rows are not pulled into the first wave. `quick_wins_hours` is the sum of
`hours_returned` on Quick Wins. The team total is unchanged; the page shows the
Quick Wins hours as not counted toward goal progress.

CSV and JSON exports append `quadrant`, `readiness`, `prize` and `call` for the
grid at export time, including current overrides. Quadrant and call are the
human labels. Readiness and prize are rounded to two decimal places.

**Mean hourly cost** is the FTE-weighted average of `result.roles[].cost_per_hour`.
`meanHourlyCost(result)` is that number. It is not a field on the team. The
default HR setup is 1×95, 3×75, 2×68, 1×75, 2×50 and 1×52 over 10 FTE, which is
68.3. A team with no FTE scores 0. The running-item prize and the implementation
cost estimate both use this rate.

**Suggestion.** `suggestGoal(initiative, tasks, goals)` returns a goal when at
least two of its content words (letters and digits, longer than two characters,
stop words removed) also appear in the initiative name or its task texts. The
page shows it as "Suggested:" and does not apply it until the lead accepts.

**Already running.** `runningCalls(items, goals, scale)` does not mutate `items`.
`scale.values` is the initiative `value_eur` list. `scale.meanHourly` is the
mean hourly cost. Suggested call, first match wins: **Merge** when `same_as` is
non-empty; **Stop** when there is no owner, or evidence is `none` and hours are
not positive; **Continue** when there is an owner, evidence is `measured`, and
either the goal id is in `goals` or hours are positive and `destination` (or
`hours_go`) is non-empty; otherwise **Edit**. `missing` lists the gaps among
owner, measure and goal. Measure is present only when evidence is `measured`.
An explicit `call` replaces the suggestion. Readiness is 85 with an owner and
measured evidence, 60 with an owner and anecdotes, and 30 with no owner. An
owner and evidence `none` also scores 30: the article names no fourth readiness
for existing work. Prize is `100 × √((hours × mean hourly cost) ÷ the largest
initiative value)`, clamped to 0…100, then +10 when a goal is linked (clamp
again), then capped at 49 unless evidence is measured. The cap is last, so an
unmeasured item cannot clear 49 by being linked to a goal. The quadrant uses
those two scores. Rings on the page are these rows, not initiatives.

**Pilot.** `pilotCheck(card, quadrant)`. A non-Quick-Win **Start** is earned
when the card has an owner, a checkable outcome or a non-empty `learn` line,
and a cost range. Checkable means `measure`, numeric `baseline`, numeric
`target` and `by` (or `date`) are all filled. The cost range is the five lines
`employee`, `process`, `data`, `implementation` and `software`, each with a
numeric low and high, high at least low. Zero counts. Quick Wins are earned
when the card has an owner, `hours_go` and `confirmer`. Otherwise `missing`
lists what is still required. `productionReady(checks)` is ok only when eight
values are all `yes`; `open` is the indexes that are not. `reviseAllowed(card)`
is refused when `status` is `revise` or `revise_count` is at least 1. The
reason is the article's line: a revision gets one more cycle with a named fix
and new criteria, then expands or stops.

**Enabling work.** `enablingWork(grid, profile, policy)` returns new item
objects. It does not mutate `grid` and it does not change `portfolioGrid`'s
`first_wave`. `partly` subtracts 10 from every readiness, `yes` subtracts 25,
`no` subtracts 0, then the quadrant and the suggested call are chosen again.
An explicit call (one that already differed from `suggested_call`) is kept.
After that shift, a blocker that is weakest on two or more items with prize
at least 50 and readiness under 50 becomes a card: data "Name your systems
and open their data", process "Define the process and its measures",
contained "Split it into contained pieces", effort "Fund the larger build".
The card lists those initiative ids and the sum of their `value_eur`. A null
profile drops a data card, because unknown data is not a blocker. `yes` also
puts "Agree an AI policy and vendor approval" first, listing every initiative
and the sum of their gross value. The page shows that policy card, then the
other cards, then `portfolioGrid`'s Accelerate Now first wave.

**Time to first value.** `timeToFirstValue(initiative)` uses the authors' rough
figures. `generate_artefact` is content generation, 2 to 4 weeks. `stop_doing`
is weeks, with no numeric range. `configure_system`, `build_workflow`,
`build_records_app`, `notifications`, `answer_desk`, `checked_ai_step` and
`build_dashboard` are workflow automation on a defined process, 2 to 4 months.
`connect_systems` with four or more systems is platform-level change, 12 to 24
months; otherwise it is the 2 to 4 month band. Any other action type is
`known: false` and is not given a band. The page labels the figure "rough,
from the article".
