---
name: Facelift Design System
description: Professional social media management platform — precision-engineered for confident operators.
colors:
  primary-blue: "#1339ec"
  primary-blue-hover: "#0f2ebd"
  primary-blue-pressed: "#0c228d"
  primary-blue-focus: "#5581f1"
  primary-blue-subtle: "#eef3fd"
  primary-blue-subtle-pressed: "#dfe7fd"
  shell-ink: "#111317"
  surface-base: "#ffffff"
  surface-neutral: "#f3f5f7"
  border-subtle: "#f3f5f7"
  border-soft: "#e7eaee"
  border-base: "#d3d7de"
  border-bold: "#a7aebe"
  text-primary: "#111317"
  text-secondary: "#5f6a82"
  text-placeholder: "#848ea4"
  text-disabled: "#a7aebe"
  text-on-color: "#ffffff"
  status-success: "#2e881b"
  status-success-bg: "#e9ffcf"
  status-warning: "#e05a00"
  status-warning-bg: "#ffede2"
  status-danger: "#cc0000"
  status-danger-bg: "#ffebeb"
  ai-violet: "#c68ed7"
typography:
  display:
    fontFamily: "'Lota Grotesque', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: "80px"
    letterSpacing: "-2.88px"
  headline:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "36px"
  title:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "24px"
  body:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "18px"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "1024px"
spacing:
  xxxs: "2px"
  xxs: "4px"
  xs: "6px"
  s: "8px"
  sm: "10px"
  m: "12px"
  l: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-blue}"
    textColor: "{colors.text-on-color}"
    rounded: "{rounded.lg}"
    padding: "7px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-blue-hover}"
    textColor: "{colors.text-on-color}"
    rounded: "{rounded.lg}"
    padding: "7px 16px"
  button-primary-disabled:
    backgroundColor: "{colors.border-soft}"
    textColor: "{colors.text-placeholder}"
    rounded: "{rounded.lg}"
    padding: "7px 16px"
  button-secondary:
    backgroundColor: "rgba(95,106,130,0.08)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "7px 16px"
  button-secondary-hover:
    backgroundColor: "rgba(95,106,130,0.12)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "7px 16px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  filter-chip-hover:
    backgroundColor: "{colors.surface-neutral}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  card:
    backgroundColor: "{colors.surface-base}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "0"
  nav-header:
    backgroundColor: "{colors.shell-ink}"
    textColor: "{colors.text-on-color}"
    height: "44px"
  sidebar-nav:
    backgroundColor: "{colors.surface-base}"
    textColor: "{colors.text-primary}"
    width: "240px"
---

# Design System: Facelift

## 1. Overview

**Creative North Star: "The Quiet Professional"**

Facelift is an operations layer, not a showpiece. Its interface is built for professional social media managers, community operators, and enterprise marketing teams who are under real pressure and do not have time to decipher a designer's aesthetic statement. The visual system earns trust by being invisible: nothing calls for attention unless it needs to be acted on.

The palette is almost entirely grey and white. Blue enters the frame only to direct action. The dark carbon shell — the app header — gives the product a grounded, production-grade presence. Content lives on white surfaces. The workspace behind them is light grey. The shell is near-black. Nothing crosses those registers without reason.

The design guidelines are explicit: "The main interface consists of grey/black/white tones. Blue is the primary color and is used to guide the user to the main action. Do not use decorative elements, shadows or gradients." This is not a system that performs. It performs its job.

The app structures content around three layout patterns: a standard two-panel (sidebar + content), a three-panel (inboxes + feed + context), and a four-panel (secondary nav + inboxes + feed + context). Each panel scrolls independently. Each except the main content panel has a collapse control.

**Key Characteristics:**
- Near-monochromatic interface: shell ink, workspace grey, surface white, one action blue
- Reduction as a design principle: space over lines, no decorative elements
- Flat at rest; elevation only in response to state (hover, overlay, focus)
- One primary blue for direction, status colors for system feedback only
- AI features marked with a deliberate violet departure (Lifty Violet) to signal a distinct interaction model
- Dense information capability: 14px body, compact spacing scale, structured multi-panel layouts
- 1,140 components, 429 icons, 74 tokens — always use the system before writing custom markup


## 2. Colors: The Reduced Palette

Four tones carry the interface; status colors and violet AI accents appear only when the system needs to say something specific.

### Primary

