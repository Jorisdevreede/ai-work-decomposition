# Frameworks and thinkers for the reimagine model

SCHOLAR, 2026-10-14. Input to experiment E3 and to the next version of `method/model-v0.md`.

Each entry gives the core idea, **what it changes in our model** (the rung, lens or question it adds,
sharpens or kills), and the sources opened in this run. Quotes are verbatim from the opened page.
Grades follow `AGENTS.md`. A framework is a lens, not evidence: the grade says how well its central claim
is supported, and E1 means "from model knowledge, not checked here". Where a page was gated, it says so.

## What this changes in model-v0, in one table

| # | Change | Rung | From |
|---|---|---|---|
| 1 | Add an **obliterate check** before choosing a pattern: should this task exist after redesign? New pattern `eliminate`. | 2–3 | Hammer, Choudary, Bersin |
| 2 | Add a **frontier probe**: would an AI error be confident and hard to spot? If yes, lower confidence and cap autonomy. | 2 | Mollick et al. |
| 3 | Add **worker desire** per task (Human Agency Scale H1–H5) to the self-service intake; treat "capable but not wanted" as red light. | 0, 3 | Shao et al. (Stanford) |
| 4 | Join two **task-level facts** on O*NET: exposure labels (Eloundou) and observed AI use, automation versus augmentation (Anthropic Economic Index). | 1 | Eloundou et al., Anthropic |
| 5 | Add **task length and interface** (API or screen) as a probe; screen work in an ERP sits in a far shorter agent horizon. | 2 | METR |
| 6 | Add a **legal gate** that sets a ceiling on autonomy per task (Annex III, Art. 5, GDPR 22, WOR 27). | 3 | EU AI Act, GDPR, WOR |
| 7 | Order patterns by **simplest first**: deterministic, then a workflow with one model call, then an agent only when steps cannot be predicted. | 3 | Anthropic, Agrawal et al. |
| 8 | Label each opportunity **point, application or system**; system solutions get more value and a longer time to value. | 6 | Agrawal, Gans, Goldfarb |
| 9 | The **ambitious lens** must answer: is demand elastic, and who captures the extra demand? It decides between "same team, more ambitious" and "smaller team". | 4, 6 | Jevons, Choudary, Autor |
| 10 | Put **Theory of Constraints next to Amdahl**: find the constraint step per value stream; hours freed elsewhere are not throughput. | 6 | Goldratt |
| 11 | **Hours freed is not the headline.** Rank on value lines plus new capability; drop small per-task gains (so-so automation). | 6 | Brynjolfsson, Acemoglu |
| 12 | Subtract **review time and adoption** from hours freed; calibrate speedups to field studies (whole-workforce savings of 3–7%, trials of 14–34%). | 5, 6 | Mollick, Humlum and Vestergaard, Brynjolfsson et al. |
| 13 | Add **expertise of what remains** to the role card: does the job get more or less expert? | 6 | Autor |
| 14 | Treat pods as **stream-aligned teams**; cap the reach lens by cognitive load; the agent layer is a platform team. | 6 | Team Topologies |
| 15 | Frame opportunities as **needs, not solutions**, and compare at least three solution patterns before choosing; assumption tests set the confidence term. | 6–7 | Torres |
| 16 | Type each team's **North Star inputs** (breadth, depth, frequency, efficiency) and check they are hard to game. | 7 | Amplitude |
| 17 | Use **noise** as a value line for judgement tasks (hiring, appraisal): structure and aggregation reduce variance even where AI does not decide. | 2, 6 | Kahneman, Sibony, Sunstein |
| 18 | Add **authority** (read only … post, pay) next to autonomy; scale the approval gate to both. | 3 | WEF AI Agents in Action |
| 19 | Every hour freed needs a **named destination** before the pilot; count savings only after a quarter in production. Correction: the opened Tenex pages do not state our hours × % × cost formula; keep it as ours. | 6 | Tenex, BCG AI at Work 2026 |

A naming clash to fix first: Eloundou's exposure labels are also called E0/E1/E2. In our files, call them **X0/X1/X2** so they never mix with evidence grades.

---

## 1. How AI meets a task (rungs 1 to 3)

### 1.1 The jagged frontier; centaurs and cyborgs (Dell'Acqua, Mollick et al., 2023)

**Core idea.** AI's abilities are uneven: two tasks that look equally hard can fall on either side of the frontier. In a trial with 758 BCG consultants, those using GPT-4 inside the frontier completed 12.2% more tasks, 25.1% faster, with over 40% higher quality. Below-average performers gained 43%, above-average 17%. On a task outside the frontier, "consultants using AI were 19 percentage points less likely to produce correct solutions compared to those without AI." Two working styles succeeded. Centaurs divide the work: they keep some steps and hand others to the AI. Cyborgs weave the AI through the whole task flow.

**What it changes.**
- Rung 2: add a **frontier probe**: "would an AI error here look confident and be hard to detect?" A yes lowers confidence and caps autonomy at 2–3. Payroll gross-to-net and legal advice qualify; drafting a job ad does not.
- Rung 3: split `copilot` into two modes. **Centaur**: the person keeps named steps. **Cyborg**: AI is used throughout. The "in practice" flow should say which.
- Rung 6: the gain is larger for weaker performers. Role cards should show a range, not one speedup.

**Sources.** https://www.oneusefulthing.org/p/centaurs-and-cyborgs-on-the-jagged (16 Sep 2023); https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf (HBS working paper 24-013). E3.

### 1.2 GPTs are GPTs: task exposure on O*NET (Eloundou, Manning, Mishkin, Rock, 2023)

**Core idea.** Each O*NET task and detailed work activity gets an exposure label. E1 means an LLM alone "can decrease the time required to complete the DWA or task by at least half (50%)". E2 means "additional software could be developed on top of the LLM" to reach that. "Around 80% of the U.S. workforce could have at least 10% of their work tasks affected." About 15% of tasks would get much faster with an LLM alone. With software built on top, that rises to 47–56%.

**What it changes.**
- Rung 1: their labels are a ready **deterministic fact per O*NET task**. Join them, renamed X0/X1/X2.
- Rung 2: their threshold is concrete: **halve the time at a quality the recipient "would not notice or care about"**. Use it to define "automate" and "amplify" in our probes, not a vague "AI can do most".
- Rung 3: the split between "LLM alone" and "LLM plus software" is roughly our `copilot` versus `llm_step`/`agent_with_gate`.

