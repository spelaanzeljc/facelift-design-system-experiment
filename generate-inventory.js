#!/usr/bin/env node
'use strict';
/**
 * generate-inventory.js
 * Reads all HTML files from output/components/ and output/components2/,
 * parses filenames into family + variant data, and writes
 * sitemap/component-inventory.html — a searchable reference page.
 */

const fs   = require('fs');
const path = require('path');

const BASE  = __dirname;
const DIRS  = [
  { dir: 'output/components',  label: 'Library 1 · BB Update', short: 'Lib 1' },
  { dir: 'output/components2', label: 'Library 2',              short: 'Lib 2' },
];
const OUT = path.join(BASE, 'sitemap', 'component-inventory.html');

// ── Numeric-suffix pattern (export duplicates like _13953-12345) ───────────────
const ALT_RE = /_\d{4,}-\d{4,}(\.html)?$/;

// ── Flagged families (Lib 1) ──────────────────────────────────────────────────
const FLAGGED = {};

// ── Library 2 flags ───────────────────────────────────────────────────────────
// Flag 1: families whose name matches an icon in output/icons/ — likely just SVG wrappers
const FLAGGED_L2_ICON = new Set([
  'admin-company-outline','alarm-bell','arrow-down','arrow-select','arrow-up',
  'artifical-inteligence','attachment','badge-check-mark-filled','beta','beta-symbole',
  'calendar','canva','check-box-checked-outline','check-mark',
  'chevron-down','chevron-left','chevron-right',
  'circle','circle-check-mark','circle-question-mark','clock',
  'close','close-large','close-lg','comment','danger-outline','desktop',
  'download','edit','ellipsis-horizontal','eye',
  'facebook','facebook-network-logo','facebook-outline',
  'facelift','facelift-ai','facelift-logo',
  'fb-messenger','fb-messenger-outline',
  'filter','flag','folder','follow',
  'fontstyle-bold','fontstyle-italic','fontstyle-underline',
  'format_landscape','format_month-','format_portrait','format_square',
  'format_today-am','format_today-pm','format_yersterday-am','format_yersterday-pm',
  'garbage-can','gearwheel-outline',
  'general_arrow-down','general_arrow-up',
  'general_collapsible-tree_tree-closed','general_sidebar_sidebar-close',
  'general_success','general_warning',
  'google','heart','heart-outline','help','hide','home','image','info',
  'instagram','instagram-network-logo','instagram-outline',
  'like','like-filled','line-chevron-left',
  'linkedin','linkedin-outline','locked','love',
  'm_discussion','m_discussion_filled','m_draft-save',
  'm_flag','m_flag_filled','m_hide','m_minimize','m_note',
  'm_promote','m_proofread','m_rewrite',
  'm_send','m_send-resolve','m_template-add',
  'magnifying-glass','megaphon','mention','minus-sign-small','mobile','more',
  'notice','notice_new','owner',
  'pinterest','pinterest-outline','planner-logo','plus-sign-small',
  'rectangle-arrow-right','refresh','retry','rss','sad',
  'search','send','settings','share','share-arrow','shorturl',
  'size_16','size_20','size_24',
  'smiley','smiley-positive','sort-down',
  'speech-bubble-outline','speech-bubble-up-text',
  'success','targeting','thankful','three-connected-squares','thumb-up-outline',
  'thumbnail','tiktok','tiktok-outline','time',
  'triangle-exclamation-mark-outline','two-squares-grid',
  'verified','video','view-list','warning-filled','whatsapp','wow',
  'x','x-network-logo','x-outline','x-sign-large','x-sign-small','x-sign-small-invert',
  'xing','youtube',
]);

// Flag 2: families that also appear in Library 1 — potential duplicates
const FLAGGED_L2_MATCH = new Set([
  'appearance_floating','appearance_inline',
  'badge',
  'color_amber','color_azure','color_beige','color_blue','color_cobalt',
  'color_coral','color_default','color_emerald','color_green','color_grey',
  'color_indigo','color_mint','color_orange','color_peridot','color_petrol',
  'color_purple','color_violet','color_yellow',
  'modal-item-',
  'navigation-bar',
  'orientation_horizontal','orientation_vertical',
  'pill_default_m_none_grey','pill_sm_default_default_brown','pill_sm_default_default_green',
  'popover-alt','popover-item-',
  'progress-indicator',
  'segmented-control',
  'status_approved','status_card','status_connected','status_disconneted',
  'status_draft','status_empty-_placeholder_','status_error',
  'status_partial-connected','status_pending','status_public','status_published',
  'status_read','status_rejected','status_scheduled',
  'status_to-be-approved','status_unread-unresolved','status_warning',
  'tab-group',
  'tags',
  'tooltip','tooltip-v02---complex-content',
]);

