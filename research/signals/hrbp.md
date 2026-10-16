# Signals: HR Business Partner

Window: 16 July 2026 to 14 October 2026. Written 14 October 2026 by SCOUT.
Each link below was opened in this session. Grades: E2 a named product does this today; E3 a documented case or a legal source with a page you can read. Nothing here is E4 (measured inside Noordhaven). Vendor and marketing pieces are marked.

What shows up for this role: HRBPs are building narrow agents for calibration, feedback and manager questions, and they are the people who get asked when a tool starts scoring staff or candidates. The EU rules that already apply are transparency, the emotion-recognition ban, and a softened AI-literacy duty. The heavy high-risk duties for worker management are deferred to 2 December 2027. In the Netherlands the works council's consent right is already live.

## S1. Workday HRBPs built their own calibration agent

- Date: indexed 9 October 2026. The article page does not print a date.
- Source: https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html
- Who: Phil Willburn, writing about Workday's own HR team. Named user: Laura Seto, principal people business partner. One HRBP built the first prototype herself.
- What: In Sana (Workday), an HRBP trained an agent on the questions leaders and HRBPs already asked in Slack. It prepares a calibration session, answers live policy questions, and drafts language. An HRBP in Singapore used it for a leave-of-absence edge case that would otherwise have been escalated. A vice president used it as a live referee in a nine-box debate. Neither use was on the roadmap. Workday says every agent goes through an internal HR AI Hub with legal, privacy and responsible-AI review.
- Number: 83% of Workday's HRBPs called it super useful and said it helped them make better-informed decisions. Half of users cut prep time by as much as 75%.
- Grade: E3, vendor measuring its own workforce. Treat the percentages as the vendor's figures, not an independent audit.
- Flag: Workday is selling Sana. The article is a customer story in which the customer is Workday.

## S2. Same team: a check-in agent aimed at feedback quality, not only speed

- Date: same article as S1.
- Source: https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html
- Who: Workday talent management team. Named user: Jim Delia, SVP of global revenue operations.
- What: Managers were writing check-ins by stitching decks, notes and metrics. The agent pulls from employee-approved connections (mail, Slack, documents, meetings, Salesforce, GitHub, Jira, Workday goals) and pushes managers past generic praise. The rubric is Situation-Behavior-Impact.
- Number: Of nearly 12,200 manager write-ups, 36% were rated "Good" before the push. High-quality feedback rose 50% in Q1 and 44% in Q2. Among agent users the share rated "Good" rose 16 percentage points, against 7 points for non-users. Delia says prep fell by over 80%: a quarterly business review deck became responses in 20 minutes, against nearly two hours.
- Grade: E3, same caveat as S1. The non-user comparison is the most useful part, and it is still internal.
- Flag: Vendor self-report. Workday also says the hardest part was quantifying value after the agent existed, because baselines were not set first.

## S3. Coca-Cola Andina: an HR assistant on WhatsApp, with a tone failure

- Date: 8 September 2026 (Microsoft Learn `ms.date`).
- Source: https://learn.microsoft.com/en-us/power-platform/guidance/case-studies/coca-cola-andina-hr-support
- Who: Rocio Duarte, product manager of HR, and Tomas Colla, IT senior solution developer, Coca-Cola Andina (Argentina). Built in Copilot Studio, reached through WhatsApp.
- What: Plant workers do not live in Teams. The agent, Andi, answers from role, location, contract type and tenure (profile from Entra ID, extra attributes from a SharePoint list synced daily from SAP). If it cannot resolve a question it opens a ticket for HR managers in an existing Power Apps canvas. HR content owners in each region write the knowledge; the technical team uploads it. A few weeks before launch the agent started joking about sick leave and doctor's appointments. The cause was a tone setting, not the knowledge. They split personality (global config) from specific instructions (topic prompts).
- Number: 1,200 of about 3,600 active employees in Argentina use it each month. Nearly 5,000 conversations. Average conversation length 6 minutes 33 seconds. CSAT 4.1 out of 5, from 976 employee surveys. No figure for hours returned to HR.
- Grade: E3. Microsoft hosts the case study. The quotes are named employees of the customer.
- Flag: Vendor-hosted case. The useful failure is the sick-leave jokes, and the finding that content structure mattered more than the model.

