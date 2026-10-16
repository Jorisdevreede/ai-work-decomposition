---
name: "Agentlabs Workspace"
description: "A calm, people-centred workspace for making an HR team more AI native."
colors:
  bg: "#f6f7f4"
  surface: "#fff"
  nav: "#ecefe9"
  ink: "#24372f"
  muted: "#59665f"
  line: "#dbe1da"
  primary: "#245b43"
  primary-hover: "#19432f"
  primary-soft: "#e4eee5"
  amber: "#795719"
  amber-soft: "#f6edda"
  lilac: "#66547b"
  lilac-soft: "#eee9f4"
  blue: "#3d5f79"
  blue-soft: "#e8eff4"
  clay: "#835748"
  clay-soft: "#f3e9e4"
  focus: "#28794f"
  error: "#a13930"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline-mobile:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "26px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  exercise-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  receipt-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "25px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  subheading:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 550
    lineHeight: 1.3
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  pill: "5px"
  icon: "6px"
  control: "7px"
  card: "8px"
  panel: "12px"
  task: "14px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  panel: "20px"
  xl: "24px"
  section: "28px"
  page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-secondary-hover:
    backgroundColor: "{colors.nav}"
  text-link:
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    padding: "5px 0"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 11px"
  navigation-link:
    rounded: "{rounded.control}"
    padding: "10px 12px"
  navigation-link-active:
    textColor: "{colors.primary}"
  chip-pine:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 7px"
  metric-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
  person-role-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "11px 14px"
  goal-strip:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "17px 19px"
  module-disclosure:
    textColor: "{colors.ink}"
    padding: "19px 0"
  opportunity-build:
    backgroundColor: "{colors.nav}"
    textColor: "{colors.ink}"
    rounded: "{rounded.icon}"
    padding: "8px 10px"
  opportunity-build-small:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  opportunity-build-medium:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
  opportunity-build-large:
    backgroundColor: "{colors.lilac-soft}"
    textColor: "{colors.lilac}"
  journey-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "22px"
  bet-trace-level:
    backgroundColor: "{colors.nav}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px"
  bet-chain-preview:
    backgroundColor: "{colors.nav}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  bet-chain-stopped:
    backgroundColor: "{colors.clay-soft}"
    textColor: "{colors.clay}"
  receipt-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "19px 22px"
  applied-evidence:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
---

# Design System: Agentlabs Workspace

## Overview

**Creative North Star: "The Calm Workspace"**

A warm-neutral work surface supports an HR lead making a team more AI native. Compact system typography, pine action states and precise table rules keep a dense operating scene calm. People and roles remain named while the lead moves between goals, twins, opportunities and modules; amplification comes before efficiency claims.

This is the code-led Workspace direction selected in the brief. The final local HTML, CSS and plain JavaScript are the visual authority; there is no approved image comp. The reusable signature is the connection between a named person, a useful future for their work and the evidence a module adds. Flat surfaces and quiet color families let that connection carry the identity.

**Key Characteristics:**
- Warm-neutral surfaces with deep pine actions.
- Dense system-sans hierarchy and ruled information groups.
- Persistent people and role identity.
- Explicit draft, illustrative and completion states.

## Colors

The palette combines warm off-whites, green-tinted neutrals and restrained work-category colors. Exact values live in the frontmatter; names below describe their use.

### Primary
- **Deep Pine** (`primary`): main actions, links, retained-work bars and informed goal segments.
- **Pine Shade** (`primary-hover`): hover state for the filled primary action.
- **Pine Wash** (`primary-soft`): goal progress, evidence contributions, completed markers and role accents.
- **Focus Green** (`focus`): keyboard focus outline, distinct from selected state.

### Secondary
- **Ochre / Ochre Wash** (`amber`, `amber-soft`): effort and review markers; the human-boundary family.
- **Lilac / Lilac Wash** (`lilac`, `lilac-soft`): amplification, illustrative status and role identity.
- **Slate Blue / Blue Wash** (`blue`, `blue-soft`): deterministic-work classifications and role identity.
- **Clay / Clay Wash** (`clay`, `clay-soft`): the additional approach and role family, plus explicitly stopped pilot decisions.

### Tertiary
- **Brick Error** (`error`): validation feedback, always accompanied by corrective text.

### Neutral
- **Warm Work Surface** (`bg`): the main application canvas.
- **White Surface** (`surface`): work panels, inputs, top bar and module rail.
- **Sage Navigation** (`nav`): persistent navigation and quiet supporting areas.
- **Forest Ink** (`ink`): primary text and transient feedback surface.
- **Quiet Sage Ink** (`muted`): captions, source notes and secondary labels.
- **Sage Rule** (`line`): table rows, dividers, input borders and panel boundaries.