// ── Blank-file detection ──────────────────────────────────────────────────────
function isBlankFile(absPath) {
  try {
    const html = fs.readFileSync(absPath, 'utf8');
    const m = html.match(/<div class="checker">([\s\S]*?)<\/div>/);
    return !m || !m[1].includes('<svg');
  } catch { return false; }
}

// ── Resolve flag info for a family + library dir ──────────────────────────────
function getFlagInfo(family, dir, blankCount, totalCount) {
  if (FLAGGED[family]) return { type: 'review', reason: FLAGGED[family] };
  if (dir.includes('components2')) {
    if (FLAGGED_L2_ICON.has(family))  return { type: 'icon',  reason: 'Likely icon — same name exists in output/icons/' };
    if (FLAGGED_L2_MATCH.has(family)) return { type: 'lib1',  reason: 'Also present in Library 1 — potential duplicate' };
  }
  if (dir.includes('components2') && blankCount > 0) {
    const all = blankCount === totalCount;
    return {
      type: 'blank',
      reason: all
        ? `All ${totalCount} file${totalCount !== 1 ? 's' : ''} blank — no SVG rendered`
        : `${blankCount} of ${totalCount} files blank — SVG missing`,
    };
  }
  return null;
}

// ── Parse a filename into { family, variants, isAlt } ─────────────────────────
function parse(filename) {
  const base = filename.replace(/\.html$/, '');
  const isAlt = ALT_RE.test(base);

  // Strip numeric alt suffix before splitting so alt files group with their base family
  const cleanBase = isAlt ? base.replace(ALT_RE, '') : base;

  // Split on `_-` to separate variant segments
  const parts   = cleanBase.split('_-');
  const family  = parts[0];
  const varParts = parts.slice(1);

  // Each varPart is like "size_medium" or "icon-only_false"
  const variants = varParts.map(p => {
    const idx = p.indexOf('_');
    if (idx === -1) return { key: p, val: '' };
    return { key: p.slice(0, idx), val: p.slice(idx + 1) };
  });

  // Build a readable description
  const desc = variants.length
    ? variants.map(v => v.val ? `${v.key}: ${v.val}` : v.key).join(' · ')
    : '(no variants)';

  return { family, variants, desc, isAlt };
}

// ── Group files by family ──────────────────────────────────────────────────────
function groupByFamily(files) {
  const map = new Map();
  for (const f of files) {
    const { family } = parse(f);
    if (!map.has(family)) map.set(family, []);
    map.get(family).push(f);
  }
  return map;
}

