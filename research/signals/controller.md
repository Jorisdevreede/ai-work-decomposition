# Signals: Controller

Window: 16 July 2026 to 14 October 2026. Written 14 October 2026 by SCOUT.
Each link below was opened in this session. Grades: E2 a named product does this today; E3 a documented case, a survey page, or a published study you can read. Nothing here is E4. Vendor and marketing pieces are marked.

What shows up for this role: a lab close, then a gate. On four simplified month-end tasks, a frontier model met every criterion. On the full 160-task close benchmark, the leading score is about 62% of criteria and more than half the tasks are never fully solved. The products on sale this month draft accruals and then stop for a person. No opened page shows a Dutch controller publishing days to close.

## S1. On four simplified close tasks, Opus 5 scored 100% and the accountants averaged about 37%

- Date: 1 October 2026.
- Source: https://www.mercor.com/blog/human-baselines-for-benchmarks-ai-now-outperforms-junior-accountants/
- Who: Aden Barton, Researcher at Mercor. Mercor hired the participants and sells the benchmark. The full paper PDF linked from the page was not opened.
- What: Twelve people did four month-end scenarios: find the numbers in a company's files, do the math, and return a table. The title and the opening call them junior accountants. The method section says they averaged about five and a half years of experience and all were licensed CPAs. The study was built to measure a person plus a model. Models alone scored perfectly, so the write-up compares unassisted people with AI. Accountant accuracy on the chart runs from about 0% to about 90%. Most attempts took 30 to 180 minutes. The average score is about 37%. Claude Opus 5 scored 100% on all 20 attempts, each in under 10 minutes. Eighteen months earlier the best models sat below that 37% line. The chart puts GPT-4o near 0%, OpenAI o3 above the human average in spring 2025, GPT-5 at about 69%, and recent frontier models at or near 100%. Qwen3.5-122B is still below the line. Opus 5 cost $0.21 per criterion met. The accountants cost $10.35, which the page says is 49 times more, using the US median accountant wage.
- Number: human average about 37%. Opus 5 at 100% on 20 attempts, each under 10 minutes. $0.21 against $10.35 per criterion. The 20 attempts are the model's. The page does not print how many human attempts sit behind the average.
- Grade: E3 as a published lab study by the firm that built the tasks.
- Flag: Mercor sells benchmarks. The title says "junior accountants" and the method says licensed CPAs. The tasks test detail, file search, and instruction following. Barton writes that they leave out clients, questions, and tacit context, and that the results do not mean accountants are replaceable. Task authors expected about 30% from a junior and 55% from a mid-level accountant. A single missed number could collapse the score. Do not read 100% as a closed set of books.

## S2. On the full close benchmark the best score is 61.8% of criteria, and the same page still says 56.4%

- Date: The Decoder's article is 2 October 2026. The leaderboard page itself prints no date.
- Source: https://the-decoder.com/ai-beats-licensed-accountants-on-speed-and-accuracy-but-still-cant-close-the-books-without-supervision/ and https://www.mercor.com/apex/apex-accounting-leaderboard/
- Who: Manuel Uth, The Decoder, reporting Mercor's benchmark. The leaderboard is Mercor's, in partnership with Ramp. The arXiv paper linked from the leaderboard was not opened.
- What: APEX-Accounting is 160 tasks across 10 simulated companies and 2,186 grading criteria. Agents get a short request, no file list, and must apply US GAAP. The leaderboard table lists Claude Opus 5.5 Max at 61.8% ±4.0%, a Medium effort of the same model at 59.9% ±3.7%, Fable 5.1 Max at 61.0% ±3.7%, and GPT-6 Astra Max at 57.9% ±3.8%. The page header instead prints 61.0% as the highest score. A key-takeaway box still says the best model is Claude Fable 5 at 56.4%, which is the older row still in the table (Fable 5 Max 56.4% ±3.6%; Opus 5 Max is 54.5% ±3.9%). The header and that takeaway agree on a second figure: 58% of tasks are never fully solved by any model in any of eight attempts. Decoder, two days after the CPA study, reported the 61.8% / 61.0% / 57.9% table and wrote that no model fully solved almost 60% of the tasks. Decoder says the tasks were built by more than 40 professionals averaging 11 years. The leaderboard says more than 40 professionals, median 11 years, half from Big Four firms. It also says its language-model judge matches expert graders 97% of the time.
- Number: 61.8% of criteria for the leading table row. 58% of tasks never fully solved. Header "highest score" 61.0%. Stale takeaway 56.4%.
- Grade: E3 as Mercor's own leaderboard plus a news report of it. The two numbers on one page do not match.
- Flag: Mercor sells the benchmark and licenses training data built by the same network. Do not quote the 56.4% box and the 61.8% row as if they were one result. Do not say a model closes the books. The 100% result in S1 is the four-scenario study, not this 160-task set. The sample world on the page is a Philadelphia law firm on QuickBooks under US GAAP, not a Dutch ledger.

