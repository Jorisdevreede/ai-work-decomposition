# Review: five models on the Noordhaven Recruiter

A conflict of interest first: I am Opus 5.5, so one of the five answers is mine. To keep that in check, every number below was recomputed from the `taskgraph.json` files. All five validate against the schema, cover all 12 tasks, have step shares that add up to 100, and match their own `job.md` totals to within 1 hour. The errors are in judgement and gates, not in the sums.

## 1. Ranking

**1. Fable (2.41×, 1,326 h after).**
- **Golden demos that meet the brief exactly.** "Friday 22:10 a candidate applies for night-shift picker in Tilburg, in Polish, phone number mistyped, no forklift certificate… Ends on: candidates silent over seven days, 0." The screening demo is "46 weekend applications" with a photo CV, one person applying to three jobs, and a flex worker flagged "check takeover terms". Each ends on an operational number, not on euros.
- **It links the jobs.** The flex order record becomes the bookkeeper's invoice-matching reference.
- **The best reflection** (class per step, workflow ids, a dated legal rule table, validators).

**2. Opus (2.39×, 1,338 h).**
- **The clearest graph for a builder:** spine, blocks, loops, gates and build order, with legal articles per opportunity: "VOG… store only 'issued, yes or no'".
- **Disjoint opportunities**, so the cases can be added.
- **Weaker demos.** Demo A ends on "down by one (demo data)". It also has 14 `person_reviews` steps with `human_gate: false`.

**3. Grok (2.89×, 1,107 h).**
- **The sharpest jev critique and concrete deterministic ideas:** inlenersbeloning pay fields that must be filled before an order can go out, and a Studytube date check.
- **The most aggressive numbers.** 65% of hours are removed, no upkeep is deducted, and "Inform" loses 79%.
- **Telegraphic prose** that a recruiter will struggle with.

**4. Sol (2.04×).**
- **The most disciplined.** Every external send is gated. It reports a fixed-human bound of 2.66× and deducts 80 h of upkeep.
- **It refuses to rely on the unverified 2027 deferral.**
- **Abstract.** Its demos end on "the €29,211 annual capacity hypothesis", which nobody can watch happen.

**5. Astra (2.03×).**
- **Exact arithmetic** ("949.12h × 68.7377%"), versioned sends, and an operating reserve.
- **Hard to use.** The `job.md` is dense prose with no headings, and the demos are generic ("an approved stage event arrives twice").
- **A weak case in the top three:** the agency register at €5.9k a year.

## 2. Ten best ideas for the merge

1. **Flex order record as the bookkeeper's invoice-matching key**, with the "eight pickers by Monday" demo (Fable, 18873).
2. **A vacancy cannot open without its must-haves.** A job-order form moves screening ambiguity upstream (Fable, 18868 s1).
3. **The card shows facts and missing items, never a score.** The loop never extracts age, photo, nationality or health (Fable). This pairs with Grok's "needs a look" lane: a fail must name a field.
4. **Sends carry a vacancy and stage version, and a queued send is cancelled if the decision changes** (Astra). Sol adds dedupe by event id and "elapsed time can trigger reminders but never a rejection".
5. **An agency order is refused when the pay-scale or inlenersbeloning fields are empty, plus a Studytube certificate-date check.** The internal applicant whose certificate is in Studytube but not on the CV is the best messy case (Grok).
6. **Power BI pass rates by gender and age band, plus screening override rates, used as the AI Act deployer's oversight record** (Opus, 18874).
7. **The code 95 card expires two weeks before start, and the recruiter decides whether the start moves** (Opus, demo B).
8. **A snippet answer is sent only if every figure in it equals the fact pack** (Grok, 18860 s3). Keep the check, add a gate or an AI notice (see section 3).
9. **A yearly predictive check on each test; drop a test that predicts nothing** (Fable, 1002 s5).
10. **Pair time to hire with 90-day retention, "so faster refusals cannot win alone"** (Grok, also Opus). Start the works council track in week one, because consent is slower than code (Fable, Opus).

## 3. Errors

- **Grok contradicts itself on Article 50.** Its 18860 s3 is a model loop that answers candidates externally with no gate (`machine`, `act_external`). Its own `job.md` says "a chatbot would [need a label], at the first turn". An auto-answering email classifier is close enough to a chatbot to need the notice or a gate.
- **Grok applies Annex III to the agency order** ("From 2 December 2027 the filter is high-risk"). A deterministic certificate-date comparison is neither candidate evaluation nor, arguably, an AI system.
- **Grok overclaims the deterministic part.** 25% of role hours are `machine`, there is no upkeep reserve, and "Inform" (a communicate-and-relationship task) loses 79%.
- **Fable's opportunity hours overlap and cannot be reproduced.**
  - Task 4 appears in both "candidate flow" and "flex desk".
  - Flex desk claims 255 h, but tasks 11 and 7 alone save 260 h before any of task 4 is added.
  - Fable admits these are "a hand sum". 18855 s1, "Decide which checks apply", runs as `machine` with no gate.
