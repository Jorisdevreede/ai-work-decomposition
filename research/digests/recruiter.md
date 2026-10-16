# Digest: Recruiter (talent acquisition)

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/recruiter.md`, sources reopened. Grades: E1 model knowledge, E2 a named product does this today, E3 a documented case or legal source.

## What is proven

- **Pipeline watching works when the agent has process context.** Uniper's hiring agent (Celonis process data plus Copilot Studio) flags overdue recruiter and manager tasks and coordinates candidate emails. Time to contract signature fell 27 days, the screening phase 13 days. On raw HR data it gave generalities; with process context it found "27 candidates on the shortlist for more than 14 days" [S1]. E3, vendor-partnership figures, no baseline.
- **Drafting is common; deciding is not.** Of 1,000+ US hiring leaders, 91% use AI: CV screening 67%, scheduling 59%, job descriptions 57%. 43% say it saves a day a week; 4 in 5 manage a problem with it; 26% fear they no longer see some candidates. A cited ManpowerGroup survey: under 5% saw "transformational" results [S2]. E3, self-reported.
- **Volume rises on the other side.** 71% believe most applications they screen are AI-written [S2]. Cheaper applications mean more of them (Jevons): the win is signal quality, not screening speed.
- **Interview kits at scale.** Workday's TA team generated questions for 800+ skills across 1,600+ roles; no evidence of better hires [S3]. E3, vendor on itself.

## Products a Dutch recruiter can run

- **AFAS Profit 8** builds a profile from the application and calculates a match score against open vacancies; Jonas fills dossier fields from documents [S4]. E2, partner description, no accuracy figure.
- **Workday Talent Acquisition Agent** flags roles at risk of missing their fill date and drafts outreach; "outreach to candidates still requires recruiter approval". Customers set which actions run alone. Early adopters now, general availability early 2027 [S5]. E2.

## What fails

- **The interview summary becomes the record.** Managers read it instead of the interview; notetakers err, drop context and store an unlawful question [S6].
- **Liability stays with the employer.** Mobley v. Workday continues on disparate impact; Kistler v. Eightfold attacks match scores built from data beyond the application; "contracts do not determine whether a statute applies" [S7]. A dismissed claim (Harper v. Sirius XM) shows the plaintiff could not prove the mechanism, not that the tool was fair [S8].

## Dutch and EU gates

- **Now:** a candidate-facing chatbot, voice screen or sourcing agent must say it is AI at the first turn, and for whom. A back-end CV ranker generally falls outside that rule; recruiter-reviewed emails and job ads need no label. Fines up to €15 million or 3% of turnover [S9]. Emotion inference in hiring is banned (Art. 5(1)(f)) [S10].
- **From 2 December 2027:** targeting job ads, filtering applications and evaluating candidates are high-risk (Annex III 4(a)), deferred by Regulation 2026/1744. Deployers then need a competent overseer, logs kept six months, and must inform workers' representatives [S10][S11].
- **GDPR Art. 22:** no rejection based solely on a score. Review must be real: "no meaningful human intervention" if the assessor must follow the outcome [S12]. The AP finds recruitment AI weak on explainability [S13].
- **Works council:** CV screening almost always needs prior consent (WOR art. 27(1)(k)/(l)); nullity can be invoked within one month [S14].

## For the model

Status updates, scheduling and job-ad drafts: `deterministic_software` or `llm_step`, autonomy 3–4, with an AI notice. Sourcing outreach: `agent_with_gate`, recruiter approves each send. Matching and selection: `copilot`, autonomy ≤ 2, ranked with reasons, logged, consent first. Interviews and references stay human. North Star inputs: days per stage and time to contract, not CVs screened.

## Sources

- [S1] https://www.cio.de/article/4230646/uniper-beschleunigt-hr-prozesse-mit-ki.html (CIO.de, 9 Oct 2026)
- [S2] https://www.hrdive.com/news/hiring-managers-say-they-trust-ai-but-actively-manage-issues-with-it/828884/ (HR Dive, 27 Aug 2026)
- [S3] https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html (Workday)
- [S4] https://irixs.nl/kennisbank/afas-profit-8 (Irixs, 14 Oct 2026)
- [S5] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S6] https://www.hrdive.com/news/ai-summaries-leave-a-paper-trail-recruiters-might-not-be-ready-for/830734/ (HR Dive, 18 Sep 2026)
- [S7] https://www.unleash.ai/risk-compliance-regulation/analysis/who-s-accountable-for-ai-in-hiring-what-hr-buyers-need-to-know-now (UNLEASH, 5 Oct 2026)
- [S8] https://www.hrdive.com/news/sirius-xm-beats-allegations-of-ai-fueled-racial-bias/832115/ (HR Dive, 5 Oct 2026)
- [S9] https://www.warden-ai.com/resources/eu-ai-act-article-50-recruitment-transparency-rules (Warden AI, 5 Aug 2026)
- [S10] https://artificialintelligenceact.eu/annex/3/ ; https://artificialintelligenceact.eu/article/26/ ; https://artificialintelligenceact.eu/article/5/
- [S11] https://www.praxikon.com/en/digital-omnibus (updated 10 Oct 2026); https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
- [S12] https://www.autoriteitpersoonsgegevens.nl/en/themes/employment-and-benefits/job-applications/online-and-game-based-assessments-in-recruitment-and-selection-rules-for-automated-decision-making
- [S13] https://www.autoriteitpersoonsgegevens.nl/en/current/ap-ai-impact-barometer-turns-red-action-required (AP, 5 Mar 2026)
- [S14] https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace ; https://wetten.overheid.nl/BWBR0002747/