**Sources.** https://arxiv.org/abs/2303.10130 ; https://arxiv.org/pdf/2303.10130v5. The Science version returned 403. E3.

### 1.3 Anthropic Economic Index: what people actually use AI for (2025–2026)

**Core idea.** Claude conversations are mapped to O*NET tasks and classified as automation (directive, feedback loop) or augmentation (task iteration, learning, validation).
- **September 2025:** automation passed augmentation for the first time on Claude.ai. On the API, 77% of transcripts show automation.
- **January 2026:** augmentation rose again to 52% on Claude.ai. The report adds "economic primitives": task success, autonomy, and time with and without AI. Tasks needing a college degree "attain a 12x speedup". Claude.ai success was 67% against 49% on the API.
- **March 2026, "observed exposure":** this measure weights automated use fully and augmented use at half. It averages over a job's tasks by time share. That is almost our role roll-up.

**What it changes.**
- Rung 1: **observed use per O*NET task** is a second fact next to exposure. A task people already hand to AI is stronger evidence than a model's opinion (closer to E2).
- Rung 6: use observed exposure as a **cross-check on the role roll-up**. Use the measured speedup and success rates as priors for `speedup_i`, discounted for success.

**Sources.**
- https://www.anthropic.com/news/the-anthropic-economic-index (10 Feb 2025)
- https://www.anthropic.com/research/anthropic-economic-index-september-2025-report
- https://www.anthropic.com/research/anthropic-economic-index-january-2026-report
- https://www.anthropic.com/research/economic-index-march-2026-report
- https://www.anthropic.com/research/labor-market-impacts (5 Mar 2026)
- https://huggingface.co/datasets/Anthropic/EconomicIndex/blob/main/README.md

E3. A vendor measuring use of its own model; method published.

### 1.4 The Human Agency Scale and WORKBank (Shao et al., Stanford, 2025)

**Core idea.** 1,500 workers in 104 occupations rated how much they want AI agents to do each of 844 O*NET tasks. 52 AI experts rated what agents can do.
- **The scale:** from H1 "AI agent handles the task entirely on its own" to H5 "cannot function without continuous human involvement". H3, an equal partnership, was the most wanted level in 47 of 104 occupations.
- **The zones:** crossing desire with capability gives four. Green light: wanted and capable. Red light: capable but not wanted. R&D opportunity: wanted but not yet capable. Low priority: neither.
- **Workers versus startups:** workers were positive about automating 46.1% of tasks. "41.0% of YC companies are mapped to Low Priority and Automation 'Red Light' Zone."

**What it changes.**
- Rung 0: our intake asks what people do and what drains them. Add **one question per task: how much should AI do this? (H1–H5)**. It costs one slider and gives a desire score per task and per person.
- Rung 3: our autonomy level is a capability claim. HAS is a preference. **Show both**, and flag red-light tasks rather than leading with them.
- Rung 7: personal advice should start in the green-light zone. That is where adoption will happen.

**Sources.** https://arxiv.org/abs/2506.06576 ; https://arxiv.org/html/2506.06576v3. E3.

### 1.5 Time horizons (METR, 2025–2026)

**Core idea.** Agent capability is measured as the length of task, in expert human time, that an agent completes with 50% success.
- **Growth:** horizons doubled about every seven months from 2019, faster since 2024. By May 2026 the public frontier was about 12 hours, with a wide interval.
- **By domain:** visual computer use (working through screens) has horizons "40-100x shorter than the software and reasoning cluster".
- **Caveat:** 50% success is a research measure, not an operating standard.

**What it changes.**
- Rung 2: add **task length per instance** and **interface**: API or file versus clicking through an ERP or HRIS screen. Most single back-office instances (one invoice, one payslip query) are short. If the agent must work through AFAS screens rather than its REST connectors, it falls in the weaker band.
- Rung 3: autonomy 4–5 needs a reliability far above 50%. Back-office agents need **deterministic checks** around the model (tie-outs, validations), not just a better model.

**Sources.**
- https://arxiv.org/abs/2503.14499
- https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/
- https://metr.org/blog/2026-1-29-time-horizon-1-1/
- https://metr.org/blog/2026-05-19-frontier-risk-report/
- https://metr.org/blog/2025-07-14-how-does-time-horizon-vary-across-domains

E3.

### 1.6 Deconstructing work: Reinventing Jobs and Work Without Jobs (Jesuthasan and Boudreau, 2018, 2022)

**Core idea.** Start with the work, not the job or the technology. Break jobs into tasks and place each task on three continua: repetitive–variable, independent–interactive, physical–mental. "Tasks that are closer to the 'repetitive' … end of the scale are more automatable". Then ask what better performance on the task is worth; their "return on improved performance" has four shapes:
- fewer errors;
- less variance;
- incremental improvement;
- exponential improvement.

Then decide whether human work is substituted, augmented or transformed, and recombine what is left into new roles. *Work Without Jobs* extends this to a "work operating system" in which tasks flow to people by skill.

**What it changes.**
- Rung 2: our class probes are close to their continua. Add the **return-on-improved-performance type** per task, because it decides the value line:
  - Payroll: fewer errors.
  - Forecasting: less variance.
  - Recruiting strategy: exponential.
- Rung 3: "transform" is our **altitude** lens. Recombining tasks is our **reach** lens and the pods option.

**Sources.**
- https://www.infoq.com/articles/book-review-reinventing-jobs (2019, authors' answers)
- https://www.shrm.org/topics-tools/news/technology/how-automation-will-affect-workforce (HBR reprint, 2018)
- https://www.penguinrandomhouse.com/books/691665/work-without-jobs-by-ravin-jesuthasan-and-john-w-boudreau/9780262368230 (publisher page)
- https://sloanreview.mit.edu/article/want-ai-driven-productivity-redesign-work/ (2025, partly paywalled)
- https://www.mercer.com/en-om/insights/talent-and-transformation/skill-based-talent-management/how-will-agentic-ai-challenge-and-change-your-business/ (Mercer, undated). This one recommends that you "embed checkpoints to validate AI outputs within workflows".

E1 for the method's effect: it is a design method, not a measured result.

### 1.7 Don't automate, obliterate (Hammer, HBR, 1990)

