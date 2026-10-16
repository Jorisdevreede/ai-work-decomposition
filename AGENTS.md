# team-reimagine: rules for every agent in this folder

This folder explores how to get from self-service inputs (the tasks people do, the software they
use) to advice and actionable opportunities that can be built as deterministic software, as an AI
step in a workflow, or as an agent. It simulates a fictional Dutch company, Noordhaven Logistics, with
an HR team (13 FTE) and a Finance team (10 FTE). Read `method/model-v0.md` first; it is the model under
test.

## What is where

| Path | Holds | Owner |
|---|---|---|
| `config/` | company profile and team definitions | orchestrator |
| `data/teams.json` | every role as O*NET tasks with time share, class and software (built by `tools/build_teams.py`) | orchestrator |
| `schema/reimagine.schema.json` | the shape every model's task answer takes | orchestrator |
| `runs/<variant>/<model>/<role>__<n>.json` | one model's answer for a batch of a role's tasks | `tools/reimagine.py` |
| `research/` | signals, frameworks, digests per role | research panes |
| `data/synthesis/` | merged task answers, role cards, team roll-ups, opportunities | synthesis pane |
| `prototypes/` | static HTML prototypes; shared look in `prototypes/style.css` | builder panes |
| `fleet/ORDERS.md` | what each pane is doing | orchestrator |
| `fleet/STATUS.md` | one line per pane when a deliverable lands | every pane appends |

Write only in the paths your order names. Read anything.

## Rules

- **No invented sources.** Never invent a product, a customer case, a number, a person's quote or a
  URL. A link you cite must be one you opened in this session. If you only know something from
  memory, say so ("model knowledge") and grade it E1.
- **Evidence grades:** E0 imagined, E1 plausible from model knowledge, E2 a named product does this
  today, E3 a documented case with a source, E4 measured in this organisation.
- **Plain English.** Short sentences, no hype words (no "revolutionise", "unlock", "seamless").
- **Prototypes are static:** one HTML file each, plain JavaScript modules, no build step, no CDN, no
  external fonts. Link `style.css` and reuse its tokens and components; add a page's own CSS in a
  `<style>` block that only uses the tokens. Load data with `fetch()` from `../data/...` and
  `../runs/...` (the folder is served from its root). They must work at 1440px and 390px wide.
- **Serve and check:** `python3 -m http.server 8790` from this folder, then open
  `http://localhost:8790/prototypes/<file>.html`. Check the browser console is clean.
- **Do not** commit, push, publish, or call any API that costs money beyond your own model, except
  what your order says. Do not touch other repositories.
- **Done means:** the deliverable exists at the path in your order, you checked it, and you appended
  one line to `fleet/STATUS.md`: `<time> <pane> <deliverable path> <one-line summary>`.