## S4. Microsoft's own HR: three internal agents, no measured result

- Date: 12 October 2026.
- Source: https://news.microsoft.com/source/asia/2026/10/12/microsofts-ai-transformation-of-hr-from-efficiency-to-operational-impact/
- Who: Microsoft, unsigned Source Asia post. The page has no byline and does not name an HR director.
- What: The post describes three internal Frontier agents. Learning agent plus Career Hub: employees look up skill gaps, paths, training, mentors and projects before the career conversation. Workforce Insights agent: managers look at structure, staffing, distribution and hiring without waiting for an HR report. People agent: find a colleague by skill. The claim for HRBPs is that the conversation starts with "what should we do", not "where is the number".
- Number: none.
- Grade: E2. The products are named and described by the company that ships them. No case measurement.
- Flag: Vendor essay. Do not treat "more strategic HR" as a result.

## S5. EU AI Act dates an HRBP in the Netherlands has to plan against

- Date: page updated 10 October 2026. Legally reviewed 30 July 2026. Regulation in force 27 July 2026.
- Source: https://www.praxikon.com/en/digital-omnibus
- Who: Zahed Ashkara, AI and privacy legal adviser, Praxikon (Netherlands). He cites EUR-Lex for Regulation (EU) 2026/1744: https://eur-lex.europa.eu/eli/reg/2026/1744/oj
- What: The Digital Omnibus on AI moved the core duties for stand-alone high-risk systems in Annex III, which includes recruitment and worker management, from 2 August 2026 to 2 December 2027. Annex I product AI moves to 2 August 2028. Systems already in use are caught when they are significantly changed. Public-authority systems have a backstop of 2 August 2030. What was not moved: Article 50 transparency has applied since 2 August 2026 (machine-readable marking of generative systems already on the market gets until 2 December 2026). Article 5 prohibitions have applied since 2 February 2025. Article 4 was weakened from "ensure a sufficient level of AI literacy" to "take measures that support" it. No mandatory certificate.
- Number: 16-month deferral of Annex III duties (2 August 2026 to 2 December 2027).
- Grade: E3 as a documented reading of the regulation, not an operational case. A second law-firm page says the same dates: MTR Legal, 5 October 2026, https://www.mtrlegal.com/ki-im-arbeitsverhaeltnis-neue-eu-fristen-fuer-arbeitgeber/
- Flag: Praxikon sells classification opinions and training. The date table matches MTR Legal, so the dates are not a single vendor's invention. I did not get the Official Journal text itself to render in this session (the Praxikon page links it).

## S6. What already applies to an HR chatbot or a performance tool

- Date: 5 October 2026.
- Source: https://www.mtrlegal.com/ki-im-arbeitsverhaeltnis-neue-eu-fristen-fuer-arbeitgeber/
- Who: MTR Legal, German employment-law firm. Page dated 5 October 2026.
- What: Emotion recognition at work from voice, face or expression is already prohibited under Article 5, apart from narrow medical or safety uses. Disclosure does not make it lawful. Chatbots used for applications or HR questions must be recognisable as AI where Article 50 applies. High-risk, once the deferred duties apply, covers systems intended to filter or evaluate candidates, and systems that influence terms, promotion, termination, task allocation, or monitoring of performance and behaviour. Deployer duties MTR lists for later: follow the provider's instructions, keep human oversight, check input data, stop the system if risk shows up, inform workers, keep logs at least six months, and consider a data-protection and a fundamental-rights impact assessment.
- Number: logs kept at least six months, as MTR states the duty.
- Grade: E3 as legal commentary, not a case.
- Flag: The firm is selling employment advice. The classification of employment AI matches the regulation summaries in S5.

