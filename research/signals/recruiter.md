# Signals: Recruiter (talent acquisition)

Window: 16 July 2026 to 14 October 2026. Written 14 October 2026 by SCOUT.
Each link below was opened in this session. Grades: E2 a named product does this today; E3 a documented case or a legal source with a page you can read. Nothing here is E4. Vendor and marketing pieces are marked.

What shows up for this role: one energy company published a hiring-cycle result (days off the path to a signed contract, not a quality score). Product teams are shipping narrow helpers for interview questions, pipeline watching and CV match scores, with a person still sending the outreach. The rules that already bite a Dutch recruiter are Article 50 disclosure for candidate chat and sourcing agents, the emotion-recognition ban, and works-council consent for CV screening. The heavier high-risk duties for recruitment are deferred to 2 December 2027. US litigation is about who is liable, not a settled finding that a tool was biased.

## S1. Uniper: a hiring agent that names stuck candidates, with a cycle-time result

- Date: 9 October 2026. Bernd Reder, CIO.de.
- Source: https://www.cio.de/article/4230646/uniper-beschleunigt-hr-prozesse-mit-ki.html
- Who: Robert Daamen, Head of Process Intelligence Centre of Excellence, Uniper. Hans Pezold, CIO, Uniper. Built with Celonis and Microsoft Copilot Studio.
- What: Uniper (~7,400 employees worldwide, about 5,000 in Germany) built an agent for hiring managers. It reports open roles and shortlisted applications, flags overdue recruiter and manager tasks, and coordinates HR emails to candidates. They asked the same question twice: "where are the bottlenecks?" On raw HR data the agent answered in generalities (fragmented data, overloaded hiring managers). With the Celonis Context Model it named a specific pile-up. The article says the same partnership is also used for maintenance, energy trading, finance services and IT service management. It gives no finance numbers.
- Number: after go-live, average time to contract signature cut by 27 days; average screening phase cut by 13 days. The context-model example: 27 candidates on the shortlist for more than 14 days. Token use fell because the agent used prestructured logic. No baseline cycle time is stated, so "27 days" is a reduction, not a remaining duration.
- Grade: E3. A named employer, named executives, a before/after prompt test, and two cycle-time figures. The figures come from the company and its vendors.
- Flag: Celonis supplies the photograph of the CIO. Treat this as a partnership story. Do not read the finance mention as a finance result.

## S2. Workday talent acquisition: one person generated interview questions for every skill

- Date: the article page does not print a date. Search index of the same post was 9 October 2026 (see the HRBP file, same URL).
- Source: https://blog.workday.com/en-us/how-workdays-hr-team-is-reimagining-workflows-with-sana.html
- Who: Phil Willburn, writing about Workday's own talent acquisition team. One talent-acquisition manager built the agent.
- What: Hiring teams were falling back on generic behavioural questions. The agent takes a job description and the skills an interviewer is assigned to assess, and writes two behavioural questions per skill, using Workday's skill descriptions and its own question-writing guidance. Willburn's other point, from the same build, is that the hard part was measuring value after the agent existed, because baselines were not set first. Every agent is reviewed through Workday's HR AI Hub (responsible AI, legal, privacy).
- Number: more than 800 job-critical skills across 1,600+ roles. Workday says it now has tailored questions for 100% of those skills and roles. No figure for whether the questions produced better interviews or better hires.
- Grade: E3 as an internal build with a coverage number. The coverage number is the vendor counting its own catalogue.
- Flag: Workday is selling Sana. "100% coverage" is not a quality result.

## S3. Workday Talent Acquisition Agent: autopilot announced, outreach still needs a person

- Date: 13 October 2026. Workday press release, Workday Rising, Las Vegas.
- Source: https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html
- Who: Joel Hellermark, chief AI officer, Workday. Gerrit Kazmaier, president, product and technology. Quote also from Holger Mueller, Constellation Research, inside the release.
- What: The Talent Acquisition Agent watches open roles, flags those at risk of missing a fill date, surfaces qualified applicants and gaps, and can notify recruiters in Slack with sourcing actions and draft outreach. The release says outreach is not sent until a recruiter approves it. The agent can also coordinate interview scheduling, pass context to interviewers, and draft feedback. It is described as working across Workday Recruiting, HiredScore, Paradox, Workday skills, and connected sourcing tools. The customer chooses which actions run alone. Autopilot for this agent is available to early-adopter customers from 13 October 2026, with general availability planned for early 2027. Payroll and Accounting autopilots are planned for early-adopter access in early 2027, not now.
- Number: the release's scene is "a recruiter managing 25 open jobs". It also says "time to fill moves from weeks to days". Neither is a customer result. Deployment Agent (IT, not hiring) is the only activation count: nearly 5,000 customers since an announcement last September.
- Grade: E2. A named product, with a start date for early adopters. Not a case.
- Flag: Vendor announcement, and the release itself says unreleased features may not ship. Do not treat "25 open jobs" or "weeks to days" as measured.

