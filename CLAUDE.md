# Design System — Claude Code Reference

This project uses a Figma-exported design system. All tokens, components, and icons are in the `output/` folder. **Always use them. Never invent colours, type styles, or shadows from scratch.**

---

## Tokens (`output/tokens/tokens.css`)

Link this file in every HTML page:

```html
<link rel="stylesheet" href="/output/tokens/tokens.css">
```

All values are CSS custom properties on `:root`. Reference them with `var(--token-name)`.

### Colors

The color system has two layers: a **reference palette** (raw ramps) and **semantic tokens** (aliases that map intent to a ramp step). Always prefer semantic tokens in UI code; use reference tokens only when no semantic alias exists.

#### Semantic tokens (use these in code)

**Text**

| Token | Resolves to | Use |
|---|---|---|
| `--sys-text-primary` | `--grey-900` `#111317` | Default body text |
| `--sys-text-secondary` | `--grey-500` `#5f6a82` | Muted / supporting text |
| `--sys-text-placeholder` | `--grey-400` `#848ea4` | Input placeholders |
| `--sys-text-disabled` | `--grey-300` `#a7aebe` | Disabled state text |
| `--sys-text-on-color` | `--grey-white` `#ffffff` | Text on coloured backgrounds |
| `--sys-text-brand` | → `--sys-primary-default` | Brand-coloured text |

**Background**

| Token | Resolves to | Use |
|---|---|---|
| `--sys-background-base` | `#ffffff` | Page / panel background |
| `--sys-background-neutral` | `--grey-50` `#f3f5f7` | Subtle tinted surface |

**Border**

| Token | Resolves to | Use |
|---|---|---|
| `--sys-border-subtle` | `--grey-50` `#f3f5f7` | Hairline divider |
| `--sys-border-soft` | `--grey-100` `#e7eaee` | Card border |
| `--sys-border-base` | `--grey-200` `#d3d7de` | Default input/container border |
| `--sys-border-bold` | `--grey-300` `#a7aebe` | Stronger divider |
| `--sys-border-contrast` | `--grey-700` `#414858` | High-contrast border |
| `--sys-border-brand` | → `--sys-primary-default` | Brand-coloured border |
| `--sys-border-focus` | `--blue-400` `#5581f1` | Focus ring |

**Primary (brand blue)**

| Token | Resolves to | Use |
|---|---|---|
| `--sys-primary-default` | `--blue-500` `#1339ec` | CTA buttons, links, active states |
| `--sys-primary-hover` | `--blue-600` `#0f2ebd` | Hover state |
| `--sys-primary-pressed` | `--blue-700` `#0c228d` | Pressed / active state |
| `--sys-primary-subtle-hover` | `--blue-50` `#eef3fd` | Ghost button hover bg |
| `--sys-primary-subtle-pressed` | `--blue-100` `#dfe7fd` | Ghost button pressed bg |

**Status**

| Token | Resolves to | Use |
|---|---|---|
| `--sys-success-default` | `--green-100` `#e9ffcf` | Success background |
| `--sys-success-content` | `--green-700` `#2e881b` | Success text / icon |
| `--sys-warning-default` | `--orange-50` `#ffede2` | Warning background |
| `--sys-warning-content` | `--orange-600` `#e05a00` | Warning text / icon |
| `--sys-danger-default` | `--red-50` `#ffebeb` | Danger background |
| `--sys-danger-content` | `--red-600` `#cc0000` | Danger text / icon |

**Secondary (ghost / grey)**

| Token | Use |
|---|---|
| `--sys-secondary-default` | Ghost button / chip background (alpha grey 8%) |
| `--sys-secondary-hover` | Ghost hover (alpha grey 12%) |
| `--sys-secondary-pressed` | Ghost pressed (alpha grey 20%) |

#### Reference palette (raw ramps)

Tokens follow the pattern `--{color}-{shade}`, e.g. `--blue-500`, `--grey-200`.

**Primary ramps**

| Colour | Shades | Key values |
|---|---|---|
| Blue | 50–900 | 500 = `#1339ec` (brand primary) |
| Grey | white, black, 50–900 | 900 = `#111317`, 50 = `#f3f5f7` |
| Green | 50–900 | 700 = `#2e881b` (success) |
| Red | 50–900 | 600 = `#cc0000` (danger) |
| Orange | 50–900 | 600 = `#e05a00` (warning) |

**Secondary ramps** — tokens available for all shades 50–900:

`--violet`, `--purple`, `--azure`, `--cobalt`, `--indigo`, `--petrol`, `--mint`, `--emerald`, `--peridot`, `--yellow`, `--amber`, `--beige`, `--coral`

**Alpha**

| Token | Value |
|---|---|
| `--alpha-grey-4` … `--alpha-grey-24` | `rgba(95,106,130, 0.04–0.24)` |
| `--alpha-white-16` / `--alpha-white-24` | `rgba(255,255,255, 0.16/0.24)` |
| `--alpha-black-40` | `rgba(0,0,0, 0.40)` |

> Do not hardcode any hex or rgba value that is not a passthrough of one of these tokens.

### Typography

Two font families are in use:

- **Helvetica Neue** — all UI text (body, labels, headings inside the app)
- **Lota Grotesque** — display/marketing headings only

Each text style exposes four properties: `-font-family`, `-font-size`, `-font-weight`, `-line-height` (and sometimes `-letter-spacing`).

**Body / UI scale (Helvetica Neue)**

| Style group | CSS prefix | Size / Weight |
|---|---|---|
| Body Md Regular | `---bb-update-body-body-md--regular` | 14px / 400, lh 20px |
| Body Md Medium | `---bb-update-body-body-md--medium` | 14px / 500, lh 20px |
| Body Md Bold | `---bb-update-body-body-md--bold` | 14px / 700, lh 20px |
| Body Sm Regular | `---bb-update-body-body-sm--regular` | 12px / 400, lh 18px |
| Body Sm Medium | `---bb-update-body-body-sm--medium` | 12px / 500, lh 18px |
| Body Sm Bold | `---bb-update-body-body-sm--bold` | 12px / 700, lh 18px |
| Paragraph | `--paragraph-paragraph` | 16px / 400, lh 24px |
| Paragraph Bold | `--paragraph-paragraph-bold` | 16px / 700, lh 24px |
| Small | `--small-small` | 14px / 400, lh 21px |
| Small Bold | `--small-small-bold` | 14px / 700, lh 21px |
| Extra Small | `--extras-small-extra-small` | 12px / 400, lh 18px |
| Extra Small Bold | `--extras-small-extra-small-bold` | 12px / 700, lh 18px |

**Heading scale (Helvetica Neue, in-app)**

| Style | CSS prefix | Size / Weight |
|---|---|---|
| Heading XL | `---bb-update-heading-heading-xl` | 28px / 700, lh 36px |
| Heading Lg | `---bb-update-heading-heading-lg` | 24px / 700, lh 32px |
| Heading Md | `---bb-update-heading-heading-md` | 20px / 700, lh 28px |
| Heading Sm | `---bb-update-heading-heading-sm` | 16px / 700, lh 24px |
| Heading XS | `---bb-update-heading-heading-xs` | 14px / 700, lh 20px |
| Headline H1 | `--headlines-headline-h1` | 28px / 700, lh 42px |
| Headline H2 | `--headlines-headline-h2` | 24px / 700, lh 36px |
| Headline H3 | `--headlines-headline-h3` | 20px / 700, lh 30px |
| Headline H4 | `--headlines-headline-h4` | 16px / 700, lh 24px |

**Display scale (Lota Grotesque, marketing/hero only)**

| Style | CSS prefix | Size |
|---|---|---|
| H1 72 Regular | `--headings-h1---72-regular` | 72px / 400 |
| H2 48 Regular | `--headings-h2---48-regular` | 48px / 400 |
| H5 24 Semi Bold | `--h5--24px--semi-bold` | 24px / 600 |

Usage example:

```css
.label {
  font-family: var(---bb-update-body-body-md--medium-font-family);
  font-size:   var(---bb-update-body-body-md--medium-font-size);
  font-weight: var(---bb-update-body-body-md--medium-font-weight);
  line-height: var(---bb-update-body-body-md--medium-line-height);
}
```

### Shadows

| Token | Use |
|---|---|
| `--shadows-shadow-md` | General card / panel shadow |
| `--card-widget---default` | Widget card resting state |
| `--card-widget---hover` | Widget card hover state |
| `--media-item---default` | Media thumbnail resting |
| `--media-item---hover` | Media thumbnail hover |

---

## Components (`output/components/`)

1,517 HTML files. Each file contains a rendered preview of the component's exact visual structure (HTML + inline CSS converted from the Figma node tree) plus a properties table.

