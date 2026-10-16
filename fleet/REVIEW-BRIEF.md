# Review brief: the team-reimagine approach, before tonight's fleet

You are an independent reviewer. Read this brief, then the files it names, and say what you would
change. Be concrete and critical; we want improvements, not praise.

## The product (AgentLabs)

Self-service: a person picks their role, ticks the tasks they really do, picks the software they use,
tags what drains them. A team lead adds the team (roles × FTE) and a North Star. Out comes advice for
the person, a team view (capacity, ceiling, redesign options) and a backlog of opportunities to build,
each with a business case and a build brief with a golden demo (after the Tenex 5-day agent sprint,
but self-service, tied to lean value streams and North Star metrics).

## Joris's bets (the owner; take them as given, but tell us where they make the method fragile)

1. Do not discount the models' time-saved estimates with public field studies; capabilities are new
   and improving, adoption lags. Show potential plus an adoption ramp (year 1 50%, 2 80%, 3 100%).
2. Most tasks are best solved with deterministic technology that is now built 10–100× faster with AI
   coding, plus small bounded agentic loops where a task truly needs reasoning or judgement.
   Autonomous end-to-end agents are not discarded but are not the default: they are harder, riskier
   and more expensive. The first year is "deterministic 10–50× faster, the last 20% now automatable,
   agentic steps wired in where needed".
3. Writing: generate as now, then a de-slop pass (flag with a script, rewrite flagged fields only).

## What exists (read these)

- `method/model-v1.md`: the current method (ladder of rungs, lenses, patterns, roll-ups, outputs).
- `method/findings.md`: what experiments E1–E6 showed (jev fixed probes, three LLMs from memory,
  research digests, merge, roll-up), including the "v1 merge" section.
- `method/e1-jev-notes.md`, `tools/jev_anatomy.py`: the eleven fixed questions to jev.
- `tools/reimagine.py` (prompt `METHOD_V1`) and `schema/reimagine-v1.schema.json`: how tasks are
  enriched by LLMs.
- `tools/pattern_rules.py`: the deterministic pattern rule.
- `research/frameworks.md`: thinkers and frameworks considered.
- Sample outputs: `runs/inmemory/opus/hrbp__1.json`, `runs/grounded/opus/bookkeeper__1.json`.

## Proposed v2 (not built yet)

- Patterns become a build ladder, cheapest first: **D** deterministic (no model at runtime); **D+**
  deterministic workflow with N bounded agentic loops (read, extract, judge, draft, reconcile; tools
  and a stop condition) as the default; **C** copilot; **A** autonomous agent only with a written
  justification why D+ is not enough, plus cost and risk.
- New per-task fields: what "last 20%" becomes feasible now; number and purpose of agentic loops;
  build effort in days with AI coding; run cost class.
- De-slop pass on all generated text.

## Tonight's fleet (proposed)

Jev anatomy rubric on all 18,838 O*NET tasks (about $2). Then Opus 5.5 with the v2 prompt on the
~4,400 automate and amplify tasks (550 batches of 8), possibly Grok 4.7 as a second opinion,
grounded with ~100 research digests written at O*NET minor-group level, then the de-slop pass and
the merge.

## Questions for you

1. What is wrong or missing in the method (rungs, lenses, patterns, roll-up, priority)?
2. Is the v2 build ladder the right taxonomy? What would you add, merge or drop?
3. The jev questions: which to change, add or drop to serve a deterministic-first bet?
4. The LLM prompt and schema: what would make the output more useful and less samey at 4,400 tasks?
5. The night fleet: what would you do differently (models, batching, grounding, quality checks,
   cost), and what must be in place so the output is trustworthy enough to show customers?
6. Anything that would make this product clearly better than a consultant's spreadsheet.

Answer in at most 900 words, in plain English, as a numbered list of concrete changes, most important
first, each with the reason. Then a short list of risks you see in Joris's bets.
