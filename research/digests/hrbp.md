# Digest: HR Business Partner

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/hrbp.md` and the HRBP last30days run, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **An AI front door, HRBPs as second line.** IBM's "Ask HR" handles over 11 million interactions a year with "40% in savings". Phone and email support for managers was removed to drive adoption. About 180 HRBPs are "the first level of human support for complex cases escalated" from it. The KPI is fewer complex tickets. HRBPs now sit in pods by function, not geography [S1]. E3, self-reported.
- **Narrow agents that HRBPs build themselves.** At Workday an HRBP built a calibration agent: 83% of HRBPs called it "super useful", and half cut prep time by up to 75%. A check-in agent raised users' share of "Good" feedback by 16 points, against 7 for non-users (12,200 write-ups). Value was hard to prove after the build [S2]. E3, vendor on itself.
- **Manager self-service and coaching.** IBM nudges managers in Slack when someone underperforms and pilots role-play for difficult conversations; no outcome data [S1]. Microsoft's Workforce Insights agent shows managers structure and staffing without asking HR [S3]. E2.
- **Policy answers per person.** Coca-Cola Andina's HR agent serves 1,200 of 3,600 staff monthly (CSAT 4.1), with tickets for what it cannot answer [S4]. E3.
- **The average effect is small.** Danish HR professionals using chatbots saved about 3% of hours [S5].

## What fails

- **Trust.** Managers drafting feedback with AI report "employees can tell if it's AI and most seem more closed off" [S6]. E3, anecdotal.
- **Data access.** Personal data and IT sign-off decide what HR may use; many firms approve Copilot only for emails [S6].
- **Hype.** "30-40% of existing HR jobs can be automated" comes from a firm selling the agent [S7]. E1.
- **Liability.** A vendor contract does not move the employer's duty for a screening tool [S8].

## Dutch and EU gates

- **Now:** emotion inference from face or voice at work is banned (Art. 5(1)(f)). IBM's forecast of "sentiment analysis from recorded meetings" [S1] is out for Noordhaven. Text sentiment on Slack is not biometric but is monitoring: consent needed (our reading, E1). Employee-facing bots must disclose they are AI (Art. 50) [S9].
- **Works council:** consent before any AI that processes personnel data or can observe behaviour or performance (WOR art. 27(1)(k)/(l)). Advice right on important technology (art. 25). Councils are often involved only after go-live [S10][S11].
- **From 2 December 2027:** AI that influences promotion or termination, allocates tasks on behaviour or traits, or evaluates performance is high-risk (Annex III 4(b)). The employer then needs a competent overseer, six months of logs, and to inform workers' representatives first [S9][S12].
- **SER:** people affected by an AI outcome must always be able to complain [S13].
- E1: a Dutch dismissal needs a documented file for UWV or the kantonrechter; AI may draft a timeline from records, a person owns the file.

## For the model

Policy explanation (13% of time) and manager questions (15%): an agent on owned content with escalation to the HRBP, autonomy 4 for general policy. Personal cases escalate. Manager training and difficult-conversation prep: `copilot`, autonomy 1–2. Jevons: coaching for every manager. Satisfaction reports: dashboards plus an `llm_step` over comments. Allocation, discipline, mediation, dismissal: `copilot` for preparation or `keep_human`, and high-risk once a tool scores people. Redesign evidence: IBM's function pods (E3). North Star inputs: manager questions solved without an HRBP; days from issue raised to resolution.

## Sources

- [S1] https://www.ilr.cornell.edu/sites/default/files-d8/2026-05/hrbp-exchange-final.pdf (Cornell CAHRS HRBP Exchange hosted by IBM, 12 May 2026)
- [S2] https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html (Workday)
- [S3] https://news.microsoft.com/source/asia/2026/10/12/microsofts-ai-transformation-of-hr-from-efficiency-to-operational-impact/ (Microsoft, 12 Oct 2026)
- [S4] https://learn.microsoft.com/en-us/power-platform/guidance/case-studies/coca-cola-andina-hr-support (Microsoft Learn, 8 Sep 2026)
- [S5] https://bfi.uchicago.edu/wp-content/uploads/2025/04/BFI_WP_2025-56-3.pdf (Humlum and Vestergaard, 2025)
- [S6] https://www.reddit.com/r/managers/comments/1x1tv7s/how_are_you_using_ai_to_manage_your_team_if_at_all/ ; https://www.reddit.com/r/humanresources/comments/1wil6wr/why_are_some_people_in_hr_avoiding_ai_az/ (read through an archive in the last30days run)
- [S7] https://joshbersin.com/2026/01/the-great-reinvention-of-human-resources-has-begun/ (Bersin, 24 Jan 2026)
- [S8] https://www.unleash.ai/risk-compliance-regulation/analysis/who-s-accountable-for-ai-in-hiring-what-hr-buyers-need-to-know-now (UNLEASH, 5 Oct 2026)
- [S9] https://artificialintelligenceact.eu/article/5/ ; https://artificialintelligenceact.eu/article/50/ ; https://artificialintelligenceact.eu/annex/3/ ; https://artificialintelligenceact.eu/article/26/
- [S10] https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace ; https://wetten.overheid.nl/BWBR0002747/
- [S11] https://www.ggi.com/news/employment/ai-from-algorithm-to-decision-the-position-of-the-works-council-in-the-netherlands (GGI / TeekensKarstens)
- [S12] https://www.praxikon.com/en/digital-omnibus ; https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
- [S13] https://www.ser.nl/-/media/ser/downloads/adviezen/2025/ai-en-werk.pdf (SER advice 25/03, May 2025)
