# Digest: HR Director

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/hr-director.md` plus two union pages, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **This role owns the switches.** Workday customers set which tasks run alone, which need review and when a person decides; every action is logged with its approver. Candidate outreach waits for a recruiter [S3]. E2.
- **The front door works, after a failure.** IBM cut dedicated HRBP support for 21,000 managers and shut HR mail and phone; internal NPS fell to −35. AskHR later scored CSAT +74 and handled 16 million messages in 2025. IBM's lesson: "Find a small pain point. Automate that, make it great and then scale"; next time it "would pilot and iterate" [S1]. E3, IBM on itself.
- **Decision support, not decision.** At IBM India, 90–95% of HR questions go through an assistant; agents recommend raises, managers decide. "You can never outsource accountability" [S2]. E3, conference remark.
- **Planning from tasks is a demo.** Workday's Work Intelligence (beta) cut a planned 50 hires to 42 in a demo [S4]. E2.
- **In Noordhaven's stack.** AFAS Profit 8 computes a candidate match score for vacancies and internal talent [S5]. E2, partner page, no results.

## What fails

- Removing the human route before the tool is good (IBM) [S1].
- A Wipro recruitment agent mishandled one demographic; Wipro ran a parallel process while the vendor fixed it [S2]. E3.
- Agent governance and orchestration are unsolved; Bersin sees "agent management" as a new HR job [S4]. E3, analyst.

## Dutch and EU constraints

- **Now:** disclose chatbots and generated content (Art. 50); fines up to €15 million or 3% of turnover. AI literacy: the employer must "take measures" [S6]. With over 750 staff, Noordhaven gets no small mid-cap relief [S6].
- **From 2 Dec 2027:** recruitment, task allocation, monitoring, evaluation and termination systems are high-risk [S6]. A final click does not exempt a ranking tool; scheduling and CV-to-fields without a score can fall outside [S7].
- **Works council:** discuss AI policy in the Art. 24 meeting; one decision can need advice and consent [S8].
- **Unions:** FNV asks, for the first time, for worker "zeggenschap" over AI at the CAO table, plus AI-literacy training [S9]. The transport CAO ends 31 Dec 2026, before the pension switch [S10]; the 2027 round is now. The own warehouse CAO is bargained in-house (E1).

## For the model

- **Leading the team, planning HR activities (34%):** `copilot`, autonomy 1–2. New work: set autonomy and gates per agent.
- **Advising managers on policy (14%):** routine questions to a policy desk (`agent_with_gate`, autonomy 3); harassment and conflict `keep_human`.
- **Personnel analysis, forecasts (17%):** `copilot` on the people analyst's metric layer, autonomy 2; scenarios, not one number.
- **Budgets (7%):** `deterministic_software` from AFAS positions and CAO tables, autonomy 3.
- **Legislation and CAO study (7%):** `llm_step` summaries with citations, autonomy 3 (E1).
- **Job evaluation (6%):** `copilot`, autonomy 2; rate jobs, not people.
- **Hearings, bargaining, vendor contracts (15%):** `keep_human`; a copilot prepares dossiers and costs union demands.

Altitude: from running HR services to designing the HR operating system (agents, gates, logs, council agreements). North Star inputs: manager satisfaction with HR; 90-day retention.

## Sources

- [S1] https://www.ibm.com/case-studies/ibm-transformation/ask-hr (IBM, 2026)
- [S2] https://www.bwpeople.in/article/ai-automates-hr-but-accountability-still-belongs-to-humans-622108 (BW People, 3 Sep 2026)
- [S3] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S4] https://www.techtarget.com/it-strategy/news/366652049/Workday-expands-agentic-AI-automation-for-HR-teams (TechTarget, 13 Oct 2026)
- [S5] https://irixs.nl/kennisbank/afas-profit-8 (Irixs, AFAS partner, 14 Oct 2026)
- [S6] https://www.kinstellar.com/news-and-insights/detail/4619/the-ai-act-after-the-digital-omnibus-simplified-rules-delayed-deadlines-but-can-compliance-wait (Kinstellar, Jul 2026)
- [S7] https://www.praxikon.com/en/annex-iii/werkgelegenheid-personeelsbeheer (Praxikon, on the Commission draft of 19 May 2026)
- [S8] https://www.ser.nl/nl/thema/medezeggenschap/belangrijke-themas/ai (SER, undated)
- [S9] https://www.fnv.nl/nieuwsbericht/algemeen-nieuws/2026/09/looneis-en-arbeidsvoorwaardenagenda-fnv (FNV, 14 Sep 2026)
- [S10] https://www.cnv.nl/vervoer/vervoer-en-logistiek/cao-beroepsgoederenvervoer/nieuws/onderhandelingsresultaat-cao-beroepsgoederenvervoer-2025-10-29/ (CNV, 29 Oct 2025)
