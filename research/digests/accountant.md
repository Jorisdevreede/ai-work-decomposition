# Digest: Accountant

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/accountant.md` plus AFAS pages and a field study, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

**Read the O*NET tasks with care.** Several are a tax examiner's ("evaluate taxpayer finances", "review taxpayer accounts"). At Noordhaven they mean the company's own VAT and corporate tax positions (E1).

## What is proven

- **Who was beaten, at what.** The "junior accountants" headline is twelve licensed CPAs with about 5.5 years' experience, on four month-end scenarios. Their average was about 37%; Claude Opus 5 scored 100% on 20 attempts. The tasks reward detail, file search and following instructions. Left out: "client communication, asking the right questions, building tacit context". "These results do not mean accountants are replaceable" [S1]. E3, vendor-run study.
- **The full job is harder.** On 160 US GAAP tasks the leading row meets 61.8% of criteria. 58% are never fully solved in eight attempts. Judgement, not retrieval, is the bottleneck. Multi-step reasoning errors are over half the top model's errors [S2]. E3. The sample world is a US law firm on QuickBooks.
- **Field result.** Accountants using AI closed 7.5 days faster and served 55% more clients a week, across 79 small and mid-sized firms (Choi and Xie). 62% of 277 surveyed worry about errors [S3]. E3, Aug 2025, via a vendor's data.
- **In Noordhaven's stack.** From Profit 8, AFAS's Jonas assists in tax returns: income and corporate tax from 2022, VAT (OB) from 2026. It uses the return's context, the help centre and optional Lefebvre Sdu content; data is not used for training. "De gebruiker blijft zelf verantwoordelijk" for the check [S4]. E2.
- **Entries prepared, not posted.** Workday's Accounting Agent extracts contract details, prepares entries and recommends revenue schedules; teams "stay responsible for review" [S5]. E2.

## What fails

- Multi-step reasoning across files [S2]; a model that adds an unnoticed assumption, so the workpaper cannot be rebuilt [S6].
- Tax estimates belong on the mandatory human review list [S7].

## Dutch and EU constraints

- **E-invoicing:** B2B from 1 July 2030, reporting from 1 July 2031; not law yet [S8]. A PDF is not an e-invoice. Intra-EU and reverse-charge invoices are due within 10 days; whether that applies at home is open [S9].
- **Filing:** large companies file accounts with KVK via SBR from FY2025; AFAS cannot file this for them [S10].
- **Untested:** no benchmark covers Dutch GAAP, Dutch VAT or a statutory audit file (E1).

## For the model

- **Close: records, reconciliations, adjusting entries, account assignment, annual figures (26%):** `llm_step` drafts with a tie-out gate, autonomy 3.
- **Internal control, audit work, fraud and payroll checks (29%):** `deterministic_software` tests over every transaction (duplicates, segregation of duties, IBAN changes), autonomy 4. An `llm_step` writes findings, autonomy 3. Interviews `keep_human`.
- **Tax returns and positions (11%):** `deterministic_software` VAT from AFAS plus Jonas checks, autonomy 3; estimates human-approved; the tax office `keep_human`.
- **Invoice processing (8%):** as the bookkeeper digest; autonomy 3 to 4.
- **Management reports, budget against actual, trends (8%):** `deterministic_software` plus `llm_step` commentary, autonomy 3.
- **Recordkeeping systems, directing filing staff (9%):** `copilot`, autonomy 2.
- **Cash, notes and securities checks (4%):** `deterministic_software` from CAMT.053, autonomy 4.
- **Officials and advice (5%):** `keep_human`.

Altitude: from posting and checking entries to writing the rules, tie-outs and tests that check every entry. North Star inputs: days to close, audit adjustments.

## Sources

- [S1] https://www.mercor.com/blog/human-baselines-for-benchmarks-ai-now-outperforms-junior-accountants/ (Mercor, 1 Oct 2026)
- [S2] https://www.mercor.com/apex/apex-accounting-leaderboard/ (Mercor with Ramp, undated)
- [S3] https://www.cfodive.com/news/ai-cuts-monthly-financial-close-time-75-days-mit-stanford-study-accounting-accountants/757610/ (CFO Dive, 13 Aug 2025)
- [S4] https://help.afas.nl/help/NL/SE/Tax_InSite_AI.htm (AFAS Help Center, Jonas AI in tax returns)
- [S5] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S6] https://www.techtarget.com/it-strategy/tip/Potential-risks-from-shadow-AI-use-in-accounting (Beaver, 5 Oct 2026)
- [S7] https://www.techtarget.com/enterprise-software/tip/What-CFOs-need-to-know-about-AI-agent-governance-in-accounting (Kofalt, 25 Sep 2026)
- [S8] https://www.rijksoverheid.nl/actueel/nieuws/2026/09/11/kabinet-kiest-voor-invoering-e-facturatie-en-rapportage-voor-bedrijven (Rijksoverheid, 11 Sep 2026)
- [S9] https://www.peppol.nu/blog-items/vida-nederland/ (De Jager, peppol.nu, 25 Sep 2026)
- [S10] https://help.afas.nl/help/NL/SE/Fin_Config_Ledger_Rep_Interm_Cie_Large.htm (AFAS Help Center)