### Naming convention

Files are named by flattening the Figma component name and all variant property values:

```
<family>_<prop1>_<value1>_<prop2>_<value2>…html
```

Variant segments are separated by `_-` and use underscores for spaces. Examples:

```
action_primary_-size_medium_-emphasis_bold_-state_default_-icon-only_false_-shape_rectangle.html
status_approved.html
appearance_colored_-color_blue.html
tag.html
```

### How to find the right component

1. Identify the family name (the part before the first `_-` variant segment).
2. Pick the correct variant combination for the state you need.

**Key families**

| Family prefix | What it is |
|---|---|
| `action_primary_*` | Primary CTA buttons |
| `action_secondary_*` | Secondary buttons |
| `action_danger_*` | Destructive action buttons |
| `action_success_*` | Confirmation buttons |
| `action_warning_*` | Warning buttons |
| `appearance_colored_*` | Coloured label/badge chips |
| `appearance_subtle_*` | Subtle tinted chips |
| `appearance_floating_*` | Floating alert/toast indicators |
| `appearance_inline_*` | Inline alert indicators |
| `status_*` | Status badges (approved, draft, connected, …) |
| `tag` | Generic tag/pill |
| `navigation-bar_*` | Top navigation bar |
| `popover_*` | Popover containers and items |
| `tooltip_*` | Tooltip variants |
| `modal-item_*` / `modal-slot_*` | Modal shells |
| `counter-input_*` | Numeric stepper input |
| `range_*` | Slider / range input |
| `check-box_*` | Checkbox |
| `tab-group_*` | Tab navigation |
| `table-row_*` | Table row variants |
| `column-header_*` | Table column headers |
| `compact_*` | Compact row/list items |
| `row_*` | Standard list rows |
| `dashboard-logo` | Product logo |
| `approval-card_*` | Approval card layout |

**Variant dimensions** (read from the filename):

- **size**: `small` / `medium` / `large`
- **emphasis**: `bold` / `subtle` / `minimal`
- **state**: `default` / `hover` / `active` / `focused` / `disabled` / `pressed`
- **icon-only**: `true` / `false`
- **shape**: `rectangle` / `round`
- **color**: `blue` / `amber` / `coral` / `purple` / `emerald` / `grey` / … (for appearance chips)
- **type**: `danger` / `info` / `success` / `warning` (for alerts/indicators)

### Rule: always use an existing component

Before writing any custom UI element, check `output/components/` for a matching family. Open the HTML file to inspect its exact dimensions, colours, spacing, and markup structure, then reproduce that in your code. Do not build buttons, badges, status indicators, inputs, or navigation from scratch.

**Additional families (from Figma library 2, now merged into the same folder)**

| Family prefix | What it is |
|---|---|
| `card--state-*` | Product card — default / hover states |
| `contextual-sidebar--*` | Contextual sidebar — chat / custom / filter content |
| `data-column--*` | Data column header — 10 types × compact / default |
| `data-list` | Key-value data list |
| `data-table--*` | Data table — default / bulk / skeleton |
| `date-range-picker--*` | Date range picker — desktop + mobile |
| `media-element--*` | Media library item — medium + small × all states |
| `modal--*` | Modal dialogs — breakpoint × size × height |
| `modal-header--*` | Modal header — desktop + mobile |
| `notification` / `notification--popover` | Notification item and popover shell |
| `section--type-*` | Section containers — collapsible / form / toggle-form |
| `section-header` | Section heading row |
| `section-item--*` | Section nav item — general / toggle × levels × states |
| `sidebar-info` | Sidebar info panel |
| `table-cell-compact--*` / `table-cell-default--*` | Table cells — type × state × alignment |
| `table-cell-general--*` | General table row — iteration × state × size |
| `table-cell-header--*` | Table header cell — state × alignment |
| `tooltip-v02--*` | Complex-content tooltip — 4 alignments |
| `view-switcher` | List/grid view toggle |

---

## Icons (`output/icons/`)

429 SVG files. All icons are in kebab-case:

```
output/icons/arrow-down.svg
output/icons/calendar.svg
output/icons/magnifying-glass.svg
```

**Common icon groups**

