# Direction A, the guided journey: what to click

Open `http://localhost:8790/mockups/a-journey/index.html` (served from `solutions/team-reimagine/`).
It opens on the destination, with Ingrid Bakker (HR Manager, Noordhaven Logistics) at station 5 of 12.
"Reset the demo" at the bottom of every page clears what you clicked.

1. **The destination (home, `#/goal`).** Five parts of the goal, each with how full it is and which
   numbered stations fill it. Point at a part (for example "A step-by-step plan") and its stations light
   up on the route; point at a station and the parts it feeds light up. Dashed parts are still an estimate.
2. **Your team (`#/setup`, junction 1 in the left route).** Three ways side by side: try the three
   upload samples (org chart, job descriptions, transcript) and look at the "Check this" marks; press the
   microphone to replay the voice conversation; add a person by hand. All of it lands in the editable
   roster and the systems list below, where unnamed systems stay visible as gaps.
3. **Card sorting, a module in progress (home: "Continue: card sorting").** You see Sanne Visser's
   session. Start sorting, put the ten cards on the four piles (click a pile, press 1 to 4, or drag the
   card), try "Undo last card", then finish. The end screen shows what it added: her role twin turns
   personal, conflicts to talk about, and the destination fills growing.
4. **Role twin (`#/role/hr-specialist`, from "See Sanne's role twin").** Her 40-hour week before and
   with AI, what goes, what she gets to do more of (now including her own "more of this" pile), what
   stays hers, skills to grow, and the initiatives that change the role. Switch to Daan or Yasmina, or to
   another role.
5. **Team twin (Look ahead → Team twin).** A summary: 5.5 FTE back (gross estimate), what the team
   could take on, the illustrative North Star and how each role shifts. Under "Look deeper", open the
   three drill-downs: the roadmap by quarter, what stays human, and the three-year business case.
6. **Opportunities (Look ahead → Opportunities).** Ranked by value ÷ effort, with the effort band.
   Open "Maintain accurate employment records" to see each step with its approach; read the legend of
   nine approaches; filter on "Traditional ML" to find the two steps that use it.
7. **Stations (left route → "All stations").** The module library in two lists. Open the North Star
   workshop: its eight-part agenda, and below it the eight North Star modules with their format tags.
8. **Pick the game (open module 10.1 → "Run the exercise").** Show the room's votes, pick the
   productivity game, edit the value exchange, agree. The end screen names the opportunities, the
   initiative and the twin part it changed.
9. **Statement (10.5, or "Next exercise: Statement").** Take one of the AI guide's three proposals,
   edit it, name the metric with the playbook template, edit an input, look at which initiatives bet on
   which input, save. Then check the team twin's North Star block and the plan, which now show the bets.
10. **Plan (Look ahead → Plan).** Twelve initiatives over four quarters, each with an owner, what it
    builds, the consent it needs and the opportunities behind it. Try "Download CSV". At 390 px wide the
    left route becomes the green strip at the top; tap "Route" to open it.

Numbers come from the real flow model for the default HR team (`data-model.js`, built by
`build-data-model.mjs`). People, conversations, station progress, plan owners and the two traditional ML
steps are invented for the mockup. The North Star metric "Requests Resolved Right First Time" and its
inputs are illustrative, from `research/north-star.md`.
