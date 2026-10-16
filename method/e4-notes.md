# E4 notes: what a research digest changes (first pass)

Opus 5.5, four HR roles (hrbp, recruiter, hr-admin, payroll), 45 tasks answered both from memory
(`runs/inmemory/opus/`) and with the role's digest in the prompt (`runs/grounded/opus/`).

| Measure | From memory | Grounded |
|---|---|---|
| time saved, mean % | 48.8 | 47.6 |
| speedup, mean × | 2.08 | 2.04 |
| autonomy level, mean | 3.04 | 3.04 |
| same pattern | | 31 of 45 |
| evidence E1 / E2 / E3 | 31 / 46 / 6 | 22 / 26 / 46 |

- **The numbers do not move.** Grounding does not make the model more or less optimistic about time
  saved, speedup or autonomy.
- **The architecture does.** 14 of 45 tasks change pattern, mostly away from `agent_with_gate`
  towards `llm_step` or `deterministic_software` (the digests say: keep calculation deterministic,
  draft then gate). Grounding makes the build choice more precise, not the size of the prize.
- **The evidence becomes citable.** Documented cases (E3) go from 6 to 46; "model knowledge" (E1)
  from 31 to 22. From memory, Opus already names many products (E2 46), which cannot be checked
  without research.
- **Ambition gets more concrete**, sometimes more modest (recruiter screening: from "a fair,
  documented read within 24 hours, near-misses tagged across three sites" to "read the same day,
  including the long tail that waits a week today").

Open: rerun for the remaining roles when their digests exist, and check whether Sol and Grok move
the same way.
