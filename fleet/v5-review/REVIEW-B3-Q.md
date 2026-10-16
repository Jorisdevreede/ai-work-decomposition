# Batch 3 second review (Q, pane 5, Opus 5.5)

**Running verdict after round 3 (16 Oct 15:30): 23 files read, 20 fix, 2 good, 1 redo.** Not a model ranking:
different jobs, six to eleven files each. All 23 pass the finalize checks; every fix is a semantic defect.

| Model | Files read | Fix | Good | Redo |
|---|---:|---:|---:|---:|
| opus-5.5 | 6 | 6 | 0 | 0 |
| sol-6.1 | 6 | 5 | 1 | 0 |
| grok-4.7 | 11 | 9 | 1 | 1 |

Open defect classes (through round 3):
- **All models:** a step relies on an input no step or contract produces, or a machine action named in the
  design has no step; a record write or a send is folded into a conversation or manual step, so its saving or its
  gate is missing; act_external is used for talks with internal colleagues.
- **Opus:** cuts to face-to-face steps are falling (23% of such steps 11:30-13:40, 13% after; a sample of six
  after 13:40 has four explained and two partly supported). Final artefacts still leave without a gate:
  `25-2058.00__8:6817` sends draft minutes by machine, `35-3011.00__2:2239` publishes unapproved allergen text
  (re-finalized, still open).
- **Grok:** pane G4 has used one paper-card template since 13:37 (19 of its 20 files, 60 tasks): a colleague
  writes a paper card, the task's first step "reads the card", stays manual and is cut to 60%. Other panes invent
  look-up hunts to cut. Ten approval cycles in the scan; `41-2011.00__4:2416` is unchanged.
- **Sol:** zero-saving tasks fell from 60% (11:30-13:40) to 36% after; a sample of six after 13:40 has four honest
  zeros and two that still fold a record write into an in-person or phone step. A supplier order is committed
  with no authorization gate (`25-9044.00__3:10971`).

**R/Q comparison:** four files read by both at the same hash, all fix in both: Grok `41-2011.00__2`,
`41-2011.00__4`, `41-2011.00__5`, Opus `35-3031.00__2`. The one task-level disagreement is settled: R accepted
Q's finding on Sol `25-2021.00__8:6567` and revised its good to fix at 15:20. R also confirmed Q's
`35-3011.00__2:2239`. R has not flagged the G4 paper-card template; its wording changes with each job, so a
repeated-text scan does not find it.

## Method

- Every ~2 hours: two new passed files each from `opus-5.5` and `sol-6.1`, plus four `grok-4.7` files (one per
  Grok pane G1-G4 by claim owner, topped up at random if a pane has none). Seeded `random.Random(seed)` over the
  unreviewed passed files in manifest order; the seed is recorded per round. Files R or Q already read can be
  picked again: a file read by both is the R/Q comparison.
- Each file is read task by task against the O*NET statement in its prompt and the defect list in the prompt
  header (order, savings, labels, evidence, already-counted/ranges). Verdicts: **good** usable as a provisional
  design; **fix** one or more defects that change a step, a gate or a saving; **redo** templated or not about the
  task.
- The finalize checks are rerun read-only on each sampled file (no file written). A structural scan runs over all
  passed files of every label each round: repeated step text, numerical shapes, inputs consumed before they are
  produced, approvals after their action or before the artefact they gate, approval cycles, shared ids reused
  inside a task, digest claims cited as model knowledge, legal claims under capability/case.
- Q never edits answers. Patterns that repeat go to `fleet/STATUS.md` as `<time> Q ALERT <label>: <pattern> <file>`.

## Rounds

### Round 1 — selected 11:16-11:18 CEST, written 11:23

Gate: the background wait fired at 11:16. It also counted one answer written but not yet finalized (Grok
`41-2011.00__4`, no `_meta`), so the helper now counts only files with finalizer metadata and an empty checks
list. The sample was redrawn with the same seed `batch3-Q-round1-20261016` on that population: 12 finalized
passes (grok 3, opus 3, sol 6). Selected: opus `53-7065.00__3`, `35-3031.00__2`; sol `53-7065.00__4`,
`35-3031.00__3`; Grok `41-2011.00__2` (G2), `37-2011.00__1` (G4), `41-2011.00__6` (G4). G1 and G3 had no
finalized pass, so one Grok slot is pending. All seven pass the finalize checks rerun read-only with the 11:11
tool fix. 26 task statements were checked.