- **Directive Blue** (`#1339ec`, `--sys-primary-default`): The single active voice. Used on primary CTA buttons, active navigation state, focus rings, links, selected segmented control items, today-column highlight. Its rarity is the point — everything blue is actionable.
- **Directive Blue Hover** (`#0f2ebd`, `--sys-primary-hover`): Pressed and hover states on primary blue elements. Never used independently.
- **Directive Blue Focus** (`#5581f1`, `--sys-border-focus`): Focus ring color only. Lighter than primary to distinguish keyboard navigation from click intent.
- **Directive Blue Subtle** (`#eef3fd`, `--sys-primary-subtle-hover`): Background tint for ghost button hover, today-column calendar highlight, selected calendar cards (solid 2px border, NOT background tint for cards — see Components).
- **Directive Blue Subtle Pressed** (`#dfe7fd`, `--sys-primary-subtle-pressed`): Ghost button pressed state, selected filter chips.

### Neutral

- **Shell Ink** (`#111317`, `--grey-900`): The app header and icon-only collapsed sidebar only. Grounds every screen. Never used on content surfaces or the expanded sidebar.
- **Surface Base** (`#ffffff`, `--sys-background-base`): Cards, panels, modal backgrounds, expanded sidebar, and any surface carrying user content. White = content zone.
- **Studio Grey** (`#f3f5f7`, `--sys-background-neutral`): The workspace background behind content surfaces. Dashboards, settings pages, and page backgrounds use this. Content rises from it onto white.
- **Border Soft** (`#e7eaee`, `--sys-border-soft`): Card borders, row dividers, section separators, page header bottom borders. Light — structural, not prominent.
- **Border Base** (`#d3d7de`, `--sys-border-base`): Input borders, stronger dividers, active container outlines. Readable on white surfaces.
- **Border Bold** (`#a7aebe`, `--sys-border-bold`): High-emphasis dividers, placeholder-level text borders.
- **Ink Text** (`#111317`, `--sys-text-primary`): Primary body text. Same value as Shell Ink.
- **Slate Text** (`#5f6a82`, `--sys-text-secondary`): Labels, metadata, supporting copy.
- **Ash Text** (`#848ea4`, `--sys-text-placeholder`): Placeholder text, timestamps, tertiary annotations.
- **Mist Text** (`#a7aebe`, `--sys-text-disabled`): Disabled states. Same value as Border Bold.

### Secondary: Status Colors

Status colors appear only in system-generated feedback. Never used as branding or decoration.

- **Growth Green** (`#2e881b`, `--sys-success-content`) on **Spring Wash** (`#e9ffcf`, `--sys-success-default`): Post published, approval granted, connected status, positive sentiment.
- **Ember Orange** (`#e05a00`, `--sys-warning-content`) on **Peach Wash** (`#ffede2`, `--sys-warning-default`): Expiring token, caution message, warning state.
- **Alert Red** (`#cc0000`, `--sys-danger-content`) on **Blush Wash** (`#ffebeb`, `--sys-danger-default`): Failed post, rejection, destructive action confirmation, negative sentiment.

### Tertiary: AI Accent

- **Lifty Violet** (`#c68ed7`): Reserved exclusively for AI-powered features. Deliberately breaks from the rest of the system to signal a distinct interaction model. Never used for standard UI states.

### Color Quick Reference

| Situation | Token |
|---|---|
| Primary CTA, links, active states | `--sys-primary-default` |
| Default body text | `--sys-text-primary` |
| Muted/supporting text | `--sys-text-secondary` |
| Placeholder text | `--sys-text-placeholder` |
| Disabled text and icons | `--sys-text-disabled` |
| Text on dark backgrounds | `--sys-text-on-color` |
| Page/panel background | `--sys-background-base` |
| Workspace/page bg | `--sys-background-neutral` |
| Default input border | `--sys-border-base` |
| Card/soft border | `--sys-border-soft` |
| Focus ring | `--sys-border-focus` |
| Success feedback | `--sys-success-default` / `--sys-success-content` |
| Warning feedback | `--sys-warning-default` / `--sys-warning-content` |
| Danger feedback | `--sys-danger-default` / `--sys-danger-content` |

**The One Voice Rule.** Directive Blue is the only color permitted on a primary interactive element. Everything blue is actionable; if you are reaching for a second accent to add interest, stop.

**The Secondary Palette Belongs to Users.** The extended ramps (violet, purple, azure, cobalt, indigo, petrol, mint, emerald, peridot, yellow, amber, beige, coral) are reserved for user-generated content: campaign bars in the calendar, tags, channel badges, custom labels. The product's own interface uses grey/white/blue only.


