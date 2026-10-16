# Findings, run of 2026-10-14

What experiments E1 to E6 show, and what to change in `model-v0.md`. Every number below comes
from `data/synthesis/experiments.json`, `roles.json`, `teams.json` and `opportunities.json`, written
by `python3 tools/synthesize.py` at 23:00 on 2026-10-14. Rerun the script to reproduce them.

Coverage: 188 automate and amplify tasks across 14 roles, each answered by Opus 5.5, Sol 6.1 and
Grok 4.7 (27 batches per model). Grounded answers (E4): Opus on all 14 roles (188 tasks), Sol on hrbp
and the bookkeepers (30 tasks).
The company is fictional, so nothing here is E4 evidence; every euro is a modelled figure.

## The short version

1. **Sol was not working from memory.** Every Sol batch ran web searches. Its E2 answers are "Sol
   with web search", so E2 compares two models from memory with one that searched.
2. **The models agree on the architecture and the size of the prize, but not on the wording.** Two
   of three pick the same pattern for 95% of tasks; their speedups sit within 15% of each other. Their
   lens lines share 4 to 7% of their words.
3. **The ideas converge even where the words do not.** 55 to 83% of "ambitious" lines say "do it
   for every case". 81 to 87% of "altitude" lines say "the person owns the rules". One line in 564
   names a new service or revenue.
4. **The fixed rule and the models disagree on what to build.** The jev rule agrees with the
   model consensus on 39% of tasks, and each model agrees with the rule about as rarely (38 to 40%).
   The rule sends structured batch work to `copilot`; the models build it.
5. **Research changes the build, not the prize.** With the role digests, Opus changed the pattern
   on 38% of tasks, mostly from an agent to a fixed workflow, and its hours freed fell only 4%. On
   the two roles tried, Sol moved its builds the same way, but its speedups went up, not down.
   Searching by itself, Sol found manuals and no cases. The digests brought Opus 194 documented
   cases, against 10 from memory.
6. **The roll-up is a ceiling on potential, not a forecast.** The models say about 50% of each task's
   time goes away. That gives back 4.0 FTE in HR and 3.8 FTE in Finance (30% and 36% of cost).
   SCHOLAR's field studies report 3 to 7% of hours saved across a whole workforce.

## A flaw in the setup: Sol had web search

`tools/reimagine.py` turns web tools off for Opus (`--disallowed-tools WebSearch WebFetch`) and
Grok (`--disable-web-search`), but passes no such switch to `codex exec`. The Codex session logs
(`~/.codex/sessions/2026/10/14/`) show 1 to 5 `web__run` searches in every Sol batch, with
site-restricted queries on help.afas.nl, learn.microsoft.com, ser.nl and uwv.nl.

The links are real. We fetched every link in the answers (`data/synthesis/url-check.json`): of the
216 links in Sol's evidence lists, 205 load and 11 could not be checked (the site blocked the
request or refused the TLS connection). Across all answers, 1 of 193 distinct links is a 404. The
grounded Sol runs searched too (2 to 5 searches per batch).

What this means:

- E2 for Sol is a third variant: the model searching for itself. The model comparison below is still
  useful, but Sol's evidence profile is not a "from memory" profile.
- Every output file now carries this as `_meta.caveats`. The critic no longer marks Sol down for
  links; it only marks down links that are dead or were never checked.
- Fix: give codex a web-off switch (its `WebSearchMode` has `disabled`, so probably
  `-c web_search="disabled"`; not tested) and rerun Sol. Log the tool calls of every run, so
  "from memory" can be checked instead of assumed.

## E2 and E5: how the three models differ

On the same 188 tasks:

| | Opus 5.5 | Sol 6.1 (with web) | Grok 4.7 |
|---|---|---|---|
| speedup, mean / median | 2.11 / 2.0 | 1.93 / 1.8 | 2.21 / 2.0 |
| time saved, mean % | 49.2 | 51.8 | 50.7 |
| autonomy, mean (tasks at 4+) | 2.97 (57) | 2.98 (47) | 3.09 (62) |
| most chosen pattern | deterministic 56, copilot 55 | agent with gate 81 | agent with gate 70 |
| `llm_step` chosen | 26 | 9 | 20 |
| confidence high / low | 30 / 7 | 4 / 18 | 18 / 9 |
| speedup and time saved disagree by >15 points | 0% | 18% | 0% |
| words per lens line | 16.6 | 19.1 | 27.3 |
| specificity per line (named systems, Dutch context, a number) | 1.77 | 1.45 | 2.36 |
| lines with a stock phrase used 4+ times | 15% | 10% | 42% |
| evidence per task; grades | 1.9; E1 140, E2 204, E3 10 | 2.7; E0 144, E1 157, E2 202 | 3.1; E1 258, E2 327 |
| sources that say "model knowledge" | 39% | 57% | 50% |
| reach lines / research questions per task | 2.1 / 3.0 | 2.8 / 3.9 | 2.9 / 3.9 |
| hype words | 0 | 0 | 0 |

