# The recruiter, reimagined

**The job today.** Two recruiters fill vacancies for 1,200 staff, mostly shift workers, and order 150 to 300 flex workers from three agencies. Recruitee holds candidates, AFAS employees, Outlook and Teams everything in between. Three flows:

- **Vacancy to hire** (tasks 1, 3, 4, 7, 8, 12; 1,751 h): screen the pile, write summaries, chase the manager, book tests and interviews, call referees, record results.
- **Candidate communication** (tasks 2, 5; 636 h): look up vacancy facts per candidate, type status mails, answer "any news?" calls.
- **Agencies and planning** (tasks 6, 9, 10, 11; 813 h): orders by mail and CSV, sourcing, funnel analysis in Excel, the hiring plan.

The glue: a job-order mail thread instead of a form, an Excel of flex orders, the recruiter's calendar as scheduler, Recruitee exports for every analysis.

**The stitched solution.** Recruitee stays the candidate record, AFAS the employee record. A small scheduled job host (Python) on the governed platform talks to both over their APIs and to Outlook, Teams and calendars over Microsoft Graph; Power BI gets one dataset. Blocks: three CRUD forms (job order, flex order, referral), workflow rules on Recruitee stage events, four artefact generators (fact sheet, candidate card, interview kit, memo), two dashboards (funnel, demand), and four bounded model loops: CV to profile card, reply from the fact sheet, outreach draft, memo draft. Each loop has a fixed input, a check that every field quotes its source, and a fallback to "by hand". No agent runs alone. Gates sit on actions: every rejection, outreach send, VOG request, agency choice and stage decision is a person's click; acknowledgements, invitations, reminders and holding messages are not gated.

Build order: candidate flow, flex order desk, screening queue (works council request filed on day one, it takes longest), then dashboards, then interview kits and tests.

**Hours.** Today 3,200 (two FTE). After, from the step fates in the task graph:

| Task | Today | After | Saved |
|---|---|---|---|
| 1 Screen applications | 429 | 142 | 67% |
| 2 Inform candidates | 341 | 133 | 61% |
| 3 Shortlist and refer | 338 | 132 | 61% |
| 4 Schedule tests | 313 | 129 | 59% |
| 5 Status updates | 295 | 83 | 72% |
| 6 Sourcing | 269 | 124 | 54% |
| 7 References and checks | 260 | 104 | 60% |
| 8 Interviews | 255 | 186 | 27% |
| 9 Evaluate criteria | 207 | 99 | 52% |
| 10 Strategy | 181 | 72 | 60% |
| 11 Agencies | 157 | 53 | 66% |
| 12 Tests | 156 | 70 | 55% |
| **Role** | **3,200** | **1,326** | **59%** |

Role speedup 2.4× (Amdahl over the task speedups). Hard limit 3.6×: 879 hours are interviews, calls, tests in the room, fairs and decisions, and do not shrink. Potential, not forecast; on the 50/80/100 ramp year one gives about 940 hours.

With 1,874 hours the recruiters interview more, sit with managers on the shift floor, run 30- and 90-day check-ins with every new hire (the North Star), take flex-worker readiness over from the agencies, and do the monitoring the AI Act adds in 2027. Peak season and holiday cover keep two recruiters: capacity, not a vacancy.

**Jev, agreed and not.** Agree on 2, 5, 6, 9, 12: low model need where jev says so, workflow for status, integration for sourcing. Disagree with the human class on 4, 7 and 11: jev's own measures say coordinate or gather, drudgery over half, main shape workflow automation. The test in the room, the referee call and the agency relationship stay human; the scheduling, checklist and order admin do not. On 1 and 3 jev wants a model judgement step (0.61, 0.66); I put configured knock-outs and templated cards first and let the model only read, because a score is what the works council, the AP and the courts object to. On 8 jev's main shape is conversation (0.78); I would not build an AI interviewer. Jev's "accountable" on task 1 (0.35) is low for a use the law calls high-risk.