## 3. Typography

**Body / UI Font:** Helvetica Neue (Helvetica, Arial, sans-serif fallback)
**Display Font:** Lota Grotesque (marketing contexts only — never inside the product shell)

**Character:** Single-family for all product UI. Helvetica Neue at 14px reads with professional neutrality. Lota Grotesque with tight negative tracking appears only in display sizes for marketing; it is never used inside the app.

### Hierarchy

- **Display** (Lota Grotesque, 400, 72px/80px, −2.88px tracking): Marketing and hero sections only. Never inside the product shell.
- **Heading XL** (Helvetica Neue, 700, 28px/36px): Page-level titles. One per view.
- **Heading Lg** (700, 24px/32px): Section headers within a module.
- **Heading Md** (700, 20px/28px): Panel headings, dialog titles.
- **Heading Sm / Title** (700, 16px/24px): Card titles, group headings, navigation labels.
- **Heading XS** (700, 14px/20px): Inline section labels, tight heading contexts.
- **Body Md Regular** (400, 14px/20px): Default UI text — labels, descriptions, cell content.
- **Body Md Medium** (500, 14px/20px): Emphasized labels, selected state text, button labels.
- **Body Md Bold** (700, 14px/20px): Strong emphasis within body context.
- **Body Sm Regular** (400, 12px/18px): Metadata, timestamps, compact table annotations.
- **Body Sm Medium / Bold** (500/700, 12px/18px): Column headers, badge text, compact labels.
- **Paragraph** (400, 16px/24px): Long-form readable content; not used for UI labels.

**The Two-Scale Rule.** In-app UI uses only the BB Update scale (Helvetica Neue). Never mix Lota Grotesque into product screens. 12px (`--extras-small-extra-small`) is the floor for visible text — nothing smaller.


## 4. Elevation

Flat by default. The design guidelines explicitly prohibit decorative shadows and gradients. Depth is expressed through the three-tier background system: shell ink grounds the product, studio grey is the workspace, white content surfaces float above it. No shadow needed to establish that hierarchy.

Shadows enter only as a state response: hover (card lifts toward the user), overlay (menu, modal, tooltip appears above the content plane).

### Shadow Vocabulary

- **Content Hover** (`0px 1px 4px 0px rgba(0,0,0,0.10), 0px 4px 8px -2px rgba(0,0,0,0.10)`) — `--shadows-shadow-md`. Post cards, list items, dropdowns — applied on hover only, never at rest.
- **Widget Resting** (`0px 1px 3px 0px rgba(172,172,172,0.20)`) — `--card-widget---default`. Dashboard widgets only. Very low opacity warm shadow.
- **Widget Hover** (`0px 6px 12px 0px rgba(172,172,172,0.10), 0px 1px 3px 0px rgba(172,172,172,0.20)`) — `--card-widget---hover`. The widget lifts on hover.
- **Media Resting** (`0px 0px 8px 0px rgba(0,0,0,0.25)`) — `--media-item---default`. Media library thumbnails. Higher opacity because no border.
- **Media Hover** (`0px 4px 8px 0px rgba(0,0,0,0.25)`) — `--media-item---hover`. Directional lift on hover.

Context menus and dropdowns use `--shadows-shadow-md` and require high z-index with portal/fixed positioning — they must never be clipped by a panel's `overflow:hidden`.

**The Flat-by-Default Rule.** A resting surface has no shadow. Adding a shadow to a resting card is decoration, not affordance. Shadows are earned by hover, overlay, or genuine z-elevation.


## 5. Components

### Buttons

Five semantic families (Primary, Secondary, Danger, Success, Warning), three emphasis levels (Bold, Subtle, Minimal), four sizes (XS, S, M, L), six states.

- **Shape:** Gently rounded (8px radius). Round variant (1024px radius) for icon-only pill buttons.
- **Primary Bold:** Directive Blue (`#1339ec`) background, white text, 7px/16px padding (medium). Hover shifts to `#0f2ebd`. Never more than one per screen.
- **Secondary Ghost:** Alpha grey (`rgba(95,106,130,0.08)`) background, dark text. Hover fills to `rgba(95,106,130,0.12)`.
- **Subtle/Minimal variants:** Transparent at rest, brand-blue or grey text; hover fills with `blue-50` or grey tint.
- **Danger/Warning/Success:** Respective semantic color as fill (bold) or text+tint (subtle). Structure identical to primary/secondary.
- **Disabled:** Border Soft background, Ash Text. No hover treatment.
- **Split Button:** When a primary action has sub-actions — primary label segment + hairline semi-transparent divider + chevron-down segment. Both segments share `--sys-primary-default` background.
- **Focus ring:** 2px offset at `--sys-border-focus` (`#5581f1`) on all interactive states.