## S7. Dutch works council: consent before the AI Act's high-risk chapter

- Date: search index 7 July 2026, nine days before this window. Included because it is the clearest Dutch works-council page opened, and the statute it explains is in force now. The AI Act dates in the same article match S5.
- Source: https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace
- Who: Zahed Ashkara, Praxikon. The opening scene (an HR director at a Dutch logistics company) is his illustration, not a reported case.
- What: Article 27 of the Works Councils Act (Wet op de ondernemingsraden) requires prior consent for arrangements on employee personal data (sub k) and for facilities aimed at or capable of observing presence, behaviour or performance (sub l). Intention does not matter: a planning tool that also records how fast someone finishes work can fall in. CV screening, AI-assisted appraisal, productivity dashboards, call monitoring and algorithmic shift scheduling almost always need consent. A generic drafting assistant is greyer, until prompts are logged per person. The works council can invoke nullity within one month (Article 27(5)). The employer can ask the kantonrechter for substitute consent (Article 27(4)). Article 25(1)(k) adds an advice right for an important technological facility. The Autoriteit Persoonsgegevens is described as the coordinating supervisor for algorithms and AI in the Netherlands, alongside the RDI. Article 26(7) of the AI Act, when it applies, requires the employer to inform workers and their representatives before a high-risk system is put into use.
- Number: one month to invoke nullity.
- Grade: E3 as legal commentary. The logistics-company scene is E0 (a made-up example on the page).
- Flag: Same commercial site as S5. A second Dutch page, https://didev.nl/ai/ai-invoeren-en-de-ondernemingsraad/ (indexed 30 August 2026), returned 403, so it is not used.

## S8. Article 50 in recruitment and employee-facing chat, as a recruiter-side reading HRBPs will be asked about

- Date: published 5 August 2026.
- Source: https://www.warden-ai.com/resources/eu-ai-act-article-50-recruitment-transparency-rules
- Who: Martyn Redstone, Warden AI.
- What: He reads the Commission transparency guidelines. A candidate-facing chatbot or voice assistant needs a clear notice at the first interaction, not a line in terms and conditions. An outbound sourcing agent should say it is AI and name who it acts for. A back-end CV ranker is generally not an Article 50(1) interaction, but may still be high-risk later. Emotion inference from face or voice is a legality question first. A synthetic video of a recruiter or executive can be a deep fake and need a label. Ordinary AI-drafted job ads and candidate emails, reviewed by a person, usually sit outside the public-interest text rule. Fines he states for Article 50: up to €15 million or 3% of worldwide annual turnover.
- Number: fine ceiling as he states it, up to €15 million or 3% of turnover.
- Grade: E3 as a documented reading of Article 50 and the Commission guidelines he links. Not a case.
- Flag: Warden sells HR AI compliance software. The "practical wording" examples are his, not a Commission template.

## S9. Two US lawsuits HRBPs will hear about when a manager wants a screening tool

- Date: UNLEASH analysis indexed 5 October 2026. The page itself does not print a byline date; the docket facts are in the article.
- Source: https://www.unleash.ai/risk-compliance-regulation/analysis/who-s-accountable-for-ai-in-hiring-what-hr-buyers-need-to-know-now
- Who: Allie Nawrat, UNLEASH. Quoted: Kyle Lagunas (Kyle & Co), Jason M. Loring (Jones Walker), Heather Bussing (Bussing Law), Kelly Trindel (Workday, chief responsible AI officer).
- What: Mobley v. Workday (N.D. Cal., filed February 2023) alleges age, disability and race discrimination in AI hiring tools. The court dismissed intentional-discrimination claims and let disparate-impact claims proceed. Age claims have conditional collective-action approval. Eightfold (Kistler, filed January 2026, now in N.D. Cal.) is a consumer-reporting claim: profiles and a "match score" built from data beyond the application, without FCRA disclosures. Both vendors deny the claims. Eightfold's motion to dismiss was still unruled when this article was written. Workday says customers keep the hiring decision and that tools look at qualifications, not protected traits, and says it has ISO 42001 and NIST AI RMF certification. The article's practical point for an HRBP: a vendor contract does not move a statutory duty off the employer, and HR should not leave the questions to Legal alone. Questions Bussing wants asked: what data, how accuracy is tested, whether the software can make an employment decision, and who pays if there is a suit (indemnity).
- Number: none new in this article. Case age is from 2023; the Eightfold filing is January 2026.
- Grade: E3 for the existence and posture of the two cases, as reported by a trade paper. Not a judgment on the merits.
- Flag: Pending litigation. Workday's statement is the defendant's account.

