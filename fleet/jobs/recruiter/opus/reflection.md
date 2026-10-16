# Reflection (Opus 5.5)

## What was hard

- **Volume.** I do not know how many vacancies, applications, tests or flex orders Noordhaven handles. Every step share is my guess at a typical Dutch logistics recruiter. The hours rest on O*NET time shares, not on this team.
- **The O*NET task list does not match this job.** It omits hiring-manager intake, offers and salary talks, and the hand-off to onboarding, which are large parts of a recruiter's week. It includes "drug tests", which are barely lawful in the Netherlands, and "develop tests", which belongs to an HR manager. So I fitted Noordhaven's real work into tasks that were written for another job.
- **Who does it.** Agency orders may sit with site planners, not recruiters. Practical tests may be run by site trainers. I assumed the recruiter does both.
- **Legal gates bend the build more than technology does.** Matching is the biggest prize, but it comes third because works council consent and a DPIA take longer than the code.

## What I am unsure about

- **Review time.** It carries the result. If recruiters re-read every CV despite the evidence table, the matching task saves 40%, not 70%.
- **The 58% role saving.** It assumes stage discipline in Recruitee, and a data spine that works.
- **Recruitee features.** I took stage emails and talent-pool consent fields from model knowledge, without an opened link.
- **The flex workers' path to a permanent job.** It may cost a takeover fee under the agency contracts, which I have not seen.

## Where the method, schema or probes got in the way

- **Fate and remaining time conflict.** The schema says `machine` means 0% remaining, but most automated steps leave a small queue of exceptions. I relabelled those as `person_reviews`. The example file breaks the same rule.
- **No shared step identity.** The evidence table is built in matching and used in selection, interviews and the criteria review. Nothing stops each task from claiming the same saving. Astra's point 7 is right.
- **New work has nowhere to go.** Maintaining fact sheets, templates, checklists, question banks, the overseer role and the works council track is real work. I hid it inside "remaining" percentages.
- **No legal tag per step.** `human_gate` and `authority` cannot say "Annex III use", "Art. 22 decision", "special category data" or "Art. 50 interaction". I wrote these in prose, where a roll-up cannot count them.
- **Steps done by others.** The schema has `actor`, but `share_pct` is the recruiter's time only. Moving work to a manager or a candidate (self-booking) looks like a saving when it is partly a transfer.
- **jev's class labels contradict jev's own shape answers.** Three tasks are classed "human" while their shape is workflow automation at over 0.9. The class asks about the core of the task; the shape asks about the work around it.
- **Some probes are not specific enough.** "Vanishes" (0.47 for interviews) and "interface: api" (0.89 for sourcing) read as if the probe had no idea which system is meant.
- **No probe for "lawful here".** A US task (drug tests) passes straight through.

## Three changes before 4,400 tasks

1. **Give each step a workflow id and a legal tag, both set by rule.** Take a step id from a shared catalogue (for example "candidate document check") so savings are counted once per workflow. Add a `legal_use` enum (`annex_iii`, `art22`, `art50`, `special_data`, `none`), set by rules over the step's action and data, not by the model. Then the roll-up can dedupe, and the gates can be counted.
2. **Make new work and transfers explicit.** Add `new_steps` (upkeep, oversight, consent) with hours. Add `moves_to` for work that shifts to another role or to the candidate. The ceiling then shows net team savings, not just one role's relief.
3. **Retire the task-level class, or derive it from the steps.** Report hours by step fate instead of "automate / amplify / human". Add a jurisdiction filter that drops or flags tasks that are unlawful or unusual in the Netherlands before they reach a model. Keep jev for the step features it is good at: drudgery, structure, stakes and reversibility.
