# Order: the rest of the AI Portfolio Grid article in the team flow (2026-10-16)

Owner: pane 0 (Grok 4.7). Builds on `fleet/ORDERS-GRID.md` (done) and the lead's fixes after it
(prize = 0.8 × √(value/max) + 0.1 evidence + 0.1 unlocks; no named systems = data readiness unknown).
Read `AGENTS.md`, `research/ai-portfolio-grid.md`, `prototypes/flow/MODEL.md` (section "Portfolio grid").
Write only in `prototypes/flow/`. Keep `node prototypes/flow/model.test.mjs` green and add to it.

Principles: everything the lead types is optional and saved in localStorage; the page is useful with
nothing filled. Show at most 7 items per list before "show all". Plain English, no hype words. No
invented sources: the payback figures and rules are "the authors' rough figures" from the article.
Pure logic goes in `model.js` (new exported functions), DOM in `results.js`/`flow.js`/`ui.js`.
Every new formula is written in `MODEL.md` under "Portfolio grid" and checked with hand-computed
fixtures in `model.test.mjs` (write the arithmetic as an expression, as the existing grid tests do).

## 0. Layout

Add a results tab **Portfolio** (after Team twin). It holds, top to bottom: Goals, Portfolio health,
the grid with its quadrant lists (moved here from Initiatives), Enabling work, Already running. The
Initiatives tab goes back to its list (drop the Grid | List switch); each initiative's detail gains a
**Pilot card** and a **Readiness** section. A dot or row on the Portfolio tab opens that detail.

## 1. Goals (article step 1)

- Up to three team goals: text, "bigger or sooner?" (bigger / sooner / both), what limits it (people,
  process, data, technology; one or more) and a one-line note. Prefill two goals for an HR team,
  visibly marked "Example, edit or remove": "Answer employee HR questions within one working day"
  (limit: process) and "Fill open roles faster without adding recruiters" (limit: people, technology).
  Other functions start empty.
- Per initiative a select "Moves which goal?": not set / goal 1..3 / none. Suggest a goal (not applied)
  when a goal's words overlap the initiative name or its task texts (ignore stop words; show
  "Suggested: <goal>" with a one-click accept).
- Model: in `portfolioGrid`, an initiative the lead marked **none** gets prize capped at 49 (the
  article: an initiative that moves no goal is not part of the strategy; it can still be a Quick Win).
  Linked to a goal: prize + 10 (clamp 100). Not set: unchanged, flagged "not linked to a goal yet".
- A collapsed "How to find your goals" box with the article's two opening questions and the
  interview steps, as copyable text.

## 2. Already running (article step 2)

- A form to add AI work that already runs (also tools people pay for themselves): name, what it is
  for, who pays (company / employee), owner (name or empty), evidence it works (none / anecdotes /
  measured), the measure if any, goal (select), hours saved a year (optional), "same job as" (select
  another running item or an initiative, optional).
- Model `runningCalls(items, goals)`: suggested call with the article's rules: **Merge** when "same job
  as" is set; **Stop** when no owner, or evidence none and no hours; **Continue** when owner + evidence
  measured + (goal linked, or hours with a named destination); otherwise **Edit** (with what is
  missing: owner / measure / goal). The lead can override.
- Put running items on the grid as hollow rings (same axes): readiness 85 with an owner and measured
  evidence, 60 with anecdotes, 30 without an owner; prize from hours × the team's mean hourly cost on
  the same √ scale against the largest initiative, capped at 49 unless evidence is measured (the
  higher bar for existing work), +10 when linked to a goal.
- A "Copy the survey" button with the article's survey questions (which AI tools do you use, for
  what, who pays; what slows your week down) as plain text.

## 3. Pilot card (article step 3), in each initiative's detail

