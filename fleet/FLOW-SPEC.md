# The team flow: from a team to actionable initiatives and an AI twin

The goal of the product, in one guided flow next to the existing prototypes. A team lead (first: HR)
sets up the team and walks out with a sorted list of initiatives, each traced to the tasks it
changes, a before/after per role and for the team, a business case, and an "AI twin" page per role
and for the team that says, positively and honestly, how the work changes for the better.

Read `AGENTS.md` (rules: static prototypes, no CDN, `prototypes/style.css` tokens, plain English).
Data: the generic task graphs of batch 1 (98 jobs) in `prototypes/data/jobs/<code>.json` and
`index.json` (built by `tools/build_jobs_view.py` from `runs/v3/sol/`), system slots and a sample
profile in `prototypes/data/system-slots.json` and `company-noordhaven.json`, O*NET task facts in
`~/Projects/AI-ISCO/data/onet_tasks.json`.

## The flow (one page, `prototypes/flow/index.html`, five steps with a progress bar)

1. **Your team.** Team name and function (HR preselected). One field, one button.
2. **Roles.** A prefilled team the lead edits, not an empty form. HR default: HR Manager
   (11-3121.00) 1 FTE, HR Specialist (13-1071.00) 3, Training and Development Specialist
   (13-1151.00) 2, Compensation and Benefits Specialist (13-1141.00) 1, HR Assistant (43-4161.00) 2,
   Payroll Clerk (43-3051.00) 1. Each row: role (searchable from the 98 jobs), FTE, cost per hour
   (default by role: 95/75/68/75/50/52 EUR), a link "see tasks". Add or remove roles.
3. **Your systems (optional, skippable).** Only the slots the chosen roles' tasks use, most used
   first: "Which recruitment system do you use?" Free text, with the Noordhaven sample as a one-click
   example. Skipping keeps generic labels.
4. **Working it out.** A short visible computation (task count, step count, roles) while the model
   runs in the browser; a real progress state, not a fake delay longer than the work.
5. **Results**, in tabs: **Team twin** (default), **Roles** (one twin per role), **Initiatives**,
   **Opportunities**, **Tasks**. A clear end state: "Your plan is ready" with export (print/PDF via the
   browser, and a JSON/CSV download of initiatives).

Everything stays in localStorage so a lead can come back; the setup can be changed at any time.

## The model (`prototypes/flow/model.js`, pure functions, no DOM; owned by MODEL)

- **Hours.** Role hours = FTE × 1,600. A task's share of its job = importance (3 if missing) ×
  frequency weight (O*NET frequency category 1..7 → 1, 1.5, 2.5, 4, 6, 8, 10; interpolate; 4 if
  missing), normalised over the job's tasks. Task hours = role hours × share. Step hours = task hours
  × step share_pct / 100. Hours after = step hours × remaining_pct / 100.
- **Before/after per role and team:** hours by fate, by kind of work (if available), by today's means
  (system screen, spreadsheet, mail, documents, meetings...), by rung; time returned; Amdahl ceiling
  `1 / Σ share_i / speedup_i` per role and team.
- **Opportunities** = tasks ranked by hours returned × cost, per role and for the team, with the
  task's design text, rung mix and time saved.
- **Initiatives** = things to build, traced to the steps (and so tasks and roles) they change. Group
  steps by **action type** and **main system slot** (and workflow where it helps naming):

  | Action type | From step | Name pattern |
  |---|---|---|
  | Stop doing | rung eliminate | "Stop: <step>" |
  | Configure a system | rung configure | "Configure the {SLOT}" |
  | Generate an artefact | block artefact_generator | "Generate <output artefact>" |
  | Build a workflow | block workflow_automation | "Automate the <workflow> flow" |
  | Build a records app | block crud_app | "Records app for <artefact>" |
  | Build a dashboard | block dashboard | "Dashboard for <workflow/topic>" |
  | Connect systems | block integration | "Connect {SLOT_A} and {SLOT_B}" |
  | Add a checked AI step | rung deterministic_plus_loop / block judgement_step | "AI step that <loop purpose> <input>" |
  | Answer desk | block answer_desk | "Answer desk for <topic>" |
  | Notifications | block notification | "Notify <role> when <event>" |

  Rung decides "configure" first; otherwise the block decides. Steps that stay manual or are
  conversations are not initiatives (they show in the twin as "kept human"). Per initiative: hours
  returned per year (Σ step hours × (1 − remaining/100)), value (× role cost), the roles and tasks
  it touches, systems, an effort band by action type (configure S, generate S, notification S, answer
  desk M, dashboard M, workflow M, records app M, connect M, AI step M/L; days: S 5, M 15, L 30, shown
  as a band, not a promise), priority = value ÷ effort days, and a quarter (Q1 for the top ones).
  Business case per initiative and in total: capacity returned, year 1/2/3 with an adoption ramp
  of 50/80/100 percent (labelled as adoption, not capability), gross: say so.
- **Text rendering:** `{SLOT}` → company product if the profile has it, else the slot label.
  Unfilled shown as a visible gap.
- Export `computeTeam(setup, jobsData, slots, profile)` returning a documented object; write the
  shape in `prototypes/flow/MODEL.md`. Unit-check it with a small Node script (`node
  prototypes/flow/model.test.mjs`).

## The twin pages (owned by UI)

Positive where it is true, never hiding the human part.

- **Role twin:** "Your role today" next to "Your role with AI": a week bar (hours by means or kind,
  before and after), the three biggest drudgery removals ("No more re-keying …"), what you get to do
  more of (from altitude, ambition, reach), what stays yours (human edge), skills to grow, the
  ceiling in one sentence, the initiatives that change this role, and its business case.
- **Team twin:** the same for the team: capacity returned in FTE and EUR, what the team could take
  on with it (ambitions), how roles shift (a small before/after per role), the initiative roadmap by
  quarter, and the team business case with the ramp. Lead with the benefit; keep a short "what this
  is and is not" note (generic estimates from O*NET-based task graphs, gross, to be confirmed).

## UX checklist (from /ux-principles; design acceptance criteria)

| Principle | Step | UI move | Worked if |
|---|---|---|---|
| Default bias / endowed progress | 1–2 | HR team prefilled; progress bar starts at step 1 done once a name is typed | lead reaches results with 3 clicks |
| Progressive disclosure | 2, 5 | role rows show essentials; tasks and steps behind "see tasks"/cards | no screen needs scrolling past one table |
| Cognitive load / Miller's law | 5 | top 5 initiatives first, rest behind "show all"; chunk by action type | each list ≤ 7 visible items before expand |
| Labor illusion (honest) | 4 | show real counts as they compute | shows actual task and step counts |
| Aha! moment / peak | 5 | team twin opens with one hero number (FTE returned) and one sentence of what it means | first screen states the benefit |
| Visual hierarchy / Von Restorff | 5 | the top initiative card stands out; one primary action per screen | one gold primary button per screen |
| Recognition over recall | 5 | initiatives show the tasks and roles they touch inline | no need to open another page to know why |
| Peak-end / exit points | end | "Your plan is ready": export, share, change setup | a clear end state exists |
| Guardrails | all | no pressure copy, no fake precision; ranges and "gross" labels | numbers show bands and labels |

## Look

Same top bar as the other prototypes, plus a **Team flow** link (add it to the other pages).
Use `prototypes/style.css` tokens and components (cards, stat cards, tags, buttons). Readable at 1440
and 390 px. Charts: simple inline SVG or CSS bars, accessible labels, no libraries. Copy: plain,
warm, specific; no hype words.
