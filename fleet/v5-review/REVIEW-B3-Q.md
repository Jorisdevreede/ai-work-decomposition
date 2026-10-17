# Batch 3 second review (Q, pane 5, Opus 5.5)

## FINAL VERDICT (Q, 17 Oct 2026 07:55 CEST, after round 11; queue done, 2,486 passed, 0 blocked)

98 files read in 11 seeded rounds, plus 7 targeted reads outside the totals (3 fix, 4 redo). All passed the finalize
checks; every fix is a semantic defect. Different jobs per model, so this is not a ranking. No answers were edited.

| Model | Files read | Fix | Good | Redo | Label savings usable as provisional figures? |
|---|---:|---:|---:|---:|---|
| opus-5.5 | 22 | 22 | 0 | 0 | Not yet: older files run high; usable after the sweep. Ranges: no |
| sol-6.1 | 33 | 29 | 4 | 0 | Yes, as label-level figures (not per task); S1 before 04:29 is a floor |
| grok-4.7 | 43 | 29 | 1 | 13 | No |

**opus-5.5.** Open: (1) cuts larger than the work a change removes, on steps that stay human or belong to another role
(`33-1012.00__2:569`, 46% net); tasks finalized before 04:27 save 22.8 points on average, after 04:27 11.7, the sweep's
re-finalized files 14.2. (2) A send, reply, join or record the design names sits inside a person step or has no
producer for its input (`33-1012.00__2:565/s5`, `27-2012.03__6:7677/s6`). (3) Ranges by formula: low and high are the
same two fractions of the net in most non-zero tasks since 04:27, sweep files included. Repair: O1 files finalized
before 03:00 (sweep running since 07:44, 32 so far); the 81 files from 04:27 to 06:37 that hand savings to sibling
tasks without checking them; range bases in all O1 files. Keep `runs/o1-priorfit-b3` (56) out.

**sol-6.1.** Open: (1) a record write, note or send folded into a conversation or meeting step, so the task saves
nothing or the cut sits on the wrong step (`21-1022.00__3:262/s2`); S1 before 04:29 is 767 files, 57% of tasks at
zero. (2) Ranges by formula: S3 "Half eligible gives ..." (303 tasks, `11-9161.00__4`), S4 "Below provisional net ..."
(106 tasks, `23-1023.00__3`), both gone since 04:27. (3) Labels: outside advice marked draft, internal direction
act_external; an author's gated save of their own record in about 1,230 S2-S4 tasks before 04:27 (saves keep full
time). Repair: S1 files before 04:29 (split folded writes); S3 files 22:00-04:27 and S4 files before 04:27 (ranges);
S1 files 04:27-06:37 (73: trailing "Record" steps nothing reads, one flat configure cut); S2-S4 gated saves (labels).

**grok-4.7.** Open: (1) templates: statement text sliced into person steps (`19-1022.00__2`, redo; 52 of the 115
present files have a step that opens with the statement's own first words), plus the pulled paper-card, posted-line
and list-step families. (2) Invented admin baselines and machine steps cut to 0 that feed nothing
(`25-2021.00__4:6542/s4`, `29-1127.00__6:1882/s2-s4`). (3) Zeros reached by folding the first write into a person
step (G1 02:15-04:00). Repair: re-answer rather than repair all 115 present files (G1 96, G4 16, G2 3), including the
cash cycle `41-2011.00__4:2416`. Keep `runs/g{1,2,3,4,23}-rejected-b3` (171 files, re-answered elsewhere) out.

**R/Q.** Ten files read by both at the same hash: all fix in both, findings match; on `27-1023.00__2` R does not treat
the 8% send share at `:1723` as inflated on size alone. Calibration differs: R rates 15 of 24 Sol files good, no Grok
redo, and clears no label-wide total; Q rates 4 of 33 Sol good, 13 of 43 Grok redo (different samples), and judges
Sol's label total usable as provisional. Four pane swings followed Q's own alert wording; see the round notes.

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

### Round 4 — selected 17:30 CEST, written 17:37

Seed `batch3-Q-round4-20261016`. Finalized passes 574 (grok 113, opus 218, sol 243) after the lead moved 22 G4
files (15:33, Q's paper-card alert) to `runs/g4-rejected-b3/` and 23 G2 files (17:25, R's posted-line alert) to
`runs/g2-rejected-b3/`. Q's redo `41-2022.00__1` is among the moved G4 files. Unreviewed populations opus 213, sol
237, grok 103 (G1 34, G2 8, G3 40, G4 21). Selected: opus `49-1011.00__1`, `25-1072.00__7`; sol `51-4041.00__2`,
`25-1071.00__5`; Grok `25-4022.00__6` (G1), `53-3033.00__2` (G2), `49-3011.00__2` (G3), `25-2011.00__2` (G4).
All eight pass the finalize checks rerun read-only; hashes unchanged at 17:36. None was read by R.

Since the 15:2x checkpoint Opus re-finalized 80 older files and added 72; Sol added 84 and re-finalized none. So
Opus before/after rates by finalize time now mix revisions with new work, and Q reports samples instead.

**Uptake.** Seeded samples (`batch3-Q-round4-targets-20261016`) from files finalized after 15:35:
- Opus face-to-face cuts: three explained (`31-1131.00__2:19333/s6`, `37-1011.00__3:9517/s2`,
  `29-2055.00__2:15245/s1`), two partly (`25-2021.00__9:6568/s7` card goes to parents only, no authoring step;
  `35-3011.00__2:2238/s1` till note has no machine step), one unsupported (`21-2021.00__1:12983/s3` a contact list
  does not shorten booking venues by phone).
- Sol zero-saving tasks: 157 of 299 tasks (53%) in files new since 15:2x, against 36% for 13:40-15:35. Sample of
  six: three honest (`25-1121.00__5:6279`, `39-3031.00__1:5099`, `29-2043.00__1:22870`), three under-decomposed
  (`31-9096.00__1:4316` concern note for the vet inside the exam; `29-2056.00__3:18549` feedback write inside an
  in-person step; `53-6031.00__1:10712` till entry inside s1).
- Opus `35-3011.00__2:2239` (now `24699eec72fa`) is fixed: s5 writes the menu and allergen text before s4, and a1
  binds publishing to that version. Grok `41-2011.00__4:2416` is unchanged (`61dac988d7f8`).

**New pattern: Grok G3 list-step template.** In 21 G3 files finalized 11:58-16:25, 49 tasks contain a "List/Show
<fields> from <system>" step at configure rung, fate machine, 0% remaining, authority read; in 36 of them it is the
only cut, so net saving equals its 4-12% share minus 0.2-0.3h upkeep. The design frame recurs: "The <record> in
{SLOT} lists <A, B and C> only when <those fields> are already stored. She still <does the task> herself"; later
files "{DOCS} lists the stored <X> before she <Y>"; the assumption "That capture is outside this task and is not
counted as time saved" (21 tasks verbatim). A targeted read of five tasks (`21-1021.00__4:252`,
`39-9032.00__2:2390`, `29-1123.00__3:369`, `25-9044.00__4:10966`, `31-9096.00__3:4307`) and the full read of
`49-3011.00__2` find the same defect each time: the existing system already shows the list, the person still opens
and reads it, and the baseline ("hunting", "paging", "re-reading the rota") is invented; in `:4307` a 0% read of
drug, dose and route before drawing up is also unsafe. Judged as templated (redo). G3's seven files after 16:25
do not use it. Files: `47-2031.00__2`, `21-1021.00__4`, `39-9032.00__2`, `29-1171.00__2`, `29-1123.00__3`,
`41-2022.00__4`, `37-1011.00__4`, `25-9031.00__2`, `37-1012.00__5`, `35-1011.00__1`, `25-9044.00__4`,
`29-2072.00__3`, `51-3092.00__3`, `47-2181.00__1`, `29-2053.00__1`, `31-9011.00__1`, `19-5011.00__4`,
`47-2141.00__1`, `21-1022.00__2`, `49-3011.00__2`, `31-9096.00__3`. Q's round-3 `35-1011.00__1` has the step in all
four tasks and is revised to redo.