**Core idea.** "It is time to stop paving the cow paths." Using IT to speed up an old process wastes it. Redesign around outcomes, and drop work that should not exist. The principles include:
- Organise around outcomes, not tasks.
- Put the decision point where the work is done.
- Capture information once and at the source.

Ford's accounts payable had 500+ people against Mazda's 5. With "invoiceless processing" (matching 3 items instead of 14), Ford reached "a 75% reduction in head count".

**What it changes.**
- Rung 2–3: add the **obliterate check** before any pattern: "if we redesigned this flow, would this task exist?" Add a pattern `eliminate`. Rule:
  - re-keying an invoice that will arrive as a Peppol UBL file is not an `llm_step`;
  - it disappears.
- Rung 6: the procure-to-pay pod has a 35-year-old precedent. **Capture once at source** points at e-invoicing and at self-service data entry by employees.

**Source.** https://folk.idi.ntnu.no/thomasos/paper/hammer_reengineering.pdf. Full HBR reprint on a university staff page, not HBR itself. E3 for the Ford case as reported by Hammer.

### 1.8 Workflows versus agents (Anthropic, "Building effective agents", Dec 2024). Not on our list; should be.

**Core idea.** The paper separates two kinds of system:
- "Workflows are systems where LLMs and tools are orchestrated through predefined code paths."
- "Agents … are systems where LLMs dynamically direct their own processes and tool usage". They suit "open-ended problems where it's difficult or impossible to predict the required number of steps". They can "pause for human feedback at checkpoints". Stopping conditions keep control.

The advice: "we recommend finding the simplest solution possible, and only increasing complexity when needed."

**What it changes.** Rung 3: this is the missing **ordering rule** for our patterns. Try them in order and stop at the first that works:

1. `deterministic_software`
2. `llm_step`, a workflow with one model call
3. a workflow of several calls (routing, prompt chaining, evaluator-optimizer)
4. `agent_with_gate`

Much of what the model answers call "agent" for HR and Finance is a workflow. The page itself notes much of its tooling has changed since 2024.

**Source.** https://www.anthropic.com/engineering/building-effective-agents. E2 as practitioner guidance.

### 1.9 Noise (Kahneman, Sibony, Sunstein, 2021). Not on our list; should be.

**Core idea.** "Noise is the major source of variability in judgment". It is unwanted variation between experts judging the same case, or within one expert over time. Executives expected about 10% variation in expert judgements; the actual figure is often "four to five times that". In one insurer's underwriting, the median difference between two experts pricing the same policy was 55%. Two other figures:
- "The probability that two interviewers will produce similar ratings after meeting the same job candidate" is 62 to 65%.
- 70 to 80% of the variance in performance appraisals is attributed to noise.

The remedies are decision hygiene: structure, sequencing information, and aggregating independent judgements.

**What it changes.**
- Rung 2 and 6: for judgement tasks that stay human (interviews, appraisal, calibration, pay decisions), **reducing noise is a value line of its own**. A copilot that structures the judgement and aggregates independent ratings has value even when it decides nothing.
- This fits the legal gate. In hiring and appraisal, AI may structure but not decide.

**Source.** https://www.strategy-business.com/article/How-noisy-is-your-company (strategy+business, 19 May 2021, an article on the book). E3 for the figures as reported; the book itself was not opened.

---

## 2. Where the value is (rung 4 lenses, rung 6 value)

### 2.1 The Turing Trap (Brynjolfsson, Dædalus, 2022)

**Core idea.** AI built to imitate people replaces labour, concentrates gains and weakens workers' bargaining power. "Automating labor ultimately unlocks less value than augmenting it to create something new." Task-by-task substitution is chosen because it "creates easy A-B tests". The incentives tilt the same way.

**What it changes.**
- Rung 6: **kill "hours freed" as the single ranking**. An opportunity that creates something new (forecasts every week instead of every quarter; coaching for every manager) needs a value line of its own.
- Rung 4: the amplify and ambitious lenses must be able to outrank automate.

**Sources.** https://arxiv.org/pdf/2201.04200 ; https://www.amacad.org/publication/daedalus/turing-trap-promise-peril-human-artificial-intelligence. E1 as an argument; the data points in it are E3.

### 2.2 Power and Prediction: point, application and system solutions (Agrawal, Gans, Goldfarb, 2022)

**Core idea.** AI is cheap prediction, and it separates prediction from judgement. Three kinds of solution:
- **Point solutions** "improve on an existing procedure and can be adopted independently".
- **Application solutions** enable a new procedure while the system stays the same.
- **System solutions** need "changes in other, related activities in order to realize the full benefits".

The big gains need system change, and that is slow. We are in "the Between Times", as with electricity, when redesigning factories took decades. "There's no such thing as a machine decision."

**What it changes.**
- Rung 6: label every opportunity **point, application or system**:
  - Most single-task answers from the model fleet are point solutions.
  - Clusters that move a decision to another role, or remove a handoff, are system solutions. Give them more value and a longer time to value in the priority formula.
- Rung 4: for each task, "in practice" should say **who holds the judgement** after the change. That is where the redesign is.

**Sources.**
- https://www.iese.edu/insight/articles/artificial-intelligence-between-promise-and-adoption-joshua-gans (Gans interview, 2023)
- https://srinstitute.utoronto.ca/news/power-and-prediction-avi-goldfarb-on-the-disruptive-economics-of-ai (Goldfarb interview)
- https://thedocs.worldbank.org/en/doc/8e4c5a79dfa409f331a1a09845b3e691-0070012022/related/Power-and-Prediction-Avi-Goldfarb.pdf (slides)
- HBR article paywalled.

E1 as a framework.

### 2.3 Reshuffle: AI as coordination (Choudary, 2025)

**Core idea.** "Automation affects tasks. Coordination reshapes entire workflows, organizations, and economies." AI changes the architecture in which tasks made sense, so a task can lose its value while still being done well. "Improving a process that AI will soon eliminate is a misallocation of resources." For agents, the payoff is in "the quality of the governance systems that orchestrate many agents". On Jevons: it "does not explain who captures the expanded demand."

**What it changes.**
- Rung 2: supports the obliterate check.
- Rung 4: coordination tasks are where agents add most value:
  - chasing approvals;
  - status updates;
  - handoffs between HR, payroll and finance.

  Tag them with the lean waste "transport/handoffs".
- Rung 6: a value-capture question per opportunity: does the gain stay with Noordhaven, go to the vendor, or go to the customer?