### Filter Chips and Tags

- **Filter chips** (toolbar): Fully rounded pill (1024px). Transparent at rest, 1px Border Base. Hover fills Studio Grey. Active/selected: Directive Blue Subtle background, blue border, dark text.
- **Tag chips** (data): Colored pill from the secondary user palette. Show first two in a row, then a grey `+N` overflow chip. Never wrap to a second line.
- **Status badges** (see Status Indicators below): Different shape and rules — not interchangeable with tag chips.

### Cards / Content Surfaces

- **Corner Style:** Gently rounded (8px radius).
- **Background:** Surface Base white — content always rises from the grey workspace.
- **Shadow Strategy:** None at rest. Hover applies `--shadows-shadow-md`. Dashboard widgets use `--card-widget---default` resting.
- **Border:** 1px Border Soft at rest. Shifts to Border Base on hover.
- **Selected State:** Solid 2px Directive Blue border. Background stays white. Never use a background tint for selection on cards — it conflicts with hover states.
- **Internal Padding:** Post cards 6–8px, section panels 16–20px, compact list items 8–12px.

### Inputs / Fields

- **Style:** 1px Border Base, white fill, 8px radius. Medium height 36px, small 32px.
- **Focus:** Border shifts to `--sys-border-focus` (`#5581f1`), 1px box-shadow ring at same color.
- **Placeholder:** Ash Text (`#848ea4`).
- **Error:** Border shifts to Alert Red, small error label below.
- **Disabled:** Border Soft background, Ash Text, no pointer events.

### Compose / Input Areas

- **Container:** Bordered box — Border Base at rest, focus ring on focus.
- **Text area:** Grows vertically with content.
- **Toolbar:** Inside the textarea box at the bottom row — Bold / Italic / Underline / Strikethrough / list / emoji / overflow. Left-aligned.
- **Send button:** Primary blue, anchored to the bottom-right corner of the panel, outside the input box border.

### Navigation — App Shell

The most structurally distinctive pattern. It defines Facelift's visual identity.

**App Header (always Shell Ink, always visible):**
- Background: Shell Ink (`#111317`). Height: 44–56px.
- Left: hamburger (36px, 8px radius, alpha-white-16 hover) → 28–30px logo mark (brand blue square, 7–8px radius) → product name (15px/700, white) → optional divider → module shortcuts.
- Right: "Today's Tasks" pill with orange (`--orange-500`) count badge (shown even at zero) → gear → chat → notification bell → 32px circular user avatar.
- Icon buttons: 20px white icons, `aria-label` required. No text labels.

**Icon Sidebar (Shell Ink, collapsed state):**
- Background: Shell Ink. Width: 52px. Icon buttons 36×36px, 8px radius.
- Active: alpha-white-16 fill, Directive Blue icon. Inactive: grey-600 icon. Hover: alpha-white-16.
- 1px grey-800 right border separating it from content area.

**Expanded Sidebar (Surface Base white, NOT dark):**
- Background: Surface Base white (`#ffffff`). Separated from content by Border Soft right border.
- Width: ~240px. Nav items: 20px icon + label; active = filled chip (brand blue bg, white text).
- Expandable items: chevron-right appended; chevron points down when open.
- Settings variant: Section header (bold + chevron) → indented children; active child = light grey pill.
- The filled chip is the only sanctioned active indicator. Never use underline, left border accent, or bold text alone.

**Toolbar / Module Header:**
- Background: Surface Base. Height: 56px. Border Soft bottom border.
- Contains: view toggle (segmented control), date navigation, filter chips, primary action button (right-aligned).

### Segmented Controls

- Outer: Studio Grey background, 1px Border Base, 8px radius, 2px inner padding.
- Button resting: transparent, Slate Text, 5px/13px padding, 6px inner radius.
- Button active: white background, Ink Text, `0 1px 2px rgba(0,0,0,0.12)` shadow.

### Page Header Anatomy