- Owner (name). Outcome builder: "Improve [measure] from [baseline] to [target] by [date]"; the card
  says **Checkable** only when all four are filled and baseline and target are numbers, else "Not
  checkable yet: <what is missing>". Alternative for uncertain work: "What must the pilot learn?"
  (one line, the article's "return on learning").
- Cost range, low and high in EUR, five lines: employee time, process change, data work,
  implementation, software. Prefill implementation from the effort band days × 8 h × the team's mean
  hourly cost (low = days_low, high = days_high), the rest 0, all labelled "starting estimate, edit".
- Where the hours go (more output from the same team / faster turnaround / fewer errors / growth
  without new hires / roles not backfilled) and who confirms it (default "Finance"). Until both are
  set, show the article's line: "Gross time saved is not realised savings."
- Go / no-go, written before the start: expand if, revise if, stop if (three lines, prefilled from the
  outcome measure, editable), a start date and a review date (default start + 6 weeks), checkpoints
  at 30, 60 and 90 days.
- Status: idea → pilot → revise (one cycle only; a second revise is refused with the article's
  reason) → expand → in production, or stopped. Stopped records the date.
- Model `pilotCheck(card, quadrant)`: **Start** is "earned" when owner + checkable outcome (or a
  learning question) + a cost range exist; else list what is missing next to the call. **Quick
  Wins** use the lighter check: owner + where the hours go + who confirms.
- Early evidence (shown once status is pilot or later): the article's four checks as yes/no/unknown
  (faster/cheaper/better without quality loss and hours went where said; used daily; the AI caused
  it; cost and benefit assumptions held). If less than 91 days since start: "Do not annualise yet".

## 4. Readiness before production (article 3.5)

- The eight checks per initiative, yes/no/unknown, prefilled where the model knows: "value at stake
  clear" yes when value_eur > 0; "data accessible" yes when all its systems are named, else unknown;
  "a business owner owns the result" yes when the pilot card has an owner. The rest start unknown.
- "In production" status is only allowed with all eight yes; otherwise say which are open. A pilot
  may start with checks open.

## 5. Portfolio health and enabling work (article 3.4, 4.1 to 4.5)

- A short strip: significant initiatives in pilot or expand (not Quick Wins) "N active, keep 3 to 5"
  (warn above 5); "Nothing stopped this quarter" warning once anything is in pilot and nothing has
  status stopped with a date in the current quarter; Quick Wins hours shown separately "not counted
  toward goal progress".
- A team setting "Does security, compliance or vendor policy block AI in production?" (no / partly /
  yes). Partly: every initiative's readiness − 10; yes: − 25, and an enabling card "Agree an AI
  policy and vendor approval" goes first.
- Model `enablingWork(grid, profile, policy)`: when the same readiness blocker is the weakest part of
  two or more initiatives with prize ≥ 50 and readiness < 50, create an enabling card ("Name your
  systems and open their data", "Define the process and its measures", "Split it into contained
  pieces", "Fund the larger build") with the initiatives it unblocks and their total gross value. Cards
  go into the first wave ahead of Accelerate Now (the article: enabling work returns nothing directly
  but belongs early).
- Time to first value per initiative, the authors' rough figures by kind of work: generate an
  artefact → content generation, 2 to 4 weeks; stop doing → weeks; configure, workflow, records app,
  notifications, answer desk, checked AI step, dashboard → workflow automation on a defined process,
  2 to 4 months; connect systems with four or more systems → platform-level change, 12 to 24 months,
  else 2 to 4 months. Show it on rows and in the first wave; label it "rough, from the article".

## 6. Exports

The JSON plan includes goals, running items, pilot cards, readiness checks, policy and enabling
cards; the initiatives CSV adds goal, owner, outcome, checkable, cost low/high, hours destination,
status, readiness checks yes count, time to first value. Print/PDF shows the Portfolio tab.

## Done

Tests pass (existing + new). Check `http://localhost:8790/prototypes/flow/index.html` with the default
HR team at 1440 and 390 px: Portfolio tab renders, a goal edit moves a dot, adding a running item
shows a ring and a call, a pilot card goes from "Not checkable yet" to "Checkable" and the call shows
"earned", the production status is refused with open checks. Clean console, no horizontal overflow.
Append `<time> G0 prototypes/flow portfolio <one line>` and then `G0 PORTFOLIO DONE` to
`fleet/STATUS.md`. Do not commit.
