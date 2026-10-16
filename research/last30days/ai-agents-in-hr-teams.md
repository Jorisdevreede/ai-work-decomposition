# AI agents in HR teams: what the last 30 days show

- **Query:** "AI agents in HR teams" (general query, no target tool)
- **Run date:** 2026-10-14. Window: 2026-09-14 to 2026-10-14.
- **Skill:** last30days v3.28.0 (engine 3.28.0, Python 3.14.5). The host wrote the query plan, with 4 subqueries: "AI agents HR" (primary), "AI recruiting agent hiring assistant", "Workday AI agents HR" and "AI replacing HR jobs". Targeted subreddits: r/humanresources, r/recruiting, r/AskHR, r/HRIS, r/AI_Agents. No X handles, because the topic is generic. The engine's raw-file save was turned off for this run, so this file is the only copy of the report.
- **Sources the engine reached:**
  - Reddit: OK, 18 threads (public keyless backend). Only threads from r/AI_Agents and r/recruiting passed the relevance filter. Nothing from r/humanresources, r/AskHR or r/HRIS did.
  - X: OK, 10 posts (xAI backend). Most posts had no engagement.
  - Hacker News: OK, 26 stories. Most are about AI and jobs in general; few are about HR.
  - YouTube: reached, no results. It found 8 videos per query, but none were published inside the window.
  - Polymarket: reached, no results (no relevant market).
- **Sources not used:**
  - TikTok, Instagram, Threads, LinkedIn and Bluesky: not configured (no ScrapeCreators key).
  - GitHub: available, but not in the plan.
  - The engine's own web fallback: replaced by host web search.
- **Host web search:**
  - Searches: 6. Three ran before the engine to set targeting and three after it as supplements.
  - Pages opened and read: 9. Workday newsroom, Workday investor release, Workday blog, Carly, iTWire, Praxikon, KHAIROS, Octagon, PR Newswire (Josh Bersin).
  - Failed: Mondaq (HTTP 500) and Metaintro (HTTP 429). aiactblog.nl redirected to Praxikon, where the page was read.
- **Not confirmed in this run:**
  - The Gartner "Emerging Market Quadrant for AI Agents in HR".
  - BNY's "Digital Employee Agency".
  - The Eagle Hill / WorldatWork 86% / 70% survey.
  - Accenture engineers working inside Workday.
  - Each of these rests on one X post. No primary page was found.
- **Engine warning:** the top evidence is concentrated in one source (X).

## Report (as produced by the skill)

🌐 last30days v3.28.0 · synced 2026-10-14

What I learned:

**Workday's agent push is about access to HR data, not a new chatbot** - At Workday Rising on 13 October, Workday made its Trusted Agent Platform "headless", per [Workday's newsroom](https://newsroom.workday.com/2026-10-13-Workdays-Trusted-Agent-Platform-Now-Delivers-Headless-Access-to-HR-and-Finance,-Letting-Customers-Build-and-Run-Lawful-AI-Agents). Outside agents can now reach Workday HR and finance data through MCP-based Agent-Ready Tools, and customers choose the model for each agent. The same day Workday announced a partnership with Anthropic so that Claude and Workday's Sana agents can pass tasks to each other, per [Workday's investor release](https://investor.workday.com/news-and-events/press-releases/news-details/2026/Workday-and-Anthropic-Announce-New-Partnership-to-Connect-Reasoning-to-the-Rules-That-Run-the-Business-Wherever-People-Choose-to-Work/default.aspx). Its examples are compensation cycles and checking open roles against headcount and budget. The "Sana in Claude" plugin is in early access. On X the news landed as a "headless mode" for external agents, per [@bitsquin](https://x.com/bitsquin/status/2110121161917092204) and [@Techstrongai](https://x.com/Techstrongai/status/2110132251815981209). Workday's CTO summed up the pitch as "Headless can't mean lawless."

**Most of the HR agents are still in early access** - Workday's own list puts Sana Concierge (HR and IT service), Sana Coach and the Talent Acquisition Agent in early access, per the [Workday blog](https://blog.workday.com/en-us/rising-product-announcements.html). It also announces "Autopilot Agents" for hiring, payroll and compliance. Carly, which sells a competing assistant, published a roundup of ship dates, per [Carly](https://www.usecarly.com/blog/workday-rising-2026/). It dates general availability of Sana Concierge to Q1 2027 and the hiring autopilot to early 2027. It also says Reworked found no customer result yet for the autopilot.

**Agents are getting an HR lifecycle of their own** - The idea that HR will hire, score and retire agents came up twice this month. [@efipm](https://x.com/efipm/status/2110023627328430485) described a new HR job at BNY: "decide whether a role goes to a human, a contractor or an AI agent". The post adds that a "Digital Employee Agency" "will onboard agents, score them and eventually offboard them." Separately, Workday is buying C1.ai (formerly ConductorOne), which governs access for people and agents, per [iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen). Bhusri's argument is that agents need access and must be managed like humans. [@HRCloud](https://x.com/HRCloud/status/2109678502232334601) stated the governance gap plainly: "AI is already in your HR stack. Either someone decided what it’s allowed to decide, or nobody did."

**The numbers come from vendors** - iTWire reports Workday as saying that more than 5,500 customers use at least one Workday-built agent. It adds that Sana leave requests save customers about 1.6 million hours a year. [@WeAreEagleHill](https://x.com/WeAreEagleHill/status/2110039397622055253) shared its research with WorldatWork: 86% of HR professionals say AI and automation help them deliver better service, yet 70% say administrative tasks still get in the way. Two more claims could not be checked. [@mycomradio](https://x.com/mycomradio/status/2108702130726936588) says Gartner published a first "Emerging Market Quadrant for AI Agents in HR" covering 15 vendors. A stock account, [@RedCandleRx](https://x.com/RedCandleRx/status/2110116102944833885), says Accenture is embedding engineers inside Workday to take agents into HR and finance. Neither claim appears in Workday's own releases or on any other page read in this run. The most-liked people-ops post was a hiring ad: Warp is hiring engineers for "Warp Agent", which "runs all of people ops for high-growth companies", per [@ayushswrites](https://x.com/ayushswrites/status/2106062440127742213). Promotional posts such as "Lyzr’s HR Agents automate it all" drew no engagement, per [@TheDigitalEcos](https://x.com/TheDigitalEcos/status/2109459915844526157). Even in r/AI_Agents people are tired of the sales tone: "I just wanna hear from down to earth people not ppl selling stuff or trying to prove something," per [u/softmax_couldnt_care](https://reddit.com/r/AI_Agents/comments/1x2fc3u/comment/pf2y11n/).

**Recruiters use agents, but not on live LinkedIn** - In [r/recruiting](https://www.reddit.com/r/recruiting/comments/1wwjfzl/anyone_using_claude_in_chrome_or_similar_ai/), a recruiter asked about running Claude in Chrome on LinkedIn Recruiter. The top reply was "I have zero desire to get my LI account shut down. Hard pass," per [u/sread2018](https://reddit.com/r/recruiting/comments/1wwjfzl/comment/pdlyotl/). [u/Mojowhale](https://reddit.com/r/recruiting/comments/1wwjfzl/comment/pdyuu8z/) suggested a boundary: "the export step is probably the right boundary. let the agent rank and explain matches from a static dataset, but keep LinkedIn access and any outreach human-controlled". One recruiter who tried it for a few weeks said "it was pretty slow" and "still just not as efficient as doing it yourself," per [u/Key_Masterpiece9560](https://reddit.com/r/recruiting/comments/1wwjfzl/comment/pdlti0s/). A separate r/recruiting thread asked which [AI recruiting companies](https://www.reddit.com/r/recruiting/comments/1x5it0m/ai_recruiting_companies/) people use.

**Candidates and staff push back** - On Hacker News the post ["I Hate Workday"](https://nelson.cloud/i-hate-workday/) drew replies such as "I simply don't apply to companies that use Workday for recruitment," per [dingdong2026](https://news.ycombinator.com/item?id=49761555). The most-liked HR-agent joke of the month asked for "An AI agent that can sit through and complete ethics, sexual harassment, cybersecurity and any other required corporate HR training modules," per [@RampCapitalLLC](https://x.com/RampCapitalLLC/status/2105738137783648516). A Business Insider story discussed on [Hacker News](https://news.ycombinator.com/item?id=50033517), "My personal AI agent posted my bank details on company Slack", shows what can happen when staff bring their own agents to work.

**In the EU, the works council comes before the agent** - A Dutch explainer from July makes three points, per [Praxikon](https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace):
- Works council consent under art. 27(1) sub k and l WOR applies to CV screening, AI-assisted appraisal, productivity dashboards, monitoring and algorithmic shift scheduling, whatever the employer intends. If the employer skips consent, the council can claim nullity within a month.
- AI Act Art. 26(7) requires employers to inform workers before they use a high-risk system.
- The Annex III employment duties start on 2 December 2027 under Regulation (EU) 2026/1744.

Other HR guides from this year still give 2 August 2026, per [KHAIROS](https://www.khairos.ai/blog/comply/eu-ai-act-for-hr-managers-2026-guide) and [Octagon](https://octagonpeople.com/insights/eu-ai-act-hr-recruitment). HR teams are reading conflicting dates.

KEY PATTERNS from the research:
1. The HR system is becoming the gatekeeper for agents. HR data, permissions and audit sit with the HRIS vendor, and outside agents plug in - per [Workday's newsroom](https://newsroom.workday.com/2026-10-13-Workdays-Trusted-Agent-Platform-Now-Delivers-Headless-Access-to-HR-and-Finance,-Letting-Customers-Build-and-Run-Lawful-AI-Agents)
2. HR is starting to manage agents like staff: decide whether work goes to a human, a contractor or an agent, then onboard, score and offboard the agent - per [@efipm](https://x.com/efipm/status/2110023627328430485)
3. Recruiters keep agents on exported data and keep outreach human, mainly to protect their LinkedIn accounts - per [r/recruiting](https://www.reddit.com/r/recruiting/comments/1wwjfzl/anyone_using_claude_in_chrome_or_similar_ai/)
4. Vendor and analyst claims run ahead of customer evidence. This run found no named employer that reported results from HR agents - per [Carly](https://www.usecarly.com/blog/workday-rising-2026/)
5. In the EU, consent and information duties apply before deployment, and the AI Act dates are being misquoted - per [Praxikon](https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace)

---
✅ All agents reported back!
├─ 🟠 Reddit: 18 threads │ 405 upvotes │ 505 comments
├─ 🔵 X: 10 posts │ 777 likes │ 38 reposts
├─ 🟡 HN: 26 stories │ 2,815 points │ 1,586 comments
└─ 🗣️ Top voices: @TheDigitalEcos, @efipm, @WeAreEagleHill │ r/AI_Agents, r/recruiting
---

I'm now an expert on AI agents in HR teams. Some things I can help with:
- Sort Noordhaven's HR tasks into those that would run on HRIS-provided agent tools (as in Workday's Agent-Ready Tools) and those that need an agent of their own
- Draft the works council consent request for a CV-screening or HR service-desk agent, based on the WOR art. 27 points
- Work out what an HR process to onboard, score and offboard agents would look like, starting from the BNY "Digital Employee Agency" idea

I have all the links to the 18 Reddit threads, 10 X posts, 26 Hacker News stories, and 8 web pages I pulled from. Just ask.

## For the reimagine model

The bullets below cover what HR teams and their vendors are doing with agents now. Grades follow AGENTS.md: E1 is model knowledge or an unverified claim, E2 means a named product does this today, and E3 means a documented case with a source. "Vendor marketing" marks a source that sells what it describes.

- **Agents reach HR data through the HRIS (E2, vendor marketing).**
  - On 13 Oct 2026 Workday made its Trusted Agent Platform headless.
  - Agent Harness, Agent-Ready Tools (MCP), Custom Agents and Developer Agent are generally available. Customers choose the model for each agent: Claude, Gemini, Llama, Mistral, GPT or Nemotron.
  - Claude and Sana agents swap tasks such as compensation cycles and checks of open roles against headcount and budget. "Sana in Claude" is in early access, with general availability expected late 2026.
  - For the model: for a small HR team, the likely build path is to configure agents on the HRIS's own tools, not to build data access from scratch.
  - Sources: [Workday newsroom](https://newsroom.workday.com/2026-10-13-Workdays-Trusted-Agent-Platform-Now-Delivers-Headless-Access-to-HR-and-Finance,-Letting-Customers-Build-and-Run-Lawful-AI-Agents), [Workday investor release](https://investor.workday.com/news-and-events/press-releases/news-details/2026/Workday-and-Anthropic-Announce-New-Partnership-to-Connect-Reasoning-to-the-Rules-That-Run-the-Business-Wherever-People-Choose-to-Work/default.aspx).
- **Named HR agents exist, mostly in early access (E2 as announced, not generally available; vendor marketing).**
  - Sana Concierge (HR and IT service desk), Sana Coach and the Talent Acquisition Agent are in early access.
  - Autopilot Agents for hiring, payroll and compliance are announced.
  - Carly, a competing vendor, says Concierge reaches general availability in Q1 2027 and the hiring and payroll autopilots in early 2027.
  - Sources: [Workday blog](https://blog.workday.com/en-us/rising-product-announcements.html), [Carly](https://www.usecarly.com/blog/workday-rising-2026/).
- **Adoption numbers come only from vendors (E2; vendor-stated, not independently measured).**
  - More than 5,500 Workday customers use at least one Workday-built agent.
  - Sana leave requests save customers "about 1.6 million hours a year".
  - Nearly 5,000 customers switched on the Deployment Agent.
  - Per Carly, Reworked found no customer result for the autopilot.
  - This run turned up no named employer with results from HR agents, so nothing here reaches E3.
  - Sources: [iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen), [Carly](https://www.usecarly.com/blog/workday-rising-2026/).
- **Agents get identities and an HR lifecycle (C1.ai: E2. BNY: E1, unverified).**
  - Workday has signed to buy C1.ai (formerly ConductorOne), which governs access for people and agents. The deal is expected to close by 31 Jan 2027.
  - One X post says BNY created an HR role that decides whether a role goes to a human, a contractor or an agent, and a "Digital Employee Agency" that onboards, scores and offboards agents. No primary source was found.
  - For the model: onboarding, access and offboarding of agents is a new HR task worth adding to the HR role cards.
  - Sources: [iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen), [@efipm](https://x.com/efipm/status/2110023627328430485).
- **Recruiters keep agents off live LinkedIn (E3; anecdotal, one small thread).**
  - Recruiters tried Claude in Chrome on LinkedIn Recruiter.
  - Replies warn that "LinkedIn doesn’t play, will restrict your account and still require you to pay your contract".
  - One recruiter found it "pretty slow".
  - The suggested pattern: export to CSV, let the agent rank and explain matches, and keep outreach human.
  - For the model: sourcing is an AI step on exported data, and outreach stays a human task.
  - Sources: [r/recruiting thread](https://www.reddit.com/r/recruiting/comments/1wwjfzl/anyone_using_claude_in_chrome_or_similar_ai/), [u/MoistMustachePhD](https://reddit.com/r/recruiting/comments/1wwjfzl/comment/pdmjkvv/), [u/Mojowhale](https://reddit.com/r/recruiting/comments/1wwjfzl/comment/pdyuu8z/).
- **Candidates and staff push back (E3, anecdotal).**
  - Some Hacker News readers say they skip employers that recruit through Workday: "I simply don't apply to companies that use Workday for recruitment". This is about the application flow, not about agents as such.
  - A widely liked post jokes about an agent that sits mandatory HR training for you.
  - A Business Insider story reports that a personal AI agent posted an employee's bank details on company Slack. Only the headline and the Hacker News discussion were seen; the article was not opened. HR needs a policy for agents that employees bring themselves.
  - Sources: ["I Hate Workday"](https://nelson.cloud/i-hate-workday/), [HN reply](https://news.ycombinator.com/item?id=49761555), [@RampCapitalLLC](https://x.com/RampCapitalLLC/status/2105738137783648516), [HN discussion of the BI story](https://news.ycombinator.com/item?id=50033517).
- **Dutch works council consent comes first (E3; sourced explainer, July 2026, older than the window; the author sells advisory services).**
  - Consent is required under art. 27(1) sub k WOR (employee personal data) and sub l (systems "aimed at or capable of" monitoring).
  - It covers CV screening and ranking, AI-assisted appraisal and promotion, productivity dashboards, monitoring of email or calls, and algorithmic shift scheduling.
  - A generic assistant is a grey zone, unless prompts are logged per employee.
  - Without consent, the works council can invoke nullity within one month (art. 27(5)).
  - For Noordhaven: every HR agent that touches personal data needs a works council track in the plan.
  - Source: [Praxikon](https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace).
- **The EU AI Act dates are confused (E3 for what the source states; the date was not checked on EUR-Lex).**
  - Praxikon puts the Annex III employment duties at 2 Dec 2027 under Regulation (EU) 2026/1744.
  - Art. 26(7) requires employers to inform workers and their representatives before they use a high-risk system.
  - Art. 50 transparency duties have applied since 2 Aug 2026, and Art. 4 AI literacy since 2 Feb 2025.
  - Two HR guides from April and June 2026 still give 2 Aug 2026.
  - Treat the date as unconfirmed until it is checked against the Official Journal.
  - Sources: [Praxikon](https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace), [KHAIROS](https://www.khairos.ai/blog/comply/eu-ai-act-for-hr-managers-2026-guide), [Octagon](https://octagonpeople.com/insights/eu-ai-act-hr-recruitment).
- **Market and survey claims to treat as unverified (E1; vendor marketing or hype).**
  - Gartner "Emerging Market Quadrant for AI Agents in HR" with 15 vendors: one X post, and no Gartner page was found.
  - Eagle Hill / WorldatWork: 86% of HR professionals say AI and automation help them deliver better service, and 70% say admin work still gets in the way. This comes from the consultancy's own post; the survey was not opened.
  - Lyzr says its HR agents "automate it all": a promotional post with no engagement.
  - Warp says "Warp Agent" "runs all of people ops for high-growth companies": a vendor claim inside a hiring post.
  - Accenture engineers inside Workday: from a stock account, and not in Workday's releases.
  - Sources: [@mycomradio](https://x.com/mycomradio/status/2108702130726936588), [@WeAreEagleHill](https://x.com/WeAreEagleHill/status/2110039397622055253), [@TheDigitalEcos](https://x.com/TheDigitalEcos/status/2109459915844526157), [@ayushswrites](https://x.com/ayushswrites/status/2106062440127742213), [@RedCandleRx](https://x.com/RedCandleRx/status/2110116102944833885).
- **Headcount forecast, flagged as hype (E1; a forecast from January 2026, outside the window).**
  - The Josh Bersin Company says "core HR headcount could fall by 30% or more" and "agents and superagents will eliminate up to 30% of traditional HR roles".
  - It then says the figure "is better understood as a shift in role count".
  - The release names no employer and promotes the firm's own product (Galileo).
  - Use it as an upper-bound scenario, not a baseline.
  - Source: [PR Newswire](https://www.prnewswire.com/news-releases/in-2026-ai-powered-superagents-will-radically-change-hr-driving-the-largest-hr-transformation-in-decades-302666677.html).