// ── Escape HTML ────────────────────────────────────────────────────────────────
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Build HTML ─────────────────────────────────────────────────────────────────
function buildHTML(libraries) {
  const totalFiles = libraries.reduce((s, l) => s + l.files.length, 0);

  const libSections = libraries.map(({ label, short, dir, files }) => {
    const families = groupByFamily(files);
    const familyCount = families.size;

    const absDir = path.join(BASE, dir);

    const familyBlocks = [...families.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([family, ffiles]) => {
      const blankFiles = new Set(ffiles.filter(f => isBlankFile(path.join(absDir, f))));
      const flagInfo = getFlagInfo(family, dir, blankFiles.size, ffiles.length);

      const rows = ffiles.sort().map(f => {
        const { desc, isAlt } = parse(f);
        const relPath = `../${dir}/${f}`;
        const altBadge = isAlt ? `<span class="badge alt">alt</span>` : '';
        const blankBadge = blankFiles.has(f) ? `<span class="badge blank">blank</span>` : '';
        return `
          <tr class="file-row${blankFiles.has(f) ? ' file-blank' : ''}" data-search="${esc(f.toLowerCase())} ${esc(desc.toLowerCase())}">
            <td class="fname"><a href="${esc(relPath)}" target="_blank" rel="noopener">${esc(f)}</a>${altBadge}${blankBadge}</td>
            <td class="fdesc">${esc(desc)}</td>
          </tr>`;
      }).join('');

      const altCount  = ffiles.filter(f => ALT_RE.test(f)).length;
      const mainCount = ffiles.length - altCount;
      const flagBadge = flagInfo
        ? flagInfo.type === 'icon'
          ? `<span class="badge flag-icon" title="${esc(flagInfo.reason)}">⬡ icon</span>`
          : flagInfo.type === 'lib1'
            ? `<span class="badge flag-lib1" title="${esc(flagInfo.reason)}">≈ lib 1</span>`
            : flagInfo.type === 'blank'
              ? `<span class="badge flag-blank" title="${esc(flagInfo.reason)}">◻ blank</span>`
              : `<span class="badge flag" title="${esc(flagInfo.reason)}">⚑ needs review</span>`
        : '';
      const flagNote = flagInfo
        ? `<div class="flag-note flag-note--${flagInfo.type}">${esc(flagInfo.reason)}</div>`
        : '';

      return `
      <details class="family${flagInfo ? ` flagged flagged--${flagInfo.type}` : ''}" data-family="${esc(family)}">
        <summary>
          <span class="fname-head">${esc(family)}</span>
          ${flagBadge}
          <span class="fcounts">${mainCount} file${mainCount !== 1 ? 's' : ''}${altCount ? ` · <span class="alt-count">${altCount} alt</span>` : ''}</span>
        </summary>
        ${flagNote}
        <table class="file-table">
          <thead><tr><th>Filename</th><th>Variants</th></tr></thead>
          <tbody>${rows}
          </tbody>
        </table>
      </details>`;
    }).join('');

    return `
  <section class="library">
    <div class="lib-header">
      <span class="lib-name">${esc(label)}</span>
      <span class="lib-meta">${familyCount} families · ${files.length.toLocaleString()} files</span>
    </div>
    ${familyBlocks}
  </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Component Inventory — Design System</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:#f3f5f7;color:#111317;line-height:1.5}
a{color:#1339ec;text-decoration:none}a:hover{text-decoration:underline}

.page{max-width:1400px;margin:0 auto;padding:2rem 1.5rem}
.page-header{margin-bottom:2rem}
.page-header h1{font-size:1.5rem;font-weight:700;margin-bottom:.25rem}
.page-header p{color:#5f6a82;font-size:.9rem}
.total-badge{display:inline-block;background:#1339ec;color:#fff;font-size:.75rem;font-weight:700;padding:.15em .5em;border-radius:4px;margin-left:.5rem;vertical-align:middle}

.search-wrap{margin-bottom:1.5rem}
#search{width:100%;max-width:480px;padding:.5rem .75rem;border:1.5px solid #d3d7de;border-radius:6px;font-size:.9rem;outline:none;transition:border-color .15s}
#search:focus{border-color:#1339ec}
.search-count{font-size:.8rem;color:#848ea4;margin-top:.35rem}

.library{margin-bottom:2.5rem}
.lib-header{display:flex;align-items:baseline;gap:.75rem;padding:.75rem 0;border-top:2px solid #1339ec;margin-bottom:.5rem}
.lib-name{font-size:1rem;font-weight:700;color:#1339ec;text-transform:uppercase;letter-spacing:.05em}
.lib-meta{font-size:.8rem;color:#848ea4}

details.family{border:1px solid #e7eaee;border-radius:6px;background:#fff;margin-bottom:.35rem;overflow:hidden}
details.family[open]{margin-bottom:.75rem}
summary{display:flex;align-items:center;gap:.75rem;padding:.6rem .9rem;cursor:pointer;list-style:none;user-select:none}
summary::-webkit-details-marker{display:none}
summary::before{content:'▶';font-size:.6rem;color:#848ea4;transition:transform .15s;flex-shrink:0}
details[open]>summary::before{transform:rotate(90deg)}
.fname-head{font-size:.875rem;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fcounts{font-size:.75rem;color:#848ea4;flex-shrink:0}
.alt-count{color:#e05a00}

.file-table{width:100%;border-collapse:collapse;font-size:.8rem}
.file-table th{background:#f3f5f7;padding:.4rem .9rem;text-align:left;font-weight:600;color:#5f6a82;border-bottom:1px solid #e7eaee}
.file-row td{padding:.35rem .9rem;border-bottom:1px solid #f3f5f7;vertical-align:top}
.file-row:last-child td{border-bottom:none}
.file-row.hidden{display:none}
.fname{font-family:monospace;font-size:.78rem;word-break:break-all}
.fdesc{color:#5f6a82;font-size:.78rem}
.badge{display:inline-block;font-size:.65rem;font-weight:700;padding:.1em .35em;border-radius:3px;margin-left:.35rem;vertical-align:middle}
.badge.alt{background:#fff3e0;color:#e05a00;border:1px solid #e05a00}
.badge.flag{background:#fef9c3;color:#854d0e;border:1px solid #ca8a04;cursor:help}
.badge.flag-icon{background:#f0fdf4;color:#166534;border:1px solid #4ade80;cursor:help}
.badge.flag-lib1{background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;cursor:help}
.badge.flag-blank{background:#fdf4ff;color:#7e22ce;border:1px solid #d8b4fe;cursor:help}
.badge.blank{background:#fdf4ff;color:#7e22ce;border:1px solid #d8b4fe;font-size:.6rem}

details.family.flagged--review{border-color:#fde68a;background:#fffbeb}
details.family.flagged--review>summary{background:#fffbeb}
details.family.flagged--review .fname-head{color:#92400e}
details.family.flagged--icon{border-color:#4ade80;background:#f0fdf4}
details.family.flagged--icon>summary{background:#f0fdf4}
details.family.flagged--icon .fname-head{color:#166534}
details.family.flagged--lib1{border-color:#93c5fd;background:#eff6ff}
details.family.flagged--lib1>summary{background:#eff6ff}
details.family.flagged--lib1 .fname-head{color:#1e40af}
details.family.flagged--blank{border-color:#d8b4fe;background:#fdf4ff}
details.family.flagged--blank>summary{background:#fdf4ff}
details.family.flagged--blank .fname-head{color:#7e22ce}
.flag-note{font-size:.75rem;padding:.4rem .9rem;border-bottom-width:1px;border-bottom-style:solid}
.flag-note--review{color:#92400e;background:#fef3c7;border-bottom-color:#fde68a}
.flag-note--icon{color:#166534;background:#dcfce7;border-bottom-color:#4ade80}
.flag-note--lib1{color:#1e40af;background:#dbeafe;border-bottom-color:#93c5fd}
.flag-note--blank{color:#7e22ce;background:#fae8ff;border-bottom-color:#d8b4fe}
.file-blank td{opacity:.55}

.family.all-hidden{display:none}

/* Filter toggle */
.filter-bar{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
.filter-btn{padding:.3rem .7rem;border-radius:20px;font-size:.78rem;font-weight:600;cursor:pointer;border:1.5px solid transparent;background:#fff;transition:all .15s}
.filter-btn:hover{border-color:#d3d7de}
.filter-btn.active{background:#fef9c3;color:#854d0e;border-color:#ca8a04}
.filter-btn.all.active{background:#1339ec;color:#fff;border-color:#1339ec}
.filter-btn.icon.active{background:#f0fdf4;color:#166534;border-color:#4ade80}
.filter-btn.lib1.active{background:#eff6ff;color:#1e40af;border-color:#93c5fd}
.filter-btn.blank.active{background:#fdf4ff;color:#7e22ce;border-color:#d8b4fe}
</style>
</head>
<body>
<div class="page">
  <div class="page-header">
    <h1>Component Inventory<span class="total-badge">${totalFiles.toLocaleString()} files</span></h1>
    <p>Every HTML file exported from both Figma component libraries, grouped by family. Click a family to expand. Click a filename to preview the component.</p>
  </div>

  <div class="search-wrap">
    <input type="search" id="search" placeholder="Search by filename or variant…" autocomplete="off">
    <div class="search-count" id="search-count"></div>
  </div>

  <div class="filter-bar">
    <button class="filter-btn all active" data-filter="all">All</button>
    <button class="filter-btn icon" data-filter="icon">⬡ Likely icon</button>
    <button class="filter-btn lib1" data-filter="lib1">≈ Also in Lib 1</button>
    <button class="filter-btn blank" data-filter="blank">◻ Blank</button>
  </div>

  ${libSections}
</div>
<script>
const input   = document.getElementById('search');
const countEl = document.getElementById('search-count');
let activeFilter = 'all';

function applyFilters() {
  const q = input.value.trim().toLowerCase();
  let visible = 0;

  document.querySelectorAll('.family').forEach(fam => {
    const matchesFilter = activeFilter === 'all' || fam.classList.contains('flagged--' + activeFilter);
    if (!matchesFilter) { fam.classList.add('all-hidden'); return; }
    let famVisible = 0;
    fam.querySelectorAll('.file-row').forEach(row => {
      const match = !q || row.dataset.search.includes(q);
      row.classList.toggle('hidden', !match);
      if (match) famVisible++;
    });
    fam.classList.toggle('all-hidden', famVisible === 0);
    if (famVisible > 0 && q) fam.open = true;
    visible += famVisible;
  });

  countEl.textContent = (q || activeFilter !== 'all')
    ? \`\${visible.toLocaleString()} file\${visible !== 1 ? 's' : ''} match\`
    : '';
}

input.addEventListener('input', applyFilters);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});
</script>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  const libraries = DIRS.map(({ dir, label, short }) => {
    const absDir = path.join(BASE, dir);
    const files  = fs.readdirSync(absDir)
      .filter(f => f.endsWith('.html'))
      .sort();
    console.log(`  ${label}: ${files.length} files`);
    return { dir, label, short, files };
  });

  fs.mkdirSync(path.join(BASE, 'sitemap'), { recursive: true });
  const html = buildHTML(libraries);
  fs.writeFileSync(OUT, html, 'utf8');
  console.log(`\n✓ Written to ${path.relative(BASE, OUT)}`);
}

main();
