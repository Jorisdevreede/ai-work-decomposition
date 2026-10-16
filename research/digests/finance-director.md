# Digest: Finance Director

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/finance-director.md` plus Dutch legal and survey pages, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

**Read the O*NET tasks with care.** The bundle is a bank manager's. At Noordhaven, "loan applications" and "credit lines" mean shipper credit limits and the bank facility; "securities" means fuel, interest and currency (E1).

## What is proven

- **Spend and return are self-reported.** In a survey of 2,000 finance executives (US, UK, France, Germany), 83% say usage-based pricing pushed AI spend over budget, about 27% on average. Confidence in the return averages 8.2/10, yet "unclear ROI" rose to 27.6% [S1]. E3, vendor survey, no Dutch slice.
- **Jobs.** 33% reduced hiring, 20% cut headcount, 32% added it [S1].
- **Controls do not reach the floor.** 66% of CFOs describe central or comprehensive AI controls, against 45% of managers. Data quality is the top barrier (40.4%) [S1].
- **Faster reports, more reports.** Executive reporting takes about 32 hours a month; 30% of the most AI-mature teams spend over 40 hours, against 17% of early-stage teams [S1]. Jevons.
- **Agents with set limits.** Workday's Accounting Agent prepares entries and revenue schedules; "accounting teams stay responsible for review, judgment, and decisions." Autopilot is for early adopters in early 2027 [S2]. E2. Noordhaven runs AFAS, not Workday.
- **Dutch cash horizon.** Of 336 Dutch finance professionals, 81% explain DSO after the fact; only 12% plan cash-in more than 30 days ahead; 75% of CFOs cannot explain an AI-driven decision [S5]. E3, vendor survey (Onguard).

## What fails

- **Shadow AI.** Figures pasted into personal chatbots; workpapers the auditor cannot rebuild; AI switched on by an update. Give an approved tool, do not only block [S4]. E3, advice.
- An advisor's line: reconciliation and AP may run with people on exceptions; tax estimates, strategic purchases and cash allocation need "mandatory human review and approval", with timestamped logs and an AI governance lead in finance [S3]. E3, advice.

## Dutch and EU constraints

- **E-invoicing:** the cabinet wants B2B e-invoicing from 1 July 2030 and digital reporting from 1 July 2031; bill before summer 2027; network not yet chosen; role-based access and access logs required [S6]. AFAS Profit sends and receives Peppol, not Peppol-first [S7].
- **Credit:** scoring the creditworthiness of natural persons is high-risk (Annex III 5(b)) [S8]. Sole-trader hauliers are natural persons (E1).
- **Payment terms:** a large company may not agree more than 30 days with a small supplier (BW 6:119a(6)) [S9].
- **Reporting:** CSRD now applies above 1,000 employees and €450 million turnover [S10]; Noordhaven's turnover is not in its profile. Large companies file accounts with KVK via SBR from FY2025; AFAS cannot do this for them [S11].

## For the model

- **Customers, banks, investors, networking (22%):** `keep_human`; copilot briefs, autonomy 1.
- **Leading the team, training, hiring (14%):** `copilot`, autonomy 1–2; add a tool inventory and a governance lead.
- **Cash oversight (9%):** `deterministic_software` cash position from CAMT.053 and AFAS items, autonomy 4; allocation stays human.
- **Credit applications and limits (15%):** `llm_step` proposal from KvK and credit data, autonomy 3; approval `keep_human`.
- **Status, risk, collection and statutory reports (23%):** `deterministic_software` plus `llm_step` commentary, autonomy 3. Cap the volume, or the time comes back.
- **Controls and systems (10%):** `copilot`, autonomy 2.
- **Budgets and market data (7%):** `copilot`, autonomy 2.

Altitude: from approving and reporting to owning the finance control system: which agents, which thresholds, which logs, who signs. North Star inputs: days to close, forecast accuracy, DSO.

## Sources

- [S1] https://www.pigment.com/reports/cfo-index/q3-2026 (Pigment, 7 Oct 2026)
- [S2] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S3] https://www.techtarget.com/enterprise-software/tip/What-CFOs-need-to-know-about-AI-agent-governance-in-accounting (Kofalt, 25 Sep 2026)
- [S4] https://www.techtarget.com/it-strategy/tip/Potential-risks-from-shadow-AI-use-in-accounting (Beaver, 5 Oct 2026)
- [S5] https://www.onguard.com/fintech-baropaper/fintech-baropaper-2026-measuring-everything-managing-nothing/ (Onguard, 2026)
- [S6] https://www.rijksoverheid.nl/actueel/nieuws/2026/09/11/kabinet-kiest-voor-invoering-e-facturatie-en-rapportage-voor-bedrijven (Rijksoverheid, 11 Sep 2026)
- [S7] https://www.peppol.nl/en/connecting-peppol-erp-or-accounting-package (Dutch Peppol Authority, undated)
- [S8] https://artificialintelligenceact.eu/annex/3/
- [S9] https://wetten.overheid.nl/jci1.3:c:BWBR0005289&boek=6&titeldeel=1&afdeling=10&artikel=119a (BW 6:119a, version of 16 Jul 2026)
- [S10] https://www.regulationtomorrow.com/2026/02/omnibus-i-csrd-and-cs3d-simplification-council-of-european-union-adopts-final-text-t-simplify-sustainability-reporting-and-due-diligence-requirements/ (Norton Rose Fulbright, 25 Feb 2026)
- [S11] https://help.afas.nl/help/NL/SE/Fin_Config_Ledger_Rep_Interm_Cie_Large.htm (AFAS Help Center)
