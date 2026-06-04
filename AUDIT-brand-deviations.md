# Brand Audit — screens vs. design system

Scope: `experiment-screens/calendar.html` and `experiment-screens/inbox.html`, audited against `output/tokens/tokens.css`, the `styleguide-*.html` pages, and the conventions in `CLAUDE.md`.

This document is for an implementation pass. Each item is a deviation with a concrete fix. Tackle Part A (screen + brand fixes) first, then Part B (system gaps) once the screen fixes have proven the missing primitives.

---

## Conventions before you start

Re-read these:

- `CLAUDE.md` — token names, scales, the "always use existing component" rule
- `output/tokens/tokens.css` — the actual list of available tokens (radius tokens **do not exist** yet; spacing tokens **do** — `--spacing-xxxs … --spacing-3xl`)
- `styleguide.html` and its sub-pages — visual source of truth

Do not introduce new hex values, new font sizes, or new shadows unless this document explicitly asks you to add a token for one.

---

## Part A — Fix the two screens

### A1. The Facelift logo mark is implemented twice, and one version is wrong

`experiment-screens/calendar.html`, the `.logo-mark` rule (around line 23):

```css
.logo-mark{
  width:30px;height:30px;
  background:var(--orange-400);    /* WRONG — brand primary is blue */
  border-radius:7px;               /* off-scale */
  font-size:14px;
  font-weight:800;                 /* off-scale; max is 700 */
  color:var(--grey-white);
  letter-spacing:-0.5px;
}
```

`experiment-screens/inbox.html` has a different spec for the same primitive:

```css
.logo-mark{
  width:28px;height:28px;
  background:var(--sys-primary-default);   /* correct */
  border-radius:6px;
  font-size:12px;
  font-weight:700;
  color:var(--grey-white);
}
```

Fix:

1. Reconcile both screens to a single spec. Use the inbox version's tokens and weights, but pick **one** size (recommend 28×28, radius 6, font-size 12, weight 700) and apply it to both files.
2. Background must be `var(--sys-primary-default)`, never `--orange-400`.
3. Weight must be `700`, never `800`.
4. Long-term: this primitive should not live as a CSS rule in each screen — see B5.

### A2. Typography is off-scale across both screens

The BB Update scale ships **only**: body sizes 12 / 14, paragraph 16, headings 14 / 16 / 20 / 24 / 28. Weights 400 / 500 / 700 for body; 700 for headings.

In `calendar.html` you currently use: 8, 10, 11, 11.5, 13, 15, 17, 18, 21 px — all off-scale. Weight 600 appears 21 times; 800 once.

In `inbox.html` you currently use: 8, 9, 10, 11, 13 px — all off-scale. Weight 600 appears 13 times.

Fix:

1. Round every font-size to the nearest in-scale value. The most-used out-of-scale value is `13px` — replace with `var(---bb-update-body-body-md--regular-font-size)` (14px) or `var(---bb-update-body-body-sm--regular-font-size)` (12px) depending on visual density. Pick the side that keeps the layout from breaking; if the layout depends on 13px, log it in B3.
2. Replace `font-weight:600` with `500` for medium-emphasis UI (labels, column headers, chip text) and `700` for strong emphasis (titles, button labels).
3. Replace `font-weight:800` (logo) with `700`. See A1.
4. Replace the bare `font-family:"Helvetica Neue",Helvetica,Arial,sans-serif` declaration in each screen's `body` rule with the token: `font-family: var(---bb-update-body-body-md--regular-font-family)`.
5. Where a screen uses a specific text style (e.g. a 14/20 medium label), prefer the full token group instead of redeclaring the four properties. Pattern:

   ```css
   .label {
     font-family: var(---bb-update-body-body-md--medium-font-family);
     font-size:   var(---bb-update-body-body-md--medium-font-size);
     font-weight: var(---bb-update-body-body-md--medium-font-weight);
     line-height: var(---bb-update-body-body-md--medium-line-height);
   }
   ```

### A3. Shadows are hardcoded

In `calendar.html`:

- `.seg-btn.is-active` — `box-shadow:0 1px 2px rgba(0,0,0,0.12)`
- `.slide-over` — `box-shadow:-8px 0 32px rgba(0,0,0,0.14)`
- `.modal` — `box-shadow:0 20px 60px rgba(0,0,0,.2)`
- `.search-panel` and `.filters-panel` — `box-shadow:-4px 0 20px rgba(0,0,0,.08)`

Fix:

1. Replace `.modal`, `.slide-over`, `.search-panel`, `.filters-panel` shadows with `var(--shadows-shadow-md)`.
2. The segmented control active-state shadow is a tooltip-tier elevation — leave a `TODO` comment and flag in B2 (we likely need an elevation-1 token).

### A4. Radii are arbitrary

Both screens mix `5, 6, 7, 8, 10, 12, 1024 px`. There are no radius tokens (see B1). Until those land, normalise to:

