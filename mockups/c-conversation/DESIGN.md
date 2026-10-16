---
name: "agentlabs · Conversation first"
description: "A forest conversation beside a shared team canvas."
colors:
  green: "#234e3e"
  green-dark: "#183e34"
  lime: "#d5efb7"
  coral: "#b66551"
  coral-soft: "#f8e9e2"
  amplify-ink: "#89412e"
  blue: "#3d627c"
  blue-soft: "#e8eff5"
  amber: "#805b16"
  amber-soft: "#f8f0dc"
  error: "#a23c37"
  ink: "#203d34"
  muted: "#5c6c65"
  paper: "#ffffff"
  ground: "#f4f5f1"
  sage: "#e7eee5"
  sage-deep: "#c9debd"
  soft: "#edf2ed"
  line: "#dce3dc"
  line-dark: "#416454"
  control-border: "#bbc9bf"
  focus: "#b2d47c"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  conversation-body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  action-label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  tag: "5px"
  field: "6px"
  action: "7px"
  inset: "10px"
  message: "12px"
  surface: "14px"
spacing:
  compact: "8px"
  control: "12px"
  group: "16px"
  panel: "20px"
  section: "24px"
  section-gap: "30px"
  canvas-inline: "40px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
    typography: "{typography.action-label}"
    rounded: "{rounded.action}"
    padding: "10px 15px"
  button-primary-hover:
    backgroundColor: "{colors.green-dark}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.action-label}"
    rounded: "{rounded.action}"
    padding: "10px 15px"
  button-secondary-hover:
    backgroundColor: "{colors.sage}"
  button-text:
    textColor: "{colors.green}"
    typography: "{typography.action-label}"
    padding: "6px 0"
    rounded: "{rounded.action}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "9px 10px"
  tag:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.green}"
    rounded: "{rounded.tag}"
    padding: "4px 8px"
  tag-warning:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
  tag-human:
    backgroundColor: "{colors.blue-soft}"
    textColor: "{colors.blue}"
  surface:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
  canvas-nav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    height: "66px"
  task-choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inset}"
    padding: "18px 12px"
  task-card:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.message}"
    padding: "28px"
---
# Design System: agentlabs · Conversation first

## Overview

**Creative North Star: "Conversation first"**

A forest green conversation sits beside a quiet working canvas. The palette keeps the agent present while white surfaces, sage selection and compact rows make the team picture easy to inspect. The visual character is calm, practical and personal.

Density belongs inside lists, tables and task details. Space separates sections and actions. Single-stroke SVGs, modest curves and short state changes support the work without a decorative entrance sequence.

**Key Characteristics:**
- Forest conversation, pale working ground and white record surfaces.
- Compact labels and rows with generous section separation.
- Sage selection, green actions and coral people-focused accents.
- Single-stroke SVG icons and brief state transitions.

## Colors

Forest greens anchor the interface, pale green neutrals hold the records, and restrained warm and cool accents distinguish people, human judgement and review states. The frontmatter records the shared palette using the source CSS names.

### Primary
- **Forest Action** (`green`): primary buttons, active navigation, progress fills and data marks.
- **Deep Forest** (`green-dark`): conversation background and primary-button hover.
- **Lime Signal** (`lime`): agent identity, online status and selection emphasis on the forest surface.

### Secondary
- **People Coral** (`coral`): people-focused capacity, coaching and human-support icons; also the brand punctuation.
- **Coral Wash** (`coral-soft`) with **Amplify Ink** (`amplify-ink`): lead avatars and amplification labels.
- **Human Blue** (`blue`) and **Blue Wash** (`blue-soft`): human-step labels and supporting capacity categories.

### Tertiary
- **Review Amber** (`amber`) and **Amber Wash** (`amber-soft`): caution and review labels.
- **Error Red** (`error`): validation messages in editing forms.

