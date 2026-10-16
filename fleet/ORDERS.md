# Orders, run of 2026-10-14

Every pane: read `AGENTS.md` and `method/model-v0.md` first, then your order below. Roles and their
ids are in `data/teams.json` (`teams[].roles[].id`). HR roles: hr-director, hrbp, recruiter,
hr-admin, payroll, cnb, ld, people-analyst. Finance roles: finance-director, controller, accountant,
bookkeeper, collections, fpa.

---

## SCOUT (Grok 4.7): what practitioners do now, from X and the web

Experiment E3. For each of the 14 roles, find what people in that job are actually doing with AI
now: posts on X and the web from the last 90 days, the products they name, cases with numbers,
failures and backlash, and anything Dutch or EU specific (AFAS, Visma, Nmbrs, Recruitee, works
councils, EU AI Act high-risk rules for recruitment and worker management).

- Write `research/signals/<role-id>.md`, one per role: 8 to 15 items, each with date, source link,
  who (role, company if public), what they did, a number if there is one, and an evidence grade.
  Flag hype and vendor marketing as such. Open every link you cite.
- Write `research/signals/people-to-follow.md`: practitioners and thinkers on AI in HR and in finance
  operations worth following on X or LinkedIn, with handle, why, and one representative post link.
- Order: hrbp, recruiter, hr-admin, payroll, ld, cnb, people-analyst, hr-director, then the finance
  roles. Append to `fleet/STATUS.md` after each role.

## SCHOLAR (Opus 5.5): frameworks, thought leaders, last30days, and the role digests

Experiments E3 and the input to E4.

1. `research/frameworks.md`: the thinkers and frameworks that should shape this model, each with its
   core idea, what it changes in our model (which rung, lens or question it adds or kills), and a
   source you opened. At least: Mollick (jagged frontier, centaurs and cyborgs), Bersin (superworker),
   Jesuthasan and Boudreau (work without jobs, deconstruction), Agrawal, Gans and Goldfarb (point
   versus system solutions), Sangeet Paul Choudary (Reshuffle), Brynjolfsson (Turing trap), Goldratt
   (theory of constraints) next to our Amdahl ceiling, Jevons, lean value streams and TIMWOODS,
   Amplitude North Star, Teresa Torres (opportunity solution tree), the Tenex agent sprint, and what
   McKinsey, BCG or the WEF published on agentic organisations this year. Add who we are missing.
2. Run the `/last30days` skill on: "AI agents in HR teams", "AI in finance month-end close and
   accounts payable", "AI for HR business partners". Save each result to `research/last30days/`.
3. When `research/signals/<role-id>.md` exists for a role (SCOUT writes them), write
   `research/digests/<role-id>.md`: at most 600 words, the facts a model should know to reimagine
   that role's tasks well: what is proven, which products, which cases with numbers, what fails,
   Dutch and EU constraints. Cite as `[S1]`, `[S2]` with the links listed at the end. Start with hrbp,
   recruiter, payroll, bookkeeper.

## SYNTH (Opus 5.5): merge, roll up, find the opportunities

Experiments E5 and E6. The model answers land in `runs/inmemory/{opus,sol,grok}/` (and later
`runs/grounded/`) while you work; start with what is there and rerun as more arrives.

1. `tools/synthesize.py` (Python standard library only), writing:
   - `data/synthesis/tasks.json`: per task uid, the three models side by side, the consensus
     pattern and autonomy, an agreement score, the median speedup and time saved, the strongest
     line per lens with the model that wrote it, the union of research questions, evidence grades.
   - `data/synthesis/roles.json`: per role, hours freed per year, the Amdahl ceiling
     (`1 / Σ share_i / speedup_i`, human and machine tasks at speedup 1 unless a model says more),
     altitude, reach, skills to grow, ambitious version, merged across models.
   - `data/synthesis/teams.json`: per team, FTE capacity returned, team ceiling, the three redesign
     options from the method with numbers.