## S4. AFAS Profit 8: a match score on the application, described by a Dutch partner

- Date: 14 October 2026.
- Source: https://irixs.nl/kennisbank/afas-profit-8
- Who: Irixs, an AFAS implementation partner, describing Profit 8. No named customer and no recruiter quoted.
- What: In recruitment, Profit reads the application and builds a profile from education, registrations, competencies and work experience, then calculates a match score against open vacancies. Irixs says this is meant to help recruiters see suitable candidates faster and to spot internal talent. The same release lets Jonas fill dossier fields from documents during a workflow, and lets new hires submit data in the Pocket app before day one. No accuracy, acceptance rate, or time-saved figure is given for the match score.
- Number: none for recruiting.
- Grade: E2. A product description of software Dutch employers actually run. Not a measured deployment.
- Flag: Partner marketing. Irixs sells the implementation. This is not an AFAS press release and not a customer case. No Recruitee AI feature was opened in this window.

## S5. Article 50, as it lands on a recruiter's candidate journey

- Date: published and updated 5 August 2026.
- Source: https://www.warden-ai.com/resources/eu-ai-act-article-50-recruitment-transparency-rules
- Who: Martyn Redstone, Warden AI. He is reading the Commission transparency guidelines (he links them; those two Commission pages were not opened in this pass).
- What: Article 50 has applied since 2 August 2026. It is four rules, not a blanket "we use AI" notice. A careers chatbot, a voice screening call, or a scheduling bot that talks to the candidate needs a clear notice at the first turn, in the conversation, not in terms and conditions. A label such as "assistant" or "powered by an LLM" is not enough on his reading. An outbound sourcing agent should say it is AI and name the employer, agency or RPO it acts for. A back-end CV ranker is generally outside Article 50(1), because the candidate never talks to it, and may still be high-risk under the deferred chapter. A video tool that infers emotion or intention from face or voice is an Article 5 legality question first; a notice does not make a prohibited use lawful. A realistic synthetic video of a recruiter or executive can be a deep fake and needs a visible label at first exposure. An ordinary job ad or candidate email that a recruiter has substantively reviewed usually sits outside the public-interest text rule. Spell-check is not that review. The 2 December 2026 date delays only machine-readable marking for generative systems already on the market, not the duty to tell a candidate they are talking to AI.
- Number: fines he states for Article 50, up to €15 million or 3% of worldwide annual turnover, with the Act's reductions for smaller organisations.
- Grade: E3 as a documented reading of Article 50 and the guidelines. Not a case, and not the Official Journal.
- Flag: Warden sells compliance software (Warden Watch). The sample notice wording is his.

## S6. Emotion recognition is banned now; recruitment scoring waits until December 2027

- Date: 5 October 2026.
- Source: https://www.mtrlegal.com/ki-im-arbeitsverhaeltnis-neue-eu-fristen-fuer-arbeitgeber/
- Who: MTR Legal, a German employment-law firm. The same dates are on Praxikon's omnibus page, updated 10 October 2026: https://www.praxikon.com/en/digital-omnibus
- What: Inferring emotion from voice, face or expression in recruitment or at work is already prohibited under Article 5, except narrow medical or safety uses. Calling it "engagement analysis" does not change the function. Systems intended to filter applications, target job ads, or evaluate candidates are in the high-risk list (Annex III). Those core deployer duties were moved from 2 August 2026 to 2 December 2027. A recruiter clicking "reject" does not, on these readings, take a scoring system off that list. Article 26(7), when it applies, requires the employer to inform workers and their representatives before workplace use. Existing systems are caught when they are significantly changed.
- Number: deferral of 16 months for Annex III duties.
- Grade: E3 as legal commentary corroborated by a second firm. Not an enforcement case.
- Flag: Both firms sell advice. The Official Journal text did not render in this session.

## S7. Dutch works council: CV screening is a consent item now, not in 2027