1. **Title row:** Page title (Heading XL or Lg, left) + optional dropdown chevron + optional ⋯ overflow; CTAs right-aligned (secondary ghost buttons first, primary button last).
2. **Subtitle/quota:** One line of Slate Text — counts, quota, or filter summary as plain text.
3. Item counts are plain secondary text directly below the title ("75 labels"). Never wrap counts in badge chips. Chips in headers are reserved for status or filter indicators.

### Data Tables

- **Row anatomy:** Col 1 optional expand chevron (▶/▼) → Col 2 name (16–20px colored icon + body-md-medium title + body-sm secondary sub-label) → Col 3 ⋯ overflow (hover only) → data columns → timestamps right-aligned in secondary color.
- **Data columns:** Date (calendar icon prefix), Status (colored circle + label + ▾ chevron), Tags (colored pill chips, first 2 visible + grey `+N` overflow, never wraps), Assignees (stacked avatar circles, up to 3 + `+N` grey overflow).
- **Row borders:** Border Subtle horizontal dividers only. No vertical column dividers. Header uses Border Soft bottom border.
- **Sort indicator:** ↑ or ↓ inline in the active column header only. No indicator on inactive columns.
- **Inline toggle:** Toggle switch as the first element in the name column. Blue track = on, grey = off.
- **Inline status edit:** ▼ chevron after label. Click opens popover, not modal.
- **Warning row:** Amber triangle icon replaces content icon. Row background stays unchanged.
- **Label color dot:** Filled circle (~8px) in the label's own color prefixing the row name. The only place a raw color from the user palette appears — it is data, not design.

### Status Indicators

Four distinct shapes serve different semantic contexts — they are not interchangeable.

| Type | Shape | Icon | Values |
|---|---|---|---|
| Post status badge | Inline label, no pill | Filled diamond ◆ | Green (Successful), Orange (Draft), Red (Failed), Blue (Scheduled) |
| Sentiment badge | Pill + dot, all-caps | Small filled dot | Red (Negative), Grey (Neutral), Green (Positive) |
| Record status | Inline label + ▾ chevron | Colored circle ● | Grey (Draft), Blue (Scheduled), Green (Published), Red (Failed) |
| Toggle | Toggle switch | None | Blue track (on), Grey track (off) |

Use ◆ diamond for post status on calendar cards and headers. Use pill chip for sentiment badges only. Mixing these shapes makes the semantic ambiguous.

### Calendar Post Cards

- **Top:** Status badge — ◆ icon (colored by status) + status label (body-sm-medium).
- **Middle:** Media thumbnail (grey placeholder if no image). Fills most card height.
- **Thumbnail overlay:** Social network icon as small circle badge, bottom-left.
- **Bottom:** Title text, 1 line truncated (body-sm-regular). Optional tag chips if tags exist.
- **Video thumbnails:** Always show semi-transparent ▶ play button at rest — not only on hover.
- **Selected:** Solid 2px Directive Blue border. Background stays white.
- **Timeline rows:** Year row = amber/orange fill + calendar icon. Campaign rows = Studio Grey + name. These sit above day cells and never collapse.

### Feed List Items (Engage module)

- **Left:** 16px checkbox for bulk select.
- **Icon:** 16–20px platform/network icon.
- **Title:** body-md-medium, 1 line truncated.
- **Row actions (right):** Flag + checkmark — always visible, not hover-only.
- **Second line:** Timestamp (body-sm, `--sys-text-secondary`) + sentiment badge pill.
- **Bottom-right:** 24px assignee avatar circle.
- **Selected state:** `--sys-primary-subtle-hover` background tint + left border accent. This is one of the few sanctioned uses of a left border — selection state in feed lists only.
- **Unassigned label:** Small dark chip "Unassigned" on hover only.

### Context Menus and Dropdowns

- Container: Surface Base white, 8px radius, `--shadows-shadow-md`, min-width 200px.
- Trigger: Always ⋯ icon button. No visible border at rest; `--sys-secondary-hover` background on hover.
- Icons: 20px outlined icons. Disabled items remain in position, styled with `--sys-text-disabled`, `aria-disabled="true"` — do not hide them.
- Portal/fixed positioning required. Must not be clipped by panel `overflow:hidden`.

### Empty States

- **Icon:** 64px centered, muted grey (`--sys-text-disabled`). Never colored.
- **Heading:** Heading Sm or Md, bold. States directly what is missing.
- **Supporting text:** 1–2 lines, body-sm-regular, `--sys-text-secondary`. Explains why or what to do.
- **CTA:** Primary or secondary button only when a direct action exists.
- Center with `display:flex; flex-direction:column; align-items:center; justify-content:center`.

