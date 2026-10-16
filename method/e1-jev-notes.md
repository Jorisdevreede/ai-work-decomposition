# E1 notes: what the jev anatomy rubric returned

268 tasks (both teams, every class), eleven questions, jev-1.13.0, 480,100 input tokens
(`data/jev_anatomy.json`). The rule in `tools/pattern_rules.py` turns the answers into a pattern
(`data/patterns_rule.json`).

## How sure jev is, per question (mean confidence of the top answer)

| Question | Confidence | Top answers (count of 268) |
|---|---|---|
| core of the work | 0.86 | transform 82, communicate 54, create 43, decide 32, gather 30, coordinate 27 |
| error cost | 0.73 | legal or financial 212, rework 34, harm to people 22 |
| rules | 0.70 | partly 190, mostly 77, fully 1 |
| input | 0.69 | structured 188, unstructured 30, documents 26, situational 24 |
| data in systems | 0.66 | partly 222, yes 41, no 5 |
| volume | 0.62 | batches 123, stream 67, cases 48, projects 30 |
| relationship | 0.55 | no 132, partly 122, largely 14 |
| verifiable | 0.50 | with review 225, only later 31, hardly 8, instantly 4 |
| drudgery | 0.49 | under a quarter 112, over half 87, a quarter to half 66, none 3 |
| ambition headroom | 0.35 | somewhat 111, a lot 105, no 52 |

## What that means

- **Strong:** the kind of work (core) is the most reliable signal, and drudgery separates the
  classes well even at low confidence: 55 of 117 automate tasks are "over half drudgery", against 11
  of 71 amplify tasks.
- **Bunched:** rules, error cost, verifiable and data in systems pile onto one middle answer, so
  the top answer barely discriminates; the rule reads probability-weighted features instead.
- **Weak:** ambition headroom (0.35) is close to a coin toss; it is a judgement about the
  organisation, not the task, and belongs with the LLM lenses or the person, not in a probe.
- **Rule outcome:** automate tasks → copilot 54, deterministic software 45, llm step 7, keep
  human 6, agent with gate 5; amplify tasks → copilot 54, keep human 7, agent with gate 7,
  deterministic software 3. The rule is conservative: "rules partly" pushes many automate tasks to
  copilot. Compare with the models' patterns before trusting either.
