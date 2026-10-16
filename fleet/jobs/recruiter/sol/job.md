# Recruiter: own the path from vacancy to day 90

The two recruiters keep conversations and hiring judgement. Software carries approved facts, appointments, messages and commitments between systems. This is a proposed design for a fictional company. Time shares, step splits and build ranges are assumptions, not measurements. Source IDs refer to the recruiter digest. External pages could not be reopened; cited claims are provisional E1 here, not independently verified E2/E3.

## One connected flow

A manager approves a vacancy, essential requirements, shifts and terms. Recruitee holds applications. Reviewed evidence supports screening, interviews, authorised tests and references. The recruiter recommends; the manager decides. An approved decision produces an offer instruction for HR administration. Acceptance links the vacancy to the AFAS employee record. HR administration and L&D confirm week-one onboarding and required certificates; the site manager confirms productivity at day 90. Outcome joins must show missing and immature cohorts.

Today’s proposed baseline has Excel joining evidence, agency orders and staffing plans; Outlook carries approvals and reminders. Confirm that baseline at intake. Replace those bridges with a small governed service, access-controlled records, scheduled reconciliation and Power BI reporting. Use existing Recruitee configuration first. API availability is supplied; scopes and features remain unconfirmed. Agency access is explicitly email and CSV.

The service uses stable vacancy, application and order identifiers, versioned facts, duplicate-safe writes, deletion rules and an exception queue. It can extract CV evidence, draft outreach or normalise agency emails through bounded calls. Each call has source checks, two-call limits and human fallback. Structured input bypasses models. No autonomous agent is needed. Do not rank candidates, infer emotion or auto-reject.

Candidate communication follows approved stage events, captures delivery and replies, and keeps unresolved cases open. Agency requests follow approved demand, rate checks, authorised sends and confirmation reconciliation. A confirmation is not proof of attendance. Decisions, promises and orders have action gates; preparation can proceed without them.

Build shared identifiers, permissions and baseline timers first. Then ship candidate updates, agency orders and candidate evidence packs in that order. Add assessment logistics, references and cohort reporting next. Validate new tests last, with specialists. Build ranges overlap; do not add them. Integration and consent may take longer than coding.

## Hours and the ceiling

Annual recruiter hours across both people; exact calculations use shares × 3,200, rather than rounded per-FTE inputs.

| Task | Today | After |
|---|---:|---:|
| Review applications | 428.80 | 177.95 |
| Explain job details | 340.48 | 97.04 |
| Select/recommend | 337.60 | 195.81 |
| Schedule/administer tests | 313.28 | 161.34 |
| Status communication | 295.36 | 69.41 |
| Sourcing | 268.48 | 122.16 |
| References/background | 259.52 | 194.64 |
| Interviews | 255.36 | 173.01 |
| Review criteria | 207.04 | 115.94 |
| Recruiting strategy | 180.48 | 81.22 |
| Agencies | 157.12 | 70.70 |
| Develop/evaluate tests | 156.48 | 112.67 |
| Total, before upkeep | 3,200.00 | 1,571.88 |

For each task, remaining fraction = Σ(step share × remaining percentage)/10,000. Speedup is its reciprocal. Role Amdahl calculation: 1/Σ(role share/speedup) = 1/0.491212 = **2.04×**. Fixed human steps occupy 37.5725% of current effort, giving an ideal bound of **2.66×** if all other effort vanished. Neither number predicts hiring throughput; manager queues and demand still constrain it.

Gross capacity returned is 1,628.12 hours. Assume 80 new hours/year for shared upkeep, audits and rule changes: net 1,548.12 hours, €100,628 capacity and 1.94× net speedup. Adoption scenarios at 50/80/100% realise 734/1,223/1,548 net hours after fixed upkeep. These are scenarios, not forecasts or public-study discounts. The remaining 20 upkeep hours cover later builds.

Keep both recruiters for peak coverage; rotate candidate cases and staffing exceptions. Reallocate released time to manager decision clinics, non-standard-CV interviews, night-shift candidate support and onboarding barriers. Cash requires avoided replacement hiring or a measured agency-spend decision; licences, implementation and other-role time remain uncosted.

## Where jev changes the design

Application review: documents and judgement fit; “automate” does not justify machine decisions. Job details: high rules and low model need favour approved packs. Selection: judgement fits; a factual worksheet needs no model. Test administration: the human label hides booking gains; health sensitivity concerns particular branches. Status: rules fit; approval probability is not legal permission. Sourcing: API probability overstates unconfirmed channel access. References: calls and interpretation stay; drudgery may be overstated. Interviews: clean input does not make the conversation vanish. Criteria: judgement fits, numerical checks remain deterministic. Strategy: dashboards support human trade-offs, rather than automate strategy. Agencies: email/CSV contradict the API probe; coordination can shrink despite the human label. Test development: software availability does not establish validity. Each disagreement and prerequisite is recorded in taskgraph.json.

## Three first opportunities

**1. Approved vacancy packs and candidate updates.** Tasks 18860/18857: 635.84 hours × 73.82% removed × €65 ≈ **€30,511/year** gross capacity. Deduct 20 upkeep hours: €29,211 net before build and licence costs. Input metric: offer acceptance; also stage waits. Quality test: correct terms and no duplicate messages. [S1] suggests process context matters, without validating these savings.

Golden demo fixture: an approved stage event arrives twice while a shift amendment is pending. Show the versioned SharePoint pack and Recruitee message record. The recruiter approves the consequential send; the stale pack is blocked. Outlook delivery and the candidate reply reopen or close the case. End on measured touch minutes and the €29,211 annual capacity hypothesis.

AI Act: this deterministic build does not evaluate candidates. Adding interactive AI requires disclosure and fresh classification. GDPR: recipient checks, minimised content and deletion. OR: obtain required consent for changed data or monitoring arrangements; avoid recruiter performance rankings.

**2. Agency order ledger.** Task 18873: 157.12 hours × 55% × €65 = **€5,617/year** gross; minus 15 upkeep hours gives €4,642. Input: week-one onboarding completion, with flex coverage tracked separately. Test duplicate-order and wrong-rate prevention; avoided spend is unknown.

Demo fixture: a changed shift request meets a CSV confirmation and contradictory email rate. Show the actual ledger record and Outlook order. Unknown rates stop processing; authorised approval releases the amendment. Reconcile agency acceptance and site-confirmed coverage. End on unresolved shifts and the €4,642 capacity hypothesis.

AI Act: extraction does not select workers; agency screening requires separate scrutiny. GDPR: minimise worker identifiers and settle agency responsibilities. OR: approve applicable changes to employee-data arrangements before rollout.

**3. Candidate evidence and interview packs.** Tasks 18868/18871/18862: 1,021.76 hours × 46.49% × €65 ≈ **€30,875/year** gross; minus 25 upkeep hours gives €29,250. Input: time to hire; evaluate mature day-90 retention alongside it. No hire-quality uplift is assumed.

Demo fixture: an unconventional CV omits a certificate and contains instructions to ignore requirements. Show quoted evidence, explicit unknowns and the original CV in Recruitee. The recruiter corrects extraction and approves progression; the manager approves selection. Generate the offer instruction and verify HR administration receipt. End on review minutes and the €29,250 capacity hypothesis.

AI Act: treat this selection-support use as potentially Annex III high-risk, even with review. Assess provider/deployer duties, oversight and logging before use. GDPR: lawful basis, DPIA assessment, processor terms, correction and meaningful human decisions [S12]. OR: applicable prior consent, not notification alone [S14]. The digest’s claimed 2027 deferral [S11] is unverified; do not rely on it for rollout.