### Alerts and Banners

| Type | Placement | Dismissible |
|---|---|---|
| System banner | Full width above page title | Yes — ✕ close |
| Inline alert | Form section or card | No |
| Toast | Bottom-right, stacked, auto-dismiss ~4s | Optional |

Banner colors: semantic bg + semantic content color. Banner CTA uses matching semantic color (e.g., orange button on orange banner), not primary blue. Show one system banner at a time — combine or prioritize if multiple exist.

### AI Feature Components (Lifty)

- **Accent:** Lifty Violet (`#c68ed7`) exclusively. Not borrowed for any other UI purpose.
- **Icon:** Facelift AI icon required on every AI-powered entry point.
- **Treatment:** Violet icon, optionally violet tint background, violet border on AI-generated content. No gradient. No glow.


## 6. Do's and Don'ts

### Do:

- **Do** use Directive Blue (`#1339ec`) on one CTA per screen. Its rarity is what makes it direct attention.
- **Do** place all content surfaces on white (`#ffffff`) lifted from Studio Grey (`#f3f5f7`). Maintain the three-tier depth structure: shell / workspace / content.
- **Do** use the expanded sidebar on Surface Base white. Only the icon-only collapsed sidebar uses Shell Ink. The full navigation sidebar is always white.
- **Do** use a filled chip (blue bg + white text) as the active indicator in main navigation. No underline, left border, or bold-text-only alternatives.
- **Do** show item counts as plain secondary text below page titles ("75 labels"). Never wrap counts in badge chips.
- **Do** use ◆ diamond + label (no pill) for post status indicators on calendar cards. Use pill chips only for sentiment badges.
- **Do** show tag chips as first two + grey `+N` overflow. Never wrap tags to a second row.
- **Do** use space to separate content groups before reaching for a border or divider line.
- **Do** mark every AI-powered feature with Lifty Violet and the Facelift AI icon.
- **Do** reserve the secondary color palette (cobalt, amber, coral, etc.) for user-generated content only: campaign bars, tags, channel badges.
- **Do** apply `--shadows-shadow-md` on hover or overlaid layers only. Never on resting cards.
- **Do** use `aria-label` on every icon-only button. Never rely on tooltip as the sole accessible label.
- **Do** wrap non-essential transitions in `@media (prefers-reduced-motion: reduce)`.
- **Do** use `aria-disabled="true"` on disabled menu items rather than removing them from the DOM.
- **Do** use `--sys-border-focus` (`#5581f1`) as the focus ring on every interactive element. Never suppress `outline` without a CSS-based replacement.
- **Do** keep the compose toolbar inside the textarea box at the bottom. Keep the send button outside the textarea, anchored to the panel's bottom-right.
- **Do** use solid 2px Directive Blue border for selected calendar cards — background stays white.

### Don't:

- **Don't** use heavy gradients, flashy micro-animations, or visual decoration that performs excitement instead of delivering usefulness.
- **Don't** replicate the Hootsuite/Buffer aesthetic: cluttered hierarchies, inconsistent type scale, dense chrome competing with content.
- **Don't** add a resting shadow to a card or list item. Shadows are state responses, not ambient decoration.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, callouts, or alerts. The only sanctioned left border use is the selected-state indicator on feed list items in the Engage module.
- **Don't** apply `background-clip: text` gradient effects. All text is a single solid color from the token set.
- **Don't** use blur or glassmorphism effects. They conflict with the flat-by-default philosophy.
- **Don't** use Lota Grotesque inside the product UI shell. Marketing/hero contexts only.
- **Don't** use any color from the secondary ramps for Facelift's own UI. Those colors belong to user content.
- **Don't** use Lifty Violet outside AI feature contexts.
- **Don't** place more than one primary blue button on a screen.
- **Don't** rely on color alone for status, error, or success states — always pair with a text label and/or icon.
- **Don't** stack multiple system banners. One at a time — combine messages or prioritize danger > warning > info.
- **Don't** hide disabled menu items. Keep them visible, muted with `--sys-text-disabled`.
- **Don't** use pill chips for post status on calendar cards — that shape is reserved for sentiment badges.
- **Don't** use a background tint to indicate selected cards. Use the 2px Directive Blue border instead.
- **Don't** make the expanded sidebar dark. Only the icon-only (collapsed) sidebar uses Shell Ink.