Structural scan at 11:22 over all 21 passes (grok 6/22 tasks, opus 5/20, sol 10/33): no repeated step sequence in
any label; full numerical shapes unique except sol (31/33 economic shapes, largest coarse group 4); one sol step
text repeats across two tasks of the same job ("clarify patrons food and beverage choices"), which is a shared
step rather than a template. Shape: Grok 4.8 steps per task, Opus 6.2, Sol 2.8. Sol has four zero-saving tasks,
which are correct for conversation-only work.

Targeted structural finding (outside the random sample): **Grok `41-2011.00__4` (G1) `:2416` a1 is an approval
cycle.** s5 "enter the count" is gated by a1, approved at s6 "witness the count", and s6 consumes s5's
`deposit count`. This is the batch-2 Terra cycle class. Gate the release that uses the witnessed count, not the
entry that the witness reads. Opus `35-3023.00__1:23100/s3` (machine, act_external, no gate) is a false positive:
the linked terminal passes the amount and the customer authorises the payment.

Tool note: until 11:11 the finalizer rejected every valid bulleted `- [S#]` citation. The three sol files
finalized before then (`41-2011.00__1`, `53-7065.00__1`, `53-7065.00__2`) cite only model knowledge. That may
reflect the tool rather than the worker; treat their evidence as unproven rather than as a provenance defect.
The 37-2 group has no digest (`research/digests-minor/37-2.md` is absent), so E1 model knowledge is the only valid
source for janitor prompts.

Findings per file:

- **opus `53-7065.00__3` (fix).** `:23896` markdown pricing: s2 lookup goes to machine 0% while the design
  still has the stocker scan each item and pick a days-to-expiry or condition code; s3 calculation goes to 0%
  although loose goods and one-off prices stay manual and multi-buy/group prices (in the statement) are not in
  the design. Keep a share for capture and manual pricing. `:23891` vendor return: no step receives the vendor's
  acceptance or return authorisation before packing. `:23882/s4` cuts 15% for a terminal re-keying the step text
  never states. Already-counted entries name unchanged steps. Strengths: approval binds the exact s3 version
  before the external send; legal sources [S3]/[S4] match the digest.
- **opus `35-3031.00__2` (fix).** `:2283/s6` and `:2284/s6` use a `sold-out list` no step or contract produces;
  the machine 0% depends on kitchen flags whose capture is not counted. Already-counted entries point at
  unchanged recommendation and telling steps (35h, 50h) instead of the residual lookup and returns. `:18746`
  cites [S2] (QR ordering at the table) for online takeaway ordering, which it does not show. Strengths:
  allergen view is deterministic with an "ask the chef" fallback; guest conversation stays at 100%.
- **sol `53-7065.00__4` (fix).** `:23871/s2` generates complete receipts with discrepancy details at machine 0%,
  but partial and damage codes need capture at handover that no step counts; the s3 check compares the receipt
  with the record it was generated from, so it proves the mapping, not the handover. Customer signature has no
  step. `:23895` is sound (version-bound, no double saving).
- **sol `35-3031.00__3` (good).** `:18748` local directions is one honest manual step at 0%. `:2294` wine
  advice keeps both conversation steps at 100% and saves only on the list lookup, with named producers for
  descriptions, prices and stock, and counted upkeep. Minor: the range basis words "high" as a bigger-saving case.
