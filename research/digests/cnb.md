# Digest: Compensation and Benefits Specialist

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/cnb.md`, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

Little. No opened page shows a Dutch AI merit cycle.

- **Grading from a job description is roughly 70% right.** A UK university scored 50 job descriptions with ChatGPT models, one per HERA factor. Accuracy against experts "exceeded 70%"; time not measured [S8]. E3, self-reported pilot.
- **Jobs move faster than bands.** Of 500 employers (opt-in panel, August 2026), 61% are rewriting job descriptions for AI, 49% say salary structures lag, 48% say benchmarks miss AI skills. Stated intent [S4]. E3, vendor survey.

## Products

- **AFAS Profit 8** stores job schemes and categories "as preparation" for pay transparency. Fields, not a model [S2]. E2, partner page.
- **Compa Analyst Agent with Mercer data** drafts market-pricing findings. No customer or result [S3]. E2, vendor wire.

## What fails

- **Paying for AI is unsettled.** 58% of employers pay an AI-skill premium now or within a year; 23% now treat it as baseline; groups overlap [S4]. Zapier's pilot paying marketers on AI-sourced pipeline has not run; credit is "case-by-case" [S6]. E3.
- **Repricing every drift.** Some re-scope roles quarterly. Others: "AI shouldn't trigger a series of one-off job evaluations"; if "core accountabilities haven't materially changed", do not regrade [S5]. E3 practice, E1 as a rule.
- E1: a wrong grade becomes an unexplained pay difference.

## Dutch and EU constraints

- **Pay transparency (EU 2023/970)** [S1], E3, a firm's reading of the bill:
  - Debates December 2026 and January 2027; start by royal decree.
  - Job evaluation on four factors: skills, responsibilities, effort, working conditions. Works council consents to system, criteria, grouping.
  - Band before negotiation; no salary-history question; pay requests answered in two months.
  - Noordhaven reports yearly, first over 2027 pay, by 7 June 2028. Agency workers count; agencies supply their pay data.
  - A gap of 5%+ unexplained after six months triggers a joint evaluation with the works council. Fines up to €11,000.
- **WOR:** a pay or grading system needs consent (27(1)(c)), except where a CAO settles it or for a mandatory industry pension fund (27(3)) [S9]. CAO Beroepsgoederenvervoer parties are regrading the sector's jobs; no outcome yet [S10]. E3.
- **Pensions:** Pensioenfonds Vervoer expects its new scheme on 1 January 2027 [S11]. E3. That Noordhaven's drivers are in it: E1.
- **AI Act:** grade or pay recommendations can fall under Annex III 4(b), high-risk from 2 December 2027: competent oversight, six-month logs, workers' representatives told first (Art. 26). A benefits chatbot must say it is AI (Art. 50) [S7]. E3. GDPR Art. 22 bars a pay decision made solely by a model (E1).

## For the model

- **Benefits and pension administration (12%):** carrier data `deterministic_software`, autonomy 4; pension questions an agent citing fund documents, autonomy 3.
- **Job evaluation and salary scales (14%):** `llm_step` drafts description and per-factor grade with reasons; specialist decides, autonomy 2. CAO jobs stay inside the CAO system.
- **Gap report and pay requests:** figures `deterministic_software` from AFAS, autonomy 4; replies `agent_with_gate`, autonomy 3.
- **Market pricing, CAO costing (6%):** costing deterministic; findings `copilot`, autonomy 2.
- **Merit, complaints, advice (18%):** `copilot`, autonomy 1–2. Complaints are classed S; treat as human-led.
- **Liaison, negotiation, focus groups:** `keep_human`, autonomy 0–1.

Altitude: from grading jobs one by one to owning the job architecture and evidence for every pay difference. North Star inputs: offer acceptance, 90-day retention, unexplained gap per group, requests answered within two months.

## Sources

- [S1] https://www.randstad.nl/werkgevers/hr-wet-en-regelgeving/actuele-wetgeving/wet-loontransparantie (Randstad)
- [S2] https://irixs.nl/kennisbank/afas-profit-8 (Irixs, 14 Oct 2026)
- [S3] https://techintelpro.com/news/ai/enterprise-ai/mercer-and-compa-partner-to-bring-compensation-insights-into-everyday-workflows (Business Wire reprint, 13 Aug 2026)
- [S4] https://www.payscale.com/featured-content/ai-workforce-impact-preview (Payscale, fieldwork Aug 2026)
- [S5] https://www.deel.com/deel-works/ai-comp-drift/ (Deel, 7 Sep 2026)
- [S6] https://www.techtarget.com/it-strategy/news/366651805/Zapier-explores-extra-pay-for-employees-driving-AI-gains (TechTarget, 8 Oct 2026)
- [S7] https://artificialintelligenceact.eu/annex/3/ ; https://artificialintelligenceact.eu/article/26/ ; https://artificialintelligenceact.eu/article/50/ ; https://www.praxikon.com/en/digital-omnibus (updated 10 Oct 2026)
- [S8] https://www.uhr.ac.uk/media/inhpcdcd/wb1.pdf (UHR Conference, 14 May 2025)
- [S9] https://wetten.overheid.nl/BWBR0002747/
- [S10] https://www.cnv.nl/vervoer/vervoer-en-logistiek/cao-beroepsgoederenvervoer/nieuws/cao-beroepsgoederenvervoer-2025-07-15/ (CNV, 15 Jul 2025)
- [S11] https://www.pfvervoer.nl/sites/default/files/documenten/pensioenfonds-vervoer-overbruggingsplan-2026.pdf (Pensioenfonds Vervoer, Overbruggingsplan 2026)
