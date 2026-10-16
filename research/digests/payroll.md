# Digest: Payroll Specialist

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/payroll.md`, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **The calculation stays a rules engine; AI sits around it.** PayCaptain: "None of this touches how pay is actually calculated", which stays "deterministic, rules-based, and repeatable". The checks it runs in production:
  - gross pay moved more than expected;
  - pension contributions stopped for someone still enrolled;
  - a leaver paid double net;
  - an hourly rate below minimum wage.

  Its assistant found "more than £500,000 in identified employee benefits" left unclaimed [S1]. E3, vendor total.
- **The big suites agree.** Workday: "Probabilistic AI is great at guessing, but in payroll and finance, a good guess isn't good enough." Its Payroll Agent autopilot (early adopters, early 2027) will audit retroactive adjustments, flag items "outside of defined parameters", and draft employee notices for payroll to check [S2]. E2, roadmap. SAP lists a Payroll Explanation Agent, no customer [S3]. E2.
- **Adoption is low and staff are wary.** Of 9,451 US respondents, more than 46% were uncomfortable with AI in payroll and 25% comfortable. In 2024, 53% objected to AI answering payroll questions instead of a person. [S4]. E3, US.

## Dutch products

- **AFAS Profit 8** (Noordhaven's payroll system) stores job schemes for pay transparency and shows wage-component history. For Flex, once a person approves a declaration, its payroll lines approve automatically: a rule after a human gate [S5]. E2.
- **AFAS Jonas** answers configuration questions, citing Help Center articles, and warns answers may be incomplete [S6]. E2.
- **Visma's Nmbrs** brand now spans payroll and accounting; payroll AI is promised, not shipped [S7]. E2.

## What fails

"Almost right means someone gets paid incorrectly" [S2]. Generated gross-to-net is unacceptable; a generated explanation of a correct one is fine. No Dutch employer has published hours saved, tickets avoided or error rates.

## Dutch and EU constraints

- **Pay transparency (EU 2023/970):**
  - Status: bill in the Tweede Kamer since 21 May 2026, debates 7 December 2026 and 11 January 2027; start date by royal decree, not 1 January 2027.
  - Requests: employees may ask for their own pay and the average pay for equal work by sex, answered within two months.
  - Reporting: with 1,200 staff, Noordhaven reports its gender pay gap yearly, first over 2027 pay, due 7 June 2028.
  - Gaps: a gap of 5% or more, unexplained after six months, triggers a joint evaluation with the works council. The council also consents to the job-evaluation system.
  - Fines: up to €11,000 under the current bill [S8]. E3, a firm's reading of the bill.
- **AI Act:** a payslip chatbot must say it is AI (Art. 50); back-office checks are exempt. A dashboard scoring people from time data can be high-risk from 2 December 2027 [S9].
- **Works council and GDPR:** a bot reading the personnel file needs consent (WOR 27(1)(k)) [S10]. Rule-based pay decisions still need a route to human review [S11].
- E1: two CAOs and seasonal flex staff multiply rule variants; keep rules explicit.

## For the model

- **Gross-to-net, filings, reconciliations:** `deterministic_software` at autonomy 4–5, never scored as LLM work.
- **Pre-run checks:** deterministic rules plus an `llm_step` that explains each exception. Autonomy 3: payroll approves.
- **Timesheet and leave documents:** `llm_step` intake.
- **Payslip questions:** an agent that quotes the calculation, with disclosure.
- **Law changes:** `copilot`.

Altitude: the specialist owns the rules and designs the checks. North Star inputs: first-time-right pay runs, corrections per run.

## Sources

- [S1] https://www.paycaptain.com/post/how-ai-is-changing-enterprise-payroll-operations (PayCaptain, 25 Aug 2026)
- [S2] https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html (Workday, 13 Oct 2026)
- [S3] https://www.sap.com/hungary/use-cases/joule-assistant/hr-service-ai (SAP)
- [S4] https://www.prnewswire.com/news-releases/survey-finds-employee-caution-around-ai-in-payroll-persists-302884225.html (PayrollOrg, 22 Sep 2026)
- [S5] https://irixs.nl/kennisbank/afas-profit-8 (Irixs, 14 Oct 2026)
- [S6] https://www.afas.nl/blog/jonas-nieuwe-afas-help-center (AFAS, 23 Sep 2026)
- [S7] https://www.visma.com/newsroom/nmbrs-becomes-vismas-business-platform-for-dutch-entrepreneurs (Visma, 1 Sep 2026)
- [S8] https://www.randstad.nl/werkgevers/hr-wet-en-regelgeving/actuele-wetgeving/wet-loontransparantie (Randstad)
- [S9] https://artificialintelligenceact.eu/article/50/ ; https://artificialintelligenceact.eu/annex/3/ ; https://www.praxikon.com/en/digital-omnibus
- [S10] https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace ; https://wetten.overheid.nl/BWBR0002747/
- [S11] https://gdpr-info.eu/art-22-gdpr/