**Sources.**
- https://platforms.substack.com/p/reshuffle-my-next-book-is-now-available (16 Mar 2025)
- https://platforms.substack.com/p/the-many-fallacies-of-ai-wont-take
- https://platforms.substack.com/p/the-problem-with-agentic-ai-in-2025
- https://platforms.substack.com/p/the-jevons-misunderstanding (7 Jun 2026)
- The book itself was not opened.

E1 as a framework.

### 2.4 Jevons: cheaper work, more demand, sometimes

**Core idea.** When work gets cheaper and demand is elastic, total demand can rise. Radiology is the standard case:
- A record 1,208 US residency positions in 2025.
- Average pay up more than 48% since 2015.
- Only about a third of the job is reading images.
- Digital imaging at Vancouver General raised CT productivity 98% without layoffs.

The effect is conditional. Bessen: manufacturing employment rose with productivity for a century, then fell as markets saturated. Where AI substitutes for people, employment of 22–25-year-olds in exposed jobs "now stands 19% below" trend (Brynjolfsson et al., August 2026 revision).

**What it changes.** Rung 4 and 6: the **ambitious lens needs an elasticity probe**. If this task cost a tenth, would Noordhaven want much more of it?
- **Elastic:** forecasting scenarios, manager coaching, learning content, analytics. These lead to "same team, more ambitious".
- **Inelastic:** payroll runs, invoices, payslips. These lead to "smaller team, same output".
- **Juniors:** flag the early-career effect, because the bookkeeper and HR admin roles are entry roles.

**Sources.**
- https://www.worksinprogress.news/p/why-ai-isnt-replacing-radiologists (25 Sep 2025)
- https://joshuagans.substack.com/p/radiologists-are-the-canaries-in
- https://sites.bu.edu/tpri/2018/03/06/automation-and-jobs-when-technology-boosts-employment
- https://fortune.com/2026/04/28/will-ai-kill-jobs-why-not-jevons-paradox-torsten-slok/
- https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/

E3 for radiology and the canaries figures.

### 2.5 So-so automation (Acemoglu and Restrepo, 2019; Acemoglu, 2024)

**Core idea.** The real threat is "'so-so technologies' that generate small productivity improvements" while displacing people. The example is automated customer service. Exposure is not profitability. Of about 20% of US tasks exposed, only 23% are profitably automatable, which gives "0.23 × 0.200 = 4.6% of all tasks". The total factor productivity gain is "no more than 0.66%" over ten years.

**What it changes.** Rung 6: exposure and hours are not a business case.
- Every opportunity needs **build and run cost** set against the saving.
- Opportunities with a small gain per task should drop out, however many hours they touch.
- An employee chatbot that answers badly is the local example of so-so automation.

**Sources.**
- https://conference.nber.org/confer/2019/YSAIf19/Automation%20and%20New%20Tasks.pdf
- https://www.nber.org/papers/w32487
- https://economics.mit.edu/sites/default/files/2024-05/The%20Simple%20Macroeconomics%20of%20AI.pdf

E3 for the method; the macro estimate is contested.

### 2.6 Expertise (Autor, 2024; Autor and Thompson, 2025)

**Core idea.** What happens to a job depends on whether the tasks that remain need more or less expertise. "Automation that decreases expertise requirements reduces wages but permits the entry of less expert workers." Two cases, 1980–2018:
- **Bookkeepers and accounting clerks:** employment fell by a third while real wages rose nearly 40%.
- **Inventory clerks:** employment more than doubled while wages fell 13%.

AI could also "extend the relevance, reach, and value of human expertise" to people without elite training.

**What it changes.**
- Rung 6: add **expertise of what remains** to the role card. After AI takes the routine part of the bookkeeper's job, does the role need more judgement (fewer people, higher grade) or less?
- Rung 4: the reach lens has evidence behind it. AI can let a less specialised person take on expert tasks.

**Sources.**
- https://www.nber.org/papers/w32140
- https://econpapers.repec.org/RePEc:oup:jeurec:v:23:y:2025:i:4:p:1203-1271
- https://mitsloan.mit.edu/ideas-made-to-matter/a-new-look-how-automation-changes-value-labor

E3.

### 2.7 The superworker (Bersin, 2025–2026)

**Core idea.** A superworker is "an individual who uses AI to dramatically enhance their productivity, performance, and creativity". The work is "redesigning jobs, and business processes around AI". He describes four stages: the same job with tools, automated tasks, integrated processes, and people managing digital workers. His redesign questions per task are:
- Should it be done at all?
- Is it routine?
- How hard is the AI to build?
- What new value must people learn?

On HR he claims "30-40% of existing HR 'jobs' can be automated with relatively low effort". He says the ratio of employees to HR staff could move from about 100:1 to 200–400:1, and names a new role, "AI Orchestration". He also says "Some agents (e.g., scheduling) may operate autonomously while others (e.g., pay or rewards) may require human oversight."

**What it changes.**
- Rung 7: the personal advice is a superworker plan.
- Rung 6: add an "AI orchestration" task to the HR role cards: onboarding, access and offboarding of agents. Workday's purchase of C1.ai to govern what agents can access points the same way (`research/last30days/ai-agents-in-hr-teams.md`).
- His autonomy split matches our legal gate.
- **Do not use his 30–40% as a baseline.** It comes from his own product data and he sells an HR agent (Galileo).

**Sources.**
- https://joshbersin.com/2025/01/the-rise-of-the-superworker/
- https://joshbersin.com/2025/03/job-redesign-around-ai-work-intelligence-tools-arrive/
- https://joshbersin.com/2026/01/the-great-reinvention-of-human-resources-has-begun/
- https://info.joshbersin.com/hubfs/HR%2026_06%20HR%202030-The%20Agentic%20HR%20Vision%20Executive%20Summary.pdf (licensed summary)
- The full HR 2030 blueprint is gated.

E1 for the headcount claims.

### 2.8 The cybernetic teammate and managing agents (Dell'Acqua, Mollick et al., 2025; Mollick, 2026)

**Core idea.** In a field experiment with 776 P&G professionals, one person with AI matched a two-person team without it. Quality rose 0.37 SD, against 0.24 for the team without AI. Teams with AI were about three times as likely to produce a top-10% solution. "The distinction between specialists virtually disappeared in AI-aided conditions", and positive emotions rose.

Mollick's 2026 posts treat working with agents as management. Whether to delegate depends on:
- the human baseline time;
- the probability of success;
- the AI process time ("request, wait for, and evaluate").

