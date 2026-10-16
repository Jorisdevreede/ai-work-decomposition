# Mockups: the whole app, three directions (2026-10-15)

Frontend only, to give an impression and explore options. Three clickable mockups of the finished
agentlabs product, each a different direction, the same story and mock data. Rules: `AGENTS.md`
(static, no CDN, no external fonts, plain JS, plain English, works at 1440 and 390 px, clean
console). A mockup may set its own look (it explores options) but defines colours as CSS tokens on
`:root` and follows the /impeccable bans: no side-stripe borders, no gradient text, no glassmorphism,
no hero-metric template, no identical card grids, no uppercase eyebrow over every section.

**Mock the data, not the flow.** Every screen below is reachable and shows realistic data; buttons
go where they say. Hash routing (`#/setup`, `#/goal`, ...) in one `index.html` per mockup, plus
`app.js`, `app.css`, `data.js` if you split.

## The product in one line

A team lead makes a team more AI native: configure the team, see the end goal up front, run
individual and team modules that each sharpen it, and leave with re-imagined roles, a team twin and
a prioritised, step-by-step plan. **Amplification first, automation second**: what people get to
do more of and better, not only what disappears.

## Mock data (use these, they come from the real model)

Noordhaven Logistics, HR team of 10 people, 6 roles (from `prototypes/flow/data/` and the flow model):
HR Manager 1, HR Specialist 3, Training and Development Specialist 2, Compensation and Benefits
Specialist 1, HR Assistant 2, Payroll Clerk 1. Invent first names for the people (Dutch, mixed).
Default HR team result: 134 tasks, 945 steps; about 8,850 gross hours a year returned = 5.5 FTE, about
EUR 586k gross, 2.2x ceiling. Label all money and hours "gross estimate". Systems: recruitment
system (ATS), HR system (HCM), payroll, Outlook, SharePoint; the Noordhaven sample names AFAS Profit.
Read `prototypes/flow/MODEL.md` and one or two `prototypes/flow/data/jobs/<code>.json` files to pick
real task and step texts (e.g. HR Assistant 43-4161.00, HR Specialist 13-1071.00).

## Screens (all three mockups have all of them)

1. **Start / configure the team**, three ways side by side: (a) upload a fuzzy source (org chart
   screenshot, job descriptions doc, meeting transcript) and show what was extracted with
   confidence and "check this" marks; (b) a voice agent ("Tell me about your team") with a live
   transcript and the roster filling in; (c) add by hand (team, roles, FTE, people). Ends in an
   editable roster: roles, people, FTE, systems.
2. **The goal, shown up front**: what you will have at the end: re-imagined roles, a team twin, a
   prioritised list of opportunities each broken into steps, a plan, and per step the approach.
   Show progress towards it (which parts are filled, by which modules).
3. **Team twin**: capacity returned (FTE, EUR, gross), what the team can take on with it, how each
   role shifts (before/after), a roadmap by quarter, what stays human.
4. **Role twin** (one role in depth, e.g. HR Specialist, with a person on it): week before and
   after, drudgery removed, what you get to do more of (amplification), what stays yours, skills to
   grow.
5. **Opportunities → steps → approach**: a sorted list; open one to see its steps, each step with
   its approach, one of: **deterministic rule**, **records (CRUD) app**, **artefact generation**,
   **workflow automation**, **traditional ML**, **dashboard**, **remove the step**, **stays human**,
   plus **amplify** (AI helps the person do it better). A legend that explains each approach in one
   line. Priority = value / effort, effort as a band.
6. **Plan**: initiatives by quarter, who owns them, what each builds, traced to the opportunities.
7. **Module library**, two lists, each module an accordion: what it does, how long it takes, who
   does it, what it contributes to the goal (which part of screen 2 it fills), status.
   - Individual: **Survey**, **Role analysis** (personalised version of our task analysis),
     **Card sorting** (like the Marion leadership-matrix cards prototype in
     `../leadership-matrix/mockups/cards/`: sort your tasks into piles), **Interview** (an AI
     interviewer, 20 min), **Connect your agenda** (real time use from the calendar, read-only).
   - Team: **SIPOC**, **Value stream analysis**, **North Star workshop** modules (after Amplitude's
     North Star Framework playbook: North Star metric, inputs, the work that moves them), plus one
     you think is missing.
8. **One module in progress**, clickable end to end: card sorting for an individual, or SIPOC for
   the team, ending in "this added X to your goal".

## The three directions

- **A, Guided journey** (Opus): a calm linear path. Setup, the goal as a destination map, then
  modules as stations along the way; the twins unlock and sharpen as stations are done. Feels like
  a good onboarding.
- **B, Workspace** (Sol): mission control for a team lead. A home with the goal progress, the team
  map with people, the opportunity board by approach, the module library in a side panel. Dense,
  calm, product UI.
- **C, Conversation first** (Sol): an agent leads. Chat and voice on one side, a canvas on the
  other that fills in (roster, twins, opportunities) as you talk and upload. Modules are suggested
  by the agent and run inline.

## Deliver

`mockups/<a-journey|b-workspace|c-conversation>/index.html` (+ files), a 1440 and a 390 screenshot
of the home and the team twin in the same folder, and `mockups/<dir>/CLICK.md`: a 6 to 10 step "what
to click" script. Check in a browser at `http://localhost:8790/mockups/<dir>/index.html`, clean
console. Append one line to `fleet/STATUS.md`. Write only in your mockup folder.
