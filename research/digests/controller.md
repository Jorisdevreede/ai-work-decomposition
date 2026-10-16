# Digest: Controller

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/controller.md` plus a field study and AFAS pages, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **Simple close tasks, in a lab.** Twelve licensed CPAs (about 5.5 years' experience) averaged about 37% on four month-end scenarios; Claude Opus 5 scored 100% on 20 attempts, under 10 minutes each, $0.21 against $10.35 per criterion met. Not measured: "client communication, asking the right questions, building tacit context". "These results do not mean accountants are replaceable" [S1]. E3, vendor-run study.
- **The full close, not yet.** On 160 US GAAP close tasks the leading row meets 61.8% of criteria (the same page also prints 61.0% and 56.4%). 58% of tasks are never fully solved. The bottleneck is "accounting judgement", not retrieval [S2]. E3, vendor's benchmark.
- **Field number, small firms.** Choi and Xie (MIT, Stanford): accountants using AI closed the month 7.5 days faster across 79 small and mid-sized firms; 62% of 277 surveyed worry about errors [S8]. E3, Aug 2025.
- **Products draft, people approve.** Trintech's accruals agent generates and rolls forward accruals, flags outliers, then "Review & Approve" and "Retain for Audit" [S4]. SAP's accruals agent (restricted availability) prepares journals for accountants to "accept, adjust, or reject"; its scope document says "preparation and posting". SAP advises at most five expense categories per handbook [S3]. Workday's Accounting Agent prepares entries; teams "stay responsible for review"; autopilot early 2027 [S5]. E2. None runs on AFAS.

## What fails

- Posting without a tie-out. The pattern: "the model drafts and the tie-out decides". Nothing posts until bank, AR and AP tie to zero [S6]. E3, one post, 18 views.
- An estimate the auditor cannot rebuild, because prompt and output sit in a personal account [S9]. E3, advice.
- Tax estimates and cash allocation need "mandatory human review and approval", with timestamped logs [S7].

## Dutch and EU constraints

- **Ledger:** AFAS bank matching is fixed rules on reference, IBAN and invoice number [S10]; a model belongs on the unmatched remainder.
- **Filing:** large companies file accounts with KVK via SBR from FY2025; AFAS cannot do this for them [S11].
- **Gaps:** benchmarks are US GAAP. Dutch GAAP (BW 2 Titel 9), the audit and VAT returns are untested (E1).

## For the model

- **Disbursement approval and cash monitoring (18%):** `deterministic_software` checks (budget, contract, duplicate, IBAN change), autonomy 3. Above a threshold a person approves.
- **Close and statements, depreciation, payroll deductions (12%):** `llm_step` drafts accruals, reclasses and flux commentary; `deterministic_software` tie-out gate; autonomy 3.
- **Funding, planning and advice to management (20%):** `copilot`, autonomy 2. Cash allocation stays human.
- **Leading and developing staff (14%):** `keep_human`, copilot briefs.
- **Authority over funds; banks, insurers, auditors (14%):** `keep_human`. Mandates and signing rights as `deterministic_software` records.
- **Controls, audits, standards, tax (12%):** `copilot`, autonomy 2; `llm_step` digests of standard changes, autonomy 3.
- **Insurance and benefit programmes (4%):** `llm_step` summaries, autonomy 2.
- **Cash and cheque deposits (7%):** near zero with SEPA batches and CAMT.053 (E1).

Altitude: from preparing the close to designing it. The controller owns the accrual handbook, tie-out queries, materiality thresholds and the audit trail. A model writes the first draft. North Star inputs: days to close, audit adjustments.

## Sources

- [S1] https://www.mercor.com/blog/human-baselines-for-benchmarks-ai-now-outperforms-junior-accountants/ (Mercor, 1 Oct 2026)
- [S2] https://www.mercor.com/apex/apex-accounting-leaderboard/ (Mercor with Ramp, undated)
- [S3] https://sapinsider.org/blogs/sap-releases-accounting-accruals-agent-for-month-end-close/ (SAPinsider, 17 Sep 2026)
- [S4] https://www.trintech.com/platform/trintech-accruals-agent/ (Trintech product page)
- [S5] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S6] https://x.com/Madeactual/status/2109741829780557947 (12 Oct 2026)
- [S7] https://www.techtarget.com/enterprise-software/tip/What-CFOs-need-to-know-about-AI-agent-governance-in-accounting (Kofalt, 25 Sep 2026)
- [S8] https://www.cfodive.com/news/ai-cuts-monthly-financial-close-time-75-days-mit-stanford-study-accounting-accountants/757610/ (CFO Dive, 13 Aug 2025)
- [S9] https://www.techtarget.com/it-strategy/tip/Potential-risks-from-shadow-AI-use-in-accounting (Beaver, 5 Oct 2026)
- [S10] https://help.afas.nl/help/NL/SE/Fin_BnkStm_Auto_Match.htm (AFAS Help Center)
- [S11] https://help.afas.nl/help/NL/SE/Fin_Config_Ledger_Rep_Interm_Cie_Large.htm (AFAS Help Center)