2. `data/synthesis/opportunities.json`: cluster tasks across roles and both teams into 15 to 30
   opportunities (one thing to build each: by work activity, pattern and system). Per opportunity:
   name, tasks and roles, pattern and autonomy, systems, business case with the formula shown
   (hours × % removed × cost = capacity returned, plus financial and quality lines where they apply,
   route to cash), North Star input metric, value stream step, lean waste, priority (value ×
   confidence ÷ time to value), and a build brief with a golden demo script (event trigger, messy
   case, real artefact, approval gate, closes the loop, ends on the business number). Use judgement
   for the clustering; keep the arithmetic in the script.
3. `method/findings.md`: what the experiments show. How the three models differ (specificity,
   ambition, honesty about evidence, sameness), in-memory versus grounded, where the deterministic
   probes and the generative answers disagree, and what to change in `model-v0.md`.

## CANVAS (Sol 6.1): prototype P1, the team canvas

`prototypes/team-canvas.html`: the team lead's view. Pick team (HR, Finance). Show roles as rows with
FTE, cost and hours per class (automate, amplify, machines, human); the time each role gets back; the
Amdahl ceiling per role and for the team with a short plain explanation; a polyvalence view (which
role can take which adjacent tasks once AI takes its drudgery, from the models' `reach`); and the
three redesign scenarios (same team, more ambitious; smaller team, same output; pods per value
stream) with sliders for adoption and speedup. Read `data/teams.json` now; read
`data/synthesis/roles.json` and `data/synthesis/teams.json` when they exist, and compute fallbacks
from `runs/inmemory/*/` until then (automate speedup 4, amplify 1.8, others 1 as the last resort).

## EXPLORER (Opus 5.5): prototypes P2 and P4, the task explorer and the opportunity board

1. `prototypes/task-explorer.html`: pick a role, see its automate and amplify tasks; open a task to
   see the O*NET facts, the class probabilities, the three models' answers side by side per lens,
   their pattern and autonomy, where they agree and differ, evidence grades, risks and research
   questions, and "how it works in practice" as a small flow (trigger, steps, human gate, systems).
   Read `runs/inmemory/*/` directly; switch to `data/synthesis/tasks.json` when it exists.
2. `prototypes/opportunities.html`: the opportunity board from `data/synthesis/opportunities.json`:
   ranked list, filters by team, pattern and value stream, a business case card with the formula,
   and the build brief with the golden demo script. Build it against the field names in SYNTH's
   order; until the file exists, make a three-item sample at `prototypes/sample-opportunities.json`
   and say so on the page.

## INTAKE (Sol 6.1): prototype P3, self-service intake to personal advice

`prototypes/intake.html`: the individual's flow in four short steps. 1) Find your role (search the
role titles in `data/teams.json`; say that the product would search all 1,016 O*NET roles). 2) Tick
the tasks you do and drag how much time each takes (start from the O*NET shares). 3) Pick the
software you use from the role's list and add your own. 4) Tag what drains you (chasing, copying,
formatting, scheduling, searching, reporting, rework) and what you want more of (customers, strategy,
coaching, building, learning). Then show "your advice": your hours by class, three drudgery
removals to start this week (from the models' `joy`, `faster` and `in_practice`, matched to your
tags and software), one altitude move, one reach move, the skill to grow, and the ceiling for your
role. Use the model answers in `runs/inmemory/*/` (and `data/synthesis/` once it exists). Keep it
warm and practical; this is the page a person would share with their manager.

---

## RESUME after the crash of 2026-10-14 (the earlier panes died; files survived)

- SCOUT: signals exist for hrbp, recruiter, hr-admin, payroll, ld, cnb, people-analyst. Do the rest:
  hr-director, then finance-director, controller, accountant, bookkeeper, collections, fpa, and
  `research/signals/people-to-follow.md` if missing.
- SCHOLAR: `research/frameworks.md` and three last30days runs exist; check frameworks.md is complete
  against your order. Digests exist for hrbp, recruiter, hr-admin, payroll, ld, cnb, people-analyst.
  Write the missing digests as SCOUT's signals land (finance roles and hr-director).
- SYNTH: `tools/synthesize.py` and `data/synthesis/*` exist. The model runs are being completed in
  the background (`runs-e2b.log`); rerun the synthesis whenever new files land, then write
  `method/findings.md` (read `method/e1-jev-notes.md` and `method/e4-notes.md` first). Also compare
  `data/patterns_rule.json` (jev rule) with the model consensus patterns.