| Group | Examples |
|---|---|
| Arrows | `arrow-up`, `arrow-down`, `arrow-left`, `arrow-right`, `arrow-dropdown`, `arrow-check-mark` |
| Alerts | `alarm-bell`, `alarm-bell-dot`, `alarm-bell-slash`, `alarm-bell-gear` |
| Browser | `browser-window`, `browser-window-pencil`, `browser-window-plus`, `browser-window-star` |
| Badges | `badge-check-mark`, `badge-check-mark-filled`, `badge-check-mark-outline`, `badge-cross-mark` |
| Calendar | `calendar`, `calendar-gear`, `calendar-time` |
| Navigation | `chevron-left-small`, `chevron-right-small`, `line-chevron-left`, `line-chevron-right` |
| Communication | `envelope`, `paperplane`, `paperplane-check-mark`, `speech-bubble-outline` |
| Social | `instagram`, `facebook`, `linkedin`, `x`, `threads`, `bluesky`, `pinterest`, `tiktok-network-logo` |
| User | `user-circle`, `profile-symbole`, `admin-company-outline`, `admin-team-outline` |
| Content | `pencil-outline`, `garbage-can`, `clipboard`, `clipboard-plus`, `magnifying-glass` |
| Status | `check-mark`, `circle-check-mark`, `circle-slash`, `triangle-exclamation-mark-outline` |
| AI | `artifical-inteligence`, `artifical-inteligence-outline` |

### Using icons

Inline SVG (preferred — allows CSS colour control):

```html
<!-- read the file and paste the <svg> element inline -->
<svg ...><!-- contents of output/icons/arrow-down.svg --></svg>
```

As an image tag (simpler, no colour override):

```html
<img src="/output/icons/calendar.svg" width="16" height="16" alt="Calendar">
```

To tint an inline SVG with a token colour, set `fill: currentColor` on the SVG paths and apply `color` on the wrapper:

```css
.icon-wrapper { color: var(--light-base-readable-readable-03); }
```

---

## General rules for building new screens

1. **Tokens first.** Every colour, font, and shadow value must come from `tokens.css`. Never write a raw hex, `rgba()`, `font-size`, or `font-weight` that isn't a direct passthrough of a token.

2. **Check components before writing markup.** Search both `output/components/` and `output/components2/` by family name before creating any interactive element. If a matching component exists in either library, mirror its structure and dimensions exactly.

3. **Use `default` state as your base.** Components are exported per-state. Use the `_-state_default` variant as the baseline and layer state changes (hover, focus, active) via CSS on top.

4. **Do not mix type scales.** Use the BB Update body/heading scale for in-app UI and the Lota Grotesque display scale only for marketing or hero sections.

5. **Icon sizing.** Icons from this library are designed on a 20×20 or 24×24 grid. Default to 20px unless the surrounding component's HTML file shows a different size.

6. **Re-export when the design changes.** Run `FIGMA_TOKEN=<token> node export.js` from the project root to refresh the `output/` folder. The script reads live data from all four Figma files (Foundation, Components library 1, Components library 2, Icons).

---

## export.js — Architecture & Coding Style

`export.js` is the single source of truth for all generated output. It is an ES-module Node.js script (~860 lines). Key conventions:

### CLI flags

| Flag | What it does |
|---|---|
| *(none)* | Full export: tokens + both component libraries + icons |
| `--export-components-only` | Re-export only component HTML (skips tokens and icons — much faster) |
| `--fix-blanks-only` | Patch blank component HTML files without re-exporting everything |

Run as: `FIGMA_TOKEN=<token> node export.js [--flag]`

### Coding conventions

- **No external dependencies** — only Node built-ins (`fs`, `path`, `url`) and the global `fetch`.
- **All Figma calls go through `figmaGet(endpoint)`** — never call `fetch` directly for Figma.
- **Helpers are pure functions** where possible: `nodeToStyle`, `nodeToHtml`, `paintToCss`, `sanitizeFilename`, etc.
- **Batch everything** — Figma API limits. Node trees: batches of 50. SVG URL fetches: batches of 200. Never send unbounded ID lists.
- **Progress with `\r` overwrite** — `process.stdout.write('…\r')` for in-progress lines, `console.log` for final lines. Keeps output clean.
- **Phase comments in exportComponents** — the 8-phase pipeline is labelled `// ── Phase N: …` for navigability.

### exportComponents — 8-phase pipeline

