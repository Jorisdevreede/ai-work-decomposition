# Batch 3 second review (Q, pane 5, Opus 5.5)

**Running verdict after round 2 (16 Oct 13:30): 15 files read, 13 fix, 2 good, 0 redo.** Not a model ranking:
different jobs, four to seven files each. All 15 pass the finalize checks; every fix is a semantic defect.

| Model | Files read | Fix | Good | Redo |
|---|---:|---:|---:|---:|
| opus-5.5 | 4 | 4 | 0 | 0 |
| sol-6.1 | 4 | 3 | 1 | 0 |
| grok-4.7 | 7 | 6 | 1 | 0 |

Open defect classes (through round 2):
- **All models:** a step relies on an input no step or contract produces, or a machine action named in the
  design has no step (ERP send, alert, sheet fill, out-of-service flag); capture effort is not counted.
- **Opus:** cuts to face-to-face steps the design keeps (24% of its focal in-person/call steps after 11:30, against
  Grok 6% and Sol 1%); approvals before the final artefact (`29-1141.04__5:20417`, `35-3011.00__2:2239`).
- **Grok:** the same cuts, falling since the 11:27 forward (16% of such steps before, 6% after); approval cycle
  `41-2011.00__4:2416` unchanged; loose authority and rung labels.
- **Sol:** short graphs. About half of its zero-saving tasks are honest; the rest fold a record write or lookup
  into a conversation step and never test the configure rung (targeted read, 8 tasks: 4 honest, 3
  under-decomposed, 1 missed change). Mixed steps get guessed cuts.

**R/Q comparison:** four files read by both at the same hash, all fix in both: Grok `41-2011.00__2`,
`41-2011.00__4`, `41-2011.00__5`, Opus `35-3031.00__2`. One task-level disagreement: Sol `25-2021.00__8`
(R good) — Q's targeted read finds `:6567` under-decomposed (rota writing and a written evaluation folded into
conversation steps); Q has not read the rest of that file. On Sol overall, R has 4 good and Q 1 good out of 4, on
different files: Q fixes mixed-step cuts, uncounted capture and an under-decomposed sale.

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