## S3. SAP's accruals agent is in restricted release, and the same article disagrees about who posts

- Date: 17 September 2026.
- Source: https://sapinsider.org/blogs/sap-releases-accounting-accruals-agent-for-month-end-close/
- Who: SAPinsider Staff. No customer is named. The linked SAP.com asset, the SAP Community post, the help.sap.com scope page, and the handbook PDF were not opened.
- What: The Accounting Accruals Agent runs through Joule in SAP S/4HANA Cloud Public Edition and is in Restricted Availability. It reads a plain-language policy PDF, retrieves historical data, calculates amounts, prepares proposed journals, and checks for duplicates. The article says accountants accept, adjust, or reject before posting, and that a handbook should cover at most five expense categories. It then says the documentation disagrees: a Community post describes review before posting, while the formal Feature Scope Description says the agent automates "preparation and posting" end to end. A dedicated review screen is described as planned. Roadmap material places the agent in Q1 2027 even though restricted use is available now. The article says the Financial Closing Orchestration Agent was scheduled for general availability on 30 September. This note did not open a later page that confirms it shipped. AI Units are bought annually from a shared pool, unused units expire after 12 months, one task can take several actions, some capabilities need an extra subscription, and availability varies by region.
- Number: none for time saved or for a customer. Cap of five expense categories in the handbook guidance.
- Grade: E2. A product description in a trade article. The posting step is unresolved on the page.
- Flag: the stack is SAP, not AFAS. Do not smooth the review-before-posting sentence and the "preparation and posting" sentence into one process. The Asda and CMC blurbs at the bottom of the page are not accrual results.

## S4. Trintech's accruals agent ends at Review and Approve, and prints no result

- Date: the page prints none.
- Source: https://www.trintech.com/platform/trintech-accruals-agent/
- Who: Trintech. No customer, no sample.
- What: The Accruals Intelligence Agent generates and rolls forward accruals, true-ups, and reversals for prepaid expenses, accrued liabilities, accrued revenue, and reserves. It flags estimates outside historical ranges. The listed steps end at Review and Approve by the accounting team, then Retain for Audit. The "Business Outcomes" lines are slogans: accelerate the close, improve estimate accuracy, reduce audit findings, strengthen governance, free preparer time. No figure is attached. Several image file names on the page say Flux Agent, not accruals.
- Number: none.
- Grade: E2. A product page.
- Flag: marketing. Do not treat the slogans as a close-time result. Do not treat a Flux image name as a second product claim.

## S5. Three more Trintech agents were announced in Chicago, in an article written by an AI agent

- Date: 28 September 2026. The Chicago event ran 28–30 September. The series then lists Oslo on 14 October, London on 15 October, and Stockholm on 22 October 2026.
- Source: https://www.unite.ai/trintech-unveils-three-ai-agents-for-the-financial-close/
- Who: the byline reads Vega Syn and the biography reads Vera Syn. The biography says the articles are AI-generated and reviewed by Unite.AI's editorial team. Darren Heffernan, Trintech's CEO, is quoted from the announcement. The Trintech news URL and the Data Access and Exception Management product pages linked in the article were not opened. The accruals product page in S4 was.
- What: At Trintech Connect 2026 in Chicago the company announced a Data Access Agent, an Accruals Intelligence Agent, and an Exception Management Agent, on top of earlier Flux and Variance Analysis agents. Unite says the Data Access Agent logs in the way a person does, including multi-factor authentication, for portals with no API. The Exception Management Agent attaches a confidence score and uses six steps: detect, classify, prioritize, route, resolve, document, with materiality thresholds. Heffernan: "Finance teams do not need more AI that simply tells them what to do. They need AI that does the work — in ways they trust." Speakers from American Airlines, H&R Block, and AT&T are named as event speakers.
- Number: none for a customer outcome.
- Grade: E2. A rewrite of a vendor announcement, and the rewrite says it was drafted by an AI agent.
- Flag: do not treat the airline, tax, or telecom names as measured close results. Do not treat "does the work" as posting without the Review and Approve step in S4. Oslo on the calendar is the day this note was written. That is a schedule line, not a report from the room.