### Neutral
- **Forest Ink** (`ink`) and **Muted Leaf** (`muted`): primary text and supporting text on light surfaces.
- **White Paper** (`paper`) over **Working Ground** (`ground`): record surfaces and the surrounding canvas.
- **Selection Sage** (`sage`), **Deep Sage** (`sage-deep`) and **Soft Green** (`soft`): selection, scrollbars and inset supporting surfaces.
- **Fine Line** (`line`), **Forest Line** (`line-dark`) and **Control Line** (`control-border`): light dividers, conversation dividers and form controls.
- **Focus Lime** (`focus`): the visible keyboard outline.

**The Green Anchor Rule.** Use green for primary actions, active navigation and progress; sage carries selection and supporting emphasis.

## Typography

**Body and Label Font:** the local system sans stack recorded in the frontmatter. No external font is loaded. Body text is neutral and familiar; compact labels and tabular numbers keep dense records readable.

### Hierarchy
- **Page heading:** the build uses a large headline (30px, weight 600, line-height 1.2, tracking −.035em), reduced on phones (27px). These are observed proportions, not a reusable display-face prescription.
- **Section heading:** the common section scale is compact (18px, weight 600, line-height 1.3, tracking −.02em). Container headings commonly tighten to 16px.
- **Body:** general content uses the body token; agent messages use the more open conversation-body token. Paragraphs cap at 70ch; page introductions cap at 65ch.
- **Label:** dense rows, metadata, navigation and helper text use the label scale. Primary actions use the action-label weight; row titles usually use weight 600.
- **Numeric data:** FTE and estimates use tabular numerals. Values gain weight rather than an extra decorative typeface.

## Layout

The desktop shell has a white masthead (68px) and a two-column workspace: a conversation column (354px) plus a flexible canvas. The conversation is sticky and viewport-height, with a scrolling thread and an anchored composer. The canvas has its own horizontal route navigation (66px high), a bounded content region (maximum 1450px) and a footer. Standard canvas padding is 32px above and 40px on the sides and below.

At widths from 761px through 1190px, the conversation narrows (310px), canvas side padding reduces (24px) and some supporting columns disappear. At 1600px and above, the conversation widens (380px) and canvas side padding grows (56px).

At 760px and below, the masthead reduces (61px), and a labelled Conversation/Canvas switch shows one view at a time. Canvas padding becomes 26px 20px 30px. Route navigation stays horizontally scrollable. Forms, comparison panels, input choices and task piles stack; roster entries place people beneath roles and retain FTE plus editing. Primary and secondary actions, icon controls, suggestion controls and switch buttons reach at least 44px high. Roster editing retains a full phone-sized action column.

The spacing vocabulary is deliberately compact: tight icon and label gaps, medium control and row gaps, then larger panel and section spacing. Shared containers group related records rather than adding a new elevated surface to every item.

## Elevation & Depth

This is a flat interface. White paper, sage fills, fine borders and the forest conversation establish depth through contrast. Regular cards, lists, forms and navigation have no box-shadow. The only ambient shadow belongs to the floating status toast; its source is retained in the sidecar.

**The Flat Surface Rule.** Working surfaces stay flat. Use tone and fine borders to separate them; the floating status toast carries the ambient shadow.

## Shapes

Use modest curves rather than pill-shaped controls: small tags, slightly softer fields, action buttons, inset panels, messages and broad working surfaces follow the radius tokens. Most light containers use a one-pixel Fine Line border and clip their internal row divisions. Avatars and numbered step markers are circular. User messages have one tighter corner (12px 12px 3px 12px), keeping conversation authorship visible without a separate card treatment.

Functional SVGs use no fill, current-color strokes (1.6px), round caps and joins. Their common base is 20px, with smaller icons inside controls and labels.

## Components

### Buttons

Compact and direct. Primary buttons use Forest Action with White Paper text; secondary buttons use White Paper, Forest Ink and a Control Line border. Both use the action radius and shared padding tokens. Desktop minimum height is 40px; phone minimum height is 44px. Primary hover deepens the forest; secondary hover adds sage and a green border. Text buttons keep a clear background and underline on hover. All keyboard targets use a focus outline (3px) with a visible offset (3px). Disabled buttons use reduced opacity (.45) and a not-allowed cursor.

### Chips