Agents should call a person for approval, expertise, variance or interest. "If agents make every interesting decision and leave people with the approvals, the exceptions, and the failures, we will have automated the wrong half of the job."

**What it changes.**
- Rung 6: evidence for the **smaller-team and pod options**: one person plus AI can cover a pair.
- Reach lens: AI blurs functional lines.
- Rung 4 "faster": compute time saved as baseline minus AI process time, review included.
- Rung 3 and the joy lens: an **approval gate design rule**. The person keeps the interesting decisions, not only the exceptions.

**Sources.**
- https://www.oneusefulthing.org/p/the-cybernetic-teammate
- https://www.nber.org/papers/w33641 (PDF opened)
- https://www.oneusefulthing.org/p/management-as-ai-superpower (27 Jan 2026)
- https://www.oneusefulthing.org/p/agency-and-agents (31 Aug 2026)
- https://www.oneusefulthing.org/p/the-dot-and-the-swarm (1 Oct 2026)

E3 for the P&G study; E1 for the 2026 essays.

---

## 3. Flow, constraints and teams (rung 6)

### 3.1 Theory of Constraints next to our Amdahl ceiling (Goldratt)

**Core idea.** One constraint caps the output of the whole system. The five focusing steps:
- "IDENTIFY the system's constraint"
- "EXPLOIT the constraint"
- "SUBORDINATE everything else to the constraint"
- "ELEVATE the constraint"
- do not let inertia become the constraint

"An hour lost at the bottleneck is an hour lost for the entire system"; "one hour saved at a non-constraint is a mirage." Drum-buffer-rope releases work at the constraint's pace.

**What it changes.** Amdahl and Goldratt answer different questions, and the model needs both:
- **Amdahl** sets the ceiling on one role's speedup: the human-only share of *its* time.
- **Goldratt** sets the throughput of a *value stream*: the slowest step, wherever it sits.

Speeding up screening 4× does nothing for time to hire if hiring managers' interview slots are the constraint. Uniper's hiring agent found exactly that: candidates waiting on the shortlist for more than 14 days (see `research/digests/recruiter.md`). In the close, practitioners report the work "moves rather than shrinks": the team now reviews every variance the AI flags (`research/last30days/ai-in-finance-close-and-ap.md`). The reviewer became the constraint.

Changes:
- Rung 6: per value stream, **name the constraint step**. Rank first the opportunities that exploit or elevate it.
- Treat **approval gates as constraint candidates**. `agent_with_gate` moves load to the approver.
- Hours freed elsewhere count as capacity only when the redesign says where they go.

**Sources.**
- https://www.tocinstitute.org/five-focusing-steps.html
- https://www.toc-goldratt.com/en/product/gsp-on-operations-dbr-and-buffer-management
- https://www.velocityschedulingsystem.com/blog/the-goal-book-eliyahu-goldratt/
- https://www.allaboutlean.com/drum-buffer-rope/ (a critique: drum-buffer-rope assumes a fixed bottleneck)

E1 as a framework.

### 3.2 Lean value streams and TIMWOODS (Lean Enterprise Institute)

**Core idea.** Map every step, value-adding or not, that brings a result to the customer: current state, then future state. Measure lead time, cycle time and "percent complete and accurate". Waste is "any activity that consumes resources but creates no value for the customer". There are eight wastes: transport, inventory, motion, waiting, overproduction, overprocessing, defects, and unused skills ("non-utilized talent"). In the office, "time, not inventory, … is the true unit of measure", and "office workers are drowning in" digital inventory. Lean HR adds a third class, "value enabling": "Not value add – but necessary to maintain business flow".

In a finance case (TXM at Agilent, self-reported), mapping and levelling the close moved reporting "from … midnight on day 4" to "5pm on day 3". It used no AI.

**What it changes.**
- Rung 6: map Noordhaven's value streams (`config/company.json`) with lead time and percent complete and accurate. Tag each task with one waste.
- Add **"value enabling"** for compliance tasks: they cannot be dropped, but can be automated.
- Rung 3: **lean before AI**. Automating a queue that should not exist is overprocessing.

**Sources.**
- https://www.lean.org/lexicon-terms/value-stream-mapping/
- https://www.lean.org/the-lean-post/articles/understanding-the-fundamentals-of-value-stream-mapping
- https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-part1.pdf
- https://www.lean.org/lexicon/waste
- https://www.lean.org/the-lean-post/articles/does-a-lack-of-physical-inventory-make-office-work-different/
- https://www.lean.org/wp-content/uploads/2022/05/lean_hr_hr_lean.pdf
- https://txm.com/streamlining-accounting-processes-in-global-technology-corporation
- https://www.6sigma.us/?p=130322 (TIMWOODS list, secondary)

E3 for the Agilent case as self-reported.

### 3.3 Team Topologies (Skelton and Pais, 2019; 2nd ed. 2025). Not on our list; should be.

**Core idea.** Design teams for flow. The default unit is a **stream-aligned team** that owns one flow end to end. Three other types reduce its cognitive load:
- **enabling**: helps teams past obstacles, then steps back;
- **complicated subsystem**: deep specialist parts;
- **platform**: an internal product used as a service.

Teams interact in three modes: collaboration, X-as-a-Service, facilitation. Cognitive load is finite: every tool, domain and responsibility uses some of it.

**What it changes.** Rung 6, the pods option, mapped as follows. The mapping is our reading (E1):
- **Hire-to-productive and procure-to-pay pods** are stream-aligned teams.
- **The agent and integration layer** (AFAS connectors, Microsoft Graph, the approval service) is a platform team.
- **The payroll and tax rules engine** is a complicated subsystem.
- **AI coaching** is an enabling team.

The **reach lens needs a cognitive-load cap**: a polyvalent person can absorb only so many adjacent domains, however much AI helps. IBM's HR pods by function (`research/digests/hrbp.md`) are a second axis to compare with pods by value stream.

**Sources.** https://teamtopologies.com/key-concepts ; https://teamtopologies.com/book. E1 as a framework.

### 3.4 The Frontier Firm (Microsoft Work Trend Index, 2025 and 2026). Not on our list; should be.

**Core idea.** Three phases: AI as assistant, agents as "digital colleagues", and humans who "set direction for agents that run entire business processes and workflows". Two quotes:
- Teams need "a new metric: the human-agent ratio".
- Each worker becomes an "agent boss: someone who builds, delegates to, and manages agents".