1. **Fetch node trees** — batches of 50 nodes via `/v1/files/{key}/nodes?ids=…`
2. **Generate HTML in memory** — `componentToHtml()` for every component; collect into `pending[]`
3. **Collect VECTOR IDs** — regex `/data-vector-id="([^"]+)"/g` across all pending HTML
4. **Fetch individual vector SVGs** — batches of 200 via `/v1/images/{key}?ids=…&format=svg`
5. **Patch individual vectors** — replace `<div data-vector-id="ID"…></div>` with `<div…><svg…/></div>` in memory
6. **Fallback: full-component SVG** — any `pending[i].html` still containing `data-vector-id=` gets the *entire* component rendered as SVG (handles instance-override node IDs that can't be individually rendered from the current file)
7. **Write to disk** — all files written in one pass
8. **patchWithSvg for blanks** — components that produced a single empty `<div>` (remote-library refs with no local node tree) are resolved via `/v1/components/{key}` → source file key → SVG render

### VECTOR node handling

Figma node types `VECTOR`, `BOOLEAN_OPERATION`, `STAR`, `POLYGON`, `LINE` cannot be CSS-rendered. `nodeToHtml()` emits a placeholder instead of an empty div:

```js
const VECTOR_TYPES = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'LINE']);
if (VECTOR_TYPES.has(node.type)) {
  return `<div data-vector-id="${node.id}"${styleAttr}${dataAttr}></div>`;
}
```

Phases 4–6 replace those placeholders with real SVG fetched from Figma.

### Instance-override IDs

Node IDs in the format `I11673:22479;11643:4889;3275:1346` are sub-nodes inside component instances. They reference paths in a library file, **not** the current file. The `/v1/images` API returns `null` for these. Phase 6 handles this by rendering the *top-level component node* as SVG instead, which captures the full visual including all overrides.

### nodeToStyle — position logic

Non-auto-layout containers that have children get `position:relative` so their `position:absolute` children (icon paths) stay correctly anchored:

```js
} else if ((node.children?.length ?? 0) > 0) {
  r.position = r.position ?? 'relative';
}
```

---

## Styleguide — Architecture

Seven HTML files in the project root form the styleguide:

| File | Contents |
|---|---|
| `styleguide.html` | Summary / landing page |
| `styleguide-colors.html` | Color token swatches |
| `styleguide-typography.html` | Type scale |
| `styleguide-shadows.html` | Shadow tokens |
| `styleguide-components.html` | Library 1 component previews |
| `styleguide-components2.html` | Library 2 component previews |
| `styleguide-icons.html` | Icon grid |

Shared CSS: `styleguide.css`. Shared token link: `output/tokens/tokens.css`.

### Component card iframe pattern

Component previews are `<iframe>` embeds of the exported HTML files. A JS snippet at the bottom of each styleguide components page:

1. **Injects CSS** into the iframe via `iframe.contentDocument` (same-origin) to suppress the checkerboard transparency background and add `position:relative` on `.checker div` for any components that still need it.
2. **Computes scroll offset** using `getBoundingClientRect()` on the `.checker` div inside the iframe to center the component in the 120px clip window.
3. **Clamps to `preview.offsetTop`** — tiny components (like status badges) must never scroll the iframe far enough to expose the "Preview" `<h2>` heading above the `preview-wrap`.

```js
var offset = Math.max(preview.offsetTop, Math.max(0, centerY - 60));
this.style.marginTop = '-' + offset + 'px';
```

The wide-frame variant (`.comp-frame--wide`, used for the navigation bar) uses a simpler `preview.offsetTop + 16` offset rather than centering.

---

## Project Status (as of 2026-05-12)

### Completed
- ✅ Tokens export (`output/tokens/tokens.css`) — 74 tokens
- ✅ Icons export (`output/icons/`) — 429 SVG files
- ✅ Library 1 components (`output/components/`) — 1,517 HTML files with inline SVG icons
- ✅ Library 2 components (`output/components2/`) — 2,399 HTML files with inline SVG icons
- ✅ All 7 styleguide pages with live iframe previews
- ✅ VECTOR node rendering via two-tier SVG strategy (individual node first, full-component fallback)
- ✅ Iframe centering / clamp fix — no "PREVIEW" heading visible in cards
- ✅ Checkerboard suppression in styleguide context
- ✅ GitHub Pages deployment at https://spelaanzeljc.github.io/facelift-design-system-experiment/

### Known limitations
- ~173 Library 2 components remain blank (remote library refs that couldn't be resolved via the component key API). These are typically deeply nested instance overrides.
- Full re-export takes significant time (~20–30 min) due to the volume of Figma API calls. Use `--export-components-only` for component-only changes.
