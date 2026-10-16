# Digest: People Analytics and HRIS Analyst

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/people-analyst.md`, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **Chat over HR data is sold; results are not published.** Microsoft's Workforce Insights agent shows managers staffing and hiring, and warns "faster access to information does not, by itself, lead to better decisions" [S3]. Visier's Vee answers in Teams or Slack; its "10x" is a vendor line, no customer named [S4]. Since 13 Oct 2026 outside agents reach Workday HR data through MCP tools, under its permissions; no customer result [S2]. E2.
- **In Noordhaven's stack.** Copilot in Power BI answers questions on a semantic model, summarises reports and writes DAX, on Fabric F2+ or Premium capacity. Without a prepared model it "can misinterpret the data"; non-English chat is not "officially supported" [S5]. E2.
- **Text-to-SQL, measured.** Uber's QueryGPT cut a query from about 10 to 3 minutes; 78% of early users said it saved time. Hallucinated tables and columns remain unsolved [S6]. E3, company on itself.
- **Task inference.** Workday's agent infers tasks from approved mail and calendars; 84% called it "extremely accurate", no sample size. Hardest part: "quantifying value after we built the agent" [S1]. E3, vendor on itself.

## What fails

- **Self-report.** 48% of 1,000 US employees had exaggerated their AI use [S7]. Survey adoption counts run high. E3, vendor survey.
- **Trend reports.** Workday's customer data "does not establish how much of the decline AI caused" [S8]. Keep such caveats.
- No opened page gives a Dutch result or a works-council decision.

## Dutch and EU constraints

- **Absence data is health data** (GDPR Art. 9) [S13]. The AP fined a firm €15,000 partly for recording the cause of sick leave [S14]. Verzuim analytics: rates and durations, never causes. E3.
- **Works council consent** for personal data and for facilities able to observe presence, behaviour or performance (WOR 27(1)(k), (l)). Capability is the test; productivity dashboards almost always qualify; nullity within one month [S11]. Totals from a tool that holds per-user rows still count (a consultant's reading) [S12]. Attrition or absence prediction touches both (E1).
- **Now:** emotion inference at work is banned (Art. 5(1)(f)); chatbots must say they are AI (Art. 50) [S9].
- **From 2 Dec 2027:** AI that allocates tasks on behaviour or evaluates performance is high-risk (Annex III 4(b)): a competent overseer, six months of logs, workers' representatives informed [S9][S10]. Art. 22 bars solely automated decisions with significant effect [S13].

## For the model

- **Standard and required reports (28% of time):** `deterministic_software` (AFAS extract, Power BI refresh, subscriptions) plus an `llm_step` narrative. Autonomy 4; required filings 3.
- **Manager questions, report support (12%):** `agent_with_gate`, read-only on a prepared model with verified answers, row-level security and a minimum group size. Autonomy 3; misses go to the analyst.
- **Dashboards, DAX, specs, documentation (25%):** `copilot`, autonomy 2.
- **AFAS data quality (4%):** `deterministic_software` checks (E1: missing end dates, open sick reports) plus `llm_step` explanations. Autonomy 4 to detect; HR admin corrects.
- **Trend scans (21%):** `llm_step` summaries with sources and caveats, autonomy 3; external contacts `keep_human`.
- **Survey comments:** `llm_step` themes on groups only, autonomy 3 (E1).
- **Attrition or absence risk (5%):** team- and site-level forecasts, `copilot`, autonomy 2, consent first; individual scores `keep_human`.

Altitude: from producing reports to owning the metric layer (definitions, verified answers, access, checks) that managers and agents query. North Star inputs: 90-day retention and verzuim correct by day 2; manager questions answered without the analyst.

## Sources

- [S1] https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html (Workday)
- [S2] https://newsroom.workday.com/2026-10-13-Workdays-Trusted-Agent-Platform-Now-Delivers-Headless-Access-to-HR-and-Finance,-Letting-Customers-Build-and-Run-Lawful-AI-Agents (Workday, 13 Oct 2026)
- [S3] https://news.microsoft.com/source/asia/2026/10/12/microsofts-ai-transformation-of-hr-from-efficiency-to-operational-impact/ (Microsoft, 12 Oct 2026)
- [S4] https://www.visier.com/products/people-analytics-ai-agent/ (Visier product page)
- [S5] https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction (Microsoft Learn, 24 Aug 2026)
- [S6] https://www.uber.com/blog/query-gpt/ (Uber Engineering, 19 Sep 2024)
- [S7] https://www.visier.com/blog/ai-in-the-workplace-new-research-on-performative-ai/ (Visier)
- [S8] https://www.prnewswire.com/news-releases/workday-global-workforce-report-ai-is-rewriting-jobs-more-than-its-cutting-them-302898076.html (Workday, 5 Oct 2026) ; https://learningnews.com/news/learning-news/2026/more-leaders-expect-ai-productivity-gains-than-workforce-cuts (Learning News)
- [S9] https://artificialintelligenceact.eu/article/5/ ; https://artificialintelligenceact.eu/article/50/ ; https://artificialintelligenceact.eu/annex/3/ ; https://artificialintelligenceact.eu/article/26/
- [S10] https://www.praxikon.com/en/digital-omnibus
- [S11] https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace ; https://wetten.overheid.nl/BWBR0002747/
- [S12] https://cruxdigits.nl/blog/shadow-ai-detectie-instemmingsrecht/ (Crux Digits, 28 Sep 2026)
- [S13] https://gdpr-info.eu/art-9-gdpr/ ; https://gdpr-info.eu/art-22-gdpr/
- [S14] https://www.awvn.nl/privacy/blog/verwerking-persoonsgegevens-boete/ (AWVN, 1 Jul 2021)
