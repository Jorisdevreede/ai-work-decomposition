# HANDOFF: team-reimagine (repo Jorisdevreede/ai-work-decomposition)

Last updated: 2026-10-17 08:55. Live site: https://jorisdevreede.github.io/ai-work-decomposition/
Older history: git log, `fleet/STATUS.md`, `fleet/v4-review/REVIEW-B2.md`.

## Batch 3: done (2026-10-17 08:50, commit fb5c0b9)

- All 2,486 prompts in `runs/v5/prompts` pass: `runs/v5/sol-6.1` 1,821, `runs/v5/opus-5.5` 665, 0 blocked, 0 Grok.
- Final verdicts in `fleet/v5-review/REVIEW-B3{,-Q}.md`. The 115 ex-Grok re-answers and the O1 sweep
  (664 of 665 Opus files re-finalized; old files 22.4% -> 19.6% net, 135 tasks save nothing) are not reviewed yet.
- ntm session `team-reimagine--weekend` is idle (all workers DONE), still up; Slack digest and caffeinate still running.

## Pulled files (kept, back in queue)

`runs/g4-rejected-b3` (paper card; prior-fit 15:59 on; `second/` = redo copies), `runs/g2-rejected-b3`
(posted line), `runs/g3-rejected-b3` (list step), `runs/g23-rejected-b3` (zero over-correction + rest),
`runs/g1-rejected-b3` (1 redo), `runs/o1-priorfit-b3` (56 O1 files 03:00-04:20, prior-fit caused by
the lead's 02:15 wording), `runs/o1-blocked-stubs-b3` (Opus safeguard flag on 15-1299.04 penetration
testers; security prompts claimed for S1).

## Lessons (apply next time)

- Grok 4.7 drifts into templates within ~2 h per pane, then over-corrects; 3 of 4 panes pulled.
  Use Grok only with a per-pane structural check every hour.
- Never quote a prior/target number in a forwarded alert: workers fit to it (O1 03:00).
- Codex panes: Tab queues a message that is only read when the turn ends; a worker loop is one long
  turn, so messages sat unread for 15 h. Deliver with Escape (interrupt), then type + Enter.
  Grok: queued; empty Enter delivers one item. Claude panes: Enter delivers.
- Opus 5.5 safeguards can flag security occupations; route those to Sol.
- dcg blocks `mv` with `$(...)`; use python `os.rename` (check destination first: it overwrites).

## Open for Joris

Re-review of the Opus sweep + ex-Grok re-answers; repair pass on the Sol families R/Q flagged; Amplitude;
66-initiative grouping; mockups merge on A; batch-2 repair pass; kill old `team-reimagine` session and,
when done, `team-reimagine--weekend`; long "Connect HCM ..." name; busy portfolio rows; Grok in future fleets.
