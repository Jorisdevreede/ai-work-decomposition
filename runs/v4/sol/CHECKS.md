# FIXES verification — 2026-10-15

Implemented `fleet/ORDERS-FLOW.md`, FIXES, against the v3 sample review and recruiter review synthesis. Only assigned generator/schema/builder files, v4 trial artefacts, and fleet status were written. No commits or publication.

## Deliverables

- `schema/taskgraph-v4.schema.json`: separate v4 contract. Evidence kind; scoped labour; shared-step markers; action/version-bound approval references; already-counted and incremental work with numeric hours; conservative savings range. The v3 schema and v3 runs are preserved.
- `tools/fleet_v3.py`: now generates v4 into `runs/v4/<model>/`. Validates schema and semantic checks before publication and derivation. Failed candidates, including missing JSON, stay in `<code>__<n>.blocked.json`, with reasons in `_meta.checks`. Two attempts maximum; corrective retries receive the failures. Repaired candidates retain rejected-attempt reasons. Existing published files are checked before skipping. Any blocked batch gives the command a failing exit code. Timed-out subprocess groups are terminated and reaped.
- `tools/build_jobs_view.py`: importance × interpolated frequency weights replace equal weighting for both job savings and hours by fate. Frequency categories 1..7 map to 1/1.5/2.5/4/6/8/10. Missing importance defaults to 3 and missing frequency weight to 4. Original numeric O*NET facts take precedence; a labelled table-frequency fallback is available. Normalisation uses the loaded tasks, including partial jobs. The builder still reads v3; no migration of existing graph data is implied.
- `runs/v4/sol/check_fixes.py`: offline regression and integration checks; no model/network calls.

## Accounting contract

Workflow step shares must sum to exactly 100. The role denominator is only the sum of `focal_role` shares. Supplier, customer, other-role and system shares earn no role capacity. If B is focal baseline and R is focal remaining time, gross saving is `100 × (B − R) / B`. Incremental focal work, measured per 100 focal-role baseline hours **for this task**, is deducted once. Already-counted work points to remaining-time steps and is never deducted again. Savings and speedup derive from this net result; a fully eliminated residual has `speedup: null`, rather than an invented cap. Zero focal baseline yields zero saving; incremental focal work then blocks.

An approval reference must name this action, its approved artefact version, its human approver, and a positive-remaining-time human step by that approver in the same task. Several actions may reuse the same time-counted approval. No machine/gone step can conceal its own human approval. The conservative range describes slower-review/more-exception scenarios: `low ≤ high ≤ central net saving`, with a stated basis. These remain provisional estimates.

## Checks

`python3 -B runs/v4/sol/check_fixes.py`: **37 tests passed**. Covers exact/bounded shares, zero machine/gone remaining, loop iff loop rung, judgement exclusion, schema failures, task identities, evidence kinds and digest membership, case-insensitive product-name checks, action/version/actor approval binding, missing/orphan references, shared approval time, external labour, incremental upkeep, no repeated deduction, conservative ranges, blocked publication/retry repair, and subprocess timeout cleanup.

The suite also rebuilds every existing v3 job into a temporary directory: **98 jobs, 1,957 tasks, zero build notes**. Each job has task shares and baseline hours summing to 100, and weighted savings reconcile to remaining hours. A 90:10 fixture returns 90% saving (the old equal weighting returned 50%). Numeric frequency interpolation and the label fallback are checked separately. Repository data exports were not regenerated because they are outside this order's ownership.

Both JSON Schema documents and both changed Python files pass syntax/schema checks. Pre-change probes demonstrated that the old checker accepted 99% shares, 1% machine residual, an unwanted loop and a lowercase product name in role prose; all are now rejected.

## Live trial

Only payroll (`43-3051.00`) and purchasing (`13-1022.00`) were selected. The initial full-job request planned 37 tasks in 10 batches, but repeated connection failures and stalled subprocesses stopped it before completion. The recorded connection failure was `workspace routing discovery failed`; MCP transports also reported failed requests. This is an infrastructure failure, not evidence that generated task graphs passed or failed content review.

A final bounded probe submitted the first four tasks of each job: **two jobs, eight requested tasks**. Each batch received two attempts, with a 90-second timeout per attempt. Both finished blocked after about 183 seconds with `no valid JSON answer: timeout`; **zero task answers and zero published v4 batches**. The initial payroll batches 3 and 4 also remain blocked; batch 4 was interrupted before its second attempt. No third job was attempted. Full-job generation and content review therefore remain unverified pending a working Codex connection.

`check-results.json` records each trial file, attempt count and reason. `python3 -B tools/fleet_v3.py --validate runs/v4/sol/*__*.blocked.json` rejects all four retained files with exit code 1, as expected: a transport failure cannot pass as a task answer. The offline tests separately prove that valid model-shaped answers publish and invalid candidates block.

To rerun the full two-job trial after restoring connectivity: `python3 -B tools/fleet_v3.py --jobs 13-1022.00 43-3051.00 --model sol --workers 2`. This resumes valid outputs and retries blocked ones. It generates all 37 tasks, not just the eight-task bounded probe.

## Review limits

Source membership means that an id exists in the relevant digest's source definitions; it does not verify that the page supports a claim. `_meta.digest` and its SHA-256 qualify the local source namespace. Product checks use the known-name list plus names in the digest's capability section; semantic product-name evasion still needs content review. Shared-step ids mark ownership questions for future team deduplication; this generator does not promise a team-wide deduplicated roll-up. Existing v3 exports retain their older accounting until their owners choose to migrate them. Existing job-page copy still says equal weight; its UI owner should update that sentence when regenerating exports.
