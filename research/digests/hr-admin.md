# Digest: HR Administrator

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/hr-admin.md`, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **Employee questions, answered per person, with a ticket when the bot cannot.** Coca-Cola Andina's HR agent on WhatsApp is used monthly by 1,200 of about 3,600 employees: nearly 5,000 conversations, CSAT 4.1 out of 5 from 976 surveys. Answers differ by region, contract type and tenure, synced daily from SAP. Unresolved questions become a ticket with the profile attached, in an existing HR queue [S1]. E3; no hours-returned figure.
- **One front door for IT, HR and facilities.** Raleigh's Ral-E answers all three from one knowledge base, with 98% deflection claimed; the published 66% cost cut is the IT desk only [S2]. E3, vendor release.
- **A chatbot alone frees little time.** Danish chatbot users, HR professionals and office clerks among them, saved about 3% of work hours, 7% where employers encouraged use [S3]. E3. Hours come from redesigned workflows, not a bot beside the old one.

## Products

- **AFAS Profit 8:** Jonas reads documents into dossier fields; new hires submit data in the Pocket app before day one [S4]. E2, partner description, no error rate.
- **SAP Joule HR agents:** answer-or-dispatch, nudging stalled approvals, payslip explanation, timesheets, time off [S5]. E2, no customer or number.
- **SixFifty (Paychex):** drafts handbooks and contracts and sends them for signature, distributes new-hire notices, files state forms, each action "grounded in strict workflows" on an attorney-built law base [S6]. E2, US law only. The pattern carries over: an agent that acts on a rules base experts maintain.

## What fails

- **Tone.** Weeks before launch Andina's bot joked about sick leave and doctor's visits. Fix: tone in the global configuration, instructions per topic [S1].
- **Content, not the model.** "Content structure mattered more than we expected." A named HR owner per region writes the knowledge. Early drop-off came from sign-in problems [S1].
- **Recordings and summaries become the file.** Notetakers capture health details and unlawful questions; if the employer cannot say where data goes, the tool is not ready [S7][S8].

## Dutch and EU gates

- **Now:** an employee-facing bot must tell people they are talking to AI unless that is obvious (Art. 50(1), since 2 August 2026) [S9][S10]. Emotion inference at work is banned [S11].
- **Works council:** a bot that answers from the personnel file, or logs questions per employee, processes personal data, so it needs consent under WOR art. 27(1)(k), and (l) if it can observe behaviour [S12].
- **From 2 December 2027:** screening applicants (Annex III 4(a)) and allocating tasks or monitoring performance (4(b)) are high-risk; a policy Q&A bot is not [S11][S10].
- **GDPR Art. 22:** the acceptance or rejection letter can be automated; the decision cannot rest solely on automated processing [S13].
- E1, model knowledge: sickness reporting (Wet verbetering poortwachter) is rule-bound, but health data is special-category (GDPR Art. 9) and should stay out of model prompts.

## For the model

Records, dossier updates, document intake: `llm_step` (document to fields) plus deterministic validation, autonomy 4 with an exceptions queue. Personal entitlements (leave balance, benefits): a deterministic lookup the bot quotes, not generated text. Policy questions: an agent on owned content with ticket escalation, autonomy 4. Applicant evaluation and selection: `copilot`, autonomy ≤ 2. Altitude: the administrator becomes knowledge owner and exception handler. North Star inputs: share of questions resolved without a ticket, dossier complete on day one, days per personnel action. Lean wastes: motion (re-keying), defects (corrections).

## Sources

- [S1] https://learn.microsoft.com/en-us/power-platform/guidance/case-studies/coca-cola-andina-hr-support (Microsoft Learn, 8 Sep 2026)
- [S2] https://newsroom.servicenow.com/press-releases/details/2026/Raleigh-North-Carolina-reduces-IT-service-desk-costs-by-66-with-ServiceNow-AI-agents/default.aspx (ServiceNow, 8 Oct 2026)
- [S3] https://bfi.uchicago.edu/wp-content/uploads/2025/04/BFI_WP_2025-56-3.pdf (Humlum and Vestergaard, BFI working paper, 2025)
- [S4] https://irixs.nl/kennisbank/afas-profit-8 (Irixs, 14 Oct 2026)
- [S5] https://www.sap.com/hungary/use-cases/joule-assistant/hr-service-ai (SAP product page)
- [S6] https://www.hrdive.com/press-release/20261012-sixfifty-a-paychex-company-launches-agentic-hr-compliance-specialist/ (press release, 13 Oct 2026)
- [S7] https://www.hrdive.com/news/hr-must-set-boundaries-ai-notetakers/830276/ (HR Dive, 14 Sep 2026)
- [S8] https://www.hrdive.com/news/ai-summaries-leave-a-paper-trail-recruiters-might-not-be-ready-for/830734/ (HR Dive, 18 Sep 2026)
- [S9] https://artificialintelligenceact.eu/article/50/
- [S10] https://www.praxikon.com/en/digital-omnibus (updated 10 Oct 2026); https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
- [S11] https://artificialintelligenceact.eu/article/5/ ; https://artificialintelligenceact.eu/annex/3/
- [S12] https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace ; https://wetten.overheid.nl/BWBR0002747/
- [S13] https://gdpr-info.eu/art-22-gdpr/