- Date: search index 7 July 2026, nine days before this window. Included because it is the clearest Dutch works-council page opened, and the statute is in force. The same caveat is in the HRBP file.
- Source: https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace
- Who: Zahed Ashkara, Praxikon. His opening scene of a Dutch logistics HR director is an illustration, not a case.
- What: Article 27 of the Works Councils Act requires prior consent for arrangements on employee personal data (sub k) and for facilities capable of observing presence, behaviour or performance (sub l). He lists CV screening with the tools that almost always need consent, alongside AI appraisal, productivity dashboards, call monitoring and algorithmic shift scheduling. A decision taken without consent can be nullified if the works council invokes nullity within one month. The employer can ask the kantonrechter for substitute consent. A generic drafting assistant is greyer until prompts are logged against a person.
- Number: one month to invoke nullity.
- Grade: E3 as legal commentary. The logistics scene is E0.
- Flag: Praxikon sells assessments and training. No opened source shows a Dutch works council refusing a recruiting tool in this window.

## S8. Two US cases recruiters will be asked about: Workday and Eightfold

- Date: UNLEASH analysis indexed 5 October 2026. The page does not print a byline date.
- Source: https://www.unleash.ai/risk-compliance-regulation/analysis/who-s-accountable-for-ai-in-hiring-what-hr-buyers-need-to-know-now
- Who: Allie Nawrat, UNLEASH. Quoted: Kyle Lagunas (Kyle & Co), Jason M. Loring (Jones Walker), Heather Bussing (Bussing Law), Kelly Trindel (Workday).
- What: Mobley v. Workday (N.D. Cal., filed February 2023) alleges age, disability and race discrimination by hiring software. The court dismissed intentional-discrimination claims and let disparate-impact claims proceed. Age claims have conditional collective-action approval. The court ordered Workday to disclose which customers use AI features in hiring. Eightfold (Kistler, filed January 2026, later moved to N.D. Cal.) alleges consumer-reporting violations: a profile and match score built from data beyond the application, without the disclosures the Fair Credit Reporting Act requires. Eightfold's motion to dismiss, filed in April, was unruled when the article was written. Workday says the claims are false, customers keep the hiring decision, and the tools look at qualifications rather than race, age or disability. Eightfold says the claims are without merit and cites third-party bias audits, including ISO and New York City Local Law 144. Loring's point for a buyer: a contract does not erase a separate statutory duty, and building the tool in-house changes the shape of the risk, not the fact of it.
- Number: none on outcomes. Both cases are pending on the claims that remain.
- Grade: E3 for posture, as reported. Not a finding on the merits.
- Flag: Pending litigation. Vendor statements are the defence.

## S9. Sirius XM: summary judgment where the applicant could not show how the tool used race

- Date: published 5 October 2026, updated 6 October 2026. Judgment 30 September 2026.
- Source: https://www.hrdive.com/news/sirius-xm-beats-allegations-of-ai-fueled-racial-bias/832115/
- Who: Caroline Colvin, HR Dive, on Harper v. Sirius XM Radio. iCIMS commented after publication. Sirius XM did not.
- What: The plaintiff, a Black applicant, applied to about 150 roles from November 2023 to November 2024 and alleged iCIMS screened and rejected applicants in a way that intentionally and disproportionately discriminated against African American workers. He said he used several email addresses to avoid what he called algorithmic penalties for repeat applications. He had one interview, for IT desktop support in late 2023. The court granted summary judgment: no direct or circumstantial evidence of discriminatory intent, and no showing of how the alleged AI use caused a disparate impact. iCIMS said AI features sit under a responsible-AI programme, customers decide whether to turn them on, and hiring teams make the decisions.
- Number: about 150 applications.
- Grade: E3. A reported judgment. Not a finding that the software was unbiased, and not a reason to skip a bias test.
- Flag: One plaintiff. Do not generalise to "AI hiring suits fail".

## S10. Paylocity survey: recruiters say they use AI, and most are already managing a problem

- Date: HR Dive brief published 27 August 2026. Author Lara Ewen.
- Source: https://www.hrdive.com/news/hiring-managers-say-they-trust-ai-but-actively-manage-issues-with-it/828884/
- Who: Paylocity, an HR software vendor, surveying more than 1,000 US HR and recruitment leaders. HR Dive is reporting the survey. The Paylocity report page linked from the article was not opened.
- What: Respondents said they use AI most for resume screening, interview scheduling and writing job descriptions. Candidate engagement and interviews sat at the bottom, which the study reads as caution: tools handle volume, recruiters decide who is worth a conversation. The same brief says 71% believed more than half of the applications they screened were written with generative tools. HR Dive also cites a ManpowerGroup and Everest Group survey, which this pass did not open, for a contrasting result: fewer than 5% of companies using AI hiring tools saw "transformational" outcomes on any key metric, while nearly 4 in 10 reported a significant impact on operational efficiency.
- Number: 91% said they actively use AI somewhere in recruitment; the rest plan to within 18 months. 85% trusted AI to assess applicants "regardless of background". 26% were concerned they were not seeing some candidates because of AI screening. 4 in 5 were "actively managing at least one issue". 43% said AI saves the equivalent of a full working day a week. Uses: screening resumes 67%, scheduling 59%, job descriptions 57%. Misses they named: bias 16%, compliance 16%, loss of control 11%, candidate trust and drop-off 11%. 89% said AI helped identify better candidates. Paylocity also cites Ashby for applications per hire tripling from 2021 to 2024; that Ashby page was not opened.
- Grade: E3 as a reported vendor survey of US leaders. Not a Dutch sample, and not an audit of outcomes.
- Flag: The sponsor sells HR software. "Better candidates" is what respondents believe.