**Opus** is short and consistent. Its numbers always agree with each other. It uses `llm_step`
most often and is the only model that cites documented cases (10, from memory). Its ambition lines
are short and concrete ("Recommendations are checked against 90-day retention data, so the
team learns which signals predict a hire who stays"). It gives the fewest reach lines and research
questions. Its stock phrase is the altitude template "the specialist owns the …".

**Sol** writes in a general register ("Provide consistent reports and action reviews for all
sites"), sometimes in the first person, and names the fewest systems. In the answers we read, it is
the most careful about who is legally accountable. It is also the only model that grades its own estimates as imagined: 137 of
its 144 E0 items are of the form "the estimates of 50% less effort are untested". But its numbers do not hang
together. On 18% of tasks the stated time saved and the speedup disagree, for example 1.3× with 45%
saved. Read through its speedups, Sol frees 5,652 HR hours; read through its percentages, 7,068.
It leans hardest towards `agent_with_gate` (81 of 188).

**Grok** is the most specific and the most Dutch. It names proeftijd, the chain of fixed-term
contracts and the holiday-allowance accrual. Its human-edge lines are the strongest: "The employee
often asks about a form when they are really asking whether they will be paid." It is also the most
templated. It echoes the prompt: "at a tenth of the cost" opens 114 of its 188 ambitious lines,
and "the part nobody would miss" recurs in the joy lens. It gives the most evidence per task, but
every item is a product name without a link ("AFAS Profit" 105 times as E2). It has the highest
autonomy and speedup.

One task shows all three: payroll, *review time sheets … to detect and reconcile discrepancies*.
Opus: `agent_with_gate`, 2.2×, "Automated variance reports with likely causes replace the manual
comparison sheet." Sol: `agent_with_gate`, 1.3× with 45% saved. Grok: `deterministic_software`,
3×, "The review opens on a ranked list of breaks, each with the two records that disagree."

### Sameness: different words, the same ideas

Word overlap is low between models (lens similarity 0.04 to 0.07) and within a model across a
role's tasks (0.04 to 0.06). The models do not copy themselves line for line. The ideas converge
anyway:

| Lens line type (188 tasks) | Opus | Sol | Grok |
|---|---|---|---|
| ambitious = "every / all / each" (do it for everyone, every time) | 117 | 103 | 156 |
| ambitious = a new service, product or revenue | 1 | 0 | 0 |
| altitude = the person owns, designs, sets or maintains the rules | 163 | 160 | 153 |

The ambitious lens asks "what would we want ten times more of". All three answer with coverage:
check every payslip, give every hire a pack. None of them asks who would buy more, or what Noordhaven
could offer customers. The altitude lens has one answer: the person becomes the owner of the rules.
That may be right, but it is not yet an insight about the role.

## E5: merging the three answers

- **Consensus.** The pattern is unanimous on 56% of tasks; two of three agree on 95%. On a tie the
  lower autonomy wins. The mean agreement score is 0.84. The models disagree most on judgement
  tasks, which have the lowest agreement (0.61 to 0.65): allocating people (HRBP), BI specifications,
  satisfaction reports, payroll discrepancy review, and selecting applicants.
- **Simplest first is not what the vote gives.** Of the 64 tasks where the consensus is
  `agent_with_gate`, 26 had a vote for `deterministic_software` or `llm_step`. A majority vote
  picks the heavier build whenever two models reach for an agent.
- **The strongest line per lens.** The plain specificity critic scores in coarse steps, so 572 of
  1,128 lens picks (51%) are ties. Before this run's fix, every tie went to Opus because it is
  listed first. Ties now rotate on a fixed hash, and the tied models are recorded. Counting only
  clear wins: Grok 330, Opus 170, Sol 56. The critic rewards named systems and Dutch context, which
  Grok supplies most. It cannot tell an idea from a well-dressed template.
- **Union, not vote, for ideas.** Reach lines, risks and research questions are merged as a union
  with near-duplicates grouped. Sol and Grok each add nearly one reach line and one research
  question per task more than Opus.

## E1 against E2: fixed probes against the models

**The O\*NET class probabilities (rung 2) predict the size well.** The probability that AI produces
nearly all of a task's result correlates with the models' consensus time saved at r = 0.75. The
probability of a clear gain on most of the task does not (r = 0.13). The class and the models
disagree on 11 of 188 tasks. On 7 automate tasks the models keep the person in the lead; on 4
amplify tasks they let AI run with the person handling exceptions.

**The jev rule (rung 3) does not predict the build.** Rows are the rule
(`data/patterns_rule.json`), columns the model consensus:

| rule ↓ / models → | deterministic | llm step | agent with gate | copilot | keep human | total |
|---|---|---|---|---|---|---|
| deterministic_software | **27** | 4 | 15 | 2 | 0 | 48 |
| llm_step | 1 | **1** | 4 | 1 | 0 | 7 |
| agent_with_gate | 5 | 2 | **3** | 2 | 0 | 12 |
| copilot | 18 | 7 | 41 | **42** | 0 | 108 |
| keep_human | 2 | 2 | 1 | 8 | **0** | 13 |

- Same pattern 39% (automate 26%, amplify 59%); same family, build or not, 60%. Each model alone
  agrees with the rule 38 to 40%, while the models agree with each other 65 to 72%. The rule is the
  outlier.
- The big miss is the `copilot` row. The rule sends 108 tasks to copilot; the models build 66 of
  them. Those tasks come in **batches** (the rule's agent branch only accepts streams and cases).
  The input is structured (0.85 to 0.94), but jev says the rules are only "partly" written down
  (codify 0.23 to 0.27). Adding batches to the agent branch lifts agreement to 44% on the pattern
  and 71% on the family. Lowering the codify threshold adds almost nothing.
- **The models never say `keep_human`** for an automate or amplify task (Opus once, in 188). Asked
  how AI can take over or improve a task, a model finds a way. The human part ends up in the
  `human_edge` field instead. The rule's 13 `keep_human` tasks become copilot (8) or a build (5) in
  the models' hands. Examples are "inform applicants of acceptance or rejection" and "advise managers on
  equal-opportunity and harassment policy".
- jev features that track the models: rules written down vs autonomy r = 0.58, relational vs speedup
  r = −0.45, drudgery vs time saved r = 0.43. Ambition headroom does not track anything (r = −0.15
  with speedup), as the E1 notes expected. jev's "core of the work" matches the models' largest
  anatomy share on 49% of tasks.

## E4: from memory against grounded

Opus was grounded on all 14 roles (188 tasks). Sol was grounded on hrbp and the bookkeepers (30
tasks), but it still had web search, so its grounded answers are "digest plus web". Grok was not
grounded. `method/e4-notes.md` holds the first pass on four HR roles.

| Opus, 188 tasks | From memory | With the role digest |
|---|---|---|
| speedup, mean | 2.11 | 2.02 |
| time saved, mean % | 49.2 | 47.6 |
| autonomy, mean | 2.97 | 2.90 |
| hours freed, both teams, Opus alone | 12,655 | 12,110 (−4%) |
| pattern changed | | 72 tasks (38%) |
| agent with gate / llm step / deterministic / copilot | 50 / 26 / 56 / 55 | 27 / 42 / 62 / 57 |
| documented cases (E3) | 10 | 194 |
| named product, no case (E2) | 204 | 105 |
| tasks whose evidence cites the digest | | 82% |
| lens wording kept (word overlap) | | 0.17 |

- **The size barely moves.** Hours freed fall by 4%, in Finance a little more than in HR (speedup
  2.24 → 2.08 against 2.01 → 1.96), even though the digests carry modest field results.
- **The build moves, and mostly one way.** 28 tasks go from `agent_with_gate` to a fixed workflow
  (`deterministic_software` or `llm_step`); 6 go the other way. Agents nearly halve (50 → 27), and
  in Finance they drop from 26 to 9. The digests' advice ("keep the calculation deterministic, draft
  then gate") lands.
- **The evidence becomes citable.** Documented cases go from 10 to 194, and bare product names
  halve.
- **The lines are rewritten, not edited.** Only 17% of the words overlap.

**Does Sol move like Opus?** On the same 30 tasks (hrbp 7, bookkeeper 23):

| Same 30 tasks | Opus: memory → digest | Sol: web → digest and web |
|---|---|---|
| speedup, mean | 2.40 → 2.22 | 2.02 → 2.29 |
| time saved, mean % | 54.0 → 51.7 | 53.2 → 54.2 |
| autonomy, mean | 3.23 → 3.23 | 3.30 → 3.30 |
| hours freed | 3,017 → 2,889 (−4%) | 2,576 → 2,817 (+9%) |
| pattern changed | 9 of 30 | 7 of 30 |
| agent → fixed workflow / the other way | 5 / 1 | 3 / 0 |
| documented cases (E3) | 0 → 32 | 0 → 22 |
| tasks whose evidence cites the digest | 82% (all roles) | 43% |

- **The build: yes.** Both move towards deterministic software (Opus 13 → 16, Sol 15 → 19), and
  both cut agents from 6 to 3. After grounding the two models agree on the pattern for 24 of 30
  tasks, against 22 before.
- **The size: no.** Opus's speedups go down and Sol's go up (bookkeeper 2.17 → 2.52). Task by task,
  the two moved their speedup in the same direction on only 5 of 30. Sol's stated time saved barely
  moves (+1 point); it is its speedup figure that changes.
- **Sol leans on the digest less.** 43% of its tasks cite a digest source, against 82% for Opus. It
  kept searching (2 to 5 web searches per batch in the session logs) and cited 53 links, against 31
  from memory.
- **Searching by itself is not grounding.** From memory, Sol searched in every batch. It found product
  manuals and guidance (Microsoft Learn, AFAS help, Recruitee support, SER, UWV, the Dutch DPA), but
  no documented case (E3 0), and it chose `agent_with_gate` more often than any other model. The
  curated digest is what brought cases and simpler builds, for both models.

Read this with care: Sol covers 30 tasks in two roles and had the web both times. The pattern so far:
the digest's build advice carries across models, but its effect on the numbers has no common
direction. Grounding is a tool for choosing the build, not for sizing the prize.

## E6: what the roll-up says

Hours freed per task are `hours × (1 − 1/median speedup)`. The ceiling is
`1 / Σ (share_i / speedup_i)`, with human and machine tasks at 1. The ranges use each task's lowest
and highest model speedup.

| Team | FTE | Hours freed a year | FTE returned | Capacity returned | Ceiling | Limit (AI infinitely fast) |
|---|---|---|---|---|---|---|
| HR | 13 | 6,373 | 3.98 (3.38–4.41) | €443,490 (30% of cost) | 1.44× (1.35–1.51) | 3.27× |
| Finance | 10 | 6,041 | 3.78 (3.29–4.20) | €405,753 (36% of cost) | 1.61× (1.49–1.72) | 3.70× |

- **The limit is far away; the speedup sets the pace.** With the models' speedups (median 2.2× on
  automate tasks, 1.5× on amplify tasks) both teams land well below their Amdahl limit. The human
  share would only start to bind if the AI tasks went much faster.
- **Roles differ more than teams.** The HR business partner has the lowest ceiling (1.22×; half its
  time is not AI work, so it can never pass 2×), then the finance director (1.32×, limit 1.75×). The
  people analyst is the opposite: the highest ceiling (2.16×), with 96% of its time on AI tasks and a
  limit of 22.7×. It is the role that most clearly moves up a layer. FP&A (1.90×) and the
  bookkeepers (1.75×) follow.
- **Which model you ask moves the prize by about 10%.** HR hours freed: Sol 5,652, Opus 6,418, Grok
  6,756. Finance: Sol 5,585, Grok 6,198, Opus 6,237. That is small next to the gap between task
  potential (50%) and field results (3 to 7% of hours across a workforce; `research/frameworks.md`,
  change 12).
- **Redesign options.** In the same team (Jevons), 4.0 and 3.8 FTE of time go to work not done
  today. A smaller team in half-FTE steps per role would be HR 10.5 FTE (−2.5) and Finance 8.0 FTE
  (−2.0). Pods per value stream would need 9.0 and 6.2 FTE of work.
- **Opportunities.** 29 things to build cover 12,291 of the 12,414 hours freed (124 hours stay
  unclustered). They return €835,594 of capacity, or €1,134,428 with the financial and quality lines.
  Those lines rest on graded assumptions and count at half weight in the priority. The top five
  by priority: rolling forecast and scenarios, budget intake and variance commentary, invoice to
  payment, credit and collections agent, bank statement matching.
- **The priority formula favours copilots.** Priority divides by time to value, and a copilot gets
  1.5 months against 3 to 4 for a build. So a €60,770 forecasting copilot ranks above a €114,234
  collections agent. Copilot value depends on adoption, which the formula does not see.
- **The cluster patterns are simpler than the models on purpose.** 16 of 29 clusters use the
  pattern that holds most of the models' hours. Most differences pick `llm_step` or
  `deterministic_software` where the models say `agent_with_gate` (budget cycle, invoice to payment,
  reporting pack), following the E4 shift. Two clusters were moved to `llm_step` in this pass
  (candidate messages, labour market radar): a fixed workflow does the job, so they need no agent.

## What to change in model-v0.md

Each change names the experiment that shows it. Numbers in brackets point to the matching row in
SCHOLAR's table in `research/frameworks.md`.

1. **Make "from memory" checkable (E2).** Every model CLI gets an explicit web-off switch, and every
   run logs its tool calls. Rerun Sol with the web off. Keep "the model searches for itself" as a
   variant of its own if it is wanted.
2. **Ask for one number, derive the other (E2).** Ask only for time saved %, and compute the speedup
   in the script. Sol's two numbers disagree on 18% of tasks, enough to move its HR prize by 25%.
3. **Rewrite the ambitious lens (E2, E5) [9].** Coverage ("every case") is the default answer. Ask
   for one of three things instead: a new service to a named customer, a decision made far more often,
   or a group of people served for the first time. Then ask whether demand is elastic. Do not put
   "a tenth of the cost" in the prompt, because Grok repeats it back.
4. **Rewrite the altitude lens (E2) [13].** "Owns the rules" is the stock answer. Ask what the
   person's week looks like after the change, which decision rights they gain, and whether the job
   gets more or less expert.
5. **Keep `keep_human` out of the models' hands (E1).** The models never choose it for automate or
   amplify tasks. Decide it in rungs 2 and 3, from the relational and stakes probes and the legal gate
   [6]. Ask the models for the human edge, not for the pattern.
6. **Fix the rung-3 rule (E1).** Let batch work reach the build branches (+11 points of family
   agreement). Drop ambition headroom as a probe; it predicts nothing and belongs with the person or
   the lenses.
7. **Use the class probability as the instant first estimate (E1).** P(AI does nearly all) tracks the
   models' time saved (r = 0.75). The self-service intake can show a first role card before any
   model runs.
8. **Simplest first after the vote (E5) [7].** When any model sees a fixed workflow
   (`deterministic_software` or `llm_step`), the consensus should take it unless the steps cannot be
   predicted. Today 26 agent consensus tasks had such a vote.
9. **Ground before choosing the build (E4).** The digest changes Opus's pattern on 38% of tasks,
   mostly towards a fixed workflow, and Sol's moves the same way. It also brings the cases. Move rung 5 before rung 3, and feed curated digests rather than letting a model
   search: self-search finds manuals, not cases.
10. **Calibrate the size in the roll-up, not in the prompt (E4, E6) [12].** Grounding did not move
    the speedups in a common direction (Opus −4% of hours freed, Sol +9%). Show the models' figure as potential. Next to it, show an expected figure after
    review time and adoption, set from field studies until Noordhaven measures its own (E4 evidence).
11. **Grade a named product as E2 only with a link that was opened (E2).** Grok's 327 E2 items are
    product names with no link. Opus's are mostly the same. Without a link they are E1.
12. **Give the merge a better critic (E5).** Half of the best-line picks are ties, and the score
    rewards name-dropping. Use a pairwise judge on idea quality, or at least a finer score, before
    calling a line the strongest.
13. **Weight copilots for adoption in the priority (E6) [11, 19].** Multiply copilot value by an
    adoption share, or compare all patterns on value after twelve months. Then a short build band
    alone cannot put a copilot first.

## v1 merge

`tools/synthesize.py --variant v1` merges `runs/v1/` (v1 prompt, grounded with the digests, one number
asked: time saved; the runner derives the speedup) into `data/synthesis/v1/`, same file names, so the
v0 merge in `data/synthesis/` stays for comparison. The default (`--variant inmemory`) is unchanged
except for one thing: Sol's web-off rerun (`runs/inmemory-noweb/sol/`) replaces the web-on batch of
the same name where it exists, and `experiments.json` (`inmemory_sol_source`) lists which batches are
which (`--sol-with-web` restores the old Sol). The v1 rules, from the changes above:

- **Simplest first after the vote (change 8).** If any model chose `deterministic_software` or
  `llm_step`, the consensus takes the simplest of those, unless two or more models chose
  `agent_with_gate` and the models' mean anatomy puts coordinate + decide above 50%. Each task keeps
  `vote_pattern`; every override, and every case where the agent vote held, is in `simplest_first`.
- **keep_human from the rule, not the models (change 5).** A task the rung-3 rule
  (`data/patterns_rule.json`) marks `keep_human` for that role is `keep_human` in the merge, frees 0
  hours, and keeps the models' `human_edge` text.
- **Copilot adoption in the priority (change 13).** Copilot value × 0.5 (`ADOPTION_SHARE`) before value
  × confidence ÷ time to value.
- **Potential and expected (change 10, as decided by Joris on 2026-10-14).** Every hours-freed and
  capacity figure (task, role, team, opportunity) keeps its `potential` and gets an `_expected` twin
  per year: year 1 × 0.5, year 2 × 0.8, year 3 × 1.0. This is an adoption ramp: how much of the
  potential is in use as people take it up. It assumes the capability holds and is not a discount
  from field studies; the public time-saved figures are not used to shrink the models' potential.

Numbers at 23:50 on 2026-10-14, **with the v1 runs still landing** (Opus 5 batches, Sol 2, Grok 0):

| | Value |
|---|---|
| Coverage | 38 of 188 AI tasks answered (Opus 38, Sol 16, Grok 0, none by all three); 17,803 hours still on the fallback speedup, all of Finance |
| Consensus pattern | keep_human 11, copilot 10, llm_step 8, deterministic_software 7, agent_with_gate 2 (the vote: copilot 16, llm_step 11, deterministic 7, agent 4) |
| Simplest first | 1 override (agent → deterministic, an HR admin task; one agent vote, coordinate + decide 30%), 0 held for an agent |
| keep_human by rule | 13 AI tasks, 3,252 hours, 0 hours freed |
| HR, potential | 5,951 h, 3.72 FTE, €400,901 (v0: 6,373 h, 3.98 FTE) |
| HR, expected | year 1 1.86 FTE, year 2 2.98, year 3 3.72 |
| Finance, potential | 7,987 h, 4.99 FTE, €537,734: fallback speedups only, not a result yet |
| Finance, expected | year 1 2.50 FTE, year 2 3.99, year 3 4.99 |

The HR drop against v0 comes mostly from the keep_human gate. The top two of the v1 priority list are
now HR builds (screening and selection assistant, `llm_step`; answer desk, `agent_with_gate`), but
they rest on few answers; rerun the merge when the batches are in. The default rerun with one Sol batch web-off (FP&A) moved Finance from 6,041 to
6,076 hours.

## Open

- Grounded runs for Grok, and for Sol on the other twelve roles with its web off, to separate the
  digest's effect from the search.
- Sol rerun from memory with the web off, so E2 compares like with like.
- A check of the E2 product claims ("AFAS Profit does this today") against product documentation.
