# Sample review of the v3 generic task graphs

You review a random sample of batch files from `runs/v3/sol/` (listed in the prompt). Each holds the
generic task graph for four O*NET tasks of one job, following `schema/taskgraph-v3.schema.json` and the
method in `tools/fleet_v3.py` (METHOD). Systems must be slot ids from `config/system-slots.json` and
`{SLOT}` placeholders in text; no product names outside evidence. `_meta.checks` holds the
mechanical check notes.

For each file, check: are the steps realistic and split at real boundaries; do fate, remaining_pct,
block, rung and loop agree; is the cheapest sensible rung chosen (flag both over-claimed
deterministic on messy input and needless agents); are gates on the right actions with a sensible
approver; is the design coherent and generic; are evidence grades honest and source ids from the
digest; any company-specific or national detail that should be generic; anything wrong.

Write `fleet/v3-review/REVIEW.md` (at most 900 words): an overall verdict on whether batch 1 is good
enough to show customers as a generic head start, the recurring problems with counts and examples
(file and task uid), and concrete fixes to the prompt, schema or checks before the next batch. Then a
table: file, verdict (good / fix / redo), one-line reason. Write only that file.