## S10. A court threw out an AI-bias claim where the applicant could not show how the tool used race

- Date: published 5 October 2026, updated 6 October 2026.
- Source: https://www.hrdive.com/news/sirius-xm-beats-allegations-of-ai-fueled-racial-bias/832115/
- Who: Caroline Colvin, HR Dive, on Harper v. Sirius XM Radio. Summary judgment 30 September 2026. iCIMS commented after publication.
- What: A Black applicant applied to about 150 roles between November 2023 and November 2024 and alleged iCIMS screened him out because of race. He said he used several email addresses to avoid "algorithmic penalties" for repeat applications. He did get one interview. The court granted summary judgment: no direct or circumstantial evidence of discriminatory intent, and no showing of how the alleged AI use caused a disparate impact. iCIMS said customers decide whether to use AI features and that hiring teams make the decisions.
- Number: about 150 applications.
- Grade: E3. A reported judgment, not a finding that the software was unbiased.
- Flag: One plaintiff, one employer. Do not generalise to "AI hiring suits fail".

## S11. Josh Bersin, on X: specialist agents, not one superagent

- Date: 11 October 2026.
- Source: https://x.com/Josh_Bersin/status/2109370572933419486
- Who: Josh Bersin, HR analyst (@Josh_Bersin). He also points at his own product, Galileo, in his bio.
- What: He argues enterprise agents should be specialists with a narrow goal and a domain they learn, "just like people", because that is how you limit behaviour. He ties this to Satya Nadella's comments on model safety versus architecture. This matches what Workday's own HR team reports in S1: four narrow agents, not one HR bot.
- Number: none.
- Grade: E1. A practitioner's opinion in a post, not a measured deployment.
- Flag: He sells an HR agent (Galileo). The architectural point is still the one his readers are repeating.

## S12. Luiza Jarovsky, on X, the day transparency enforcement started

- Date: 2 August 2026.
- Source: https://x.com/LuizaJarovsky/status/2083933591621251542
- Who: Luiza Jarovsky, PhD (@LuizaJarovsky). She runs an AI-governance newsletter.
- What: She posted that enforcement of transparency obligations and prohibited practices started that day, with the AI Office enforcing rules for general-purpose models and for systems from the same provider, national authorities enforcing the rest, and the EDPS covering EU institutions. She also posted the exceptions: machine-readable marking for systems already on the market extended to 2 December 2026; Annex III high-risk enforcement postponed to 2 December 2027; Annex I to 2 August 2028. She links a complaint tool and a whistleblower tool for the AI Office.
- Number: she wrote that her newsletter was above 99,000 subscribers. That is her figure.
- Grade: E3 for the dates, which match S5 and S6. The subscriber count is self-reported.
- Flag: The first line ("enforcement starts today, fines") is broader than the postponement she explains in point 4. Read the whole post.

## What this role should not treat as settled

- No opened source gives an HRBP a measured hours-back figure for a Dutch employer, or for AFAS, Visma or a works council that refused a tool. The Dutch constraint in this file is the statute, not a named company case.
- "HR becomes more strategic" appears in Microsoft's essay (S4) without a number. The only HRBP-specific percentages in this set are Workday's own (S1, S2).