## S6. Workday's Accounting Agent prepares entries, and the team stays responsible for review

- Date: 13 October 2026, Workday Rising in Las Vegas.
- Source: https://www.prnewswire.com/news-releases/workday-launches-autopilot-agents-that-get-real-work-done-across-hr-finance-and-it-302906706.html
- Who: Workday. Gerrit Kazmaier, president, product and technology, is quoted. No accounting customer is named.
- What: The Accounting Agent can extract contract details, prepare accounting entries, recommend revenue recognition and billing schedules, and remind teams of payment deadlines. The release says the agent prepares the work and accounting teams stay responsible for review, judgment, and decisions. It can also test transactions in the background. Autopilot for the Accounting Agent is planned for early-adopter customers in early calendar 2027. The same release says unreleased features may not ship. Nearly 5,000 customers activated an earlier Deployment Agent. That figure is not the accounting autopilot. More than 11,500 organisations use Workday. "Time to fill moves from weeks to days" sits in the hiring section.
- Number: early 2027 for accounting autopilot with early adopters. No close-day figure.
- Grade: E2. A vendor release, marked by Workday as forward-looking.
- Flag: the ledger in this model is AFAS, not Workday. Do not treat the hiring slogan, or the 5,000 deployment activations, as an accounting result. Holger Mueller's comment on the same page is an analyst line, not a case.

## S7. A controller's tie-out pattern was posted, and almost nobody saw it

- Date: 12 October 2026, 20:23 GMT.
- Source: https://x.com/Madeactual/status/2109741829780557947
- Who: @Madeactual. The bio says custom software, operational systems, and integrations. No employer finance team is named.
- What: "Month-end close is a good test because every step already has a tie-out. A pattern worth copying: let the model draft the accruals and reclasses, but nothing posts until a reconciliation query shows bank, AR, and AP tie with zero difference. The model drafts and the tie-out decides."
- Number: 0 likes, 0 reposts, 18 views.
- Grade: E3 as a public post. It is not evidence that controllers are running this.
- Flag: one practitioner describing a pattern, seen by 18 people. Do not treat it as a deployment.

## S8. Turing's CEO says a model that looks ready still cannot run a fund controller's close

- Date: 12 October 2026, 17:45 GMT.
- Source: https://x.com/Jonsid/status/2109702115971244090
- Who: Jonathan Siddharth, @Jonsid, founder and CEO of Turing. Turing sells training data and enterprise deployment.
- What: He argues that models are "jagged" where they meet real work. "On a benchmark, they look ready. Inside an asset management firm, asked to run a fund controller's month-end close, they aren't." He also writes that Turing post-trained an open-weight model and "lifted its score on our enterprise-work benchmark by about 10 percent, while driving real ROI for the client we built it for." No client is named. The 10% and the ROI are not defined.
- Number: about 10% on Turing's own benchmark. 53 likes, 4,031 views. No close-day figure.
- Grade: E3 as a CEO's public essay. The 10% is the vendor's undefined figure.
- Flag: Turing is selling the loop he describes. Do not treat "about 10 percent" or "real ROI" as a measured month-end result.

## S9. A CFO advisor: routine reconciliation can run, tax estimates and cash stay with a person

- Date: 25 September 2026.
- Source: https://www.techtarget.com/enterprise-software/tip/What-CFOs-need-to-know-about-AI-agent-governance-in-accounting
- Who: James Kofalt, president of DX4 Research. He names no customer. The same advice is used from the spend and policy side in the finance-director note. This item is the close gate only.
- What: He writes that some finance teams already use agents for reconciliation, invoice processing, forecasting, and closing. His recommendation is narrower: routine reconciliation and accounts payable, with people on the exceptions. Strategic purchases, tax estimates, and cash allocation should require a person to review and approve. He wants timestamped logs of the decision, the data lineage, and the reasoning. He names SOX as the compliance example. SOX is a US statute.
- Number: none.
- Grade: E3 as published advice. Not a measured close.
- Flag: no customer, no hours. Do not import a US control statute as a Dutch audit rule. The finance-director note carries the rest of his governance list.

## What this role should not treat as settled

No opened page gives days to close for a Dutch logistics ledger, or a count of accruals posted without a person. The 100% score is four simplified scenarios. The full benchmark's own page currently shows both 61.8% and 56.4%, and says 58% of tasks are never fully solved. SAP's article leaves the posting step in conflict, on a stack this team does not run. Trintech, Workday, and Unite describe a review step and do not show a customer time. The tie-out post has 18 views. The 10% gain has no client and no definition.
