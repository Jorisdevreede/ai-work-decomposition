# Reflection

**What was hard.** The step shares. Nothing in the inputs says how a Noordhaven recruiter's week splits between reading CVs and chasing managers, so every `share_pct` is my guess, and the whole hours table rests on it. The 67% on screening depends on how many applications a knock-out question catches; that number is unknown and flagged. Second, shared steps. Scheduling appears in tasks 4, 8, 11 and 12, the certificate checklist in 7 and 11, the profile card in 1, 3, 6 and 8. I assigned each to one task, but the three opportunities draw across tasks, so their hours are a hand sum and the task table and the opportunity list cannot both be read as additive. Third, the legal line between "a card with facts" and "an evaluation". I drew it at: no score, no ranking, no automated rejection, the recruiter can overrule. I am not sure the Autoriteit Persoonsgegevens or a works council draws it there, and Article 22 on knock-out sorting is open.

**Unsure about.** Whether shift workers use booking links, or the phone stays the channel. Whether Recruitee's API carries stage events and questionnaire answers at the grain I assume (model knowledge). Whether a 3.6× hard limit means anything in a job with a seasonal peak, where Amdahl's fixed workload does not hold. Whether 59% is honest: the digest's one cycle-time case is a vendor partnership without baseline, and the survey evidence says efficiency, not transformation [S2]. The numbers are the bet the owner asked for, with the ramp shown.

**Where the method got in the way.**

- The class "human" on four tasks. Jev's own measures on 4, 7 and 11 say coordinate or gather, drudgery over half, workflow automation as main shape. The label would have zeroed 730 hours of paperwork around a call or a test.
- The schema says `machine` means `remaining_pct` 0, but the example bookkeeper file uses `machine` with 20 and carries `time_saved_pct`, `speedup` and `_meta`, which `additionalProperties: false` forbids. A reviewer cannot tell which is the contract. I followed the schema and put the derived numbers in job.md.
- No `workflow_id` or "shared with task X", so reuse is invisible and double counting is easy.
- `handoff_to` wants a role id; the hiring manager is not a role in the input, so I wrote "line manager".
- The digest and the signals file number sources differently ([S2] is a survey in one, a Workday post in the other). I cited the digest, as the brief says, but it is a trap.
- No jev question asks the share of the task that is the human core. "Drudgery" is close but bands on quarters; a number would seed `share_pct` directly.

**Three changes before 4,400 tasks.**

1. **Class per step, not per task.** Drop "human" as a task label. Ask jev for the human-core share as a number and the fate of the rest, and let the keep-human gate fire on the step whose authority is a conversation or a decision. Keep `human_edge` as the narrative.
2. **Workflow ids and a rule table for legal gates.** Add `workflow_id` and `shared_with` to steps and roll up by workflow before role. Put the legal gates in a dated table keyed on authority and data (candidate-facing generative text, filtering or evaluating candidates, special-category data, works-council items) and apply them by rule in the script, shown on the card. Every model re-deriving the AI Act per task is slow and will drift.
3. **Validate what the schema promises.** Make "machine means 0", "shares sum to 100" and "loop only on D+" validators that fail the run. Compute `time_saved_pct` and `speedup` in the script, outside the model's output, and store them beside the model's file, not inside it. Then example and schema agree, and the reviewer reads one contract.