**The Action Pine Rule.** Use pine for actions, selected work and evidence progress. Use the other muted color families to classify roles, approaches or status alongside written labels.

## Typography

**Display Font:** the system sans stack in `headline`; there is no separate display face.
**Body Font:** the same system sans stack in `body`.

**Character:** compact, neutral product typography. Weight, spacing and position establish hierarchy; the type never competes with the work.

### Hierarchy
- **Headline:** `headline` for page headings; `headline-mobile` at the mobile breakpoint. Headings use balanced wrapping.
- **Title:** `title` for section headings; `subheading` for local groups. Reviewed exercises use `exercise-title`; receipts use `receipt-title`. These reduce to (18px) and (22px) on mobile.
- **Body:** `body` is the inherited base. Paragraphs cap at (72ch); most operational content uses compact local sizes.
- **Label:** `label` describes the standard action. `tag` describes the small status chip. Labels use sentence case.
- **Caption:** `caption` is the general supporting-text role. Existing dense tables and metadata also use local small sizes; those are component details, not a new primary reading scale.

## Layout

Use a persistent navigation edge and a flexible central work area. The optional module rail supports work without navigating away. At the standard desktop width, navigation is (204px), central content is flexible and an open rail is (276px); main padding is the `page` token. The desktop top bar is (69px) tall. Content groups use the `section` rhythm, with small local gaps for data.

Observed responsive steps:
- At (1600px) and above, navigation grows to (218px), the rail to (300px), and main padding becomes (38px 44px).
- At (1280px) and above, the selected opportunity places its open nine-approach legend beside the step list in a (180px) reference column with a (22px) gap. Below this width, the legend is folded immediately above the steps.
- At (1200px) and below, navigation narrows to (184px), an in-grid rail to (252px), and main padding becomes (26px 24px).
- At (1000px) and below, navigation is (180px); modules become a fixed right panel (300px wide). Opportunity details stack, and wider multi-column groups reduce columns.
- At (760px) and below, content uses one column with (26px 20px) main padding. Navigation becomes a menu panel (232px wide). The top bar is sticky and (60px) tall. The module panel is (330px) wide, capped at `calc(100vw - 36px)`, and fills the dynamic viewport height. Tables preserve data by moving secondary fields below identity rather than causing horizontal document scroll.

The selected home expression keeps people navigation, goal progress and a next-module rail available together on desktop. Its current central reading order is goal, illustrative metric, applied-evidence links when available, outputs, team map and opportunities. Do not assume the full team map fits above the fold. At mobile width, menu and modules are explicit modal panels. A viewport change out of the mobile navigation mode closes that modal state and restores focus to the active navigation link.

## Elevation & Depth

Ordinary content uses flat white or tinted surfaces, a single quiet border and internal row rules. Tonal separation carries the structure. There is no shadowed card grid. Shadows are restricted to the transient toast and the module panel when it overlays content.

### Shadow Vocabulary
- **Transient feedback:** `--shadow` (`0 8px 32px #24372f1c`) beneath the toast.
- **Overlay rail:** (`-10px 0 35px #24372f16`) beneath the fixed module panel.

**The Flat Work Surface Rule.** Keep ordinary panels flat and bordered. Reserve shadows for transient overlays and feedback.

Motion is brief state feedback: the mobile navigation slides and the toast fades/moves with (0.18s ease-out). Card-sort choices lift on hover by (2px). The reduced-motion media query removes transitions and transforms. Motion never carries the only explanation of state.

## Shapes

Panels use the `panel` radius; ordinary controls use `control`. Smaller cards, chips and icon controls use their corresponding frontmatter values. The active task card is slightly softer through `task`; person initials use circles. Rules remain thin (1px) and outlines stay precise. Dense lists share a single outer panel with row dividers instead of giving every row a separate silhouette.

Inline icons use a consistent outline vocabulary with round caps and joins. The ordinary icon is (18px), drawn from a (24px) viewBox with a (1.65px) stroke. Person initials, category washes and the small card-sort illustration supply recognition without stock imagery.

## Components

### Buttons

Quiet and practical, with the filled pine action providing the clearest next step. Primary and secondary variants use the `control` radius and the frontmatter padding. Desktop standard buttons have a minimum height of (40px); compact controls use (32px), with (34px) actions beside the North Star context. On mobile, standard and compact actions reach at least (44px). Secondary actions use a line border and shift to the navigation wash on hover. Text actions use pine with an underline on hover. Disabled buttons reduce opacity and stop hover movement.

All keyboard-focusable controls retain a (2px) focus outline with (3px) offset. This is a focus state, not a substitute for active navigation or selected opportunities.

### Chips