The 2026 index (20,000 workers) found organisational factors explain 67% of reported AI impact, individual factors 32%.

**What it changes.**
- The three phases map onto our autonomy levels.
- Rung 6: the human-agent ratio is a candidate metric for the "smaller team" option.
- Rung 7: the **team lead's advice matters more than the individual's**, since most of the impact is organisational.

**Sources.**
- https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born
- https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization (5 May 2026)

E2. A vendor survey with self-reported figures.

---

## 4. From opportunity to build (rungs 6 and 7)

### 4.1 North Star Framework (Amplitude)

**Core idea.** "A North Star Metric is a single metric that best captures the value customers derive from your product". It comes with "three to five influential, complementary" input metrics that teams can move. Inputs come in four types:
- **Breadth:** how many get value?
- **Depth:** how much value each?
- **Frequency:** how often?
- **Efficiency:** how friction-free is the path?

A good North Star leads rather than lags, is actionable, and is hard to game ("Could teams hit this number through perverse incentives?"). There are three games: attention, transaction, productivity.

**What it changes.**
- Rung 7: internal HR and Finance play the productivity game. Type each team's inputs:
  - HR's "onboarding completed in week one" is efficiency.
  - "Manager satisfaction with HR" is depth.
  - Finance's "invoices processed without touch" is efficiency.
- Run the "hard to game" check on each. "CVs screened per hour" fails it.
- Every opportunity should name the one input it moves.

**Sources.**
- https://www.amplitude.com/blog/product-north-star-metric
- https://www.amplitude.com/blog/good-bad-north-star-metric
- https://amplitude.com/books/north-star/about-north-star-framework (partial render)
- https://github.com/amplitude/builder-skills/blob/main/growth-skills/skills/north-star-metric/SKILL.md (the input types)

E1 as a framework.

### 4.2 Opportunity Solution Tree (Torres)

**Core idea.** One outcome leads to opportunities, then solutions, then assumption tests. An opportunity is "an unmet customer need, pain point, or desire", not a feature. To catch a solution in disguise, ask: "Is there more than one way to address this opportunity?" Then "compare and contrast at least 3 different solutions" and test their key assumptions side by side.

**What it changes.**
- Rung 6: our "one opportunity is one thing to build" jumps too early. Name the **opportunity as a need**, drawn from the intake pain tags (chasing, copying, rework). Example: "managers wait days for HR answers".
- Then compare **at least three solution patterns**, for example a deterministic lookup, an `llm_step`, and an agent.
- The **riskiest assumption** and its test feed the confidence term in priority = value × confidence ÷ time to value.

**Sources.**
- https://www.producttalk.org/opportunity-solution-trees/
- https://www.producttalk.org/glossary-discovery-opportunity-solution-tree/
- https://www.producttalk.org/glossary-discovery-compare-and-contrast-decisions/

E1 as a method.

### 4.3 The Tenex agent sprint (Tenex, 2025–2026)

**Core idea.** Tenex (tenex.co) is a US AI transformation firm. Alex Lieberman and Arman Hezarkhani founded it.

Its free five-day "AI Agent Bootcamp" has three phases:
- interview the people closest to the work;
- map workflows step by step, with systems and expected impact;
- prototype agents on the client's own data, then "recommend what to take live first".

The output is a roadmap with ROI per opportunity, up to eight mapped opportunities and up to four working prototypes. Its off-the-shelf agents target deployment "under two weeks", with permissions, human approvals, an audit trail and an agreed outcome for the first workflow.

The strategy playbook works in four steps:
1. Survey about 30 staff and interview 6–12.
2. Score each use case on frequency, time spent, cost of that time, P&L impact and effort.
3. Rank by ROI per month against a 1–5 "lift" score.
4. Split each workflow into 5–15 micro-steps and automate "the most repetitive, time-expensive one" first. Prefer deterministic steps with "checkpoints every few steps"; "your knee-jerk reaction should still be to buy."

On value, Tenex says "gross productivity gain is not realized savings". Saved hours count only when they have been given a named destination beforehand (more output, growth without hiring, unfilled roles) and finance confirms them at 30, 60 and 90 days. "Don't annualize results from less than a quarter in production."

**What it changes.**
- **A correction to model-v0.** No opened Tenex page states the formula hours × % removed × loaded cost, and none has a separate risk line. Keep the formula as ours. Add Tenex's two rules to the route to cash:
  - every hour freed needs a **named destination** before the pilot;
  - realised savings are **confirmed after a quarter**, not annualised from a demo.
- **Rung 6:** micro-step decomposition plus "automate the most expensive repetitive step first" matches our task grain. It also matches Goldratt: pick the step that matters, not all steps.
- **Rung 7:** the golden demo is a **prototype on real data**, not a document. This matches the build brief.
- **Priority:** "ROI per month ÷ lift" is a working version of value × confidence ÷ time to value.

**Sources.**
- https://www.tenex.co/
- https://www.tenex.co/ai-transformation
- https://www.tenex.co/ai-engineering
- https://www.tenex.co/playbooks/build-an-ai-strategy-that-works
- https://www.tenex.co/the-big-question/ai-strategy-where-to-start (9 Oct 2026)
- https://www.tenex.co/playbooks/show-then-tell-how-high-fidelity-prototypes-collapse-product-alignment
- https://www.latent.space/p/10x-ai-engineers-with-1m-salaries (podcast, 19 Nov 2025)

E2. The firm describes its own method; no client results were opened.

---

## 5. What McKinsey, BCG and the WEF published this year

### 5.1 BCG (2025–2026)

**Core idea.** The value gap is widening.

**The Widening AI Value Gap (30 Sep 2025):**
- 1,250 executives surveyed: 5% of firms are "future-built", 35% "scalers" and 60% "laggards".
- Future-built firms get 5× the revenue gains and 3× the cost reductions.
- Agents are about 17% of AI value in 2025, expected to reach 29% by 2028.

**The 10-20-70 rule:** "10% of AI value comes from algorithms, 20% from data and technology, and 70% from people and processes."

**Design Your Company for AI (23 Apr 2026):**
- Decide per task what is human-led, AI-assisted or AI-led by asking whether AI can do it as well, and whether it should.
- Organise small cross-functional teams that own an outcome.
- HR case at a global bank: over 80 HR capabilities for agents over three years, about 3 million hours freed (about 1,700 FTE), payback within two years.

