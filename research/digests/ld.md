# Digest: Learning and Development Specialist

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/ld.md`, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **AI in L&D mostly makes content.** Of 531 self-selected practitioners, over two thirds use AI; faster content is still the top expected benefit. The 14% of teams now asked for different things put AI in front of learners more (38% against 17%). Privacy tops barriers (52%) [S1]. E3, vendor-sponsored.
- **Feedback practice moves behaviour.** Workday's check-in agent drafts manager feedback against the Situation-Behavior-Impact rubric. From a 36% "Good" baseline (12,200 write-ups), users gained 16 points, non-users 7 [S2]. E3, vendor on itself.
- **Assistance trains novices.** Across 5,179 support agents, an assistant raised resolutions per hour 14%, and 34% for novices [S3]. E3.
- **A working routine.** MHR's learning team has an agent draft content and check reading level; a person reviews. Measures are agreed with the manager first, then collected at six weeks and six months. AI clusters comments, "a tool to support, not for decision-making" [S4]. E3, unmeasured.

## Products

- **Studytube AI Authoring** (Noordhaven's LMS) drafts outlines, scripts and questions from a title or uploaded PDF, PPT or SCORM; authors edit. Vendor claims a course "within minutes" [S5]. E2.
- **Microsoft Learning agent** shows skill gaps, pathways and mentors; HR still guides role moves and leadership development. No outcome figures [S6]. E2.

## What fails

- **Delegating hurts learning.** In a randomised trial with 52 junior developers, AI users scored 17% lower on a mastery quiz; those asking for explanations kept more [S7]. E3.
- **Fixing AI eats time.** US desk workers spend 42% of AI time troubleshooting, 35% on real work; 35% say knowledge transfer now runs mainly through AI [S8]. E3, vendor-commissioned.
- **No measured result.** No opened page shows a course cutting time-to-skill. Workday advises baselines before launch [S2].

## Dutch and EU constraints

- **AI literacy (Art. 4):** since 27 July 2026 a duty to "take measures"; no level, hours, test or certificate. Supervised from 2 August 2026 [S9][S10]. A Dutch €295 course still claims a "voldoende" level and sells a certificate [S11]: a record, not compliance.
- **Now:** an AI tutor must say it is AI; deep fakes must be disclosed (Art. 50). Inferring learners' emotions, say from a webcam, is banned (Art. 5(1)(f)) [S12].
- **From 2 December 2027:** AI using learning data to evaluate workers is high-risk (Annex III 4(b)): trained overseer, six-month logs, workers' representatives informed [S12][S13].
- **Works council:** training policy (WOR 27(1)(f)), personal data (k) and monitoring-capable tools (l) need consent; nullity within one month [S14].
- E1: outside bodies certify VCA and forklift skills; AI only prepares learners.

## For the model

- **Certificate expiry, enrolment, scheduling, cost reports:** `deterministic_software`, autonomy 4; Studytube expiry dates plus AFAS rosters book shift staff before a lapse.
- **Course and instructor materials:** `llm_step`, autonomy 2; a person approves; the safety lead signs safety content.
- **Evaluation:** Power BI plus an `llm_step` clustering comments; group level only, never into appraisal. Autonomy 2.
- **Learning paths for office staff:** `agent_with_gate`, disclosed, autonomy 3; HR decides executive development.
- **Delivery:** `copilot` for feedback practice, autonomy 1; practical safety training stays `keep_human`.
- **Needs analysis, design, instructors, contracts, referrals:** `keep_human` with `copilot` research, autonomy 0–1.

Altitude: from producing courses to owning the competence record and the Article 4 measures file for 1,200 staff.

North Star inputs: onboarding completed in week one, shift staff certified on their first shift, 90-day retention. Not courses completed.

## Sources

- [S1] https://learningnews.com/news/learning-news/2026/ai-use-grows-but-lds-core-work-holds-steady (Learning News, 7 Oct 2026)
- [S2] https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html (Workday)
- [S3] https://www.nber.org/papers/w31161 (Brynjolfsson, Li and Raymond, NBER, rev. Nov 2023)
- [S4] https://www.hrdconnect.com/2026/10/09/ai-is-changing-what-we-learn-is-lnd-changing-fast-enough/ (HRD Connect with MHR, 9 Oct 2026)
- [S5] https://studytube.com/product/ai-authoring (Studytube)
- [S6] https://news.microsoft.com/source/asia/2026/10/12/microsofts-ai-transformation-of-hr-from-efficiency-to-operational-impact/ (Microsoft, 12 Oct 2026)
- [S7] https://www.anthropic.com/research/AI-assistance-coding-skills (Anthropic, 29 Jan 2026)
- [S8] https://www.bamboohr.com/about-bamboohr/press-release/bamboohr-research-redesigning-work-ai-performance-review (BambooHR, 1 Sep 2026)
- [S9] https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy (European Commission, updated 13 Oct 2026)
- [S10] https://www.praxikon.com/en/ai-act/artikel/4 (Praxikon)
- [S11] https://www.fme.nl/agenda/ai-geletterdheid-de-praktijk (FME, event 29 Oct 2026)
- [S12] https://artificialintelligenceact.eu/article/50/ ; https://artificialintelligenceact.eu/article/5/ ; https://artificialintelligenceact.eu/annex/3/ ; https://www.praxikon.com/en/digital-omnibus
- [S13] https://artificialintelligenceact.eu/article/26/
- [S14] https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace ; https://wetten.overheid.nl/BWBR0002747/
