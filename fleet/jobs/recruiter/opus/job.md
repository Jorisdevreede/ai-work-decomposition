# Recruiter at Noordhaven, reimagined (Opus 5.5)

## The job as a graph

Three flows carry most of the 3,200 hours.

1. **Vacancy to hire.** Manager request → vacancy profile → ad → applications → screening → shortlist → tests and interviews → checks → offer → HR admin. The glue is the recruiter's mailbox, Word notes and an Excel tracker beside Recruitee. Agency CVs arrive by mail; assessors book by phone; managers reply by mail.
2. **Candidate communication.** Status, questions on pay and shifts, rejections, calls. Facts come from old vacancy texts and the CAO PDF.
3. **Flex orders.** Site manager phones → recruiter mails an agency → email or CSV confirmation → Excel → no-shows. The bookkeeper later needs the same orders to match agency invoices.

**The stitched solution.**
- *Spine:* Recruitee, AFAS and Microsoft Graph synced nightly to the governed data platform; every stage change and decision logged.
- *Blocks:* stage automations and a "waiting five days" list; a fact-sheet records app per job type that generates ads and info packs; a scheduling workflow on Graph calendars with a tablet results form; a pre-employment checklist with upload; an evidence table per application; a flex order app with a fill board; Power BI pages for funnel, pass rates and forecast.
- *Loops:* bounded and checked. They draft (replies, rejections, summaries, outreach, test items), extract (CVs, certificates, agency emails) and judge ad wording. None sends or rejects alone.
- *Gates on actions:* rejections, drafted replies, stage decisions and offer clearance need a person. Templated acknowledgements and invitations run alone once the template is approved.

**Build order:** spine and pipeline dashboard → A communication → B scheduling and checks → flex orders (shared with the bookkeeper) → C evidence table, with the works council track started in week one → criteria review and forecast.

## Hours

| Task | Today h | Saved | After h |
|---|---|---|---|
| Match applications | 429 | 70% | 128 |
| Inform applicants | 340 | 53% | 162 |
| Select and refer | 338 | 50% | 169 |
| Schedule tests | 313 | 68% | 102 |
| Status contact | 295 | 73% | 81 |
| Sourcing | 268 | 56% | 119 |
| References and checks | 260 | 58% | 110 |
| Interview | 255 | 25% | 192 |
| Evaluate criteria | 207 | 65% | 74 |
| Recruiting strategy | 180 | 58% | 76 |
| Agencies | 157 | 63% | 58 |
| Develop tests | 156 | 56% | 69 |
| **Role** | **3,200** | **58%** | **1,338** |

Saved = 1 − Σ step share × remaining, from `taskgraph.json`; review time and new upkeep (fact sheets, templates, checklists) count as remaining. Ceiling: `1 / Σ share ÷ speedup` = 1 / 0.418 = **2.39×**, about 1,860 h (1.16 FTE, €121,000 at €65). Adoption ramp 50/80/100% over three years: 930 h, 1,490 h, 1,860 h. This is potential under the owner's bets, not a forecast.

**What the two recruiters do with the time.** They stay two. Volume will rise, because AI-written applications are cheap [S2]. The time goes to offer calls and internal rejections, a day-90 check with every new hire (the North Star), a route to permanent work for flex workers with three months' service, and overseeing the screening tools.

## Where I agree and disagree with jev

- **Tests, checks, agencies (18869, 18855, 18873): jev says human; I disagree.** jev's own answers say drudgery over half and shape workflow automation at 0.93–0.96. The core stays human; booking, chasing and parsing do not. The label hides 57–68% of the time.
- **Matching (18868): jev says automate (0.70).** Right size, wrong label. A rejection is an Art. 22 decision and an Annex III use, so stage decisions stay `person_reviews`; jev's human_approval 0.66 agrees.
- **Inform (18860): agree.** Low model need (0.21) and public data (0.72): the safest place for a drafting loop.
- **Status (18857): agree.** Irreversibility 0.61 is why rejections are gated and acknowledgements are not.
- **Interview (18862):** "vanishes with clean input" at 0.47 is too high; forms remove fact-finding, not the interview.
- **Sourcing (18865):** "interface: api" at 0.89 is wrong for LinkedIn and CV databases, which are screen-only for most employers (model knowledge).

## Three to build first

**A. Candidate communication (status + inform).** 295 h × 73% + 340 h × 53% ≈ 393 h × €65 ≈ **€25,500** capacity; quality line: nobody waits over five working days for news. *North Star input:* offer acceptance rate. *Golden demo:* a recruiter moves a Tilburg reach-truck candidate to "rejected after interview" → messy case: the candidate also applied in Venlo and emailed in English about the night allowance → artefacts: a personal rejection naming the open Venlo role, and a reply whose allowance figure is checked against the fact sheet → gate: the recruiter approves both in Outlook → close: sent and logged in Recruitee → number: candidates waiting over five days, down by one (demo data).

**B. Scheduling and pre-employment checks (tests + checks).** 313 h × 68% + 260 h × 58% ≈ 361 h × €65 ≈ **€23,400**; quality line: no start with an expired certificate or unchecked right to work. *North Star input:* time to hire (offer to cleared checks) and onboarding completed in week one. Uniper cut 27 days to contract with pipeline watching [S1], a vendor figure without baseline, so not a promise. *Golden demo:* stage moves to "test" → messy: assessor on late shift; the uploaded code 95 card expires two weeks before start → artefacts: booked slot, check file flagging the expiry → gate: recruiter decides whether the start moves → close: clearance reaches the HR admin in AFAS → number: days from offer to cleared checks.

**C. Evidence table and shortlist hand-off (match + select).** 429 h × 70% + 338 h × 50% ≈ 470 h × €65 ≈ **€30,550**, largest but third because of consent. *North Star input:* days in screening, with 90-day retention as the quality guard. *Golden demo:* an agency emails a Polish CV as PDF → messy: lapsed forklift certificate, unclear shifts → artefact: per-criterion table with quotes and "unclear", no score → gate: recruiter sets stage and reason code → close: candidate told through A, override logged → number: median days from application to first decision.

## EU AI Act, GDPR, works council

- **A.** Not Annex III: it neither filters nor evaluates. Reviewed emails need no AI label; a chatbot would need a notice at the first turn [S9]. GDPR: processor agreement, EU hosting, no training on our data, retention limits (model knowledge). Works council: inform; consent probably not needed, but I am unsure.
- **B.** Scheduling and document reading are not candidate evaluation. The VOG is criminal-record data: store only "issued, yes or no". No drug or medical tests (Dutch law limits them, model knowledge); the test form records observations, and emotion inference is banned [S10]. Works council: likely consent under art. 27(1)(k) for a new personal-data system [S14].
- **C.** Annex III 4(a) high risk from 2 December 2027 [S10][S11]; build for it now: named overseer, six months of logs, override rates, worker representatives informed. GDPR Art. 22: no rejection based solely on the table, and review must be real [S12], so there is no score to follow and disagreement is measured. DPIA (model knowledge) and a bias test on Noordhaven's history first. Prior works council consent almost certainly; without it the decision can be nullified within one month [S14]. Liability stays with Noordhaven even when built in-house [S7].
