# Digest: Credit and Collections Officer

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/collections.md` plus Dutch statute, government and survey pages, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

Noordhaven's debtors are mostly businesses (shippers). Most Dutch collection pages are about consumers; read them with that in mind.

## What is proven

- **Drafting legal steps.** Syncasso's module turns a file into a draft summons in two minutes. A legal professional reviews it; the bailiff stays responsible for the writ. Handling time falls from 165 to 62 minutes, "volgens Syncasso" [S1]. E3, award entry, vendor's own figure.
- **Receivables suites promise, not measure.** Genpact's AR suite expects "up to" 80% touchless cash application, 20% fewer past dues, 40% higher collector productivity and 30% faster disputes. These are "indicative estimates only", with people on "validation and complex decision-making". FLSmidth selected it; no result yet [S2]. E2, AI-written news page.
- **The Dutch baseline.** Of 336 Dutch finance and credit professionals, 81% explain DSO after the fact. Half plan cash-in no more than two weeks ahead; 30% name manual work (Excel, mail, exports) as the biggest cash-flow problem [S3]. E3, vendor survey (Onguard).
- **Cash application in AFAS is rules.** Matching on payment reference, IBAN, invoice number and oldest-first sums; misses go to a person [S4]. E2.

## What fails

- Early file errors surface only in court: a wrong first letter, interest or costs miscalculated, terms never handed over. Courts test consumer claims of their own motion [S5]. E3, vendor event page.

## Dutch and EU constraints

- **Interest and costs (B2B):** statutory commercial interest runs from the agreed due date, or 30 days after the invoice if none was agreed. At least €40 compensation is due without any reminder [S6].
- **Registration (Wki):** since 1 October 2026 a debtor owes no collection costs or further interest if the party sending reminders on another's behalf is not registered. The debt itself stands. This covers natural persons, including sole traders and partnerships. Bailiffs and lawyers are exempt [S7]. Chasing one's own invoices is not described as covered (E1).
- **Credit scoring:** creditworthiness scoring of natural persons is high-risk under Annex III 5(b) [S8], with Annex III duties from 2 December 2027 [S9]. Sole-trader hauliers count (E1).

## For the model

- **Monitoring, recording, admin, filing, tracing (35%):** `deterministic_software` ageing, priority lists and KvK lookups; `llm_step` call notes. Autonomy 4.
- **Reminders and first notices (8%):** `deterministic_software` dunning with `llm_step` wording, autonomy 4 for standard reminders, 3 for the rest.
- **Account questions (8%):** `agent_with_gate` sends statements, invoice copies and proof of delivery, autonomy 3.
- **Posting receipts (8%):** AFAS rules first; `llm_step` reads remittance mails for the remainder, autonomy 4.
- **Conversations: reasons, persuasion, advice, payment plans, extensions (35%):** `copilot` with the dispute file (delivery proof, damage claims, surcharges, E1), autonomy 2. Plans and extensions are approved by a person.
- **Escalation to lawyers or agencies, insurers (7%):** `agent_with_gate` prepares the hand-over file, autonomy 3. A person decides; check the agency's registration.

Altitude: from chasing invoices to running the order-to-cash rules: credit limits, reminder sequences, dispute causes fed back to sales and operations. North Star inputs: DSO, share of invoices disputed.

## Sources

- [S1] https://www.creditexpo.nl/genomineerden-credit-management-awards-2026-bekend/ (Credit Expo, 13 Oct 2026)
- [S2] https://www.unite.ai/genpact-debuts-agentic-ai-suite-for-accounts-receivable/ (Unite.AI, 14 Oct 2026)
- [S3] https://www.onguard.com/fintech-baropaper/fintech-baropaper-2026-measuring-everything-managing-nothing/ (Onguard, 2026)
- [S4] https://help.afas.nl/help/NL/SE/Fin_BnkStm_Auto_Match.htm (AFAS Help Center)
- [S5] https://www.creditexpo.nl/juridische-scherpte-begint-bij-de-eerste-aanmaning/ (Credit Expo, source LegalMike, 5 Oct 2026)
- [S6] https://wetten.overheid.nl/jci1.3:c:BWBR0005289&boek=6&titeldeel=1&afdeling=10&artikel=119a (BW 6:119a and 6:96(4), version of 16 Jul 2026)
- [S7] https://www.rijksoverheid.nl/actueel/nieuws/2026/09/21/geen-incassokosten-bij-niet-geregistreerde-incassodienstverlener (Rijksoverheid, 21 Sep 2026)
- [S8] https://artificialintelligenceact.eu/annex/3/
- [S9] https://www.kinstellar.com/news-and-insights/detail/4619/the-ai-act-after-the-digital-omnibus-simplified-rules-delayed-deadlines-but-can-compliance-wait (Kinstellar, Jul 2026)