**AI at Work 2026 (3 Jun 2026):**
- About 12,000 respondents. Of regular users, 42% save about 8 hours a week, but 66% get little or no guidance on how to use that time.
- Agents are integrated at 30% of organisations, up from 13%.
- Firms that redesign workflows are 24 points more likely to see a measurable business result.
- "Adoption tells you that people use AI, not whether it pays off."

**What it changes.**
- Rung 6: "can it, and should it" is our pattern choice plus the obliterate check.
- The bank's HR case is the closest published analogue to our HR team (E3, consultant-reported).
- The 66% without guidance is the reason freed hours need a named destination (see Tenex).
- 10-20-70 argues for weighting redesign effort, not model choice, in time to value.

**Sources.**
- https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap
- https://www.bcg.com/press/30september2025-ai-leaders-outpace-laggards-revenue-growth-cost-savings
- https://www.bcg.com/news/26january2026-what-is-driving-ai-value
- https://www.bcg.com/publications/2026/design-your-company-for-ai-not-ai-for-your-company
- https://www.bcg.com/publications/2026/ai-at-work-why-strategy-matters-more-than-tools

E3 as surveys and consultant cases.

### 5.2 McKinsey (Sep 2025 – Aug 2026). Secondary sources only.

Every mckinsey.com page timed out in this run, so these figures come from open pages that report them. Treat them as E1–E2 until the originals are read.

**"The agentic organization" (26 Sep 2025):**
- A new paradigm of humans and agents working side by side, in small outcome-aligned teams.
- Commentary reports a picture of 2–5 people overseeing 50–100 agents.

**MGI, "Agents, robots, and us" (25 Nov 2025):**
- Current technology could in theory automate 57% of US work hours: 44% by agents, 13% by robots.
- Value (about $2.9 trillion a year by 2030) depends on organisations that "redesign workflows, rather than individual tasks".

**State of AI 2026 (Aug 2026):**
- 1,719 responses. 37% report any EBIT impact, flat on last year.
- Agents are scaled in about 5% of finance functions.

**What it changes.**
- Rung 6: 57% is a **technical ceiling**, the same kind of number as our class hours, not a forecast.
- The flat EBIT result is the strongest argument in this list for TOC and for the named-destination rule.
- Agents scaled in about 5% of finance functions means agents in finance are early (consistent with `research/last30days/ai-in-finance-close-and-ap.md`).

**Sources (secondary).**
- https://thescaffold.beehiiv.com/p/the-agentic-organization-why-mckinsey-s-new-paradigm-is-both-inevitable-and-incomplete
- https://www.headquarter.ai/en/post/mckinsey-agentic-organization
- https://roboticsandautomationnews.com/2025/11/26/mckinsey-warns-ai-and-robots-could-automate-40-percent-of-us-jobs-by-2030/
- https://idm.net.au/node/15761

### 5.3 World Economic Forum (Nov 2025 – Mar 2026)

**AI Agents in Action (Nov 2025, with Capgemini).** Agents are classified on seven dimensions:
- function;
- role;
- predictability (deterministic to non-deterministic);
- autonomy;
- **authority** (read-only to full admin);
- use case;
- environment.

The paper applies the SAE driving scale from Level 0 to Level 5, as our model does. "Progressive governance approaches scale oversight and safeguards in proportion to the autonomy, authority and complexity of the agent."

**Four Futures for Jobs in the New Economy (Jan 2026).** Two axes, AI progress and workforce readiness, give four scenarios. Executive views: 54% expect AI to displace jobs and 24% expect it to create them. One scenario has humans "directing portfolios of capable machines and becoming agent orchestrators".

**Future of Jobs 2025** is still the latest edition: 170 million jobs created and 92 million displaced by 2030, with 39% of skills changing.

**What it changes.**
- Rung 3: add **authority** next to autonomy. An agent that can only read AFAS is a different risk from one that can post a journal or release a payment batch.
- Scale the approval gate to both. This is the cleanest published basis for our autonomy levels.

**Sources.**
- https://www.rivista.ai/wp-content/uploads/2025/12/1765181682395.pdf (open copy of the WEF paper)
- https://www.sipotra.it/wp-content/uploads/2026/02/Four-Futures-for-Jobs-in-the-New-Economy-AI-and-Talent-in-2030.pdf (open copy)
- https://www.lewissilkin.com/our-thinking/future-of-work-hub/insights/2026/01/14/four-futures-for-jobs-in-the-new-economy-ai-and-talent-in-2030
- https://digital-skills-jobs.europa.eu/en/latest/research/future-jobs-report-2025
- weforum.org returned 403 throughout.

E3 for the classification as published.

---

## 6. Rules that cap autonomy (EU and the Netherlands)

These are not frameworks but **hard gates**. They belong in rung 3 as a ceiling on autonomy, and in every build brief.

### 6.1 EU AI Act, as amended by the Digital Omnibus (Regulation (EU) 2026/1744)

**Annex III point 4: employment.** Two uses are high-risk.
- **(a)** Systems used "for the recruitment or selection of natural persons", "in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates".
- **(b)** Systems used to make decisions on terms of work, promotion or termination; "to allocate tasks based on individual behaviour or personal traits or characteristics"; "or to monitor and evaluate the performance and behaviour of persons".

**Deployer duties (Art. 26).**
- Use the system as instructed.
- Assign "human oversight to natural persons who have the necessary competence, training and authority".
- Keep input data relevant.
- Monitor the system and suspend it on risk.
- Keep logs for at least six months.
- Before use at work, "inform workers' representatives and the affected workers".

**Dates.**
- Prohibitions (Art. 5): since 2 February 2025. These include emotion inference "in the areas of workplace and education institutions", except for medical or safety reasons.
- Transparency (Art. 50): since 2 August 2026. A system that talks to people must tell them it is AI unless obvious.
- AI literacy (Art. 4): softened to "take measures to support".
- Annex III duties: from 2 December 2027, moved from 2 August 2026 by the Omnibus, in force since 27 July 2026.

**What it changes.** Rung 3 gets a **legal ceiling per task**:
- **Screening, ranking and evaluating candidates:** at most `copilot` or `agent_with_gate`, with a named overseer and logs.
- **Allocating tasks on behaviour, or scoring performance:** the same.
- **Emotion or sentiment from face or voice at work:** excluded.
- **Employee- and candidate-facing bots:** disclose.

