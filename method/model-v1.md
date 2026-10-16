# The reimagine model, v1

From self-service inputs to advice and things to build. v0 (`model-v0.md`) was tested on a fictional
Dutch company (Noordhaven Logistics: HR 13 FTE, Finance 10 FTE, 268 O*NET tasks, 188 of them automate
or amplify) with three kinds of reasoning: fixed questions to jev (E1), three LLMs answering the same
schema (E2, E5), and research digests (E3, E4). Evidence: `findings.md`, `e1-jev-notes.md`,
`e4-notes.md`, `data/synthesis/`.

## What each kind of reasoning is good for

| | Fixed probes (jev) | LLM from memory | Research (web, X, last30days) |
|---|---|---|---|
| **Best at** | reproducible features over 18,838 tasks for cents: kind of work, drudgery, structure, stakes | the narrative: today's steps, the lenses, in-practice flow, human edge, risks, research questions | real cases, products that exist, failures, Dutch and EU law, what people do now |
| **Measured** | P(AI does nearly all) predicts the models' time saved at r = 0.75; "core of the work" at 0.86 confidence | three models agree on the pattern (2 of 3) for 95% of tasks and on the size within ~10% | changes the build on 38% of tasks (Opus, 188 tasks); documented cases 10 → 194 |
| **Fails at** | the build: its rule matched the models on 39%; middle answers bunch; "room for more" is a coin toss (0.35) | ambition and altitude collapse to stock ideas ("every case", "owns the rules"); never says keep human; product names without links | the size of the prize: speedup 2.11 → 2.02, unchanged; a model searching by itself finds manuals, not cases |
| **Use it for** | the instant first role card, the keep-human gate, the features a rule needs | the words a person reads, and ideas to vote on | choosing the build and grading the evidence |

The headline: **probes size it, research shapes it, models tell it.** And field studies (3 to 7% of
hours across a workforce) say the models' 50% is potential, not a forecast.

## The ladder, reordered

1. **Inputs** (self-service): the person ticks tasks, corrects time, picks apps, tags drudgery and
   what they want more of; the lead sets team, FTE, North Star and input metrics.
2. **Facts**: O*NET tasks, work activities, frequency, importance, software, related roles.
3. **Probes** (jev): the class questions plus a trimmed anatomy rubric (drop "room for more").
   Output an **instant role card**: hours by class and a first estimate of time back from P(AI does
   nearly all). No LLM needed; works for every one of the 1,016 roles.
4. **Gate** (rule): `keep_human` and legal gates are decided here, from relationship, stakes and the
   EU AI Act / works council flags, never by the models (they never choose it).
5. **Ground** (moved before the build): a curated digest per role, built once and reused across
   customers: cases with numbers, products with opened links, failures, NL/EU constraints. Refresh
   monthly with Grok on X and last30days.
6. **Reimagine** (LLM fleet, grounded): the lenses below, the in-practice flow, the human edge, risks
   and research questions. Two or three models; ideas merged as a union, the pattern by vote.
7. **Choose the build**: vote, then **simplest first**: if any model sees a fixed workflow
   (`deterministic_software` or `llm_step`), take it unless the steps cannot be predicted.
8. **Roll up**: role ceiling (Amdahl), team capacity and redesign options, opportunities clustered by
   work activity, pattern and system, business case with the formula shown.
9. **Calibrate**: show potential (models) next to expected (after review time and adoption, from field
   studies until the organisation measures its own), and track it against the North Star input.
10. **Advise**: person, lead, builder (below).

## The lenses, rewritten

The v0 lenses produced the same two answers everywhere. v1 asks sharper questions:

| Lens | v1 question |
|---|---|
| **Faster** | Which steps disappear, and what is the new time for the steps that stay? (Ask only time saved %; derive speedup.) |
| **Autonomous** | What event starts it, what runs without the person, where is the gate? |
| **Ambitious** | Pick one: a decision made far more often; a group served for the first time; a new service to a named internal or external customer. Is demand for it elastic? (Do not say "a tenth of the cost" in the prompt.) |
| **Joy** | What does nobody miss, and which part does the person want more of? (Match the intake tags.) |
| **Options** | Where do several drafts or scenarios change the decision, not just the effort? |
| **Altitude** | What does the person's week look like after the change; which decision rights do they gain; does the job get more or less expert? |
| **Reach** | Which tasks of which adjacent role can this person absorb, and what would they need to learn? |
| **Human edge** | Where does the person beat the machine and must stay (asked always; it replaces `keep_human` from the models). |

## Answers to the questions behind the run

- **How can a role take a team's workload, and where is the ceiling?** Amdahl. A role's speedup is
  `1 / Σ share ÷ speedup`; the human share sets the hard limit. Measured here: HR 1.44× today with the
  models' speedups (limit 3.3× if AI were infinitely fast), Finance 1.61× (limit 3.7×). The HR
  business partner can never pass 2× (half its time is human work); the people analyst could pass
  20×. So the polyvalent player is the role whose limit is high and whose reach is wide: people
  analytics, FP&A, bookkeeping, HR administration. The business partner grows by reach into
  adjacent advisory work, not by speed.
- **What does more ambitious mean?** Not "do it for every case", which every model said. It means a
  decision made more often (weekly forecasts instead of quarterly), people served for the first time
  (flex workers, night shifts), or a new service. This needs the person's and the lead's input; the
  models do not supply it unprompted.
- **Where does a human excel?** The models write it best in the `human_edge` field (Grok: "The
  employee often asks about a form when they are really asking whether they will be paid"). Keep it
  as a first-class output on every card.
- **What to prioritise?** Value × confidence ÷ time to value, with copilot value multiplied by an
  adoption share. Without it, copilots win on speed alone. Top five here: rolling forecast and
  scenarios, budget intake and variance commentary, invoice to payment, credit and collections agent,
  bank statement matching. In HR: an answer desk for HR and finance questions.

## Outputs

- **Person**: instant card (rung 3), then three drudgery removals for this week, one altitude move,
  one reach move, the skill to grow, the role's ceiling. Shareable with the manager.
- **Lead**: team canvas (hours by class, capacity, ceiling, three redesign options), the opportunity
  backlog tied to North Star inputs, value streams and lean waste.
- **Builder**: per opportunity a build brief with pattern, autonomy, systems, data and a golden demo
  script (event, messy case, real artefact, approval gate, closes the loop, business number).

## Before trusting the numbers

1. Rerun Sol with the web off (codex had search on; its E2 was not from memory).
2. Ask one number per task; derive the other.
3. Grade a product E2 only with an opened link.
4. Replace the specificity critic with a pairwise judge on idea quality.
5. Measure one opportunity at a real customer: the first E4 evidence.