Small rectangular chips with the `pill` radius classify status, effort or approach. Text and background use paired dark/light family tokens. Labels remain readable independently of color. Module-format tags are a quieter outlined sibling; they describe how an exercise runs, separately from progress status. Use `module.format` for exercise metadata in the library and module rail. `module.type` groups the library into individual or team work; it does not override the execution format. Bet up belongs to the team-work library group and runs Solo · AI-guided.

### Cards / Containers

Flat surfaces with a quiet line border and the `panel` radius group related work. The metric panel uses `metric-panel`; the goal strip uses `goal-strip`. Lists use shared container edges and internal row rules. Smaller opportunity cards use the `card` radius and preserve owner, effort band/range and the actual step-approach mix. Hover changes a border or background; it does not add decorative depth.

### Opportunity Comparison

Opportunity cards expose a full build label and range before selection: Small build · S (3–7 days), Medium build · M (10–20 days), or Large build · L (20–40 days). The effort strip uses `opportunity-build`, with Pine Wash, Ochre Wash and Lilac Wash respectively. Written bands and ranges carry the meaning independently of color.

Each card counts its selected steps by approach and shows those counts with short readable labels and small color markers. Derive this mix from the card's actual steps; the primary approach tag is a separate summary. Gross hours and money remain explicitly labelled estimates. Within the selected detail, the nine-approach legend sits with the work it explains, beside the steps on wide screens and folded immediately above them at narrower widths.

### Readable Work Labels

**The Readable Work Rule.** Show plain work labels in the interface. Keep source-task, O*NET and trace identifiers in internal data, and use sentence-case approach labels instead of implementation keys.

Approach tags, step labels and the legend share the display-label mapping, including Records app and Prediction model. Compact approach counts use the corresponding short labels. Human-readable source notes remain available without exposing raw identifiers.

### Inputs / Fields

White fields with a quiet stroke and the `control` radius use `text-field` padding and a minimum height of (44px). Labels remain visible outside inputs. Focus changes the border to pine and retains the global focus outline. Validation is written beside the affected form in the error color. Exercise validation announces the missing information and focuses the first incomplete field. Source, voice and manual paths converge on the same editable roster; proposed extraction is reviewed before saving.

### Navigation

The navigation surface anchors the organization, workspace destinations and named people. Active destinations use a stronger sage tint and pine text; hover uses a quiet wash. People links retain both names and roles, with colored initial markers. Long role text may truncate in navigation, while the destination and team map retain the full identity. Mobile navigation and module panels receive focus when opened, contain keyboard focus, close with Escape and restore focus to the trigger. Hidden navigation is inert. Moving back above the mobile breakpoint clears its backdrop/modal state and focuses the active sidebar destination.

**The Named People Rule.** Keep the person and role visible when representing a twin, an opportunity owner or a module contribution.

### Goal Progress and Contribution

The goal strip names the output count and reinforces it with five segments; informed segments use pine. Output rows show a label, an explanation, the source module and status. Completion names exactly what changed and links to the goal and role. The separate metric panel labels the HR metric and four inputs as illustrative and leaves unvalidated baseline and target values unset.

### Module Disclosure

An open rail presents one suggested next module, then quieter expandable library items. Each module names the goal output it informs before the action. Library rows keep format, audience/time and progress as separate signals. The eight North Star exercises retain their source order; the Guide live workshop is a separate bundle. Confidence ladder and Bet up are runnable exercises with review and completion states, alongside the four-card sort. Native disclosure behavior exposes details on demand rather than showing every explanation at once.

Use these plain exercise names in source order: Pick the game; Sort the team’s measures; Surface assumptions; Confidence ladder; Write the statement; Agree the metric and inputs; Bet up; Turn inputs into actions. Every exercise displays numeric minutes alongside its format and audience. When the source supplies no timing, retain the visible “proposed” qualifier: Sort the team’s measures (15 min), Surface assumptions (10 min), Bet up (20 min) and Turn inputs into actions (20 min). These are planning estimates, not attributed source timings. The Bet up exercise header uses the same proposed duration as its library row.

### Reviewed Exercises

Confidence ladder and Bet up share a three-step sequence: edit, review, then added to the goal or plan. Small numbered circles and written step names distinguish current, reached and future steps; the current step gains weight and reached steps use pine. A pine-wash context block keeps the illustrative metric visible. Review names the consequences before the lead applies them. Source notes keep the HR adaptation, simulated guide and unvalidated hypotheses explicit.

**The Review Before Apply Rule.** Separate draft edits from applied North Star evidence. Require review before applying, then show a receipt linking directly to each changed output.

Edits and applied results persist separately in this browser. Saving or returning to edit retains the last applied result until a new review is confirmed. Required fields prevent review with incomplete information; an explicit stop decision is a complete pilot decision. Completion offers both an output link and a way back to edit.

### Journey Rows