Business cases for HR tools should count December 2027 compliance work.

**Sources.**
- https://artificialintelligenceact.eu/annex/3/
- https://artificialintelligenceact.eu/article/26/
- https://artificialintelligenceact.eu/article/5/
- https://artificialintelligenceact.eu/article/4/
- https://artificialintelligenceact.eu/article/50/ (consolidated text)
- https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng (official)
- https://www.praxikon.com/en/digital-omnibus (updated 10 Oct 2026)
- https://www.cooley.com/news/insight/2025/2025-11-24-eu-ai-act-proposed-digital-omnibus-on-ai-will-impact-businesses-ai-compliance-roadmaps (the proposal)

E3.

### 6.2 GDPR Article 22 and the Dutch DPA

**Core idea.** People have a right not to be subject to a decision "based solely on automated processing" with legal or similarly significant effects. Where an exception applies, there must be "at least the right to obtain human intervention … to express his or her point of view and to contest the decision". Recital 71 names "e-recruiting practices without any human intervention". The Autoriteit Persoonsgegevens (AP) adds two points:
- Review must be real: "there is no meaningful human intervention when the assessor … has no discretion and must always follow the automated outcome".
- Its March 2026 barometer finds recruitment AI weak on explainability.

**What it changes.** Rung 3: no automatic rejection, pay decision or dismissal step without a reviewer who can overrule. The "human gate" in "in practice" must say what the reviewer sees and can change.

**Sources.**
- https://gdpr-info.eu/art-22-gdpr/
- https://gdpr-info.eu/recitals/no-71/
- https://www.autoriteitpersoonsgegevens.nl/en/themes/employment-and-benefits/job-applications/online-and-game-based-assessments-in-recruitment-and-selection-rules-for-automated-decision-making
- https://www.autoriteitpersoonsgegevens.nl/en/current/ap-ai-impact-barometer-turns-red-action-required (5 Mar 2026)

E3.

### 6.3 Works councils (WOR art. 27) and the SER

**Core idea.** The employer needs works council consent before introducing or changing a rule:
- on processing employees' personal data (27(1)(k));
- on facilities "gericht zijn op of geschikt zijn voor waarneming van of controle op aanwezigheid, gedrag of prestaties" (27(1)(l)).

Hiring and promotion policy, appraisal, training and pay systems are consent topics too. A decision taken without consent can be voided if the council invokes nullity within one month. The SER's May 2025 advice asks for earlier involvement than the law requires, and says people affected by an AI outcome must always be able to complain.

**What it changes.**
- Rung 6: consent is a **lead time and cost in time to value** for nearly every HR opportunity and for any finance tool that reads employee data.
- Rung 7: the build brief gets a works-council step. This also follows Team Topologies' and Mollick's logic: involve the people the system acts on.

**Sources.**
- https://wetten.overheid.nl/BWBR0002747/
- https://www.ser.nl/-/media/ser/downloads/adviezen/2025/ai-en-werk.pdf
- https://www.praxikon.com/en/posts/works-council-consent-ai-in-the-workplace
- https://www.fnv.nl/getmedia/8b24119f-4f18-43e9-9d4f-6a3d08a21c59/AI-in-medezeggenschap-20251203.pdf (FNV slides; its k/l labels differ from the statute, so rely on the statute)

E3.

---

## 7. Calibration: what field studies measured

Use these bands to ground `speedup_i` and hours freed. They are far below the fallback speedups of 4× for automate and 1.8× for amplify.

| Study | Setting | Measured effect | Grade |
|---|---|---|---|
| Brynjolfsson, Li, Raymond (2023) | 5,179 customer-support agents | +14% productivity on average, +34% for novices | E3 |
| Dell'Acqua et al. (2023) | 758 BCG consultants | inside the frontier 25.1% faster, 40% better; outside, 19 points less correct | E3 |
| Dillon et al. (2025) | M365 Copilot trial, 66 firms, 7,137 workers | two fewer hours on email per week; no change in task mix | E3 |
| Humlum and Vestergaard (2025) | 25,000 Danish workers incl. accountants, HR, clerks | ~3% of hours saved; ~7% where employers encourage use; no measurable effect on earnings or hours | E3 |
| Choi and Xie (2025–26) | 277 accountants, 79 small firms | monthly close 7.5 days faster; 8.5% less time on routine processing (association, not causal) | E3 |
| Brynjolfsson, Chandar, Chen (rev. Aug 2026) | US payroll data | 22–25-year-olds in AI-exposed jobs 19% below trend where AI substitutes | E3 |

Sources:
- https://www.nber.org/papers/w31161
- https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf
- https://arxiv.org/abs/2504.11436
- https://bfi.uchicago.edu/wp-content/uploads/2025/04/BFI_WP_2025-56-3.pdf
- https://www.gsb.stanford.edu/faculty-research/publications/human-ai-accounting-early-evidence-field
- https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine/

**What it changes.**
- Rung 5–6: separate **task speedup** (trials, large) from **realised hours** (whole workforces, small).
- The roll-up should carry an **adoption factor** and **review time**. Without them, "capacity returned" is a ceiling, not a forecast.
- No randomised study of agents in accounts payable or HR turned up.

---

## 8. Who we were missing

Added above, beyond the order's list:
- Eloundou et al. (1.2)
- the Anthropic Economic Index (1.3)
- Stanford's Human Agency Scale (1.4)
- METR (1.5)
- Hammer (1.7)
- Anthropic's workflows-versus-agents guidance (1.8)
- Kahneman's *Noise* (1.9)
- Acemoglu (2.5)
- Autor (2.6)
- Team Topologies (3.3)
- Microsoft's Frontier Firm (3.4)
- the EU, GDPR and Dutch rules (6)
- the field studies (7)

Still missing, named from model knowledge only (E1, not opened in this run, worth a later pass):
- **Daugherty and Wilson, *Human + Machine*:** the "missing middle" of human–AI collaboration roles, a second view on our altitude lens.
- **Christensen's jobs to be done:** a sharper way to phrase opportunities than tasks.
- **Ronald Coase on the firm:** why cheaper coordination changes what a company does in-house versus buys. This is the theory under Choudary.
- **Dutch practitioners on AI in HR and finance:** SCOUT's `research/signals/people-to-follow.md` covers people; no Dutch framework surfaced in this run.
