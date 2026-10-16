# Digest: FP&A Analyst

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/fpa.md` plus Power BI and governance pages, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

**Read the O*NET tasks with care.** The bundle is a public-sector budget analyst's ("appropriations", "testify before fund-granting authorities"). At Noordhaven read cost-centre and site budgets, the board and the bank (E1).

## What is proven

- **Useful, least where judgement is the work.** In a survey of 2,000 finance executives (US, UK, France, Germany), more said AI was more useful than expected than less, for every task. Budgeting nets +42 (49.9% against 7.8%), forecasting +34, variance analysis +28, model building +27, scenario planning +26. The least successful tasks "demand human judgement" [S1]. E3, vendor survey, self-reported.
- **Better, not just faster?** "Accuracy and confidence in planning outcomes" (49.7%) was the only benefit that rose. Reduced manual work has fallen every quarter. Reforecasting in response to turbulence fell to 51.2% [S1].
- **Vendor averages.** OneStream says customers of its forecast product see "average accuracy gains above 25%" and "cycle time reductions above 82%". No customer is named [S2]. E2. Its split: agents gather data, flag records that do not tie, do variance arithmetic, run scenario mechanics, draft commentary and monitor. People decide which source wins, allocate capital and face the board. "Their week was rearranged"; the team is not smaller [S2].
- **In Noordhaven's stack.** Copilot in Power BI answers questions, summarises reports and writes DAX on Fabric F2+ or Premium. "Without preparation, Copilot can misinterpret the data". Non-English use "isn't officially supported" [S3]. E2.

## What fails

- **Doing the wrong thing faster:** rollover budgets, padding, silo plans, commentary written after the number. Agents do not fix "clean data, certified reports, defined drivers, encoded policies"; speed "will make it harder to catch the errors that were already there" [S4]. E3, argument on a vendor blog.
- **Faster reports invite more reports.** The most AI-mature teams spend more hours on executive reporting [S1].
- "In payroll and finance, a good guess isn't good enough" [S5]. Data quality is the top barrier (40.4%) [S1].

## Constraints

- Power BI runs on a nightly AFAS extract. Copilot needs a prepared semantic model and capacity, and works in English (E2) [S3].
- Workpapers built in personal chatbots cannot be rebuilt for the auditor [S6].
- Headcount plans with named people are personal data (E1).

## For the model

- **Checking estimates, expenditure control, regular reports, allocations (32%):** `deterministic_software` checks and variance tables, autonomy 4; `llm_step` commentary, autonomy 3.
- **Trend review and resource needs (19%):** `llm_step` driver analysis with sources, autonomy 3.
- **Cost advice, cost-benefit, efficiency ideas (22%):** `copilot` with options, not one answer, autonomy 2.
- **Funds requests (9%):** `llm_step` drafts a recommendation memo; a person decides.
- **Managers, budget policy, board and bank (19%):** `keep_human`, with copilot preparation.

Ambitious lens: monthly rolling forecasts and scenarios for each site, if the drivers are defined first (E1).

Altitude: from assembling the budget to owning drivers, definitions and the forecast rules. North Star inputs: forecast accuracy, days to close.

## Sources

- [S1] https://www.pigment.com/reports/cfo-index/q3-2026 (Pigment, 7 Oct 2026)
- [S2] https://www.onestream.com/blog/fp-and-a-ai-agents-what-they-actually-automate-today/ (Ma, OneStream, 6 Oct 2026)
- [S3] https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction (Microsoft Learn, 24 Aug 2026)
- [S4] https://www.solverglobal.com/blog/most-fpanda-teams-will-use-ai-to-do-the-wrong-thing-faster (Nils R., Solver, 25 Sep 2026)
- [S5] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S6] https://www.techtarget.com/it-strategy/tip/Potential-risks-from-shadow-AI-use-in-accounting (Beaver, 5 Oct 2026)