Quiet status labels rather than navigation pills. The default tag uses sage and green, with compact padding and the tag radius. Warning and human-state variants pair their pale background with their matching dark foreground. Approach labels reuse that semantic palette at a slightly tighter radius (4px).

### Cards / Containers

Shared white frames use the surface radius and a Fine Line border. List headers and rows supply their own internal spacing. Inset help panels use Soft Green; task cards use sage and the message radius. Content panels commonly use 20px, 22px or 24px padding; the task card uses 28px on desktop and 22px 18px on phones. Internal separators remain flat and fine.

### Inputs / Fields

Fields have visible text labels, white backgrounds, a Control Line stroke and the field radius. Text controls use the compact label scale and the recorded input padding. Minimum height is 40px. Forms use two columns on desktop and one on phones. Validation is a text message in Error Red. The composer is a white message surface with a borderless multiline field, muted placeholder, explicit accessible label and green send action.

### Navigation

Canvas routes use compact sentence-case labels, muted text and a transparent bottom border. The active route uses green text, a stronger weight (650) and a green bottom border (2px). Hover uses green text. Desktop links fill the navigation height. Phone links retain a minimum 44px target, and overflow stays inside the navigation strip. The phone view switch uses sage to mark the selected view.

### Roster and task sorting

The roster is one rounded white container: role, people, tabular FTE, systems and edit action align in compact rows. The desktop row minimum is 68px. Phone rows put role and people in the first column while FTE and editing remain aligned alongside them.

Task sorting pairs one sage task surface with three flat, bordered choice surfaces. The choices use the inset radius; hover adds sage and a green border. On phones they become full-width rows with icon, label, explanation and count. Completion and progress updates keep the same green-and-sage vocabulary.

The conversation can also run the sorting flow. Each captured answer appears as a compact divided row: task text above its chosen pile, using the existing conversation foreground colors (12px, task weight 500, 12px vertical padding). Conversation choices and typed pile answers update the same live canvas. After all five tasks, the conversation shows the draft choices; the canvas allows edits before the reviewed priorities are added to the goal and role twin.

### Capacity summary and opportunity list

The team estimate is a supporting sentence followed by a single proportional bar, rather than a separate row of large numbers. The sentence uses muted body text (13px) with an ink emphasis (weight 600). The bar is green over the existing administration tone, with a small radius (3px) and height (12px); its 55% fill is this sample’s capacity data, not a fixed component default. The two explanatory labels stack on phones.

The ten-opportunity sample sits in one white, bordered working container with bounded vertical scrolling (maximum 590px on desktop and 480px on phones). The scroll region is keyboard-focusable and keeps the existing focus outline. Rows use Soft Green on hover and sage when selected. Selection opens the related details below and moves focus there, keeping the list and detail connected.

### Guided exercise drafts and contributions

Guided exercises reuse the conversation and flat canvas surfaces. Answers appear as separated draft notes, then become editable at review. Review notes use white textareas with the existing field stroke and radius, open leading (13px, line-height 1.6) and a minimum height (94px). Metrics use paired measure and classification controls with visible labels and a minimum height (44px); the two columns stack on phones. Exercise and evidence text links also use 44px minimum phone targets.

Draft changes remain separate from applied contributions. The review lists proposed destinations; applying it adds contribution entries to the goal and linked details. These entries reuse the white surface, fine dividers, quiet status tags and green trace links. Their padding reduces from 24px to 18px 16px on phones. Long answers preserve line breaks and wrap within their column. This extends the existing component vocabulary without adding a new palette or elevation treatment.

## Do's and Don'ts

### Do:
- **Do** use the existing green action and sage selection roles consistently.
- **Do** group dense rows inside a shared white surface and divide them with fine neutral lines.
- **Do** preserve the visible focus outline and the phone control sizes in the shipped components.
- **Do** use inline single-stroke SVGs for functional icons.
- **Do** keep state changes brief and honor reduced motion.

### Don't:
- **Don't** add permanent shadows to the flat working surfaces.
- **Don't** use coral as the primary action color; it marks people-focused material and the brand punctuation.
- **Don't** turn every row into a separate floating card.
