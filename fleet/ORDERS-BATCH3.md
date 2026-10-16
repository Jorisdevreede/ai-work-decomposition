# Orders: batch 3, the weekend fleet (2026-10-16 to 2026-10-18)

Session `team-reimagine--weekend`. Read `AGENTS.md` first. Goal: v4 task graphs for every remaining O*NET
occupation, only the tasks with a digital component (`config/jobs-batch3.json`: 709 jobs, 8,829 tasks,
2,486 prompts of up to 4 tasks, largest US employment first). Prompts: `runs/v5/prompts/<name>.md`.

## Workers (panes 0-3 Grok 4.7, 4 Opus 5.5, 6 Sol 6.1)

Your pane id and label:

| Pane | Id | Label (output folder) |
|---|---|---|
| 0-3 | G1-G4 | grok-4.7 |
| 4 | O1 | opus-5.5 |
| 6 | S1 | sol-6.1 |

Loop until the queue says DONE:

1. `python3 tools/claim_next.py <Id>` prints the next prompt name (or DONE). Asking again before you
   answer gives you the same name back.
2. Read `runs/v5/prompts/<name>.md` and follow its header. Write the answer yourself to
   `runs/v5/<label>/<name>.json`, then finalize:
   `python3 tools/fleet_v3.py --batch config/jobs-batch3.json --label <label> --finalize runs/v5/<label>/<name>.json`
   Fix and finalize again, at most 3 tries; a file that stays blocked stays `.blocked.json`. Go on.
3. Every 10 prompts append one line to `fleet/STATUS.md`: `<time> <Id> <n> passed, <m> blocked, last <name>`.

Rules:
- **No scripts that write answers.** Every task's steps are written by you for that task. A helper that
  copies a step sequence or fills a template from task text is the batch-2 Terra failure: those files are
  deleted and the pane is stopped. Small helpers that only check or format your own text are fine.
- Web search stays off; use the digest in the prompt and model knowledge (E1, say so).
- Read the defect list in the prompt header before your first answer and re-read it every 25 prompts.
- Never edit another pane's files, `tools/`, `schema/`, `config/` or `prototypes/`.
- If the finalize command itself fails (a crash, not a check failure), write one line `<Id> TOOL ERROR <name>
  <first error line>` to `fleet/STATUS.md` and claim the next prompt.

## Reviewer (pane 7, Sol 6.1, id R) and second reviewer (pane 5, Opus 5.5, id Q)

R: every 2 hours sample two new passed files per model from `runs/v5/*/` (seeded, record the seed),
read them against the task statements and the defect list in the prompt header, and append findings to
`fleet/v5-review/REVIEW-B3.md` (top: a running verdict per model: fix / good / redo counts). Also run a
structural scan over all passed files each round (repeated step sequences across tasks, dependency order,
approvals before their artefact). For a pattern that repeats, append `<time> R ALERT <label>: <pattern>
<example file>` to `fleet/STATUS.md`: the lead forwards it to the workers.

Q: the same every 2 hours but only for `opus-5.5` and `sol-6.1` files plus 4 Grok files, so each model gets
two independent readers; write to `fleet/v5-review/REVIEW-B3-Q.md`. When R and Q disagree on a file, say
so in your own file. Neither reviewer edits answers.

Do not commit or push. The lead commits and pushes the results at checkpoints.