**Three to build first.**

1. **Candidate flow** (tasks 5, 4, 8, 2 in part). Stage templates, a seven-day-silence rule, booking links over Graph, reminders, the fact sheet in every mail. 520 h × EUR 65 = EUR 34k a year in capacity. North Star input: days per stage, time to hire; Uniper took 27 days off time to contract with pipeline watching [S1], a vendor figure without baseline. Golden demo: Friday 22:10 a candidate applies for night-shift picker in Tilburg, in Polish, phone number mistyped, no forklift certificate. At 22:11 the acknowledgement goes out in Dutch and English with shift, pay scale, start dates and a booking link. Monday the recruiter sees "must-have missing: forklift" and invites anyway, because Tilburg trains: one click. The slot lands in Outlook, the reminder goes 24 hours before, the candidate shows, the stage moves. Ends on: candidates silent over seven days, 0.

2. **Screening queue** (tasks 1, 3, 6 in part). Job-order form, knock-out queues, CV-to-card loop, candidate cards to managers in Teams with a one-tap answer, talent-pool query. 480 h × EUR 65 = EUR 31k. Quality line: nobody lost in the pile (Uniper found 27 waiting on a shortlist [S1]). North Star input: time to hire, manager satisfaction. Golden demo: Monday 08:00, 46 weekend applications for three warehouse jobs. One CV is a photo, one person applied to all three, one claims forklift experience without a certificate, one is a current flex worker. Queue: 29 complete, 11 missing one item, 6 without right to work, duplicates merged, the flex worker flagged "check takeover terms". The recruiter overrules two of the 11 and approves the batch rejection with a reason each; nothing was sent before that click. Three cards go to the manager, answered in Teams by noon. Ends on: 46 applications, 0 waiting over one working day.

3. **Flex order desk** (tasks 11, 7, 4 in part; reach to the bookkeeper). Request form, order record, fixed-format order mail, CSV replies parsed, certificate and induction checklist, order reference for invoice matching. 255 h × EUR 65 = EUR 17k. Financial line: the bookkeeper's line-level invoice check needs this record; size unknown until last year's disputed lines are counted. North Star input: onboarding completed in week one, now including flex workers. Golden demo: Tuesday 16:30 the Venlo evening lead asks for eight pickers, two on reach truck, from Monday, four weeks. One agency's CSV has other columns, one worker's VCA expired last month, one left Noordhaven in March. Board: eight lines, six filled, two open, certificates per worker, inductions booked. The recruiter confirms six, sends the two open lines to agency B for its rate, approves the induction invites. Monday 06:00 all eight are on the gate list, inducted; the order reference reaches the bookkeeper. Ends on: open lines at shift start, 0; request to filled, three days.

**EU AI Act, GDPR, works council.**

- *Candidate flow*: no AI decision and no generated text reaches a candidate unread, so Article 50 does not bite [S9]; a reply bot, if ever switched on, must say so at the first turn. The booking tool stores the appointment, not the reason for a medical. Retention: four weeks after the procedure, a year with consent (model knowledge). Works council: inform; consent unlikely; confirm with legal.
- *Screening queue*: the Annex III use [S10]. Works council consent before go-live [S14]; a DPIA; under GDPR Article 22 the recruiter decides and can overrule, and the card shows facts and missing items, never a score [S12]. From 2 December 2027: a named overseer, decision logs kept six months, the works council informed [S10][S11]; build the log now. Building in-house makes Noordhaven provider and deployer; liability does not move to a vendor [S7]. The loop never extracts age, photo, nationality or health. No emotion inference [S10].
- *Flex order desk*: deterministic, no AI decision. Processing agreements with the agencies; medical fitness as pass or fail only; VOG and certificates stored with expiry date, nothing more. Ask each agency whether it uses AI to pick the workers it sends; the works council will ask.
