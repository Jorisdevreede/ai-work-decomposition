# Judge: three mockups of team-reimagine (2026-10-15)

All eight screens of each mockup loaded at 1440 and 390 px with Playwright: clean console, no overflow at 390. Slop risk: lower is better.

| Dimension | A journey | B workspace | C conversation |
|---|---|---|---|
| Primary action | 75: "Continue: card sorting" is the one green button on `#/goal` | 75: "View team twin" competes with "Start card sorting" in the side panel | 75: "Looks right. Show me the goal" on setup |
| Visual hierarchy | 75: route, then the five goal parts, then next stations | 75: calm and dense; the goal bar sits above the outputs list | 75: good type, but the canvas carries everything |
| No raw ids | 75: setup shows "O*NET 11-3121.00 · 26 tasks" | 50: "Source task 43-4161.00:2689" in mono; lowercase enum tags "records (CRUD) app"; "NSF Statement Exercise" | 50: "Task trace: 13-1071.00:18853" in the opportunity detail |
| Progressive disclosure | 50: the team twin runs to about 3,500 px and the home to about 2,100 px; the legend is open by default | 75: opportunities as list and detail; North Star inputs folded | 75: accordions, and the opportunity opens below the list |
| Polish vs harness | 75: station states (done, here, ahead), hover tracing from goal part to station | 75: receipts link to what changed; preview modules say so | 50: the chat column is 354 px of chips and replies, and the canvas tab row does the real work |
| Slop risk (lower is better) | 25: own green and yellow route idea | 50: identical opportunity cards; a row of 3 identical cards on home | 50: hero-metric row on the team twin is a banned pattern; 3 identical setup cards |
| Brief coverage | 100: all 8 screens; 9-approach legend incl. amplify; every station shows minutes, status and "Sharpens"; 2 North Star exercises run end to end; adds Guardrails | 75: all 8 screens; legend folded at the page foot; North Star rows say "Duration not stated"; 2 run (Confidence ladder, Bet up) | 75: all 8 screens; only 4 opportunities (against 28 in A and 9 in B); accordions show "Adds to your goal / Fills"; 2 run |
| **Overall** | **75 READY** | **75 READY (with fixes)** | **50 NEEDS-WORK** |

## Must-fix, A journey
1. Split the team twin into a summary and drill-downs (business case, what stays human, roadmap).
2. Remove the O*NET codes from the setup roster. Use "based on 26 standard tasks" and keep the code in a tooltip.
3. On the home, the five goal cards each have "Open" plus station chips: drop the repeated "Open" links that compete with the primary button.

## Must-fix, B workspace
1. Remove the "Source task 43-4161.00:2689" lines and use sentence case on the approach tags ("Records app", not "records (CRUD) app").
2. Give every North Star module a duration and plain names ("Write the statement", not "NSF Statement Exercise"; not "Games of Product", "Leading / Lagging").
3. Move the approach legend up beside the step list; make the nine identical cards differ (effort band, approach mix).

## Must-fix, C conversation
1. Replace the four-number hero row on the team twin with one sentence plus the capacity bar. It breaks an /impeccable ban.
2. Remove "Task trace: 13-1071.00:18853", and show at least 8 to 10 opportunities so the 134 tasks and 945 steps are visible.
3. Make the conversation do something the tabs cannot do. The agent now only narrates the tab row: run modules in the chat with the canvas responding, or fold the tabs into its suggestions.

## Verdict (5 lines)
1. **A, Guided journey, is strongest.** Progress toward the goal is its structure (stations fill numbered parts), with the fullest data and module metadata.
2. A must cut length: summaries first, drill-downs second. Raw codes go.
3. Borrow from B: the list-and-detail opportunities with "See this in the plan" and its trace back; the people list in the sidebar; and receipts after a module that link to every changed item.
4. Borrow from C: the accordion row "Adds to your goal / Fills <part>", its restrained plain headlines, and a docked agent with context-aware suggestion chips as an optional helper on each A screen.
5. Before anything ships, all three must drop task-trace ids and keep money and hours labelled "gross estimate".