A shared bordered panel contains numbered, ruled journey rows. Each row keeps the moment, person and value together, followed by a 1–5 confidence rating, an optional AI-support choice with its human boundary, and an observable trust signal. Ratings and signals are required; AI support is optional. Review repeats the rating, written AI/human status, signal, boundary and changed opportunity.

Desktop fields form two columns with a (40px) inset beneath identity; the signal spans both. At mobile width, fields become one column with no inset, and row padding changes from (22px) to (18px 16px). The checkbox glyph is (20px); its labelled mobile control retains a (44px) target. The pattern adds evidence to a named twin and opportunity without treating a confidence rating as a measured outcome.

### Bet Traces and Stop Decisions

Pilot rows reuse the journey panel grammar. Two numbered levels ask what work should increase or decrease, then which input that change would move. Every continued pilot requires a chosen input, a described first change and a test signal. A live written preview exposes the chain while editing. The explicit “No credible link” choice uses Clay Wash and records that the pilot will stop.

Review presents three quiet navigation-wash blocks: pilot → first change → input. They sit horizontally on desktop and stack with downward arrows on mobile. Labels preserve the causal order independently of arrows. A stopped decision has written stop status and reason. Once applied, stopped pilots leave active plan quarters and remain in a separate stopped section with a route back to review.

### Module Receipts and Applied Evidence

Receipts use a centred heading and success mark above a flat, ruled changes list, with a maximum width of (850px). Each row names the changed output, states what was added or stopped, and links directly to its twin, opportunity or initiative. Detail links scroll to and focus the selected opportunity or initiative, including a stopped pilot. Row padding changes from (19px 22px) to (17px) on mobile. A goal action and an edit action remain available after completion.

Applied evidence appears beside the work it changes: linked summaries on the goal, journey rows in the team twin, pine-wash evidence within opportunities, and input hypotheses within initiatives. Labels and test signals distinguish these contributions from the original model draft. Ratings, marked AI candidates and causal traces remain hypotheses to test; applying them updates the mock workspace, not the illustrative metric or capacity estimate.

### UX Acceptance Retained from the Selected Direction

- Visual hierarchy → filter → one next-module action, with secondary exploration links → a lead can resume card sorting from home.
- Recognition over recall → meaning → people and roles remain named → each person opens their role twin.
- Progressive disclosure → filter → opportunity details and approach legend expand on demand → all step approaches remain inspectable.
- Feedforward → act → each module says which goal output it adds → completion names the added evidence.
- Goal gradient → act → a concrete 4-card sort with review and completion → progress persists and updates home.
- Cognitive load → filter → defaults use the supplied team and editable extraction → all input paths end at the same roster.
- Fitts's law → act → mobile controls and actions have at least (44px) targets → usable at (390px).
- Provide exit points → memory → module success links to the goal and role → no dead-end completion.

- Feedback and control → act → journey ratings and two-level pilot traces expose their consequences in review → applying produces a receipt and links to each changed output.
- Traceable decisions → meaning → a pilot needs a controllable input or an explicit stop → stopped pilots remain inspectable outside the active plan.

The final system includes the completed card sort, Confidence ladder and Bet up flows, their review and receipt states, and the applied evidence shown in the goal, twin, opportunities and plan. Other library previews retain their stated scope.

## Do's and Don'ts

### Do:
- **Do** use the frontmatter tokens and the CSS custom properties in app.css as the same palette.
- **Do** keep people, roles, owners and contribution labels beside their visual markers.
- **Do** expose one next-module action with quieter exploration links.
- **Do** reflow data into a single reading column on mobile and preserve every field through wrapping or disclosure.
- **Do** preserve visible keyboard focus, panel focus entry and restoration, and mobile controls with at least 44px targets.
- **Do** keep illustrative metrics and gross estimates labelled where they appear.
- **Do** preserve the last applied evidence while edits remain in draft, then link every receipt to the changed work.
- **Do** use exercise format for module metadata and keep library grouping separate.
- **Do** show numeric module durations and label proposed timings honestly.
- **Do** compare opportunities with complete effort ranges and counts derived from their actual steps.

### Don't:
- **Don't** introduce external fonts, a CDN, a build requirement or a separate icon font into this static design world.
- **Don't** turn ordinary content into a shadowed card grid.
- **Don't** use color alone to communicate approach, ownership or completion.
- **Don't** style a draft metric or scenario as a validated organisational measurement.
- **Don't** treat card sorting as validation of monetary savings or returned capacity.
- **Don't** present confidence ratings, AI-support marks or pilot traces as validated outcomes.
- **Don't** hide a stopped decision or leave its pilot in active plan quarters.
- **Don't** expose raw source-task, O*NET or trace identifiers as product copy.
- **Don't** promote one screen's exact composition or an unimplemented module state into a system-wide rule.
