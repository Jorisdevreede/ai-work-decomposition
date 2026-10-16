# Order: the AI Portfolio Grid in the team flow (2026-10-16)

Owner: pane 0 (Grok 4.7). Read `AGENTS.md`, `research/ai-portfolio-grid.md` (the method),
`prototypes/flow/MODEL.md` (the initiative shape) first. Write only in `prototypes/flow/`.

## What to build

At the top of the **Initiatives** tab of `prototypes/flow/index.html`, a view switch **Grid | List**
(Grid default). The list is the current view, unchanged.

### 1. Model: `portfolioGrid(result, profile, overrides)` in `model.js` (pure, no DOM)

Scores every initiative 0 to 100 on two axes, from data the model already has. Write the formula in
`MODEL.md` under a new heading "Portfolio grid".

- **Readiness (can we execute it today):** mean of four parts, each 0 to 100, kept separately so the UI
  can name the weakest one as "the blocker":
  - *data*: share of the initiative's systems the profile has named (a filled slot); no profile → 50;
  - *process*: by action type: stop, configure 90; generate, notification 75; records app, dashboard,
    answer desk 60; workflow 55; connect systems 40; checked AI step 35;
  - *contained*: 1 role 100, 2 roles 70, 3 or more 40; minus 10 per system beyond two (floor 0);
  - *effort*: S 90, M 60, L 30 (checked AI M/L counts as L when days_high is 30).
- **Prize (how big is the prize):** 0.65 × value rank (percentile of `value_eur` within the team) +
  0.20 × evidence (best task evidence grade among its tasks: E4 100, E3 85, E2 65, E1 35, none 20; read
  the tasks' `evidence` arrays, check the field names in `data/jobs/*.json`) + 0.15 × unlocks (share of
  other initiatives that share a system or flow with it, scaled to 0 to 100).
- **Quadrant:** split at 50 on both axes: Accelerate Now (ready, big), Invest to Unlock (not ready, big),
  Quick Wins (ready, small), Deprioritize (not ready, small).
- **Suggested call:** Accelerate Now and Quick Wins → Start; Invest to Unlock → Edit (fix: the weakest
  readiness part); Deprioritize → Stop, or Merge when another initiative has the same action type and
  shares a system.
- **Order:** Accelerate Now ranked by readiness first, then by value (odds before return); mark the top
  3 to 5 as "first wave". Quick Wins listed separately and their hours shown as a separate total ("not
  counted toward goal progress").
- `overrides` = `{[initiativeId]: {call, owner_wants: true|false|null}}` from localStorage. An owner who
  wants it adds 10 readiness; an owner who does not subtracts 20. Overrides change call and position.
- Add checks to `model.test.mjs`: every initiative gets exactly one quadrant; scores in 0..100; quadrant
  counts sum to the initiative count; Accelerate Now order is non-increasing in readiness; overrides move
  an initiative. Run it; existing checks must still pass.

### 2. UI

- Inline SVG scatter, no library: x = readiness ("Can we do it today?"), y = prize ("How big is the
  prize?"), quadrant names in the four corners, dot area by gross value, colour by quadrant using
  `style.css` tokens. Dots are buttons (keyboard focus, `aria-label` with name, quadrant, scores);
  hover/focus shows a small card; click opens the existing initiative detail.
- Under the grid, four short lists (≤ 7 visible each, "show all"): per initiative the name, call
  (a select: Start, Continue, Edit, Merge, Stop), the blocker for Invest to Unlock ("Blocked by: data"),
  an "Owner wants it?" yes/no/unknown control, the gross value. A one-line rule per quadrant, in our words,
  from `research/ai-portfolio-grid.md`.
- A short note: "Scores are a first read from generic task data. Readiness before production needs all
  eight checks." with the eight checks behind a disclosure. Credit the method once in small text: "After
  the AI Portfolio Grid by Matt Siegel, Arman Hezarkhani and Alex Lieberman (Tenex Labs)." No link.
- Exports: add `quadrant`, `readiness`, `prize`, `call` to the initiatives CSV/JSON.
- Works at 1440 and 390 px (at 390 the grid is full width and square, lists stack), clean console, no
  horizontal overflow. Plain English, no hype words.

## Done

`node prototypes/flow/model.test.mjs` passes; open `http://localhost:8790/prototypes/flow/index.html`,
run the default HR team, check the grid at both widths (Playwright if you have it, else say you did not).
Append to `fleet/STATUS.md`: `<time> G0 prototypes/flow grid <quadrant counts for the HR team>` and then
`G0 GRID DONE`. Do not commit.
