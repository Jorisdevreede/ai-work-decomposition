# Orders: batch 2, the next 100 roles (2026-10-15)

Read `AGENTS.md` first. Batch 2 = `config/jobs-batch2.json`: 100 jobs, 2,224 O*NET tasks, 595 prompts
of four tasks each in `runs/v4/prompts/<code>__<n>.md` (built by `tools/fleet_v3.py --emit-prompts`).
Your lane (W1..W8) and its prompt list are in `fleet/BATCH2-LANES.json`. Write only in your lane's
`out` folder; never touch another lane's files, the prompts, the tools or the schema.

## Workers W1–W8 (Grok 4.7 and Codex Terra)

For each prompt in your lane, in order, skipping any whose `<out>/<name>.json` already exists:
1. Read `runs/v4/prompts/<name>.md` (its header says how to answer). **No web search**: use only the
   research digest in the prompt and model knowledge (grade it E1). Never invent a product, case,
   number or link; source ids only from the digest.
2. Write ONE JSON object valid against `schema/taskgraph-v4.schema.json` to `<out>/<name>.json`.
3. Run `python3 tools/fleet_v3.py --batch config/jobs-batch2.json --label <label> --finalize <out>/<name>.json`.
   Fix every reported reason and finalize again, at most 3 tries; if it still fails, leave the
   `.blocked.json` and move on. Never weaken an answer just to pass (do not drop steps, sources
   or gates to silence a check; fix the substance).
4. After every finished **job** (all its prompts), append one line to `fleet/STATUS.md`:
   `<time> W<n> <code> <passed>/<total> passed, <blocked> blocked`.
When your lane is done, append `W<n> LANE DONE <passed>/<total>` and stop.

## Reviewer R (Sol 6.1)

Every ~30 minutes, sample 2 newly passed files per worker (all 8 lanes) and judge them as in
`fleet/V3-SAMPLE-REVIEW-BRIEF.md`, plus the v4 points: evidence kinds, approval references, labour
scope, incremental new work, conservative range. Keep a running `fleet/v4-review/REVIEW-B2.md`
(verdict table: file, lane, model, good/fix/redo, one-line reason; and recurring problems per lane).
If one lane shows a systematic defect, append `R ALERT W<n>: <defect>` to `fleet/STATUS.md`.
Do not edit worker files. When all lanes say LANE DONE, write the final verdict (Grok vs Terra
quality, counts) at the top of REVIEW-B2.md and append `R REVIEW DONE`.