- `6px` — small controls (chips, icon buttons, dropdown items)
- `8px` — buttons, cards, panels
- `12px` — modals
- `50%` — avatars and dots
- `1024px` — pills only (where shape = pill is intentional)

Anything currently set to `5px` or `7px` should round to `6px` or `8px`. Pick the value already used by the nearest component family in `output/components/`.

### A5. Dark app chrome uses the reference palette directly

`calendar.html` and `inbox.html` build the header and sidebar from `--grey-900` / `--grey-800` / `--grey-500` / `--grey-400` / `--grey-300` / `--alpha-white-16`. There are no semantic tokens for inverse surfaces, so the screens are forced into the ramp.

Short-term fix (apply now): leave the raw greys but add a comment block at the top of each screen's `<style>` listing them, so when the inverse tokens land (B4) replacement is mechanical.

Long-term fix: see B4.

### A6. Calendar: `.lt-tag` uses an inline `background` per row

In the list view, table tags get raw inline backgrounds. They should use the `appearance_subtle_*` or `appearance_colored_*` component families (see CLAUDE.md → Components, library 1). Audit the rendered HTML for inline `style="background:#..."` on tags and convert to the component classes / structure used in `output/components/appearance_subtle_-color_blue.html` etc.

### A7. Inbox: notification dot uses raw red

`experiment-screens/inbox.html`:

```css
.notif-dot{... background:#ef4444 ...}
```