- **Grok `41-2011.00__2` (G2, fix).** `:2408` cuts listening (s1 85%), telling (s6 65%, s7 80%) and walking
  the exception to the supervisor (s4 55%) although only the s2 lookup changes; s3 routes "standard vs
  exception" by machine although that is the cashier's judgement. `:2419/s1` and s5 cut noticing and waiting
  with no mechanism. `:2405/s1` saves 40% of scanning by moving it to a self-scan lane "the store already runs",
  which is today's baseline. Strengths: the s2 loop is well bounded and its check tests meaning; both approvals
  bind the exact artefact; [S#] claims match the digest.
- **Grok `37-2011.00__1` (G4, fix).** `:9544/s3` and `:20590/s3` mark forms the janitor writes as
  person_reviews to claim 60% cuts; no machine drafts anything. `:9545` consumes `par levels` that do not exist
  today and have no producer; its today means (system screen) contradicts the handwritten list in the blocker;
  the requisition approval has no void-on-edit although the supervisor "always cuts quantities". Strengths: the
  walk, locking and cupboard count stay at 100%; E1 entries say plainly that the job has no digest.
- **Grok `41-2011.00__6` (G4, fix).** `:2413/s4` cuts payment by 25% while the design says the cashier still
  takes card or cash. `:2424/s2` invents a "re-read the transaction for a bulky flag" step today that the blocker
  says does not exist; it carries the task's whole saving. `:2409/s5` cuts paper filing ~60% with no mechanism.
  Catalogue and bulky-marker upkeep is labelled focal although the retail lead does it. `:2415` uses a
  structured address with no counted capture. Strengths: both gates bind exact artefacts; the `:2409` reading
  loop is bounded with one attempt.

Next round about 13:23.

### Round 2 — selected 13:23 CEST, written 13:30

Seed `batch3-Q-round2-20261016`. Finalized passes 211 (grok 52, opus 71, sol 88); unreviewed populations opus
69, sol 86, grok 50 (G1 12, G2 10, G3 15, G4 13). Selected: opus `29-1141.04__5`, `25-3031.00__2`; sol
`35-3023.01__1`, `39-3091.00__4`; Grok `41-2011.00__4` (G1), `35-2014.00__1` (G2), `41-2011.00__5` (G3),
`35-9011.00__1` (G4). All eight pass the finalize checks rerun read-only; 31 task statements checked. Two Grok
picks were already read by R, which gives an R/Q comparison.

Structural scan at 13:25 over all passes (grok 53 files/178 tasks, opus 72/249, sol 89/320): no repeated step
sequence; no free-text field (design, blocker, enabler, human edge, altitude, range basis) repeats inside a
label except Opus altitude "nothing changes" (35), which the method allows. Sol's largest coarse group is 107
one-step manual tasks. Steps per task: Grok 4.9, Opus 5.9, Sol 2.5. Zero-saving tasks: Grok 12/178, Opus 2/249,
Sol 173/320; by prior class, Sol leaves 164/276 "human" tasks at zero against Grok 12/145 and Opus 2/207.

Uptake of the 11:27 forward: cut face-to-face focal steps (in person, meeting/call, paper/phone, person_does
below 100%) fell for Grok from 10/62 before 11:30 to 21/328 after; Opus stayed high, 24/80 before and 130/532
after; Sol 2/61 and 3/405. The heuristic also counts cuts the design explains, so the rate is an upper bound;
every Opus file read this round has unexplained ones.

Targeted structural findings (outside the random sample):
- **Opus `35-3011.00__2:2239` (real).** The bar manager approves menu and prices at s4; s5 then writes menu
  text with allergen information and s6 publishes it by machine to the till and QR menu under a1. The
  published allergen text is never approved. Approve after s5, or gate s6 on a review of the menu text.
- Opus `35-1012.00__5:2161` (minor): the supplier is chosen at s2 after the supervisor's own s1 review that
  gates the external order. Opus `25-2021.00__9:6572` (acceptable): the leader pre-approves a plan with an
  explicit scope clause. Four other approval-order hits are false positives (covered by a second approval or a
  void-on-change clause). R has read the forward-reference hits; Q does not repeat them.
- **Sol zero-saving tasks**, seed `batch3-Q-round2-solzero-20261016`, 5 of 31 zero tasks with record/order-type
  statements and 3 of 139 others: honest zero `25-2022.00__7:6597`, `29-2052.00__4:18546`,
  `47-2111.00__1:2882`, `25-2011.00__6:6491`; under-decomposed `29-1141.01__1:18303` (judgement, record write
  and handoff in one in-person step), `25-2021.00__8:6567`, `29-1141.02__3:17330` (consultation write folded into
  a meeting step); missed change `35-3011.00__1:2228` (servers' orders reaching the bar through the existing
  till, which the digest [S1] describes; the file rejects only QR ordering). 39 of Sol's 173 zero tasks have a
  full-time conversation or in-person step labelled write/draft.

Findings per file:

- **opus `29-1141.04__5` (fix).** `:20417` the committee approves the draft programme plus comments; no step
  revises it after the panel and physician reviews, and s7 publishes at 0% with nobody proofing the rendered
  page. `:18009` the patient agrees the plan before team coordination and physician agreement can change it;
  s7's cut needs progress charted per goal with no producer. `:18018` [S19] is GDPR art. 22 and does not support
  the research-basis claim; the deviation calendar has no visit/sample-record input. Strength: `:20417/s3` loop
  checks meaning (numbers equal the source, no option favoured).
- **opus `25-3031.00__2` (fix).** `:22393/s4` cuts a physical drop-off of paper tests (80%) the design keeps;
  `:22402/s1` halves reading duties because it moves to a screen. A boundary note says marking is outside next to
  a marking step. Incremental 0.3h counts s5's remaining work a second time (understates the saving). Strengths:
  supervision and teaching stay at 100%; [S#] claims match the digest.
- **sol `35-3023.01__1` (fix).** `:17591/s2` cuts order entry to 50% for presets although the barista still
  records every drink and the till already holds modifiers; the saving belongs on s3. `:17584/s1` mixes display
  reading with probe checks and guesses the split; the central assumes networked controllers are installed.
  Strength: every range starts from a named zero scenario; input contracts list fields and fallbacks.
- **sol `39-3091.00__4` (fix).** `:5127` folds the rental/sale transaction into one zero step and puts payment
  outside the boundary on a "rent, sell" task labelled order-to-cash; split it and price or reject a prepaid
  add-on. `:5126` zero is honest (attendant at the controls for the whole cycle).
- **Grok `41-2011.00__4` (G1, fix; R fix).** `:2416` approval cycle remains (gate on s5, witnessed at s6 from
  s5's output). `:2406` no step issues the trading stamps the statement names; scanning and telling the balance
  are cut although only keying changes. `:2423` high-value lines post before the review the design promises.
  `:2412` the ERP send named in the design has no step; reading session totals is cut to 50%.
- **Grok `35-2014.00__1` (G2, fix).** `:18723`, `:18724`, `:2180` cut store walks, equipment regulation, sight
  and smell checks, rotation and telling the kitchen lead by 5-30% while the enabler says hands-on work is
  unchanged; each central is above the file's own best case. The probe alert and the sheet fill have no step.
  `:2180` [S12] overreads the digest. `:2185` a model reads handwritten delivery notes into the accounts with a
  check against till sales, which cannot catch a wrong quantity or price.
- **Grok `41-2011.00__5` (G3, fix; R fix).** `:2414/s3` drops count entry to 0% although the cashier still
  enters the amount; s4 cuts explaining differences to 35% and writes variance notes under read authority.
  `:2421` uses a model loop to label the cashier's own notes where a structured form suffices. `:18768` filing a
  note that may not exist today supplies most of the saving; a1 is approved in the step it gates.
- **Grok `35-9011.00__1` (G4, good).** Small, explained savings; `:11168` zero is honest; producers and
  fallbacks for the open check, preset keys and shelf labels. Minor: server check entry may be new other-role
  work; loose labels (integration with no new system, carrying marked write_internal).

Next round about 15:23.

### Round 3 — selected 15:23 CEST, written 15:30

Seed `batch3-Q-round3-20261016`. Finalized passes 416 (grok 107, opus 147, sol 162); unreviewed populations opus
143, sol 158, grok 100 (G1 22, G2 16, G3 29, G4 33). Selected: opus `29-2034.00__1`, `25-2058.00__8`; sol
`21-1012.00__7`, `25-9044.00__3`; Grok `35-2021.00__2` (G1), `25-3021.00__7` (G2), `35-1011.00__1` (G3),
`41-2022.00__1` (G4). All eight pass the finalize checks rerun read-only. None was read by R, so this round
gives no file-level R/Q comparison. Opus re-finalized `29-2034.00__1` at 15:28, during the read
(`339a28450ede` to `ef26f70fc7e8`); only `:22808` changed, and that change resolves the finding on it (a patient
step now produces the safety answers). The verdict stands on the other tasks.

Structural scan at 15:25 (grok 107 files/376 tasks, opus 147/517, sol 162/577): no repeated step text. Steps per
task: Grok 4.3, Opus 5.5, Sol 2.5. Zero-saving tasks: Grok 27, Opus 2, Sol 274. Grok has 10 approval cycles
(the gate consumes its action's output), 9 of them in files finalized after 13:40; R alerted on seven at 15:20.

Uptake, files finalized 11:30-13:40 against after 13:40 (the 13:30 alerts):
- Opus: cut face-to-face focal steps 132/571 (23%) to 60/455 (13%). Seeded sample of six after 13:40
  (`batch3-Q-round3-targets-20261016`): four explained (`35-3041.00__1:11154/s1`, `51-9161.00__4:11954/s2`,
  `37-1012.00__1:11201/s3`, `45-2093.00__1:13421/s4`), two partly (`53-3054.00__1:23758/s5` hand-in cut not tied
  to a cash share; `21-1022.00__4:270/s5` phone chasing halved by a status list with no producer or alert step).
- Sol: zero-saving tasks 186/311 (60%) to 81/222 (36%); steps per task 2.4 to 2.5. Sample of six after 13:40:
  four honest (`33-3051.00__4:23072`, `31-9011.00__2:7883`, `21-2011.00__2:10939`, `53-3054.00__2:23772`), two
  under-decomposed (`53-3054.00__2:23764` defect logging inside a phone step; `29-2042.00__2:22861` stock count and
  restock request inside in-person steps, and par levels assumed away).
- Grok: cut face-to-face focal steps 21/337 (6%) to 0/307.
- Opus `35-3011.00__2:2239` was re-finalized (now `c4ea23174b08`) but is not fixed: a1 still binds only the
  line-up and prices approved at s4, and s6 publishes s5's allergen text.

**New pattern: Grok G4 paper-card template.** Since 13:37, 19 of G4's 20 passed files (60 tasks) use one design:
a colleague writes a paper card (shelf card, account card, admission card, requirements card), the first step
"reads the card", is labelled stays_manual and is cut to 60% (56 of 60 tasks), the design says the worker "reads
it, then still" does the rest, and the range basis says "when the card has no row ... most of that step returns".
Net savings are 2-6%. The baseline it cuts is often invented (a parts counter with no stock system, a lookup
from memory), and the record writes and sends that a system would touch stay folded into in-person steps. Files:
`21-1012.00__2`, `21-1022.00__2`, `25-2058.00__6`, `25-2058.00__10`, `25-3041.00__1`, `25-9031.00__7`,
`25-9044.00__5`, `29-1127.00__6`, `29-2034.00__2`, `29-2053.00__3`, `33-3051.00__5`, `37-1011.00__5`,
`39-2021.00__2`, `39-9032.00__4`, `41-2022.00__1`, `47-2141.00__1`, `49-3042.00__1`, `51-9198.00__1`,
`53-3053.00__2`. No other Grok pane and no other label uses it. Q read `41-2022.00__1` in full (redo) and the
first steps of `21-1012.00__2` and `29-2053.00__3`.

Findings per file:

- **opus `29-2034.00__1` (fix).** `:22809` the protocol is chosen at s2 before prior exams (s3) and the physician
  call (s4) that inform it; s4's output feeds nothing; no approval or commit binds the final protocol.
  `:22819/s3` "completes the exam" goes to machine 0% though the radiographer still closes it; s2 incidents cut
  to 70% with no mechanism. `:22802` asserts a paper reject log the enabler says the console already keeps. Range
  bases are not scenarios. Strengths: patient and judgement steps at 100%; [S#] claims match the digest.
- **opus `25-2058.00__8` (fix).** `:6817` s4 e-mails the minutes by machine from s3's draft with no approval
  (approvals empty, no gate) although the loop check names the chair's approval; the recording the loop reads has
  no producer and its deletion no step. `:6816/s1` cuts planning and phone booking by 30% when only a supplier
  lookup changes. `:6815/s4` hours logging to machine 0% assumes providers report; leave approval has no step.
  `:6807/s3` paper notes to tablet cut 50%. Range bases are generic. Strengths: teaching and supervision at 100%.
- **sol `21-1012.00__7` (fix).** `:18633/s1` contact lookup and opportunity log sit inside a 100% conversation
  (zero not shown honest). `:5629/s2` machine 0% although the file says missing data returns to manual
  compilation; s1's new structured capture (about nine fields) is not counted. `:18635` and `:5636` zeros are
  honest (supervision; notes belong to the job's records task). Strength: deterministic native view, field
  contract, per-step already_counted.
- **sol `25-9044.00__3` (fix).** `:10971/s3` places the supplier order (act_external) with no gate and reads a
  "normal spending authorization" no step produces; collection and ordering share the step. `:10958/s1` one step
  drafts, approves, publishes and changes the schedule. `:10962/s3` under-claims: the paperwork could be
  prefilled from s1's template. Strengths: conversation and student time at 100%; a1 in `:10963` binds the
  exact released package.
- **Grok `35-2021.00__2` (G1, fix).** `:2216/s4` "post" (12%) repeats s2's record write (invented step); s2's
  fill needs portions and recipe quantities no step gives. `:2222/s2` a model loop reads a note the worker reads
  anyway; s1's zero rests on ward-clerk keying that is not counted. already_counted lists unchanged baseline work.
  Strengths: task-specific low/high scenarios; gates bind the accepted version.
- **Grok `25-3021.00__7` (G2, fix).** `:8686/s1`, `:8689/s1` cuts come from the studio lead posting skill lines
  and activities, uncounted, and take over the teacher's own judgement; the "search old notes" share looks
  invented. `:8691` the checklist is read after the evaluation it frames; a tick replaces the written evaluation
  (artefact drift). `:8677/s5` a reply to a prospect is labelled write_internal and shares a step with logging.
- **Grok `35-1011.00__1` (G3, fix).** `:11129/s1`, `:11132/s1`, `:11135/s2` cut invented hunts for a sheet, board
  or book to machine 0%. `:11131` the paper count feeds a spreadsheet draft with no structured producer; sending
  the accepted order is folded into a 100% call. `:11129/s3` the paper HACCP log stays at 100% although the design
  could prefill it. Model-knowledge range items are labelled survey. Strength: deterministic par arithmetic.
- **Grok `41-2022.00__1` (G4, redo).** All four tasks (`:2427`, `:2430`, `:20775`, `:20776`) use the paper-card
  template above. The baseline (account status in a till note or memory, walking to bin labels) is invented for a
  parts counter; `:2427/s1` reads the caller's parts before the call; card authorisation, the account-limit check
  (`:2430`) and the purchase-order write (`:20775/s3`) are folded into in-person or call steps.

Next round about 17:30.

## Verdicts

| File | Label | Pane | Round | Verdict | sha256[:12] | Reason |
|---|---|---|---|---|---|---|
| 53-7065.00__3 | opus-5.5 | O1 | 1 | fix | 3f4bd4d04864 | 23896 s2/s3 cut to 0 despite scan capture and manual pricing; 23891 no vendor acceptance step |
| 35-3031.00__2 | opus-5.5 | O1 | 1 | fix | 80a992260642 | 2283/2284 s6 sold-out list has no producer; already-counted on unchanged steps; 18746 [S2] overreach |
| 53-7065.00__4 | sol-6.1 | S1 | 1 | fix | 540d487bd615 | 23871/s2 discrepancy capture uncounted; s3 check proves mapping only; 23895 sound |
| 35-3031.00__3 | sol-6.1 | S1 | 1 | good | 6c3998ac5021 | Conversations kept at 100%; lookup saving with named producers and counted upkeep |
| 41-2011.00__2 | grok-4.7 | G2 | 1 | fix | a6cc7e2ddada | 2408 s1/s4/s6/s7 and 2419 cut unchanged in-person work; 2405 credits existing self-scan |
| 37-2011.00__1 | grok-4.7 | G4 | 1 | fix | 39e587425323 | 9544/20590 self-written forms as person_reviews; 9545 par levels no producer, version not voided |
| 41-2011.00__6 | grok-4.7 | G4 | 1 | fix | 63204c3f9032 | 2413/s4 payment cut; 2424/s2 invented baseline; 2409/s5 filing cut; upkeep scope |
| 29-1141.04__5 | opus-5.5 | O1 | 2 | fix | 281fc95ec979 | 20417 approves unrevised draft, publish unproofed; 18009 patient agrees pre-final plan; 18018 [S19] miscite |
| 25-3031.00__2 | opus-5.5 | O1 | 2 | fix | 8eeda01294b3 | 22393/s4 physical drop-off cut; 22402/s1 reading halved for moving to a screen; boundary contradicts steps |
| 35-3023.01__1 | sol-6.1 | S1 | 2 | fix | 3dd2d527d9d1 | 17591/s2 entry cut while barista still records; 17584/s1 mixed step, guessed split, assumed feeds |
| 39-3091.00__4 | sol-6.1 | S1 | 2 | fix | cfd5d620f627 | 5127 sale/rental transaction folded into one zero step, payment put outside; 5126 honest zero |
| 41-2011.00__4 | grok-4.7 | G1 | 2 | fix | 61dac988d7f8 | 2416 approval cycle; 2406 stamp issuing missing, scan/tell cut; 2423 posts before review; 2412 no ERP step |
| 35-2014.00__1 | grok-4.7 | G2 | 2 | fix | a109c81d2b74 | 18723/18724/2180 cut hands-on steps the design keeps; alert/sheet-fill steps missing; 2185 weak check |
| 41-2011.00__5 | grok-4.7 | G3 | 2 | fix | d72c0fbb2dd6 | 2414 s3 entry dropped, s4 explain cut + read auth; 2421 needless loop; 18768 filing baseline, self-gate |
| 35-9011.00__1 | grok-4.7 | G4 | 2 | good | 134d21fa8432 | Small explained savings, honest zero at 11168, named producers; minor label notes |
| 29-2034.00__1 | opus-5.5 | O1 | 3 | fix | 339a28450ede | 22809 protocol before priors/call, no gate on final; 22819 s3 0% and s2 cut unsupported; 22808 fixed at 15:28 |
| 25-2058.00__8 | opus-5.5 | O1 | 3 | fix | 77bd426ad559 | 6817 machine-sends unapproved draft minutes, recording no producer; 6816/s1 cut covers planning; 6815/s4 0% |
| 21-1012.00__7 | sol-6.1 | S1 | 3 | fix | 564955029a7c | 18633/s1 contact lookup and log folded in; 5629/s2 0% despite manual fallback, capture uncounted |
| 25-9044.00__3 | sol-6.1 | S1 | 3 | fix | df4040b04e5e | 10971/s3 supplier order ungated, authorization no producer; 10958/s1 draft/approve/publish in one step |
| 35-2021.00__2 | grok-4.7 | G1 | 3 | fix | d301dbba3608 | 2216/s4 post repeats s2 write; 2222/s2 needless loop, clerk keying uncounted; already_counted on baseline |
| 25-3021.00__7 | grok-4.7 | G2 | 3 | fix | 9f0f7bf9c0b0 | 8686/8689 cuts shift work to studio lead uncounted; 8691 checklist after evaluation, tick replaces paragraph |
| 35-1011.00__1 | grok-4.7 | G3 | 3 | fix | 11c8eeea2ed2 | 11129/11132/11135 invented look-up hunts cut to 0%; 11131 count no structured producer, send folded in |
| 41-2022.00__1 | grok-4.7 | G4 | 3 | redo | b9b4f063b216 | G4 paper-card template in all four tasks: s1 read-the-card stays_manual cut to 60%, invented baseline |
