# The reimagine model, v0

How to get from self-service inputs (the tasks people do, the software they use) to advice and
actionable opportunities: things to build as deterministic software (built faster with AI), as an
AI step inside a workflow, or as an agent. Draft for the exploration run of 2026-10-14; the
experiments below exist to test and replace parts of it.

Focus: the tasks AI can take over (**automate**) or make clearly better (**amplify**). Tasks that
machinery does or that stay human are left for later.

## The ladder

Each rung adds a different kind of knowledge, and each has its own way of being wrong.

| # | Rung | Kind | Source | Fails by |
|---|---|---|---|---|
| 0 | **Inputs** | self-service | the person ticks tasks, corrects time, picks apps, tags pains; the lead sets team, FTE, North Star | people describe the job they think they have |
| 1 | **Facts** | deterministic | O*NET tasks, work activities, importance, frequency, software, US pay | US-centric, generic statements |
| 2 | **Probes** | fixed questions, probabilities | jev (TypeSafe): the six class questions plus an anatomy rubric | a fixed question misses what is special |
| 3 | **Pattern** | rules on probes | which solution type and autonomy level | rules are only as good as the features |
| 4 | **Reimagine** | generative | LLM fleet (Opus 5.5, Sol 6.1, Grok 4.7) through seven lenses | confident fiction, sameness |
| 5 | **Ground** | research | web, X through Grok, last30days, product docs, cases | recency noise, vendor claims |
| 6 | **Roll up** | arithmetic + synthesis | role card, team capacity and ceiling, opportunity clusters, business case | double counting, Amdahl ignored |
| 7 | **Advise** | output | personal moves, team backlog, build brief with golden demo | advice nobody can act on |

Rung 2 and 3 make the answer reproducible and comparable across 18,838 tasks; rung 4 makes it
specific and inspiring; rung 5 keeps rung 4 honest. Every claim carries an evidence grade:
**E0** imagined, **E1** plausible from model knowledge, **E2** a product does this today,
**E3** a documented case, **E4** measured in this organisation.

## Rung 3: solution patterns and autonomy

| Pattern | When | Build | Example |
|---|---|---|---|
| **deterministic_software** | rules can be written down, inputs structured, output checkable | workflow, integration, rules engine, report; built fast with AI coding, runs without a model | payroll mutation check, contract generation from AFAS fields |
| **llm_step** | unstructured input (mail, CV, PDF) into a structured, checkable output | deterministic workflow with one model call inside it | CV to candidate profile, invoice PDF to booking |
| **agent_with_gate** | several steps, tools and exceptions; a person approves before it counts | agent with skills, a router and an approval gate | absence case follow-up, collections dunning |
| **copilot** | the person stays the lead; judgement, trust or accountability | briefings, drafts, options, simulations, practice | HRBP preparing a difficult conversation |
| **keep_human** | presence, trust, liability or care is the value | none; protect the time | delivering a dismissal |

Autonomy levels (as in driving): **0** manual, **1** assisted (AI suggests), **2** partial (AI drafts,
person does), **3** conditional (AI does, person approves each), **4** high (AI does, person handles
exceptions), **5** full.

## Rung 4: the seven lenses

Asked of every automate and amplify task, from the point of view of the person doing it:

1. **Faster**: the same result in a fraction of the time. Which steps disappear?
2. **Autonomous**: what runs without the person, triggered by an event instead of a reminder?
3. **Ambitious**: if this cost a tenth, what would we want ten times more of, or done properly for the
   first time? (Jevons: cheaper work gets more demand, not less.)
4. **Joy**: take out the drudgery. Which parts does nobody miss, and what is left that people like?
5. **Options**: instead of one draft, five; instead of one plan, scenarios. What choices open up?
6. **Altitude**: one layer of abstraction up. The person stops doing the task and designs, checks and
   improves the system that does it. What does that job look like?
7. **Reach**: which tasks of adjacent roles can this person now take on? (The polyvalent player:
   defence, midfield, attack.)

Plus: **human edge** (where the person beats the machine, and must stay), **in practice** (trigger,
steps, human gate, systems, data, where it logs), **time saved** and **speedup**, **risks**, and the
**research questions** that would confirm or kill the idea.

## Rung 6: roll-ups

**Role.** Hours per class, hours freed, the role one layer up, the adjacent tasks it can absorb,
skills to grow.

**Ceiling (Amdahl).** A role's speedup is `1 / Σ (share_i / speedup_i)`. If 30% of the time stays
human at speedup 1, the role cannot go faster than 3.3×, however good the AI is. The same holds for a
team, where approval gates and handoffs count as human time. The ceiling tells where to stop
automating and start redesigning: the human-only share, not the AI, sets the limit.

**Team.** Capacity returned in FTE, the new ceiling, and three redesign options: the same team doing
more ambitious work (Jevons), a smaller team doing the same work, or polyvalent pods that cover a
whole value stream (hire to productive, procure to pay).

**Opportunities.** Tasks cluster across roles and teams by work activity, pattern and system. One
opportunity is one thing to build. Each gets a business case (after the Tenex sprint method):
- labour: annual hours × % removed × loaded hourly cost, called capacity returned, with the route to
  cash (fewer hires, less agency spend, people moved to revenue work);
- financial: faster cash, avoided spend, captured discounts, avoided fines;
- quality and risk: volume × error rate × cost per error × % prevented, never carrying a case alone.

And it is tied to a **North Star input metric** (Amplitude), a **value stream step** and a **lean
waste** (TIMWOODS: transport/handoffs, inventory/queues, motion/app switching, waiting,
overprocessing, overproduction, defects/rework, skills unused).

Priority = value × confidence ÷ time to value, with the build pattern setting the effort band.

## Rung 7: advice

- **Person:** three drudgery removals to start this week, one altitude move, one reach move, the skill
  to grow.
- **Team lead:** the opportunity backlog, the team ceiling, a redesign option, the North Star input it
  moves.
- **Builder:** a build brief per opportunity with a golden demo: starts from an event, handles a messy
  case, works in a real artefact, enforces an approval, closes the loop, ends on the business number.

## The experiments of this run

| Id | Question | How |
|---|---|---|
| E1 | What do fixed, deterministic questions add? | jev anatomy rubric over all team tasks |
| E2 | What can an LLM do from memory alone? | Opus 5.5, Sol 6.1 and Grok 4.7, no web, same schema |
| E3 | What does research add? | Grok on X and web, Claude web search, last30days, per role |
| E4 | Does grounding change the answer? | E2 rerun with the E3 digest, compared |
| E5 | How do models differ, and how to merge them? | consensus, union of ideas, disagreements, critic score |
| E6 | What does the roll-up say? | role cards, Amdahl ceiling, polyvalence, opportunities, business case |
| P1-P4 | What would the self-service product look like? | four prototypes on the same data |