## S11. Interview summaries become the record, including the illegal question

- Date: 18 September 2026. Kathryn Moody, HR Dive.
- Source: https://www.hrdive.com/news/ai-summaries-leave-a-paper-trail-recruiters-might-not-be-ready-for/830734/
- Who: John Challenger, CEO, Challenger, Gray & Christmas, an outplacement firm, commenting on his firm's analysis. HR Dive does not print a separate methodology.
- What: Zoom, Teams and Google Meet transcribe and summarise. Recruiting platforms draft interview notes, fill scorecards and suggest follow-up questions. Challenger's point is that a hiring manager may read the summary and never watch the interview, so the summary becomes the first evaluation, and notetakers make mistakes. A candidate's slip, or an interviewer's unlawful question, is then stored. He also says recording changes how candidates behave. The article repeats the Paylocity finding that just over 90% of surveyed HR managers use AI somewhere in recruitment, and that 4 in 5 are managing at least one issue. Bias, he says, gets worse when a summary drops context.
- Number: no count of bad summaries. The 90% and 4-in-5 figures are the Paylocity survey in S10, restated.
- Grade: E3 as a reported practitioner warning. Not a measured error rate.
- Flag: Challenger's firm sells outplacement. The analysis is his firm's, as told to a trade paper.

## S12. Notetakers in interviews: consent, and HR as the person who vets the tool

- Date: 14 September 2026. Ryan Golden, HR Dive.
- Source: https://www.hrdive.com/news/hr-must-set-boundaries-ai-notetakers/830276/
- Who: Jim Link, chief human resources officer, SHRM. Brian McGinnis, partner, Barnes & Thornburg. Adam Solomon, partner, Hunton Andrews Kurth.
- What: McGinnis says some notetakers are marketed as not alerting participants, and that an interview with AI recording is higher risk than an ordinary internal Zoom because employment-decision laws are starting to cover it. He names all-party consent states including California, Florida and Illinois. Solomon points at workplace-monitoring notice rules. Link says SHRM's baseline is to disclose AI and to get agreement from everyone present before recording. His hiring test: if the employer cannot explain where candidate data comes from, how it is protected, and what happens to it, the tool is not ready. He prefers the employer to own the data. He also says he gets two or three unsolicited AI pitches a week, many claiming a higher chance of a successful hire.
- Number: two to three vendor pitches a week, as Link describes his own inbox. No outcome figure.
- Grade: E3 as on-the-record comments from named practitioners and counsel. Not a case result.
- Flag: Lawyers are speaking from their practice. Link is at an HR association, not reporting a deployment.

## S13. A former head of recruiting: buying the model does not buy you out of the explanation

- Date: 25 August 2026.
- Source: https://x.com/toshimitsu_sowa/status/2092075404832182348
- Who: Toshimitsu Sowa (@toshimitsu_sowa), representative of Jinzaikenkyusho, a Japanese HR consultancy. Bio: former head of recruiting at Recruit, and author. The post is in Japanese. The paraphrase below is a translation of that post, not his English.
- What: He writes that "the AI decided" and "it is a vendor product, so we do not know" are not explanations of an employment decision. His reading of the direction of the EU AI Act: the technology can be outsourced, the responsibility to employees and candidates cannot. In HR-tech buying, auditability belongs next to performance and price.
- Number: none. The post had 14 likes when opened.
- Grade: E1. A practitioner's opinion. He does not cite a case or a clause.
- Flag: None on the post itself. It is a view, and it matches the buyer advice in S8 without adding evidence.

## What this role should not treat as settled

No opened source in this window is a Dutch employer publishing hours saved, or a hire-quality result, on AFAS, Visma, Nmbrs or Recruitee. The AFAS match score is a partner's description of a release. Uniper's 27 days and 13 days are the only cycle-time figures opened, and they are the vendor partnership's own numbers. "Time to fill moves from weeks to days" in the Workday release is a slogan. A summary-judgment win for Sirius XM is not evidence that screening tools are unbiased.