Replace with `var(--sys-danger-content)` (#cc0000). If the visual weight feels wrong against the dark header, change the spec — don't substitute a Tailwind hex.

### A8. Inbox: avatar gradients are off-system

Every user avatar in `experiment-screens/inbox.html` is a hardcoded Tailwind gradient pair:

```js
{av:'MK', bg:'linear-gradient(135deg,#f97316,#ec4899)', ...}
{av:'TR', bg:'linear-gradient(135deg,#3b82f6,#1d4ed8)', ...}
{av:'AP', bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)', ...}
{av:'CW', bg:'linear-gradient(135deg,#14b8a6,#0f766e)', ...}
{av:'BS', bg:'linear-gradient(135deg,#f59e0b,#d97706)', ...}
{av:'JP', bg:'linear-gradient(135deg,#10b981,#059669)', ...}
```

The Facelift HQ brand avatar already uses the system correctly:

```js
{av:'FL', bg:'linear-gradient(135deg,var(--azure-400),var(--blue-500)), ...}
```

Fix:

1. Replace each Tailwind hex pair with a system gradient using the secondary ramps. Map:
   - `#f97316/#ec4899` → `var(--coral-400)/var(--purple-500)`
   - `#3b82f6/#1d4ed8` → `var(--cobalt-400)/var(--cobalt-700)`
   - `#8b5cf6/#7c3aed` → `var(--indigo-400)/var(--indigo-700)`
   - `#14b8a6/#0f766e` → `var(--mint-400)/var(--petrol-700)`
   - `#f59e0b/#d97706` → `var(--amber-400)/var(--amber-700)`
   - `#10b981/#059669` → `var(--emerald-400)/var(--emerald-700)`
2. Verify each mapping against the actual hex in `output/tokens/tokens.css` and pick the closest ramp step if the suggested step doesn't match.
3. Long-term: the avatar should be a component with a deterministic colour-from-initials mapping. See B5.

### A9. Both screens: status / sentiment chips conflate two layers

The inbox tags posts as `Positive` / `Neutral` / `Negative`. Today they appear styled like `--sys-success-content` / `--sys-text-secondary` / `--sys-danger-content`. That works visually but conflates **system feedback** (success/warning/danger) with **user sentiment**. Until B6 lands, use the existing status semantic tokens but add a `TODO: sentiment != status` comment next to each declaration.

---

## Part B — System gaps to fix in the design system itself

These are why the screens drift. Fixing the screens without fixing these means the next screen will drift the same way.

### B1. Add radius tokens

`tokens.css` has spacing, colour, type, shadow — no radius. Add:

```css
--radius-none: 0;
--radius-xs:   4px;   /* hairline controls, tag chips */
--radius-sm:   6px;   /* small controls, icon buttons */
--radius-md:   8px;   /* default for buttons, cards, panels */
--radius-lg:  12px;   /* modals, large containers */
--radius-pill: 1024px;
--radius-circle: 50%;
```

Add a Radius section to `styleguide.html` (or a new `styleguide-radius.html`).

Update `CLAUDE.md` → General rules to require radius tokens.

### B2. Add an elevation scale

We have `--shadows-shadow-md` and two widget-card tokens. We're missing low and high elevation tiers. Add:

```css
--shadows-shadow-xs:  0 1px 2px  rgba(0,0,0,.08);   /* pressed state, segmented active */
--shadows-shadow-sm:  0 2px 6px  rgba(0,0,0,.10);   /* tooltips, popovers */
--shadows-shadow-md:  /* keep existing */
--shadows-shadow-lg:  0 8px 24px rgba(0,0,0,.14);   /* slide-overs, drawers */
--shadows-shadow-xl:  0 20px 60px rgba(0,0,0,.20);  /* modals */
```

Then replace the four hardcoded shadows listed in A3.

### B3. Reconcile the type scale with real product UI

`13px` is used 29 times in calendar alone, and `font-weight: 600` is used 21 times. Either the screen is wrong or the scale is missing rows. Decide and document:

Option A — extend the scale (recommended): add Body XS at 13/18 weight 400/500/700 and a `medium-semibold` (600) row across Body Md/Sm. This requires a Figma update first, then re-export tokens.

Option B — enforce the existing scale: rewrite the screens to round all 13px to 14px, all 600 to 500 or 700. Document the rule in `CLAUDE.md`.

Pick one before fixing A2 fully — A2's "round to nearest" instruction is a holding pattern.

### B4. Add inverse / dark-chrome semantic tokens

The dark header + sidebar pattern repeats in both screens. Add:

```css
--sys-surface-inverse:        var(--grey-900);
--sys-surface-inverse-hover:  var(--grey-800);
--sys-text-on-inverse:        var(--grey-white);
--sys-text-on-inverse-muted:  var(--grey-400);
--sys-text-on-inverse-subtle: var(--grey-500);
--sys-border-on-inverse:      var(--grey-800);
--sys-icon-on-inverse:        var(--grey-400);
--sys-icon-on-inverse-hover:  var(--grey-200);
```

Then sweep both screens and replace raw `--grey-*` references in the header/sidebar with these.

### B5. Add primitive components that are currently inline CSS

These show up as ad-hoc CSS in screens and should be real components in `output/components/`:

1. **Logo / brand mark** — `FL` square. Two specs across two screens today (A1).
2. **Avatar** — appears as `.header-avatar`, `.post-av`, `.fi-avatar`, `.comment-avatar` across two screens. Needs:
   - Size variants (xs / sm / md / lg)
   - Colour assignment scheme (deterministic from initials, using the secondary ramps)
   - Gradient variant for branded use
3. **Notification badge / dot** — currently raw `<div class="notif-dot">` with hex red.
4. **Network icon chip** — Instagram / Facebook / LinkedIn / X / Threads icons appear in both screens; verify there's a single component, not bespoke per-screen markup.

### B6. Add a sentiment colour layer

Separate from status. Mirrors the status tokens but lives in its own namespace:

```css
--sys-sentiment-positive-bg:      var(--green-100);
--sys-sentiment-positive-content: var(--green-700);
--sys-sentiment-neutral-bg:       var(--grey-50);
--sys-sentiment-neutral-content:  var(--grey-600);
--sys-sentiment-negative-bg:      var(--red-50);
--sys-sentiment-negative-content: var(--red-600);
```

Then update the inbox tags to use these instead of borrowing from Success / Danger.

### B7. Document the rule "no Tailwind hexes, ever"

Add a section to `CLAUDE.md` → General rules listing the most-violated foreign palettes seen in screens (`#3b82f6`, `#10b981`, `#f97316`, `#ef4444`, `#8b5cf6`, `#14b8a6`, `#f59e0b`). Make it explicit that linting should reject these.

---

## Acceptance criteria

When this audit is complete, the following must be true:

1. `grep -E "(font-size:1[03578]|font-size:21|font-size:11.5)" experiment-screens/*.html` returns nothing.
2. `grep -E "font-weight:(600|800)" experiment-screens/*.html` returns nothing — or the type scale has been extended to include them (B3) and they're sourced from tokens.
3. `grep -oiE "#[0-9a-f]{3,8}" experiment-screens/*.html` returns only hex values that are passthroughs of an existing token (or are inline SVG `fill="#..."` attributes for network logos where brand hex is intentional, e.g. Instagram `#E2007A`, Facebook `#1877F2`, LinkedIn `#0A66C2`, X `#0F1419`).
4. `grep -E "rgba\(" experiment-screens/*.html` returns nothing.
5. Both screens render the Facelift logo mark identically.
6. Both screens load only tokens from `output/tokens/tokens.css`; no inline declarations of brand colour, font size, or shadow values that aren't `var(--…)` passthroughs.

---

## Sequencing

Suggested order:

1. **Now**: A1, A7, A8 (visible brand contradictions — wrong colour on the logo, wrong red on the dot, off-brand avatars).
2. **Same pass**: A3, A4, A6, A9 (shadow / radius / chip cleanup using existing tokens).
3. **Decide B3 first**, then A2 (typography sweep).
4. **Then B1, B2, B4** (token additions) so subsequent screens don't redrift.
5. **Then B5, B6, B7** (component primitives and rules).