- **The fate fields are used loosely.**
  - Fable labels 6 steps `gone` on a deterministic rung.
  - Opus has 8 `person_does` steps on build rungs.
  - Fable has 10, Opus 14 and Grok 7 `person_reviews` steps without a gate. "Reviews, ungated" means nothing.
- **All five miss that targeting job ads is Annex III 4(a)**, even though the digest says so. Fable's outreach-draft loop and talent-pool query, and Opus's outreach drafts, need the same treatment as screening.
- **The legal date is a real risk.** Fable, Opus and Grok rely on the deferral to 2 December 2027 (Regulation 2026/1744). Sol could not verify it, and Astra found the Official Journal page did not render. If the deferral does not hold, Annex III applies now. Fable and Opus at least say "build the log now". Sol's stance is the safe one.
- **The works council article is probably wrong for applicants.** All five cite WOR 27(1)(k)/(l), which concern data of people *working in* the company. For external applicants the firmer hook is likely 27(1)(c), the hiring policy (model knowledge, E1). Ask legal.
- **Citation hygiene, not invention.**
  - Fable's "11%" [S2] and "two questions per skill" [S3] come from the signals file but are cited with digest ids.
  - Opus's "AFAS Pocket" [S4] and "two behavioural questions per skill" [S3] have the same problem.
  - Sol grades everything E0 or E1 despite citing digest sources: under-graded, but honest.
- **The input itself is wrong in places.**
  - The agency task is O*NET "more than yearly" at 157 h, while the company has 150–300 flex workers (Grok).
  - O*NET omits manager intake, offers and the onboarding hand-off, and includes drug tests, which are barely lawful in the Netherlands (Opus).

## 4. The jev measures

**Where all five agree with each other against jev:**
- The "human" class on tests (18869), references (18855) and agencies (18873) hides 57–68% of paperwork. jev's own answers say so: drudgery over half, main shape workflow automation at 0.84–0.96. The models are right; the class contradicts the shape.
- `vanishes` at 0.47 for interviews is wrong.
- `interface: api` is wrong for sourcing (0.89) and for agencies (0.73), when the input says email and CSV.

**Where they split:** on matching, `judgement_step` 0.73 and `model_needed` 0.61. Fable and Grok say a checklist comes first and the model only extracts. Opus and Sol keep the size of the gain but gate the decision. Fable and Grok are closer to the owner's bets.

**Questions that earned their place:** drudgery, reversibility (it drove "rejections gated, acknowledgements not"), data sensitivity (special 0.99 on tests drove "a model never opens the file"), error cost, exposure and human approval.

**Questions to change:**
- **Interface and standard software:** take these from the company profile, not from the occupation.
- **Vanishes:** reword it.
- **Accountable:** drop it, because a legal rule sets the gate.
- **Class:** derive it from the steps.

## 5. The method

- **Schema**
  - Add `workflow_id` and `shared_with` to steps; all five reflections ask for this.
  - Add `new_steps` for upkeep and oversight, and `moves_to` for work transferred to managers or candidates.
  - Add a `legal_use` enum set by rule: `annex_iii`, `art22`, `art50`, `special_data`, `wor27`.
  - Validate that `person_reviews` implies a gate and that `gone` implies the `eliminate` rung.
  - Add an `approver_role`.
  - Fix the example file so it obeys `additionalProperties`.
- **jev questions**
  - Ask the human-core share as a number (Fable).
  - Split shape into "share a closed checklist finishes" and the residue (Grok).
  - Add "lawful in NL" (Opus).
- **Prompt**
  - Let the company profile override O*NET frequency.
  - Require demos to end on an operational number, not euros.
  - Point to one numbered source file.
  - Consider withholding jev from half a sample, to measure anchoring (Grok, Astra).
- **Merge:** merge by `workflow_id` across tasks. Keep the strictest gate from any model.
- **Roll-up**
  - Arithmetic, Amdahl and the ramp go in the script, not the model.
  - Deduct upkeep once per role.
  - Report ceilings by step fate.
  - Apply the legal table by date.

## 6. Which model for the full run

**Generation:** use Fable. Opus is a close second and could replace it if cost matters. The two land within 12 hours of each other (2.41× vs 2.39×), and Sol and Astra land within 4 hours of each other (2.04× vs 2.03×). So a second generator mostly reproduces a known spread. Run it on a stratified 5% sample to calibrate, not on all 4,400 tasks.

**Review:** use Sol, as the gate, legal and evidence checker. It gated every external send and refused unverified law, which is the job of a reviewer.

**Merge:** worth paying for only on the top opportunities per role, not per task. Grok is useful as an adversarial "deterministic-first" voice on those shortlists, not as the generator.
