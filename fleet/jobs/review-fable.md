All source reading is done. One claim three models made is confirmed: the digest and the signals file number their sources differently (digest S2 is the HR Dive survey, signals S2 is the Workday question-generation post). The example bookkeeper file does carry `time_saved_pct`, `speedup` and `_meta` and uses `machine` with non-zero remaining time, as Fable said.

I'm waiting on the validation script's results (schema validity, step sums, fate contract, recomputed hours and ceilings per model) before writing the review.

The validation agent could not run anything: no agent in this session has a shell, and Bash isn't available to me either. I did the arithmetic by hand from the five task graphs instead (step sums, fate contract, after-hours per task, ceilings, opportunity sums). Every number below is checked that way.

# Review: five models on the Recruiter

Files: [fleet/jobs/recruiter/](file:///Users/Joris.deVreede/Projects/agentlabs-hub/solutions/team-reimagine/fleet/jobs/recruiter/).

**1. Ranking**

| Place | Model | After hours | Role speedup | Hours table matches taskgraph |
|---|---|---|---|---|
| 1 | Fable | 1,326 | 2.41× | yes |
| 2 | Opus | 1,338 | 2.39× | yes |
| 3 | Grok | 1,107 | 2.89× | yes |
| 4 | Sol | 1,572 | 2.04× | yes |
| 5 | Astra | 1,575 | 2.03× | yes |

- **Fable first.** The only job.md a recruiter would recognise as their week: "Friday 22:10 a candidate applies for night-shift picker in Tilburg, in Polish, phone number mistyped, no forklift certificate." The build order has a reason ("works council request filed on day one, it takes longest"). The flex order desk reaches the bookkeeper. Weakness: opportunity hours are hand sums; the screening queue is listed at 480 h while tasks 1 and 3 alone save 493 h.
- **Opus second.** Best jev critique and best legal section. "'interface: api' at 0.89 is wrong for LinkedIn and CV databases, which are screen-only." Its reflection is the most actionable of the five. Three steps mix fate, rung and block (a stays_manual reference call with block crud_app).
- **Grok third.** Most disciplined on double counting: "Each case owns one task. Do not add the three to the role." Its three builds reconcile to the cent. But the baseline is written as the future: thirteen steps have actor "system" with recruiter share, so "today" already contains "Publish the weekly pipeline snapshot" at 35% of task 9. And its 65% saving is the highest.
- **Sol fourth, Astra fifth.** Arithmetic is flawless in both and the loop budgets are builder-grade ("at most two calls, 8,000 input tokens and 2,000 output tokens per call, 30 seconds"). But the prose is abstract, the golden demos are idempotency fixtures ("an approved stage event arrives twice"), Astra repeats six boilerplate assumptions on all twelve tasks, and Sol downgraded every digest E3 to E1 because it could not reopen pages, which empties the evidence column.

**2. Ten best ideas**

1. Knockout returns pass, fail or needs-a-look, "a fail names a field; no score"; nothing is rejected before the recruiter accepts the pile. Grok.
2. Evidence table per criterion with verbatim quotes, "found, not found or unclear", protected attributes stripped before the call. Opus. Fable's "every field quotes the CV span it came from" is the same check.
3. One vacancy fact sheet as the only source of figures, merged into every mail; replies outside the sheet get "no draft, only a flag". Fable. Grok's classify-onto-approved-snippets variant is the deterministic end of the same idea.
4. The stage clock as first build: a silence rule (seven days Fable, five Opus, fourteen Grok) and the number "candidates silent over seven days, 0". Fable, Grok.
5. Flex order record whose reference the bookkeeper's invoice matcher uses; demo with an expired VCA, a worker who left in March and a CSV with different columns. Fable. Opus adds the live fill board and agency scorecard.
6. New work as a line in the hours table: an 80-hour operating reserve and a net speedup. Sol, Astra.
7. A legal tag per step set by rule, not by the model: `legal_use` in {annex_iii, art22, art50, special_data}. Opus. Fable's dated gate table and Grok's action tags converge on it.
8. "A small-sample flag forces the sentence do not conclude" in the criteria memo loop; the criteria review doubles as the AI Act deployer record. Grok, Opus, Fable.
9. Matching ranked third despite the biggest prize, because consent dominates: consent_and_access 15 to 60 days. Opus, Fable.
10. Role altitude stated as rights not gained: "They do not gain the right to hire, to score, or to read a medical file." Grok. Opus's flex-to-permanent route after three months, with the takeover fee as an unknown, is the best ambition.

**3. Errors**

- Grok: today-steps written as the future (above); a classifier that sends snippets to candidates with no gate and fate machine on a loop step; Annex III and the 2027 duties applied to a deterministic certificate date check in the agency build; [S9] cited for the high-risk claim and [S10] for the deferral, both belong to [S10][S11].
- Fable: opportunity sums not reconcilable with the task table (admitted); one evidence source "input.json company systems" outside the allowed forms.
- Sol: grades collapsed to E1; declares the 2027 deferral "unverified; do not rely on it", while Astra reopened the sources and corroborated it. Trust Astra and the digest.
- Astra, Opus, Fable: `handoff_to` set to "hiring-manager" or "line manager", a role that does not exist in the input.
- Opus: pass-rate pages by gender and age band assume those attributes are available for applicants; it flags this but the AP line is thin.
- Nobody invented a product or source. All five cite Justis, VCA, inlenersbeloning and the Wet op de medische keuringen as model knowledge, correctly graded E1. No model used rung "agent" anywhere; the owner said rare and got zero.
- Overclaims: Astra marks "Arrange interviews and send routine receipts" as machine 0 with no exception time. The models disagree on works council consent for candidate-only systems (Fable "consent unlikely", Opus "likely consent under 27(1)(k)"); a rule table must settle it. The references task spans 25% saved (Sol) to 65% (Grok) on the same input.

**4. The jev measures**

Unanimous rejections, and all five were right: the "human" class on 18869, 18855, 18873 (jev's own shape says workflow_automation at 0.84 to 0.96); API at 0.89 and 0.73 when the company profile says mail and CSV; "vanishes" 0.47 on interviews; judgement_step with model_needed 0.61 on matching read as extraction, never a score. Unanimous agreement: low model need on inform and status; special data 0.99 on tests ("a model never opens the file"); rule coverage under half keeps the decision human.

Questions that earned their place: drudgery, shape_main and shape_support, data_sensitivity, reversibility (Opus: why rejections are gated and acknowledgements are not), rule_coverage, error_cost. Questions to change: the task class (derive it from steps), interface (read the company's access list), vanishes (reword or drop), human_approval (a task probability cannot say which action), accountable (0.35 on a high-risk use), O*NET frequency ("more than yearly" on agencies, Grok). Add: the human-core share as a number (Fable), a lawful-here filter (Opus, drug tests), action tags inform, reject, score, request special data (Grok).

**5. The method**

- Schema: `workflow_id` and `shared_with` on steps; `actor_today` and `actor_after`; a gate object with approver and scope (per item or per template) instead of one boolean; `new_steps` with hours and `moves_to` for transferred work; `legal_use` set by rule; E4 and an opened-status field; derived numbers computed by script, not emitted by the model, and the bookkeeper example fixed to the contract.
- Jev questions: as in section 4, plus let the company profile override frequency and channel.
- Prompt: one share per step with hours from the company; "today means today"; opportunities own disjoint tasks; golden demo spec in Fable's form; loop budgets in Astra's form; the legal paragraph comes from the gate table; one source scheme (the signals file numbers S2 as a Workday post, the digest as a survey).
- Merge: align on workflow_id, fates by majority, remaining_pct by median, flag spreads over twenty points for a person.
- Roll-up: sum once per workflow; show potential, ramp and net of new work; ceiling on person_does remaining; the 4,400-task population should include human-class tasks whose shape is workflow.

**6. Which model**

Generate on Opus with the merged prompt: it matched Fable's numbers and beat it on the reflection at lower cost. Fable writes the role-level synthesis and the opportunities, where the demos and the legal line need its judgement. A second generator across 4,400 tasks is not worth it; the five spread 51% to 65% on one job, and the merge would average guesses. Spend that budget on validators in code and one Sol or Astra review pass on a stratified sample for arithmetic and overclaims. Grok earns a place only as the disagreement reader on human-class tasks.