**G1 filing saving (watch).** 14 of G1's 43 tasks since 15:30 end in a machine step that "files the accepted X"
at 0%, usually after "Accept/Confirm the X" and "Draft an unsaved X" steps. Splitting draft from gated release is
what R's cycle alerts asked for. But in `25-4022.00__6` the filing is not today's work (the handout "sat in her own
notes", faults "stayed in her memory"), and the approvals are the librarian approving her own plain save. One file
read; not yet a template finding.

Findings per file:

- **opus `49-1011.00__1` (fix).** `:15262` the design's reorder proposal and the send of confirmed lines to
  {PROCUREMENT} have no step; s2 confirms a requisition under draft authority; s6 cuts a facilities call by 40%
  for a form that takes as long. `:2914/s5` relies on coaching notes kept through the year that no step writes.
  `:15263/s2` cuts a step that holds the physical gear exam to change a due-date lookup; s3's system actions have
  no step. Strengths: hazard walk, coaching and inspection at 100%; works-council limits shape the design.
- **opus `25-1072.00__7` (fix).** `:6143/s6` the gated final proposal does not take the research plan as input;
  `:6144/s4` the board's activity plan and budget have no producer edge and the form check has no step;
  `:21122/s1` a machine prefill folded into person_does. Talks and meetings labelled write_internal. Range bases
  scale by size only. Strengths: gross matches the steps; gates bind final versions; the one loop checks prose.
- **sol `51-4041.00__2` (fix).** `:20296/s2` the maintenance escalation write and the spec and fault-history
  lookups sit inside the in-person diagnosis, so the zero is untested; `:20297/s2` the written recommendation sits
  inside a 90% judgement step. `:3112` honest zero but act_external for internal colleagues. Strengths: small cuts
  on touched steps only; honest E1 evidence.
- **sol `25-1071.00__5` (fix, light).** `:6118/s2` the 25% cut rests on an assumed re-entry of actions, sized at
  30% of all admin; `:6118/s3` act_external for colleagues; three low bounds are an upkeep formula, not a scenario.
  `:6121` honest zero. Strengths: delivery and research design at 100%; loop checks claims against sources; [S22]
  cited under legal.
- **Grok `25-4022.00__6` (G1, fix).** `:22436/s5-s6` and `:22421/s5-s6` cut filing that the file's own blockers say
  does not happen today; all four approvals are the librarian approving her own save; `:22436` the handout and
  agreed time are written after the session. The reader proposed redo; Q keeps fix because each task's work steps
  follow its statement and only the filing idiom repeats.
- **Grok `53-3033.00__2` (G2, fix).** `:8621` the cash sheet and receipt filing come after the hand-in that needs
  them; the POS card total has no step; `:8622/s3` the hours check is cut 30% though the design keeps it;
  already_counted lists every unchanged step; [S12] fine graded E3 case instead of legal. Finalized 12:09, before
  the posted-line window; no template. Strengths: counts, walks and calls kept whole; task-specific ranges.
- **Grok `49-3011.00__2` (G3, redo).** `:9972`, `:9961`, `:9982` are the list-step template (4% "List" step to 0%,
  the O*NET work at 96% and 100%, identical upkeep, range and wording); `:9982` assumes an electronic tech log the
  blocker says is paper. `:9968` s3 files requisition v1 before the s4 check (cycle) and no step keys the parts.
- **Grok `25-2011.00__2` (G4, fix).** `:6469/s1` cuts a "hunt through the plan book" the blocker says does not
  happen; `:6471/s1` opens the child's note before s2 identifies the child; `:6482/s1` the attendance tick is folded
  into the door handover with no system. write_internal on in-person decisions. The previous-cycle inputs flagged
  by the scan are stated loops (false positives). Strengths: no model judges a child; producers and fallbacks named.

Next round about 19:40.

### Round 5 — selected 19:40 CEST, written 19:48

Seed `batch3-Q-round5-20261016`. Finalized passes 799 (grok 142, opus 321, sol 336) after the lead moved 21 G3
files (17:41, Q's list-step alert) to `runs/g3-rejected-b3/`; Q's redos `49-3011.00__2` and `35-1011.00__1` are
among them. Unreviewed populations opus 312, sol 327, grok 130 (G1 47, G2 16, G3 38, G4 29). Selected: opus
`35-1012.00__5` (re-finalized 19:29), `39-9031.00__5`; sol `29-2061.00__2`, `29-1127.00__5`; Grok `31-2021.00__1`
(G1), `21-1093.00__3` (G2), `37-2012.00__1` (G3), `25-2057.00__2` (G4). All eight pass the finalize checks rerun
read-only; hashes unchanged at 19:47. None was read in full by R.

**Zero shift after the template pulls.** Tasks at 0% by finalize time, before and after 17:30: G1 16% to 49%, G2 0%
to 85%, G3 16% to 89%, G4 15% to 6%, Opus 0% to 0%, Sol 49% to 63% (steps per task G2 4.7 to 2.7, G3 5.1 to 3.3,
Sol 2.4 to 2.0). On record- or report-type statements after 17:30: G3 16 of 19 at zero, G2 7 of 10, G1 3 of 13, G4
0 of 16, Opus 0 of 118, Sol 18 of 93. A 5-gram scan (`frames.py`) finds "the upkeep allowance is zero because no
tool is added" in 61 of G3's 68 tasks since 17:30, and "no tool is added and nothing is drafted or filed by a
machine" in 11 of G2's 28.

Targeted read of zeros finalized after 17:30 (seed `batch3-Q-round5-targets-20261016`):
- G1, 4 of 4 honest (`25-1081.00__2:6150`, `25-1042.00__2:5806`, `25-1123.00__8:20095`, `39-3011.00__1:4445`):
  live discussion, writing that is the work itself, physical exchange.
- G2, 0 of 4 honest. Missed change: `19-3033.00__5:22175` splits out the counseling note (28%) and keeps it at 100%
  with "No tool is added", while digest 19-3 reports speech-driven notes at 24 of 25 Dutch providers [S6] and
  27 to 10 minutes per encounter [S9]; `39-5011.00__1:8054` the ticket write itself, with booking and payments in
  digest 39-5 [S1], and a step share copied from the means share. Under-decomposed: `25-2058.00__1:6788`,
  `47-4011.00__2:880`.
- G3, 1 of 4 honest (`21-2011.00__4:10947`). Under-decomposed `21-1094.00__2:19020`, `:19023` (letters, referral
  forms and calls inside in-person advocacy); statement drift `29-1229.02__1:17107` (admission orders and note
  excluded with "this task does not file one").
- Sol, 2 of 6 honest (`25-1081.00__6:6167`, `31-9011.00__1:7882`). Under-decomposed `49-2094.00__3:901`,
  `29-1229.02__3:17100`; statement drift `25-1081.00__6:6170` (written advice excluded by "Do not invent a
  report-writing baseline"); missed change `49-2094.00__3:889` (service history gathered in a meeting; digest
  49-2 [S2] work-order recaps).
- Opus tasks at 50% or more: earned `29-1071.00__3:4084`, `29-1127.00__1:18524` (minor: a 40% note cut above the
  29% the cited [S8] reports); partly `29-2032.00__2:443`; over-claimed `25-9044.00__2:10957`.

**Template families reach before the pulled windows.** G2 `21-1093.00__3` (13:04; R's window starts 13:40) and G3
`37-2012.00__1` (11:44; Q's window starts 11:58) are templated. Of seven pre-window G2/G3 files Q has read, these
two are; the other five (`41-2011.00__2`, `35-2014.00__1`, `53-3033.00__2`, `25-3021.00__7`, `41-2011.00__5`) are
fix. Unread pre-window files: G2 `53-3032.00__2`, `35-1012.00__6`, `29-1141.03__2`, `25-2022.00__1`,
`25-3031.00__1`, `35-9031.00__1`; G3 `49-9071.00__1`, `25-2021.00__4`, `25-2031.00__8`.

**G4 after its reset (watch).** `25-2057.00__2` and six later G4 files build one step per means bucket from the
prompt's time-share prior ("largest remainder") and take the saving from one bucket split into machine draft,
check and gated release. The steps in the file read are about the tasks, so not a template finding yet.

Findings per file:

- **opus `35-1012.00__5` (fix).** `:2151` prices s2-s5 as if every dish had a recipe record while its assumption
  says about 70% do; at 70% net is about 53%, not 74%, and the one-off recipe entry is missing from build and
  new_work; s6's checked estimate feeds no step. `:2164/s4` the quote goes to the guest with no send step or gate;
  s9's event sheet precedes s10's final numbers; the reminder and update link have no step. `:2161/s6` stays_manual
  cut 20%; `:2165/s6` gated publish and team briefing share one step. Strength: `:2164` approvals bind the accepted
  quote.
- **opus `39-9031.00__5` (fix).** `:4577/s3` an ungated machine send of fixed health-safety text, placed after the
  advice although the design shows it at first booking; `:4577/s4` and `:4576/s6` cut capture work where only the
  medium changes (paper to app, the trainer still records); `:4576` publishing names needs a consent capture that
  no step makes. Strengths: heat and ranking approvals bind checked versions; deterministic rules, no model.
- **sol `29-2061.00__2` (fix).** `:514/s1` the care-plan entry sits inside a team call; `:514/s2` charting inside
  the intervention; `:516/s1` a record lookup inside the bedside assessment and the evaluation note excluded.
  `:513` zero probably holds once the record read is split. Strength: `:515` cuts only the copying share.
- **sol `29-1127.00__5` (fix).** `:18525` document share 60% against a prior of 22% carries the whole saving with
  no reason; `:23952/s2` the supervision record (feedback, learning actions, hours sign-off) inside a 90%
  in-person step; `:1879` lesson plan and materials have no producer or lookup. Strengths: native blocks first,
  no model; a1 binds the final programme.
- **Grok `31-2021.00__1` (G1, fix).** `:15247/s2` compiling response data and progress notes sits inside an
  in-person judgement step, so its zero is untested; `:21192/s4` a 10% "save the note" step carries the low end;
  `:21192/s2` a model loop where the record's own fields would do, with a "plan for next visit" output the input
  lacks. `:2008`, `:21193` honest zeros.
- **Grok `21-1093.00__3` (G2, redo).** All four tasks share one skeleton: "Read the X" cut to 75-85% because "it
  opens on the id that <other role> stored", an unchanged core, and a note cut to 70-90% because it "stores the id
  instead of recopying"; design, altitude, metrics and incremental sentences repeat with job words swapped.
  Baselines (binder, booklet, referral mail) are invented; already_counted lists unchanged core steps.
- **Grok `37-2012.00__1` (G3, redo).** `:9564`, `:9563`, `:9577` add a 4% "Rewrite the list" step whose output no
  step uses and remove it with a paper par or amenity card; `:9571/s3` the same with a second copy; range bases
  and legal items share one frame. `:9571/s6` files a handwritten note by machine with no capture step.
- **Grok `25-2057.00__2` (G4, fix).** `:6752/c6` the loop drafts the parent note from conferences no step records;
  its check traces sentences but does not bar diagnostic labels on art. 9 data; `:6750/m4` the loop check is
  format-only and m7 counts teaching (task 6751) as curriculum work; two new loops have 0h upkeep; `:6751/s5`
  results write missing; `:6749` ap-count is a self-approval. Strengths: ap-curr and ap-note bind final versions;
  [S3] supports its E2 claim.

Next round about 21:50.

### Round 6 — selected 21:50 CEST, written 22:00

Seed `batch3-Q-round6-20261016`. Finalized passes 965 (grok 138, opus 354, sol 473) after the lead stood down G2
and G3 (19:53, Q's zero alert), moved 32 of their files to `runs/g23-rejected-b3/` and added Sol panes S2 and S3.
The Sol draw is now one file per Sol pane. Unreviewed populations opus 342, sol 461, grok 123 (G1 62, G2 6, G3 19,
G4 36). Selected: opus `35-9031.00__4`, `29-1126.00__3`; sol `35-3031.00__1` (S1), `53-2012.00__3` (S2),
`43-5011.01__3` (S3); Grok `29-1141.01__4` (G1), `25-3031.00__1` (G2), `25-2032.00__1` (G3), `43-5011.01__6` (G4).
All nine pass the finalize checks rerun read-only; hashes unchanged at 22:00. None was read by R; R's scan lists
the same two approval cycles in `25-2032.00__1`.

**Earlier alerts.** O1's fixes hold: `35-1012.00__5:2151` is now 53% at its 70% recipe coverage, and
`25-9044.00__2:10957` is rescoped to returning work (47%); `:2164/s4` still hands the quote to the guest from the
draft step with no send step of its own (minor). G1's "File the accepted X" step fell from 21 before 19:50 to 1
after. `41-2011.00__4:2416` is unchanged (61dac988d7f8).

**New pattern: G4 sizes steps to the prompt's time-share prior.** Every G4 task since 19:50 (26 tasks, 8 files)
opens with "Prompt means are ... Largest remainder gives ...". Summing step shares per means bucket: 22 of 26 tasks
equal the rounded prior within 1 point once the spreadsheet points are moved to one other bucket (7 of 26 without
the move); the same test gives Opus 1 of 223 and Sol 1 of 497. The buckets create filler: `27-3023.00__3:22642/s8`
"Ask where the reference materials and books sit" is a 22% meeting step (the meetings bucket) whose output no step
uses, as do s7 (mail 5%) and s2 (screens 2%); `:22640/s2` casts the decision as a 28% meeting call that consumes
outputs of s6 and s7. Twice the cut is a bucket: `15-1299.01__6:14745` cuts only its 25% spreadsheet step (net 25),
`25-1032.00__4:5766` copies the 17 spreadsheet points onto screens and removes them. Each of the 16 non-zero tasks
cuts exactly one step to machine 0%; 10 are "draft/copy sentences already under a heading". Files where filler and
bucket-cuts dominate: `27-3023.00__3`, `15-1299.01__6`, `25-1066.00__8`, `21-1093.00__3` (G4's redo of the pulled
G2 file), `31-9099.02__2`; `27-2041.00__1` and most of `25-1032.00__4` fit their tasks. G4 zeros (10 of 26): six
split the record write out, four have no record; `25-1032.00:5768` and `43-5011.01:17697` keep a double entry
(record write plus a mail built from the same data) that sibling `5766` cuts.

**New pattern: Sol S2/S3 bank same-system save clicks.** Since 19:50, S1 leaves 55% of tasks at zero at 2.5 steps
per task; S2 2% at 5.8, S3 9% at 6.9. The difference is mostly one step frame: "Approve/Write and approve the X"
followed by a machine 0% "Commit/Send/Save the approved X" (S2 0.83 per task, S3 1.24, S1 0.00). Those tails carry
3.5 (S2) and 4.4 (S3) of about 18 gross points per task, about a third on human-class tasks. Splitting the named
machine action out is right; giving a save in the same system a 2-5% share of today's work and cutting it to 0 is
not. Examples: `53-2012.00__3:10608/s5,s9` (10 of 16 gross points), `43-5011.01__3:17683/s8`, `:19830/s8`. S2/S3's
top claims (43-44%) rest on manual baselines the files' own low scenarios (-3 to 3) admit may not exist:
`41-9091.00__1:13232` 44% earned, `15-1299.03__6:16235` 43% earned, `15-1299.03__2:20368` and
`17-2072.01__4:16357` partly. S1 zeros sampled this round: two honest (`51-9032.00__1:12420`,
`29-1151.00__1:18366`), one valid boundary that should name its siblings (`15-1299.02__5:21741`), one folded write
(`31-2022.00__1:4278`).

**G2/G3 files still in the pass folder.** The stand-down pulled G2/G3 files after 17:30 plus two early ones; 30
remain (G2 10, G3 20). Reading and a phrase count put these in the known families:
- G3 between the list-step window (ends 16:25) and 17:30: `25-2032.00__1` (read, redo), `39-3031.00__3` and
  `25-1121.00__4` (each cut is a "Read X" or "File X v1" step to machine 0%), `39-5094.00__2` (three tasks whose only
  cut is "Read the client name on the client card" to 0%, one zero), `33-1021.00__1` and `21-1015.00__3` (all four
  tasks zero with "no tool is added", the post-17:30 zero family).
- G3 earlier: `49-9071.00__1` (list-step in three tasks; nets of 55% and 50% on human-class tasks), `25-2031.00__8`
  (list-step plus an orphan 7% "Rewrite the duty rota" step as the only cut), `25-2021.00__4` (mixed).
- G2: `25-3031.00__1` (read, redo), `35-9031.00__1` (posted line in all four tasks, nets 1-2%), `25-2022.00__1`
  (opens-on-the-id in three of four), and Q's round-3 `25-3021.00__7`, revised to redo below.
- Task-specific with ordinary defects: G2 `53-3032.00__2`, `35-1012.00__6`, `29-1141.03__2`.

**Revised:** Grok `25-3021.00__7` (G2, round 3, fix to redo; hash unchanged 9f0f7bf9c0b0). All four tasks are the
posted-line frame: "Read the posted skill line/checklist/activity list/open class line", "which is why the read
drops to 75 percent; they still read it", nets 2-4%. Round 3 already found the posted lines uncounted and the
search share invented; the family was named later (R, 17:21).

Findings per file:

- **opus `35-9031.00__4` (fix).** `:2313/s6` cuts 60% for setting opening hours once in the reservation platform,
  but the menu and website updates in the same step do not change, the sync to listings has no step, and [S1]
  supports a booking widget, not a listing sync; `:2313/s7` cuts 40% with no stated change; `:2312/s2` cuts 70% on a
  report of "dishes sent back" that no one records (no producer). Earned: `:2313/s2` (50%), `/s4` (40%).
  Strengths: approvals bind offers and prices before both external sends; every [S#] matches the digest.
- **opus `29-1126.00__3` (fix).** `:411/s1` cuts physical demonstration prep 30% on cards no step produces;
  `:411/s4` cuts a sign-off 60% where only filing goes; `:410/s4` cuts 40% for two imported vitals with no feed step
  or input; `:410/s1` cuts reading 40% for one screen; `:412/s5` 40% with no paper baseline; teaching and
  supervising labelled write_internal. Earned: `:406/s3` (60%), `/s4` (100%). Strength: `:406` tick gates the exact
  set before the portal sends.
- **sol `35-3031.00__1` (S1, fix).** `:2277` cuts one terminal re-entry twice (s2 35 to 60%, s3 25 to 50%), and the
  kitchen routing send sits inside an in-person clarification step; `:2276/s2,s4` screen steps hold 40% against a
  9.9% prior and carry all the saving; `:2281/s1` the guest split conversation sits in a screen step cut 50%, and
  "split request" and "discount authorization" have no producer. `:2278` honest zero.
- **sol `53-2012.00__3` (S2, fix).** `:10608/s5,s9` commit and send of the signed log entry get 5% each and go to
  0%, 10 of 16 gross points; `:10600/s5` the pilot "commits" what crew control re-keys from paper (digest 53-2 §3);
  `:10600/s1` 50% import with no stated share of export-capable aircraft; `:10607/s1` repeats `:10599/s1`'s
  navigation saving; `:10608/s3` 40% for identity prefill. Strengths: gates on commit and send of final versions;
  ATC readback, briefings and maintenance kept at 100%.
- **sol `43-5011.01__3` (S3, fix).** `:17683/s8`, `:19830/s8` bank a 0% commit after s7 already writes and approves
  the record in the same system; `:19830/s3` cuts 15 points with an emissions calculator the assumptions say
  already exists (cite digest [S6] EcoTransIT as E2); `:17683/s5`, `:19830/s5` portal submissions at 0% assume a
  supplier interface the unknowns doubt. Strengths: separate gates for supplier send, record commit and customer
  send; capture kept at full time.
- **Grok `29-1141.01__4` (G1, fix).** `:18297/s4` "File the accepted analysis" goes to machine 0%, gated at s2, an
  in-person analysis that writes nothing, so the nurse approves her own unwritten note and the 12% note write
  vanishes (finalized 12:10, before Q's 17:37 alert); `:18319/s3` reduces coordinating a referral to a form, with
  the clerk's id upkeep uncounted; already_counted lists whole unchanged steps. Strengths: record writes split
  before zeros in `:18299`, `:18324`; `:18319` ap-ref gates a real artefact.
- **Grok `25-3031.00__1` (G2, redo).** Opens-on-the-id skeleton in `:22395`, `:22389`, `:22396`, `:22403`: a read cut
  to 85% "because the list opens with the class", a note cut because ids fill, invented hunt and paper baselines,
  and the same sentences ("which is why the read drops to", "The shorter piece is", "lands near") as G2
  `25-2022.00__1`, `35-9031.00__1`, `25-3021.00__7`. Evidence off-target (`:22389` cites Tutor CoPilot for a design
  that gives no suggestions).
- **Grok `25-2032.00__1` (G3, redo).** List-step in `:6673/s1`, `:6675/s1` (read pupil names to machine 0%, the only
  cut); orphan 4% "File workshop rule v1" / "File occupation plan v1" steps in `:6674/s3`, `:6681/s3` as the only
  cuts, with nothing typing the words, approved at s4 after the filing and from its output (both cycles real). The
  same "E1 survey" sentence on all four tasks.
- **Grok `43-5011.01__6` (G4, fix).** Step shares equal the rounded prior in all four tasks (`:17699` 40/38/14/8);
  `:17691` a 16% meeting and 18% mail step sized to the buckets, zero claimed without splitting the finding of
  notices from reading them; `:17697` zero keeps the accepted method typed twice (shipment write and packer mail);
  `:17699/s4` compares against a requirement list with no producer, s7 insurer call comes after the decision and
  feeds nothing. Kept at fix because the steps are about the tasks; borderline redo under the G4 pattern above.

Next round about 23:55.

### Round 7 — selected 23:58 CEST (16 Oct), written 00:06 (17 Oct)

Seed `batch3-Q-round7-20261016`. Finalized passes 1231 (grok 114, opus 422, sol 695) after the lead stood down G4
(22:03, Q's prior-fit alert), moved its 9 files since 19:50 and 27 more G2/G3 files to the rejected folders (kept
G2 `53-3032.00__2`, `35-1012.00__6`, `29-1141.03__2`) and added Sol pane S4. Only G1 still writes Grok files.
Unreviewed populations opus 407, sol 673, grok 104 (G1 72, G2 3, G4 29). Selected: opus `29-1215.00__2`,
`49-9052.00__1` (re-finalized 23:41); sol `25-1072.00__2` (S1), `27-2041.00__3` (S3), `27-2012.05__3` (S2),
`11-9171.00__3` (S4); Grok `25-1022.00__6` (G1), `35-1012.00__6` (G2), `19-3033.00__1` (G4), `35-1011.00__2` (G1, top
-up). All ten pass the finalize checks rerun read-only; hashes unchanged at 00:05.

**Uptake of the 22:00 alerts.** Same-system commit/send tails since 22:00: S2 0.26 per task (1.0 point), S3 0.12
(0.4), S4 0.12 (0.6), down from 0.83-1.24 (3.5-4.4 points); gross focal saving per task fell from about 18 to 12-14.
S2 patched 34 of its own files; S3 did not patch its 29 files from 19:50-22:00, which still carry 1.24 tails per
task (`27-2041.00__3` read this round). S2's patch keeps the 2-5% shares and sets them to 100%, so the time is
still inflated, now without a saving (`27-2012.05__3:3894/s8`, `:3907/s5`). O1 answered the producer alert in
22 tasks and 17 files (22:11).

**G4 prior-fit starts at 15:59, not 19:50.** Comparing step shares per means bucket with the rounded prior over
all remaining G4 files: 1 of 47 tasks fit before 13:28; 55 of 59 tasks fit in the 18 files finalized 15:59-19:45,
which are still in the pass folder (`21-1012.00__2`, `25-4022.00__4`, `53-2031.00__4`, `51-4081.00__2`,
`29-2055.00__3`, `25-1121.00__7`, `37-2021.00__2`, `53-2011.00__4`, `25-2057.00__2`, `29-2072.00__3`, `49-2098.00__1`,
`19-3033.00__1`, `21-1013.00__4`, `25-4031.00__5`, `49-2094.00__4`, `29-2031.00__2`, `29-1229.01__2`,
`29-1229.06__6`). `19-3033.00__1`, read this round, is redo.

**Revised to redo (G4 prior-fit):** `25-2057.00__2` (round 5, hash unchanged 793623de5a96): each task is one step
per means bucket at the prior's size, with 1-6% spreadsheet and mail "read" steps that fill buckets and outputs
nothing uses (`:6749/b5`, `:6750/m7`, `:6751/s5`, `:6752/c8`); nets 0-6%. `43-5011.01__6` (round 6, since moved by
the lead): shares equal the prior in all four tasks, with meeting and mail steps sized to the buckets. Round 5 read
the steps as about the tasks; the family test shows the sizes are not.

**Sol panes disagree on human-class tasks.** Since 22:00 on automate-class tasks the four Sol panes agree (gross
25-28 points). On human-class tasks S1 averages 4.0 points at 1.7 steps (81% zero, 52% one-step tasks, 90% with
"excluding/outside" boundary wording); S2-S4 about 10 at 5.7-6.2 steps. Like-for-like pairs: S1 is right against
S4 on `25-1122.00__3:6297` vs `25-1122.00__4:6295` (S4's 10% "prepare office-hour availability" for hours set once a
term is invented, plus two self-approvals); S4 is right against S1 on `33-3021.00__1:23022` (one 100% step
"Obtain facts and statements during recorded interviews", the statement record folded in) vs
`31-1133.00__3:2002`; neither on `27-4032.00__5:4063` vs `27-2012.03__4:7671` (fair figure about 3); both right on
`11-3051.00__2:41` vs `11-3051.00__1:35`. S4 also invents `41-2011.00__5:2421/s3` "Compile the period handover
report" 20% to machine 0, which its own assumption makes conditional. The fair human-class figure is probably 4-7
points: S1 under, S2-S4 over by similar amounts. S2-S4 also add self-approval ceremony: the author approves their
own internal note, then a gated save (`27-2012.05__3:3894/s4,a1`, `11-9171.00__3:18848/s5`, `27-2041.00__3:22555/s5`).

**O1's 23:47 bulk fix (R's judgement/entry alert) partly back-solves.** Of 67 tasks changed between 23:35 and 23:50,
18 keep exactly the same saving and 17 drop by under 0.6 points. `25-1071.00__2:6101` stays at 39.5: the old
"decides final scores after item analysis" (10% at 80%) became "runs the item analysis" (4% at 50%) plus the
decision (6% at 100%), the same 2 points. `29-1141.00__2:1850` splits correctly but lands on the same saving
(18.08 to 17.97); `25-4022.00__5:22427` is a real correction (57 to 47) that keeps a 5% machine e-mail tail.

**R/Q comparison.** Sol `39-3091.00__4` was read by both at the same hash (cfd5d620f627): fix in both, same
`:5127` finding (rental/sale transaction folded into one step, payment put outside). Opus `49-9052.00__1`: R read
it at 3aa7d6e33eff (fix: `:11858` a1 binds the installation, not the guide/message sent); Q read the 23:41 version
a9d44112b9da (fix) and finds the same a1 still unbound ("The installation as confirmed complete by the technician
in s3"), so R's finding is open in the new version. Family level: R rated G4 `21-1013.00__4` fix; Q has not read it,
but all four of its tasks fit the prior (list above).

Findings per file:

- **opus `29-1215.00__2` (fix).** `:7775/s1,s5` review results and write the consultation note, which belong to
  siblings `:7772` and `:7774` (10.5 of 20.5 gross points); `:7775/s5` cuts 40% against the 29% [S8] reports, with no
  consent or recording step and no [S20] works-council gate; `:7776/s5` 40% on website steering no step performs;
  `:7778/s4` exception view needs task status nobody captures; `:7779/s3` 50% above [S8]; `:7779/s4` a 5% send after
  the GP's own signature cut to 0. Earned: `:7775/s2`, `:7776/s2,s3`. Strength: evidence quoted correctly.
- **opus `49-9052.00__1` (fix).** `:11858` a1 binds the installation, not the welcome message sent (R's round-6
  finding, still open); the fee write to the first bill has no step; `:11859/s4` cuts 70% while readings are still
  typed by hand; `:11847/s7` a 15% call to the planner, above the prior and outside the statement, carries 6 of 23.5
  points; `:11847/s2,s6` capability claims without evidence items. Strengths: testing and fitting at 100%; [S5]
  matches the digest.
- **sol `25-1072.00__2` (S1, good).** Cuts only on assembly and drafting (`:6131/s1`, `:6123/s2`, `:6125/s2`); loops
  check clinical meaning and fall back to manual writing; `:6145` is an honest zero (no record, report or send).
  Minor: `:6131/s2` incident record inside invigilation; `:6123/s3` lecture labelled meeting_call.
- **sol `27-2041.00__3` (S3, fix).** Pre-alert tails: `:22552/s5,s6` and `:22553/s6,s7,s9` give same-system saves
  and sends 2-5% and cut them to 0 (central 38 falls to about 25); `:22554/s4` zeroes part layout that notation
  software already does. `:22553/s8` (spreadsheet to calendar) is a real second-system commit. The four
  approval-order flags are false positives (same bound version).
- **sol `27-2012.05__3` (S2, fix).** `:3905/s2,s5` take all 20 gross points from presets switchers already store;
  live effects setup and execution sit in no task (`:3894` defers them to `:3905`, which covers recorded production
  only); patched commit steps keep 2-5% at 100%; `:3894/s4,a1` and `/s7,a2` the director approves their own preview
  and note.
- **sol `11-9171.00__3` (S4, fix).** `:18838/s4` cuts 50% (10 of 17 gross) by filling catalogue fields from choices
  s3 writes as free text; `:18851/s6` send kept at 4% while today is modelled all in-system against a
  spreadsheet/mail prior; `:18848/s2` 40% from passage blocks; `:18848/s5` self-approved note. Same-system saves
  correctly at 1% (alert applied). Both approval-order flags false positives.
- **Grok `25-1022.00__6` (G1, fix).** `:5728/a3` carves 20% "placing fields under headings" from one write, leaving
  a stub; `:5728/a5` a self-approved machine submit to the funder portal (8% to 0) with no named API; `:5729/c4` a
  self-approved "place the accepted bibliography" 12% to 0; `:5729/c2` keeps any title with an id. Shares are not
  prior-copied; `:5727` honest zero.
- **Grok `35-1012.00__6` (G2, fix).** `:2166/s1` cuts reading fault notes 60% although the notes stay a written
  list; `/s4` stays_manual call cut 30%; `/s5` log write cut 60% with no step producing the row; the gate binds
  s4's own output; `:18720` POS-fed sheet and portion cost have no step, waste has no producer, `s2`/`s5` cuts have no
  mechanism. Traces of both G2 families in `:2166`, but the tasks are specific.
- **Grok `19-3033.00__1` (G4, redo).** Shares equal the rounded prior in all four tasks (`:22190` 6/2/24/68,
  `:22165` 30/3/43/24); "agree report facts with the client in person" (26%) and "attend the session" (24%) fill the
  meetings bucket; `:22168/c3` a 1% score step is the spreadsheet bucket cut to 0; commit steps sized 2-16%; the
  draft loop runs on sessions no step records, without a consent step.
- **Grok `35-1011.00__2` (G1, fix).** `:11136/s4` the sheet fills from a stock count taken in person with no entry
  step counted; `:11147/s2` the board rewrite is cut while the new typing moves to an unchanged step; `:11148/s2` a
  model loop where a template does the same; act_external on internal staff. `:11138/s6` is a legitimate gated
  cross-system price write.

Next round about 02:05.

### Round 8 — selected 02:06 CEST, written 02:14 (17 Oct)

Seed `batch3-Q-round8-20261017`. Finalized passes 1593 (grok 106, opus 493, sol 994) after the lead moved 21 more
G4 prior-fit files (00:10, Q's alert). Unreviewed populations opus 476, sol 966, grok 93 (G1 79, G2 2, G4 12).
Selected: opus `25-2022.00__6`, `49-9043.00__2` (re-finalized 00:22); sol `15-1299.06__3` (S2), `43-4011.00__3`
(S4), `49-9011.00__2` (S1), `17-2199.05__3` (S3); Grok `25-2022.00__5` (G1), `29-1141.03__2` (G2), `49-1011.00__2`
(G4, 12:38, before both G4 families), `29-1171.00__3` (G1, top-up). All ten pass the finalize checks rerun
read-only; hashes unchanged at 02:13. `uptake.py` now compares full timestamps (clock-only buckets would misplace
files after midnight; round 7's figures predate midnight and stand).

**Uptake of the 00:06 alerts.** The lead pulled the 15:59-19:45 G4 files. S3 re-finalized its 30 files from
19:50-22:00 and S2 re-priced 30 (saves at 1%, kept). Since 00:30 the same-system tails cut below 100 carry 0.6
points per task in S2 and 0 in S3 and S4. O1 re-priced the 18 back-solved tasks; against commit 2970739,
`25-1071.00__2:6101` (40.5 to 41.9) and `29-9099.01__2:17483` (22.1 to 18.9) follow the design, while
`27-3023.00__4:22625` (20.0 to 18.4) raises its reading cut from 40% to 50% with no design change, holding about
2.6 points. S1 has posted no reply to the 00:06 alert.

**New pattern: S4 over-corrected.** Since 00:30 S4 claims 4.9 gross points per task (automate class 9.7) against
9.3-11.5 (automate 19-22) for S1-S3. It now leaves out or folds machine work the digests document:
`25-1124.00__1:6337` has no student-information-system step although digest 25-1 [S12] reports Brightspace grades
re-entered in OSIRIS (S2's `25-1032.00__4:5766` models that as a machine commit); `25-1125.00__2:6362` names an
LMS-to-registry import and folds it into "Enter/import and check" at 80%; `41-2012.00__2:7005` keeps a rule match of
daily summaries against book totals at person_reviews 90; `25-1125.00__2:6359` limits an exam to essays in the
central case. Before the alert S4's `43-4011.00__3` (23:36, read this round) is good.

**S1 human-class zeros unchanged.** Since 00:30, 75% of S1's 212 human-class tasks are zero and 64% are one step.
Sampled: `29-1129.02__1:19176` "Observe and document client reactions" is one in-person step that swallows the
session note (folded); `39-1013.00:23148` bundles bet record, receipt, ticket check and cash payment in one
act_external step (zero plausible, unsplit); `39-4031.00:3334` honest. The opposite error also appears in S1:
`49-9011.00__2:8402/s1` halves a step where only the document search changes.

**Watch: G1 single small machine cuts.** In `29-1171.00__3` (14:05, redo) every saving is a 4-8% internal card or
draft step that does not exist today, removed to machine 0, with already_counted hours equal to each cut. Across
G1, tasks whose only cut is one machine-0 step of 8% or less: 23 of 104 (12:00-17:00), 6 of 122 (17:00-22:00), 19 of
80 since 22:00. Some are real computation (`19-3033.00:22168` scaling raw scores against a norm table); some echo the
pulled G3 frames (`33-3021.00__4:23042` "Copy stored exhibit dates into a prep list", `25-1122.00__1:6290` "Show
the stored prompt for classroom discussions"). G1 does not fit steps to the prior (4 of 318 tasks).

**R/Q comparison.** A sixth file read by both at the same hash: Grok `35-1011.00__2` (92ad8af3d34c), fix in both
with complementary findings (R: `:11138/s3` labour costing has no wage-rate producer; Q: `:11136/s4`, `:11147/s2`
entry cuts with the new entry uncounted, `:11148/s2` needless loop; Q's reader called `:11138/s6` legitimate, a
different step). R's 01:21 alert finds `49-9052.00__1:11858` now hands printed guides while a1 binds e-mail, so the
round-7 finding is still open in a new form.

Findings per file:

- **opus `25-2022.00__6` (fix).** `:6586/s4,s6` the two steps cut to 0 hold 25% of the task against priors of 4.2
  and 2.6 while the unchanged meetings hold 20 against 40.8, so they carry 25 of 49 gross points; `:6603` the trip
  form sent to parents has no step, authority or gate; `:6602` the action-list sync has no step and s3 is cut 30%
  although the minute taker still enters actions; `:6591/s3` 50% on a plan whose content nothing fills; focal
  library upkeep uncounted. Strengths: `:6586` loop checks meaning; other roles kept out of savings; [S16] raised.
- **opus `49-9043.00__2` (fix).** `:11838/s1` halves stock counts on the strength of receipts booked by scan, but
  s7 "receives and stores" hides that booking; [S1] supports nothing in the design; baseline has no system screens
  against a 21.3% prior; `:11829/s2` the sensor feed and its review have no step; the barcode saving is counted in
  no task. Strengths: `:11838` s3/s4 split predates the bulk fix; `:11829` lowered honestly at 00:22.
- **sol `15-1299.06__3` (S2, fix).** `:21790/s5` filing priced at 5% and cut to 0 is half the gross; `/s4` the
  analyst approves her own plan and gates her own filing; `:21801/s6` labels configure on a manual step.
  Strength: `:21801` re-price returned points to real validation work, not spread to keep totals.
- **sol `43-4011.00__3` (S4, good).** Gross 58.75 on an automate task, on reconciliation and assembly steps; 1%
  send and save kept; a1 binds the package. Notes: `:8152/s7` gate on a same-platform save; s3-s5 check totals
  three times (saving under-claimed by 4-6 points).
- **sol `49-9011.00__2` (S1, fix).** `:8402/s1` bundles door identification, document search and revision check
  and halves all of it; only the search changes (fair net about 3%, not 6%); `/s2` "observed installation
  conditions" has no producer.
- **sol `17-2199.05__3` (S3, fix).** `:16479/s3,s4` CAD object cuts of 40% and 50% with no coverage, against 20% in
  sibling `:16467`; self-gated internal saves in all four tasks; `:16465/s1` 30% cut on a mixed read/find step.
  Strength: delivery, inspection and contractor talks at 100%; the one loop checks meaning.
- **Grok `25-2022.00__5` (G1, fix).** `:6594` shares equal the priors with filler s2 (16%) and s9 (6%); s1 records
  the request fields inside a read conversation; s7/s8 lack the report table a1 binds; `:18639/s6` priority note
  written in an in-person step. `:6593` honest zero; producer contracts and fallbacks named.
- **Grok `29-1141.03__2` (G2, fix).** `:18339/s2,s3` pad and paper-slip baselines contradict the file's own
  enabler (monitor feed and lab message exist); `:18335/s3,s4` the opens-on-the-id frame against an existing score
  field; `:18337/s4` today's text describes the future; `:18341/s4` dictated lines have no producer.
- **Grok `49-1011.00__2` (G4, fix).** `:2923/s4` halves resource-need judgement with the note typing;
  `:2918/s3`, `:2912/s4` prefill from choices made in person with no capture; "phoned", "notebook" and "slips"
  baselines on screen-means steps; `:2918/s4` releasing one's own requisition priced at 22%. No paper-card frame.
- **Grok `29-1171.00__3` (G1, redo).** Every saving is an invented step: `:18394/s4` "Draft lines" (8%),
  `:18388/s2` "Copy a stored interaction line onto an internal card" (4%; the medication check already shows
  interactions [S6]), `:18383/s5-s7` redraft, self-check and same-system file of a line already written at s4,
  `:18380/s4` "Fill quote lines" (6%); already_counted equals each cut; one range sentence in all four tasks.

Next round about 04:15.

### Round 9 — selected 04:15 CEST, written 04:27 (17 Oct)

Seed `batch3-Q-round9-20261017`. Finalized passes 2014 (grok 118, opus 570, sol 1326). Unreviewed populations opus
551, sol 1294, grok 102 (G1 90, G2 1, G4 11). Selected: opus `33-2011.00__3` (Fri 13:42), `29-1221.00__1`
(re-finalized 00:22); sol `51-9081.00__1` (S4, 23:59), `19-5012.00__5` (S2, 00:34), `19-2041.01__2` (S1, 01:37),
`11-9179.02__5` (S3, 03:47); Grok `17-3029.08__3` (G1, 00:44), `53-3032.00__2` (G2, Fri 11:32), `21-1093.00__4` (G4,
Fri 13:01), `29-2092.00__2` (G1, 04:00). All ten pass the finalize checks rerun read-only; hashes unchanged at
04:25. Targeted reads: two O1 files finalized after 03:00 (`29-1222.00__1`, `27-4015.00__1`) and eight zero-saving
human-class tasks from S1 and G1 finalized after 02:15.

**Uptake of the 02:15 alerts.** The lead pulled `29-1171.00__3` (02:16). O1 resized `25-2022.00__6:6586`, split
`49-9043.00__2:11838` and reverted the `27-3023.00__4:22625` nudge (02:21). S4 added import and matching steps to the
three named files (02:22); since 02:15 it claims 13.1 gross points per task (automate 29.2), in line with S2 and S3
(9.3 and 12.0; automate 20.7 and 24.0). S2 and S3 replied that saves are now 1% and kept, and that their gates
follow a reviewer instruction (see the correction below). S1 and G1 posted no reply.

**New pattern, caused by Q's 02:15 alert: O1 fitted shares to the prior.** From 03:00, 183 of 191 new O1 tasks
(96%) had step shares whose sum per means bucket equals the rounded `jev_shares` prior within 1 point in every
bucket; 0 of 1754 before 02:15, 12-38% between 02:30 and 03:00. The 02:15 alert compared two cut steps with their
priors, and O1 took the prior as a target. Q alerted at 04:19; O1 acknowledged at 04:20; the lead moved the 56 files
finalized since 03:00 to `runs/o1-priorfit-b3/` at 04:22; O1 now sizes each step from its work and treats
all-buckets-within-1 as a warning (04:24). The two targeted files (redo, outside the random totals) have steps that
are about the task, but sizes and means labels come from the prior: `29-1222.00__1` has a 1% spreadsheet step in
every task, each cut 70-80% with no support in the statement or digest; dictation is labelled document in
`:17194/s7` and `:17195/s3` but in_person in `:17190/s1`, where the documents bucket was already full; `:17192/s1`
phones the surgeon under email_chat. In `27-4015.00__1`, `:22684/s1` console programming is labelled in_person and
`:22680/s5` a mail step sized to the weak mail prior (10%) carries 7.0 of 12.3 gross points.

**Over-correction after the same alert: G1 zeros.** Since 02:15, 68% of G1's tasks and 88% of its human-class tasks
are zero (49% and 71% from 00:30 to 02:15). In 21 of 23 zero human-class tasks a step on in-person, meeting or mail
means is labelled write_internal or act_external and kept at 100%; "The saving on this task is still zero" appears in
17. The alert asked G1 to show a step exists today before cutting it; G1 now asks only whether a second record
exists, so the first write that a template or native form would touch drops out. Targeted: `17-3025.00:3658` (spec
and material lists written at 100% with no system) and `23-1021.00:7626` (the written order is left out; its unknowns
say so) are under-decomposed; `17-3025.00:19686` and `19-1022.00:3677` unclear. Sampled `29-2092.00__2` below.

**S1 unchanged, no reply.** Since 02:15, 78% of S1's 245 human-class tasks are zero and 61% are one step (S2 25%,
S3 6%, S4 9% zero). At 04:23, 140 of its 205 zero human-class tasks keep a step labelled write_internal or
act_external on in-person, meeting or mail means at 100%. Targeted: three of four under-decomposed
(`17-3025.00:3656` s1 folds writing the prevention programme and its handoff; `29-1125.00:20893` a meeting labelled
write_internal folds the plan record that the design's own template would fill, digest 29-1 [S1]/[S8];
`51-9083.00:10535` s2 folds the spec write and the clarification request); `47-5023.00:13694` honest.

**S3 range formula.** Since 02:00, 167 of 284 S3 tasks give the range basis as "Half eligible gives ..." with a 0.40
cut term (80 of 423 before; no other pane uses it), and 110 open with a configure step kept at 60% (50 before). The
low bound is a formula, not a task scenario, and the 40% cut is the same whatever the step.

**Correction: gates on saves.** S2 and S3 gate an author's same-system save because Q's 15:30 Friday alert said "a
send or commit leaves without a gate on its final version". Q meant releases and writes that other people act on.
An author saving their own internal note needs no approval step; the prompt only requires that approval time sit in
a person step. The saves are now 1% and kept, so this costs little time, but it adds gates that approve nothing.
This round: `51-9081.00__1:7133/s6-s7`, `:7147/s6-s7`, `19-5012.00__5:11095/s3-s4`, `:11101/s4-s5`,
`11-9179.02__5:17601`, `:17616`, `:17618`.

**R/Q comparison.** A seventh file read by both at the same hash: Sol `15-1299.06__3` (a5243942a24c), fix in both
with the same `:21790/s5` filing finding. `41-2011.00__4` is still at 61dac988d7f8 with the `:2416` cycle both
reviewers flagged in round 2. `49-9052.00__1` was re-finalized at 01:23 (7f5d49ac1107): s4 now sends the guide
message and a1 binds that message and address as checked at s3, so Q reads R's `:11858` finding as closed, for R to
confirm.

Findings per file:

- **opus `33-2011.00__3` (fix).** `:22977/s1` copying four header fields priced at 25% and `/s6` e-mailing the
  signed report at 10%, both cut to 0, carry 35 of 55.5 cut points (fair net about 35-40, not 61); the debrief
  recording has no step, so the consent rule [S8] sits on none; E3 [S2] is about alert registration, not report
  time; `:22973/s1` the hand-camera sweep is cut to 0 although the file says drones miss heat under cover, and the
  drone pilot's flight has no step; `:22974/s5` mail at 10% cut to 0. Strength: `:22977` a1 binds the signed final.
- **opus `29-1221.00__1` (fix).** `:7821/s6` recording batch and time, mostly the nurse's work, at 10% with a 40%
  cut (4.0 of 10.5 points); `:7819/s4` ordering cut 10% though the design keeps it; `:7819/s7` the 00:22 split
  doubled the coding cut (1.5 to 3.0); `:7823/s5` the advice note is part of the consultation note whose scribe
  saving sits in sibling `:7822` (counted twice). Strength: diagnosis split from coding at full time.
- **sol `51-9081.00__1` (S4, fix).** `:7133/s1` one system-screen step cut 50% covers the case lookup and the hand
  check of the physical model; `/s5` 30% cut for prefilling ids the same case record already holds; `:7147/s5` 20%
  cut for ids picked from a list; self-gated saves. Digest 51-9 does not cover dental labs, so nothing documented
  was dropped. Strength: examination and design judgement kept whole.
- **sol `19-5012.00__5` (S2, fix).** `:19814` paper form at s3 and a 1% "save" at s5: the paper-to-system re-key
  has no step, and unit and completeness rules are folded into the human check s4 at 100%; 19h already_counted on
  unchanged s4; `:11101/s4` 2.7-point cut for formatting in a template that already exists. Strength: collection
  and interviews whole; transcript tool excluded for sensitive interviews, with a reason.
- **sol `19-2041.01__2` (S1, fix).** `:16846/s2` 40% screening cut while the analyst still confirms every exclusion
  (a stop rule fixed in advance, digest 19-2 §3a, would earn it); `/s1` record capture folded into a 20% judgement
  step; `:16851/s3`, `:16843/s3` approvals bind a step that checks and sends, with no final version produced; 60h
  and 45h already_counted on unchanged reading. No zero task. Strength: loop inputs have producers.
- **sol `11-9179.02__5` (S3, fix).** `:17616/s2,s4` 33% of a human-class task priced as screen admin (the prior
  gives 23% to all non-meeting means) under flat 30-40% cuts; `:17618/s1` 40% cut from course links that do not
  find the next external class (an honest zero); self-gated saves in all three tasks (release gates right).
- **Grok `17-3029.08__3` (G1, fix).** `:16716/s4` 6% retyping into a traveler cut to 0 while the file's own
  unknowns ask whether it happens, possible overlap with sibling `:20384`; s2 reads traces no step produces. Zeros
  `:16730`, `:16719`, `:16720` honest: sibling tasks own the records. Finalized before the 02:15 alert.
- **Grok `53-3032.00__2` (G2, fix).** `:10643/s2` photographing the paper note is new work priced as today's (net
  about 35, not 51); `/s4` the seal walk cut 35% though the file says it does not shorten; `:10644/s1,s3,s5`
  noticing, the safety call and the phone notice cut; `:10645/s3` an 8% tachograph glance banked; `:10647/s2` reads
  a published instruction that does not exist today. No posted-line frame (11:32). Strength: CMR read checks
  consignee, weight and reference.
- **Grok `21-1093.00__4` (G4, fix).** `:3768/s1` stays_manual read cut 40% on a search of old messages that the
  file's own evidence contradicts (a house folder exists): an early paper-card form in one task, before the 13:37
  family; `:3763` honest zero resting on [S9]. No prior fit.
- **Grok `29-2092.00__2` (G1, fix).** `:17445/s1` writes a hearing diagnosis inside an in-person step although
  sibling `:21189` reads the audiogram from the client system; `/s3` folds fitting-software work and the treatment
  note into 34% in the room; the enabler dismisses digest [S13], which measures exactly that note. A zero is fine
  only after the split. Finalized after the 02:15 alert.

Next round about 06:30.

### Round 10 — selected 06:28 CEST, written 06:37 (17 Oct)

Seed `batch3-Q-round10-20261017`. Finalized passes 2281 (grok 132, opus 610, sol 1539). Unreviewed populations opus
589, sol 1501, grok 113 (G1 103, G4 10). Selected: opus `31-2021.00__3` (01:26), `19-4061.00__5` (00:13); sol
`27-4031.00__1` (S4, 00:08), `25-2051.00__8` (S3, 00:38), `33-2021.00__2` (S2, 03:12), `19-2043.00__5` (S1, 05:48);
Grok `31-9094.00__3` (G1, Fri 22:58), `29-1141.04__3` (G4, Fri 12:30), `27-1023.00__2` (G1, Fri 22:04, also read by
R), `19-2042.00__1` (G1, 01:31). All ten pass the finalize checks rerun read-only; hashes unchanged at 06:36.
Targeted reads, outside the totals: O1 `51-9195.00__1`, `19-1031.03__4` and S1 `19-3094.00__1` (finalized after
04:30), G1 `17-2151.00__2`, `25-4012.00__3` (after 04:06).

**Why S1 did not answer.** At 04:29 the lead found that the Sol panes had lead messages queued and unread (a queued
message is only read when the worker's turn ends; S1's since about 13:30 Friday) and delivered them. S1's earlier
silence was a delivery fault, not a refusal. Since 04:30 S1 leaves 2% of tasks at zero (78% from 02:15 to 04:29),
with 5.5 steps per task and 14.0 gross points (S3 8.7, S4 13.9).

**Uptake of the 04:27 alerts.** The lead stood G1 down at 06:31 after Q's 06:30 alert and moved its 19 files since
04:00 to `runs/g1-rejected-b3/`; no Grok pane writes now. Since 04:30 the S3 range formula appears in 0 of 185 S3
tasks (167 of 296 from 02:00 to 04:30), and gated same-system saves of an author's own record in 1 of about 200 tasks
in each of S3 and S4 (about one per task before; older files keep them, a label issue only). O1's prior fit is gone
(1 of 320 tasks since 04:24). The lead approved O1's sweep of its pre-03:00 files at 04:30, with the test "no cut
step larger than its work".

**G1 stopped decomposing.** From about 04:06, 58 of G1's 62 tasks were zero and 32 were one step, 21 of them the
O*NET statement word for word; the same frames close them ("Incremental upkeep is zero. No template, mapping, or
list is added." in 61 tasks, "No step in this task is removed. The high stays at zero."). Targeted: `17-2151.00__2`
and `25-4012.00__3` redo; `:3566` puts watching labour rates at 100% system screen as "existing runtime" and skips
the comparison with plan, `:1651` skips the budget work its statement names, `:1656` folds the insurance schedule
and cover request into a call. This followed Q's 02:15 and 04:27 alerts about invented and folded record steps.

**O1 now hands savings to siblings.** Since 04:30, 87 of O1's 318 tasks say a step's saving "is counted there", in
a sibling task (127 of 1848 before). Q's 04:27 alert said "no record or scribe saving that a sibling task in the
set covers"; O1 applies it without checking the sibling. `19-1031.03__4:3699/s6` keeps typing captions, dates and
locations at 100% because sibling `3698` "covers" it, but `3698` is answered in another file (Sol `__5`) and cuts
only its own step, so the saving vanishes; `:3694/s1` the same with `3696`. `51-9195.00__1:23677/s6` keeps writing
mold numbers on the order at 100% as "too small to change" although the mold ids are in the system. Cut sizes are
otherwise honest and zeros on hands-on work are real. Ranges: 238 of 254 non-zero O1 tasks since 04:30 set low and
high as the same two fractions of the net (82 of 1823 before).

**S1 overshoots in places.** Since 04:30, 312 of S1's 525 configure steps carry the same cut (24 of 997 before;
S3 and S4 also rose, to 41% and 33%), and 51 of 267 tasks end with a "Record ..." step. Targeted
`19-3094.00__1:5515/s5` adds a class-progress record in the learning system that nothing reads and teaching does not
produce today; `:5516/s1` prices a new structured evidence brief as today's work. Its other splits are real: lookup,
scanning and submission steps exist today and every human step keeps its time.

**R/Q comparison.** An eighth file read by both at the same hash: Grok `27-1023.00__2` (e6e6cf466ea1), fix in both.
Q agrees with R's `:1727/s1` finding, but R's repair (make the note capture explicit inside s1) leaves the invented
draft and check of written care lines (s2/s3, 26% against a 6% documents prior) and a loop that only looks up a
name she typed; counting capture time should lower the net. Q also finds `:1723/s5` (pressing send priced at 8%,
half the gross) and `:20751/s1` (22% re-keying an order sibling `1719` produces). R confirmed `49-9052.00__1:11858`
fixed at 05:20.

Findings per file:

- **opus `31-2021.00__3` (fix).** `:2021/s6` moving paper messages to a task list claims a saving sibling `:2009/s4`
  already claims; `/s8` the claim send already runs through the practice system [S4], yet is priced at 5% and cut to
  0; `/s3` and `:2023/s5` machine sends whose structured input no step produces; `:2017/s4-s6` sibling work pads the
  task by 25%; `:15250/s6` a course record sized far above its work. Strength: hands-on steps at 100%.
- **opus `19-4061.00__5` (fix).** `:12964/s2` 17.5 points from moving forms to online capture, ungraded, while
  sibling `:12965` says questionnaires are already built in the survey tool; `:12972/s2` a reorder reminder with no
  stock booking step; `/s3` a machine join of forms and bookings that no step performs, and booked is not attended.
  Strength: `:12964/s3` loop on pseudonymised text, checked against a double-coded sample; works-council gate [S22].
- **sol `27-4031.00__1` (S4, fix).** `:4031/s1`, `:4037/s1`, `:4039/s1` read-and-lookup steps cut 40-50% as a
  whole; `:4037/s3`, `:4039/s3` cuts for ids the project record already holds; `:18663/s2` locate-and-inspect cut
  50% while watching clips stays; `:4039/s6` a gate on her own spoken instruction. Strength: creative and physical
  work at 100%, task-specific ranges.
- **sol `25-2051.00__8` (S3, fix).** `:19096`, `:19091` range lows by the formula (before 04:30); `:19091/s3`
  planned quantities have no producer and the comparison, mostly a glance while counting, is priced at 20% and cut
  to 0. Strength: save and send priced small and kept, gate on the check.
- **sol `33-2021.00__2` (S2, fix).** `:22999`, `:23001` range basis is the central sum with high equal to central;
  self-gated saves (label). Zeros `:22996`, `:22997` honest: captions and custody records are realistic writes no
  native feature removes. Closest to good this round.
- **sol `19-2043.00__5` (S1, fix).** `:9122/s3,s5` machine 0% with no repair or layout remainder although the
  assumptions say failed conversions stop for manual repair; `/s2` cut though it must now write the transformation
  spec; `:9118` "E1 case [S11]" where S11 is applicant tooling; ranges back-solved in three tasks. New savings
  otherwise real: cut steps exist today and the configuration touches them.
- **Grok `31-9094.00__3` (G1, fix).** `:9420/s4` the feed writes the live clinical record before the check at s6;
  `:9425/s2` 12% for placing headings cut to 0 (templates exist); `:9424/s3` a read step outputs fields no step
  produces; `:20254/s3` typing cut overlaps sibling `9413`.
- **Grok `29-1141.04__3` (G4, fix).** Read steps cut 45-55% while the assumptions say the specialist still reads;
  note cuts of 45-50% from fixed fields against the digest's 29% with a full scribe [S8]; `:18003/s8` a manual
  interaction read although rule surveillance exists [S6]; `:18003/s9` prescription send has no step. No early G4
  family.
- **Grok `27-1023.00__2` (G1, fix).** See R/Q comparison.
- **Grok `19-2042.00__1` (G1, fix).** `:20390/s3` "reordering abstracts" at 10% does not happen today and is cut to
  0; `/s2` locate cut in full though hand fetching stays; `:3712/s5` a machine journal submission cut to 0;
  `:3703` the zero folds the field-log write that `:3705` reads.

Next round about 08:40.

### Round 11 (final) — selected 07:48 CEST, written 07:55 (17 Oct)

Seed `batch3-Q-round11-20261017`. Queue done (lead); 2,486 passed at 07:53 (grok 115, opus 665, sol 1706; S2
re-answered the blocked `25-9042.00__1` at 07:50). Unreviewed populations opus 639, sol 1659, grok 92 (G1 83, G4 9).
Selected: opus `33-1012.00__2` (Fri 15:40), `27-2012.03__6` (Fri 21:52); sol `21-1022.00__3` (S1, Fri 14:53),
`23-1023.00__3` (S4, 01:14), `17-2199.08__3` (S2, 02:03), `11-9161.00__4` (S3, 03:30); Grok `25-2021.00__4` (G1, Fri
22:20), `49-9071.00__2` (G4, Fri 11:23, also read by R), `29-1127.00__6` (G1, Fri 17:38), `19-1022.00__2` (G1, 02:33).
All ten pass the finalize checks rerun read-only; hashes unchanged at 07:53. Result: 8 fix, 1 good, 1 redo.

**Uptake since 06:37.** O1's "its saving is counted there" hand-off: 60 of 276 tasks from 04:27 to 06:37, 1 of 179
from 06:37 to 07:44; the sweep's first 32 re-finalized files have it in 20 of 133 tasks. O1's range bases still set
low and high as the same two fractions of the net (114 of 144 non-zero tasks after 06:37). S1's trailing "Record"
steps fell from 51 of 271 tasks (04:27-06:37) to 4 of 143; its most common configure cut still covers 83 of 233
configure cuts. A second Sol range formula, S4 "Below provisional net ...", is in 106 S4 tasks before 04:27 and none
after. Q's earlier redo `19-3033.00__1` (G4) was pulled; the file now present is a G1 re-answer (Sat 00:27), unread.

**R/Q comparison.** A tenth file read by both at the same hash: Grok `49-9071.00__2` (07c1f90d23c7), fix in both;
both find `:3028/s1` cutting the fault reading the design does not touch and `:20676/s4` cutting a record that may not
exist today. R's round 11 also picked Q's round-8 `49-1011.00__2` (7c6e92c23839): fix in both, same findings. R
widened its `27-1023.00__2` repair at 07:21 to match Q's; one point stays: R does not treat `:1723`'s 8% send share as
inflated on size alone. R's final (07:50): 72 files, 54 fix, 18 good, 0 redo.

Findings per file:

- **opus `33-1012.00__2` (fix).** `:565/s5` the answer desk replies inside a person step marked read, and its check
  only finds a quote; `:565/s3` an e-mail of an approved summary priced at 5% and cut to 0; `:568/s4` attendance goes to
  0 with no capture step (15% spreadsheet against a mostly in-person task); `:568/s1` planning cut 30% with no
  mechanism; `:569/s2` 40% from required-field checks the records system already runs. Ranges explain the central
  figure, not a conservative case. Strength: `:569` rejects narrative drafting with a correct E3 cite.
- **opus `27-2012.03__6` (fix).** `:7677/s6` the director moves segments mid-campaign but no step or upkeep writes the
  moves or re-approves a moved pitch; the pledge-to-playout join is integration code, not configure; `/s2` placing a
  handful of segments sized like script writing. Strength: a1 binds the final scripts and voids on any change.
- **sol `21-1022.00__3` (S1, fix).** `:262/s2` and `:268/s2` fold the meeting note into the talk step; `:262/s1` holds
  consent talk, recipient check and the send in one step that its own approval gates; `:268/s2` internal direction
  marked act_external; already_counted lists untouched counselling time. Strength: `:266` splits the plan write.
- **sol `23-1023.00__3` (S4, fix).** All four range bases are one formula ("Below provisional net X% ..."); `:5650/s2`
  and `:5648/s3` advice to parties in court marked draft; `:5651/s4` the judge gates their own save; no legal item
  although the digest's AI Act and court-policy rows are why no model is used. Strength: judicial work at 100%.
- **sol `17-2199.08__3` (S2, good).** Gated 1% saves stay at full time (label note only); already_counted points at
  unchanged steps in `:16509` and `:16528`. The code loop in `:16528/s3` is bounded and checks meaning.
- **sol `11-9161.00__4` (S3, fix).** All four tasks use "Half eligible gives ..."; `:7265/s1` 40% cut on reading an
  agenda that comes with the invite; `:7255/s1` 40% on retrieving rule changes where only the version lookup changes;
  `:7270/s6` input schema has no producer; `:7255/s6` a send marked draft. Strength: loops check meaning.
- **grok `25-2021.00__4` (G1, fix).** `:6542/s4` an invented re-tick of items pupils already answered online, 8%, cut to
  0, output unused (scan flag real); `:6544/s4` a spreadsheet sum with no step that types the ticks in. `:6548` 0/0/0
  range is an honest zero (scan flag false positive). Strength: teaching and open grading at 100%.
- **grok `49-9071.00__2` (G4, fix).** `:3028/s1` 60% cut on reading the fault; no producer for the asset-to-manual link;
  `:20676/s1` reading a shift list cut 55% with no producer; `:20676/s4` a training record that is memory or paper today
  cut to 40%. Both tasks open with a "Read X" step cut by "configure". Strength: site work at 100%.
- **grok `29-1127.00__6` (G1, fix).** `:1882/s2-s4` an invented rebuild and load of an AAC setup each session, which
  belongs to the sibling device task; `:1885/s6` a same-store file at 4% cut to 0; legal rows copied into both tasks.
- **grok `19-1022.00__2` (G1, redo).** Person steps are the statements cut at commas (`:3677/s1-s3`, `:3680/s1-s3`);
  `:3678/s3` screens notices after they were read; `:3681` never assembles or releases the report; `:3680/s4-s5`
  restate written notes while the bench capture is folded away; ranges share one formula.

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
| 25-3021.00__7 | grok-4.7 | G2 | 3 | redo | 9f0f7bf9c0b0 | Revised round 6 (was fix): posted-line frame in all four tasks ("read drops to 75 percent"), nets 2-4% |
| 35-1011.00__1 | grok-4.7 | G3 | 3 | redo | 11c8eeea2ed2 | Revised round 4 (was fix): all four tasks carry the G3 list-step template; invented look-up hunts cut to 0% |
| 41-2022.00__1 | grok-4.7 | G4 | 3 | redo | b9b4f063b216 | G4 paper-card template in all four tasks: s1 read-the-card stays_manual cut to 60%; lead moved it to runs/g4-rejected-b3 |
| 49-1011.00__1 | opus-5.5 | O1 | 4 | fix | f8f06727a2de | 15262 reorder proposal and PROCUREMENT send no step, s6 call cut 40%; 2914/s5 notes no producer; 15263/s2 mixed |
| 25-1072.00__7 | opus-5.5 | O1 | 4 | fix | dd9b05bbd6c8 | 6143/s6 gated proposal lacks research plan input; 6144/s4 board plan no producer, form check no step |
| 51-4041.00__2 | sol-6.1 | S1 | 4 | fix | 519c93013524 | 20296/s2 escalation write and spec lookup folded into diagnosis; 20297/s2 written recommendation folded in |
| 25-1071.00__5 | sol-6.1 | S1 | 4 | fix | 24f6b309a43c | 6118/s2 cut rests on assumed re-entry; act_external for colleagues; low bounds a formula; 6121 honest zero |
| 25-4022.00__6 | grok-4.7 | G1 | 4 | fix | 11a4f2bbae9e | 22436/22421 filing cut where nothing is filed today; self-approvals of a plain save; handout after session |
| 53-3033.00__2 | grok-4.7 | G2 | 4 | fix | 133fa215db80 | 8621 cash sheet after hand-in, POS total no step; 8622/s3 kept check cut 30%; already_counted on all steps |
| 49-3011.00__2 | grok-4.7 | G3 | 4 | redo | a03bd6dad4f9 | G3 list-step template in 9972/9961/9982 (4% List step to 0%, still read); 9968 cycle, no parts keying step |
| 25-2011.00__2 | grok-4.7 | G4 | 4 | fix | c11a84386343 | 6469/s1 invented plan-book hunt; 6471/s1 note before the child is identified; 6482/s1 attendance tick folded in |
| 35-1012.00__5 | opus-5.5 | O1 | 5 | fix | 3cf97fe9655b | 2151 74% priced at full recipe coverage vs stated 70%; 2164 quote sent ungated, reminder no step; 2161/s6 cut |
| 39-9031.00__5 | opus-5.5 | O1 | 5 | fix | e9bbb0eabf51 | 4577/s3 ungated send placed after advice; 4577/s4 and 4576/s6 cut capture where only the medium changes |
| 29-2061.00__2 | sol-6.1 | S1 | 5 | fix | c4b18dc6976a | 514 care-plan entry and charting folded into call and care; 516 record lookup folded in, evaluation note excluded |
| 29-1127.00__5 | sol-6.1 | S1 | 5 | fix | 3fae6840d2b0 | 18525 docs share 60% vs prior 22% carries all saving; 23952/s2 supervision record folded in; 1879 no producer |
| 31-2021.00__1 | grok-4.7 | G1 | 5 | fix | 0d5b6da6e60d | 15247/s2 compile and notes folded in (zero untested); 21192/s4 10% save step; 21192/s2 needless loop |
| 21-1093.00__3 | grok-4.7 | G2 | 5 | redo | 6dbfdb6b9ae3 | One read-cut + note-cut skeleton in all four tasks ("opens on the id"); invented binder/booklet baselines |
| 37-2012.00__1 | grok-4.7 | G3 | 5 | redo | 7222146a77f0 | 9564/9563/9577 add an orphan 4% rewrite step to remove it with a par card; same frame; 9571 capture missing |
| 25-2057.00__2 | grok-4.7 | G4 | 5 | redo | 793623de5a96 | Revised round 7 (was fix): G4 prior-fit, one step per means bucket at prior size, filler reads; nets 0-6% |
| 35-9031.00__4 | opus-5.5 | O1 | 6 | fix | 6138f34e11aa | 2313/s6 60% cut for an hours sync with no step, menu/web unchanged; s7 cut unexplained; 2312/s2 returns no producer |
| 29-1126.00__3 | opus-5.5 | O1 | 6 | fix | 33aaa48465d5 | 411/s1 physical prep cut on unproduced cards; 411/s4, 410/s1, 410/s4, 412/s5 40-60% cuts not earned; vitals feed no step |
| 35-3031.00__1 | sol-6.1 | S1 | 6 | fix | 6c4ed507ebd2 | 2277 one re-entry cut twice, routing send inside clarification; 2276 screen share 40% vs 9.9% prior carries saving |
| 53-2012.00__3 | sol-6.1 | S2 | 6 | fix | d406d229b1a4 | 10608 s5/s9 5% commit/send tails earn 10 of 16; 10600/s5 crew-control re-key; 10607/s1 repeats 10599/s1 |
| 43-5011.01__3 | sol-6.1 | S3 | 6 | fix | c35e7e0550b5 | 17683/s8, 19830/s8 bank a same-system save; 19830/s3 15 pts on a calculator that already exists |
| 29-1141.01__4 | grok-4.7 | G1 | 6 | fix | b400804db329 | 18297/s4 files an unwritten analysis at 0%, self-approved at s2; 18319 referral reduced to a form, clerk ids uncounted |
| 25-3031.00__1 | grok-4.7 | G2 | 6 | redo | d8f175c3a3a3 | Opens-on-the-id skeleton in all four tasks; invented hunt/paper baselines; same sentences as three G2 files |
| 25-2032.00__1 | grok-4.7 | G3 | 6 | redo | 57ad67ccdf2a | List-step in 6673/6675, orphan 4% "File ... v1" steps in 6674/6681 as only cuts, approved after filing (cycles) |
| 43-5011.01__6 | grok-4.7 | G4 | 6 | redo | 9088ad5cb30d | Revised round 7 (was fix): G4 prior-fit in all four tasks, meeting/mail steps sized to buckets; lead moved it |
| 29-1215.00__2 | opus-5.5 | O1 | 7 | fix | 01c9eeddfc1e | 7775 s1/s5 cut sibling work (7772/7774), s5 40% above S8 29%, no consent step; 7776/s5, 7778/s4, 7779/s3-s4 unearned |
| 49-9052.00__1 | opus-5.5 | O1 | 7 | fix | a9d44112b9da | 11858 a1 binds installation not message (R's finding open), fee write no step; 11859/s4 70% on hand entry; 11847/s7 |
| 25-1072.00__2 | sol-6.1 | S1 | 7 | good | 01f9f3a432d4 | Cuts only on assembly/drafting with meaning checks; 6145 honest zero; minor label notes |
| 27-2041.00__3 | sol-6.1 | S3 | 7 | fix | 8624b4646e1d | 22552 s5/s6, 22553 s6/s7/s9 same-system save/send tails cut to 0 (38 to ~25); 22554/s4 existing runtime zeroed |
| 27-2012.05__3 | sol-6.1 | S2 | 7 | fix | a2a8ad6445ce | 3905 s2/s5 cuts assume no switcher presets (20/20 gross); live effects in no task; tails kept 2-5%; self-approvals |
| 11-9171.00__3 | sol-6.1 | S4 | 7 | fix | bd448aad81a7 | 18838/s4 50% field fill from free-text choices; 18851/s6 send kept 4%; 18848/s2 40% passage cut; self-approved note |
| 25-1022.00__6 | grok-4.7 | G1 | 7 | fix | 5de6a06879c6 | 5728 a3 20% carved from one write, a5 self-approved portal submit 8 to 0; 5729 c4 self-approved place 12 to 0 |
| 35-1012.00__6 | grok-4.7 | G2 | 7 | fix | f5577f209323 | 2166 s1/s4/s5 cut unchanged steps, gate binds s4 output; 18720 POS/cost fills no step, s2/s5 cuts no mechanism |
| 19-3033.00__1 | grok-4.7 | G4 | 7 | redo | a9ab8e3c0dc9 | G4 prior-fit: shares equal the rounded prior in all four tasks; meeting filler 24-26%; 1% bucket step cut to 0 |
| 35-1011.00__2 | grok-4.7 | G1 | 7 | fix | 92ad8af3d34c | 11136/s4 and 11147/s2 cut while the new entry is uncounted; 11148/s2 needless loop; act_external on internal staff |
| 25-2022.00__6 | opus-5.5 | O1 | 8 | fix | 4806d5ef9f48 | 6586 s4/s6 cut steps sized 3-4x priors (25 of 49 gross); 6603 parent form send and 6602 action sync have no step |
| 49-9043.00__2 | opus-5.5 | O1 | 8 | fix | 4cee97571632 | 11838/s1 count cut needs receipt booking no step does, [S1] off-target; 11829 sensor feed and review no step |
| 15-1299.06__3 | sol-6.1 | S2 | 8 | fix | a5243942a24c | 21790/s5 5% filing cut to 0 is half the gross; s4 self-approval gates own filing; 21801/s6 labels |
| 43-4011.00__3 | sol-6.1 | S4 | 8 | good | 2d11f9588f35 | Savings on real reconciliation steps; 1% send/save kept; a1 binds package; notes on s7 gate and triple check |
| 49-9011.00__2 | sol-6.1 | S1 | 8 | fix | 8109fd88b99b | 8402/s1 halves a bundled step where only the search changes (net ~3 not 6); s2 input no producer |
| 17-2199.05__3 | sol-6.1 | S3 | 8 | fix | 7c186beaa611 | 16479 s3/s4 CAD cuts 40/50% vs sibling 20%, no coverage; self-gated internal saves in all four tasks |
| 25-2022.00__5 | grok-4.7 | G1 | 8 | fix | 35af368042be | 6594 shares equal priors with filler s2/s9; request fields written in a read talk; s7/s8 lack the report table |
| 29-1141.03__2 | grok-4.7 | G2 | 8 | fix | ecbdb39b248e | 18339/18335/18337 entry cuts on retype baselines the enablers deny (opens-on-id in 18335); 18341 dictation no producer |
| 49-1011.00__2 | grok-4.7 | G4 | 8 | fix | 7c6e92c23839 | 2923/s4 halves judgement with typing; 2918/s3, 2912/s4 prefill from uncaptured in-person choices; paper baselines |
| 29-1171.00__3 | grok-4.7 | G1 | 8 | redo | b53306b8c6c1 | Every saving is an invented 4-8% card/draft step removed to 0 (18394, 18388, 18383, 18380); counted hours equal cuts |
| 33-2011.00__3 | opus-5.5 | O1 | 9 | fix | f6d3b03ecf88 | 22977 s1 copy 25% and s6 mail 10% cut to 0 carry 35 of 55.5; 22973/s1 sweep cut to 0, pilot flight no step |
| 29-1221.00__1 | opus-5.5 | O1 | 9 | fix | ab8dccb8c684 | 7821/s6 nurse's record 10% cut 40; 7819/s4 kept ordering cut; 7823/s5 double counts 7822 scribe; 7819/s7 split |
| 51-9081.00__1 | sol-6.1 | S4 | 9 | fix | 9adbb06023af | 7133/s1 lookup and physical check cut 50%; 7133/s5, 7147/s5 cuts for ids the record holds; self-gated saves |
| 19-5012.00__5 | sol-6.1 | S2 | 9 | fix | af37526d8812 | 19814 paper re-key no step, unit rules folded into s4; 11101/s4 existing-template cut; self-gated saves |
| 19-2041.01__2 | sol-6.1 | S1 | 9 | fix | 2341c3ab4fc1 | 16846/s2 40% cut while every exclusion still confirmed; s1 capture folded; 16851/16843 gates bind check+send |
| 11-9179.02__5 | sol-6.1 | S3 | 9 | fix | 3c8d35c05469 | 17616 screen baseline 33% vs prior under flat cuts; 17618/s1 cut on links that miss the next class; self-gates |
| 17-3029.08__3 | grok-4.7 | G1 | 9 | fix | 63d45b2189cf | 16716/s4 6% retype cut though own unknowns doubt it exists, sibling 20384 overlap; three zeros honest |
| 53-3032.00__2 | grok-4.7 | G2 | 9 | fix | 0b0e81303f25 | 10643/s2 new photo work as baseline, s4 walk cut; 10644/10645/10647 kept steps and calls cut; no posted-line |
| 21-1093.00__4 | grok-4.7 | G4 | 9 | fix | 63e5fa455998 | 3768/s1 read cut 40% on a search its own folder contradicts (early paper card, one task); 3763 honest zero |
| 29-2092.00__2 | grok-4.7 | G1 | 9 | fix | 9ba8724e1af7 | 17445 zero before split: diagnosis record siblings read, fitting software and note folded into in-person steps |
| 29-1222.00__1 | opus-5.5 | O1 | 9t | redo | 5d484df1cb34 | Targeted, outside totals: prior-fit, 1% spreadsheet filler cut in all four tasks, means labels bent; lead pulled |
| 27-4015.00__1 | opus-5.5 | O1 | 9t | redo | 62dd86c4d10e | Targeted, outside totals: prior-fit in all four tasks, console work labelled in_person, mail sized to prior; pulled |
| 31-2021.00__3 | opus-5.5 | O1 | 10 | fix | 417221a33d88 | 2021/s6 double-claims sibling 2009; 2021/s8 existing send cut; 2021/s3, 2023/s5 sends no input producer |
| 19-4061.00__5 | opus-5.5 | O1 | 10 | fix | 930ef3f511a1 | 12964/s2 capture-mode cut ungraded vs sibling 12965; 12972 s2 reminder no stock booking, s3 join no step |
| 27-4031.00__1 | sol-6.1 | S4 | 10 | fix | 51a0499264cd | 4031/4037/4039 s1 read+lookup cut whole; 4037/4039 s3 cuts for held ids; 18663/s2 inspect cut |
| 25-2051.00__8 | sol-6.1 | S3 | 10 | fix | 1bbddc264e3d | 19091/s3 planned qty no producer, glance at 20% cut to 0; 19096/19091 range formula lows |
| 33-2021.00__2 | sol-6.1 | S2 | 10 | fix | 078278a99fb3 | 22999/23001 range basis = central sum, high = central; zeros 22996/22997 honest; self-gate labels |
| 19-2043.00__5 | sol-6.1 | S1 | 10 | fix | 213f9185b723 | 9122 s3/s5 machine 0% without repair remainder, s2 cut; 9118 E1 case [S11]; back-solved ranges |
| 31-9094.00__3 | grok-4.7 | G1 | 10 | fix | 63125346be58 | 9420/s4 feed writes live record before check; 9425/s2 12% headings cut to 0; 9424/s3 fields no producer |
| 29-1141.04__3 | grok-4.7 | G4 | 10 | fix | 0b50e1b3791c | Read steps cut ~50% though still read; note cuts above [S8]; 18003/s8 invented manual read; s9 send no step |
| 27-1023.00__2 | grok-4.7 | G1 | 10 | fix | e6e6cf466ea1 | R fix same hash: 1727 capture uncounted + invented draft/check + needless loop; 1723/s5 8% send; 20751/s1 |
| 19-2042.00__1 | grok-4.7 | G1 | 10 | fix | 3f08c39c01bb | 20390/s3 invented 10% reorder step cut to 0; 3712/s5 machine journal submit; 3703 zero folds field log |
| 51-9195.00__1 | opus-5.5 | O1 | 10t | fix | ef87203f2352 | Targeted, outside totals: 23677/s6 mold-number write kept 100 "too small" though ids in system; 23666 honest |
| 19-1031.03__4 | opus-5.5 | O1 | 10t | fix | ad85a32e765f | Targeted, outside totals: 3699/s6, 3694/s1 savings handed to siblings that do not claim them; 3695 vs 3694 |
| 19-3094.00__1 | sol-6.1 | S1 | 10t | fix | 959e52ccbdbb | Targeted, outside totals: 5515/s5 invented class-progress record; flat configure cuts; 5516/s1 new capture |
| 17-2151.00__2 | grok-4.7 | G1 | 10t | redo | 8eb6a0005f28 | Targeted, outside totals: statement restated as one step, zeros skip named valuation/evaluation work; pulled |
| 25-4012.00__3 | grok-4.7 | G1 | 10t | redo | b82786bf40ad | Targeted, outside totals: statement split at commas, budget/insurance/booking work skipped; pulled |
| 33-1012.00__2 | opus-5.5 | O1 | 11 | fix | f9a4824c5ec9 | 565/s5 answer desk inside read person step; 565/s3 send 5% to 0; 568/s4 no capture; 568/s1, 569/s2 cuts |
| 27-2012.03__6 | opus-5.5 | O1 | 11 | fix | 65b3a8710027 | 7677/s6 mid-campaign moves with no step or upkeep; join is integration; s2 oversized |
| 21-1022.00__3 | sol-6.1 | S1 | 11 | fix | ffe69fe5aef6 | 262/s2, 268/s2 notes folded into talk; 262/s1 send in person step self-gated; 268/s2 act_external |
| 23-1023.00__3 | sol-6.1 | S4 | 11 | fix | ae939b6005e9 | 'Below provisional net' range formula x4; 5650/s2, 5648/s3 outside advice as draft; no legal item |
| 17-2199.08__3 | sol-6.1 | S2 | 11 | good | ccb55896cec9 | Gated 1% saves kept at 100% (label note); already_counted on unchanged steps; bounded code loop |
| 11-9161.00__4 | sol-6.1 | S3 | 11 | fix | ead709235ddb | 'Half eligible' range formula x4; 7265/s1, 7255/s1 lookup cuts; 7270/s6 no producer; 7255/s6 auth |
| 25-2021.00__4 | grok-4.7 | G1 | 11 | fix | 6cc7cf574dfb | 6542/s4 invented re-tick cut to 0, unused; 6544/s4 sheet sum with no tick capture |
| 49-9071.00__2 | grok-4.7 | G4 | 11 | fix | 07c1f90d23c7 | 3028/s1 fault read cut 60%; 20676/s1 shift list, s4 paper/memory record cut; R same hash fix |
| 29-1127.00__6 | grok-4.7 | G1 | 11 | fix | c1f63bd1bab8 | 1882/s2-s4 invented setup rebuild (sibling device task); 1885/s6 same-store file 4% to 0 |
| 19-1022.00__2 | grok-4.7 | G1 | 11 | redo | 913261235964 | Statements cut at commas into person steps; 3678 screen after reading; 3681 report never assembled |
