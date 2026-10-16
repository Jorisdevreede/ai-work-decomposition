# Digest: Bookkeeper (accounts payable and receivable)

For the grounded rerun (E4). SCHOLAR, 2026-10-14, from `research/signals/bookkeeper.md` plus AFAS and Dutch payment pages, sources reopened. Grades: E1 model knowledge, E2 a product does this today, E3 a documented case or legal text.

## What is proven

- **In Noordhaven's stack.** AFAS Profit 8 reads UBL and PDF invoices to line level. A one-to-one match with order or receipt is posted and approved for payment ("boekt en fiateert") [S1]. E2, partner, no match rate. AFAS's help: a PDF without UBL is scanned into an e-invoice, supplier found by KvK, VAT number and IBAN, gaps filled by hand [S2].
- **Bank matching is rules, not AI.** AFAS matches CAMT.053 lines on payment reference, IBAN, invoice number, then oldest-first sums; exact amounts unless a tolerance is set; misses go to a person [S3]. E2.
- **Capture speed, one vendor case.** In NetSuite, Escalante Golf (8,000 invoices a month) went from 2.5 minutes to 45 seconds per invoice. Coding is suggested from vendor history for the team to "review and confirm for accountability"; the same page says "routine invoices process themselves" [S4]. E3, vendor case. APQC, via Zone: over 20,000 invoices per FTE a year for top teams, about 6,000 for the bottom quarter.
- **The Dutch baseline is manual.** In a Wolters Kluwer survey (594 respondents), 70% approve invoices on paper or by email; 43% say this regularly delays payment [S5]. E3, vendor survey.

## What fails

- **A booking proposal is not automation** ("digitaliseren, geen automatiseren"). Measured touchless shares disappoint. Blockers: own ledger accounts, VAT codes and exceptions per administration; PDFs and receipts keep coming [S6]. E3, vendor content.
- Let AP run with people on exceptions, and log every decision with its data [S7].

## Dutch and EU constraints

- **E-invoicing:** B2B from 1 July 2030, reporting from 1 July 2031; not law yet [S9]. A PDF is not an e-invoice. On a Peppol seller's reading, buyers report intra-EU and reverse-charge purchases within 5 days of receipt. Two weeks in an approval round misses it [S8].
- **Flex-worker invoices:** Noordhaven can be held liable for its three agencies' unpaid wage tax and VAT. It limits this by asking for a payment-behaviour statement, meeting its record-keeping duties, and paying that part into the agency's g-rekening [S10].
- **Payment runs:** since October 2025 banks check payee name against IBAN; a payer who confirms after a warning is not blocked [S11].
- **Payment terms:** as a large company, Noordhaven may not agree more than 30 days with a small supplier [S12].

## For the model

- **Recording, coding, posting, matching (25%):** UBL and one-to-one matches as `deterministic_software`, autonomy 4. PDF capture and coding suggestions as `llm_step`, autonomy 3.
- **Checking, reconciling, trial balance (17%):** AFAS rules first (`deterministic_software`, autonomy 4). An `llm_step` explains unmatched lines, autonomy 3.
- **Payments, receipts, deposits (12%):** payment run as `deterministic_software` with approval, autonomy 3; check IBAN changes, duplicates and the g-rekening split. Cheques are rare here (E1).
- **Billing, interest, account status (11%):** `deterministic_software`, autonomy 4.
- **Questions and correspondence (9%):** `agent_with_gate` on payment-status questions from AFAS, autonomy 3.
- **Expenses, cost, budget, stock and payroll input (13%):** mixed; receipts as `llm_step`, autonomy 3.
- **Compliance and tax forms (6%):** `deterministic_software` checks, autonomy 3.
- **10-key calculators and typewriters (6%):** really Excel arithmetic; it goes with structured data (E1).

The Noordhaven case: agency invoices checked against time records, g-rekening share split, only differences to a person.

Altitude: from keying invoices to owning match rules, tolerances and supplier data. North Star inputs: invoices processed without touch; days to close.

## Sources

- [S1] https://irixs.nl/kennisbank/afas-profit-8 (Irixs, AFAS partner, 14 Oct 2026)
- [S2] https://help.afas.nl/help/nl/se/129350.htm (AFAS Help Center, Scan & herken)
- [S3] https://help.afas.nl/help/NL/SE/Fin_BnkStm_Auto_Match.htm (AFAS Help Center, bank matching)
- [S4] https://www.zoneandco.com/articles/ai-in-ap-automation (Zone & Co, 18 Aug 2026)
- [S5] https://www.accountancyvanmorgen.nl/2026/09/08/zeventig-procent-van-respondenten-keurt-facturen-nog-handmatig-goed/ (Accountancy Vanmorgen, 8 Sep 2026)
- [S6] https://www.accountancyvanmorgen.nl/2026/07/02/ict-ai-volledig-automatische-factuurverwerkingzo-kom-je-er/ (branded content by Zenvoices, 2 Jul 2026)
- [S7] https://www.techtarget.com/enterprise-software/tip/What-CFOs-need-to-know-about-AI-agent-governance-in-accounting (Kofalt, 25 Sep 2026)
- [S8] https://www.peppol.nu/blog-items/vida-nederland/ (De Jager, peppol.nu, 25 Sep 2026)
- [S9] https://www.rijksoverheid.nl/actueel/nieuws/2026/09/11/kabinet-kiest-voor-invoering-e-facturatie-en-rapportage-voor-bedrijven (Rijksoverheid, 11 Sep 2026)
- [S10] https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/aangifte_betalen_en_toezicht/aansprakelijkheid/inlenersaansprakelijkheid/inlenersaansprakelijkheid (Belastingdienst)
- [S11] https://www.betaalvereniging.nl/en/?p=3093 (Betaalvereniging, IBAN-Name Check)
- [S12] https://wetten.overheid.nl/jci1.3:c:BWBR0005289&boek=6&titeldeel=1&afdeling=10&artikel=119a (BW 6:119a, version of 16 Jul 2026)
