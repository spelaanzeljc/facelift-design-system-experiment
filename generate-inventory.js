#!/usr/bin/env node
'use strict';
/**
 * generate-inventory.js
 * Reads all HTML files from output/components/, parses filenames into
 * family + variant data, and writes sitemap/component-inventory.html.
 */

const fs   = require('fs');
const path = require('path');

const BASE = __dirname;
const DIR  = 'output/components';
const OUT  = path.join(BASE, 'sitemap', 'component-inventory.html');

// ── Numeric-suffix pattern (legacy export duplicates) ─────────────────────────
const ALT_RE = /[-_]\d{4,}-\d{4,}(\.html)?$/;

// ── Parse a filename into { family, desc, isAlt } ────────────────────────────
function parse(filename) {
  const base = filename.replace(/\.html$/, '');
  const isAlt = ALT_RE.test(base);
  const cleanBase = isAlt ? base.replace(ALT_RE, '') : base;
  const parts = cleanBase.split('--');
  const family = parts[0];
  const desc = parts.slice(1).join(' · ') || '(no variants)';
  return { family, desc, isAlt };
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
function buildHTML(files) {
  const families = groupByFamily(files);

  const familyBlocks = [...families.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([family, ffiles]) => {
    const rows = ffiles.sort().map(f => {
      const { desc, isAlt } = parse(f);
      const relPath = `../output/components/${f}`;
      const altBadge = isAlt ? `<span class="badge alt">alt</span>` : '';
      return `
          <tr class="file-row" data-search="${esc(f.toLowerCase())} ${esc(desc.toLowerCase())}">
            <td class="fname"><a href="${esc(relPath)}" target="_blank" rel="noopener">${esc(f)}</a>${altBadge}</td>
            <td class="fdesc">${esc(desc)}</td>
          </tr>`;
    }).join('');

    const altCount  = ffiles.filter(f => ALT_RE.test(f)).length;
    const mainCount = ffiles.length - altCount;

    return `
    <details class="family" data-family="${esc(family)}">
      <summary>
        <span class="fname-head">${esc(family)}</span>
        <span class="fcounts">${mainCount} file${mainCount !== 1 ? 's' : ''}${altCount ? ` · <span class="alt-count">${altCount} alt</span>` : ''}</span>
      </summary>
      <table class="file-table">
        <thead><tr><th>Filename</th><th>Variants</th></tr></thead>
        <tbody>${rows}
        </tbody>
      </table>
    </details>`;
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

.lib-header{display:flex;align-items:center;gap:.75rem;padding:.75rem 0;border-top:2px solid #1339ec;margin-bottom:.5rem}
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

.family.all-hidden{display:none}
</style>
</head>
<body>
<div class="page">
  <div class="page-header">
    <h1>Component Inventory<span class="total-badge">${files.length.toLocaleString()} files</span></h1>
    <p>Every HTML file exported from the Figma component library, grouped by family. Click a family to expand. Click a filename to preview.</p>
  </div>

  <div class="search-wrap">
    <input type="search" id="search" placeholder="Search by filename or variant…" autocomplete="off">
    <div class="search-count" id="search-count"></div>
  </div>

  <div class="lib-header">
    <span class="lib-name">Component Library</span>
    <span class="lib-meta">${families.size} families · ${files.length.toLocaleString()} files</span>
  </div>

  ${familyBlocks}
</div>
<script>
const input   = document.getElementById('search');
const countEl = document.getElementById('search-count');

function applySearch() {
  const q = input.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.family').forEach(fam => {
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
  countEl.textContent = q ? \`\${visible.toLocaleString()} file\${visible !== 1 ? 's' : ''} match\` : '';
}

input.addEventListener('input', applySearch);

const urlQ = new URLSearchParams(location.search).get('q');
if (urlQ) { input.value = urlQ; applySearch(); }
</script>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  const absDir = path.join(BASE, DIR);
  const files  = fs.readdirSync(absDir).filter(f => f.endsWith('.html')).sort();
  console.log(`  Component Library: ${files.length} files`);
  fs.mkdirSync(path.join(BASE, 'sitemap'), { recursive: true });
  fs.writeFileSync(OUT, buildHTML(files), 'utf8');
  console.log(`✓ Written to ${path.relative(BASE, OUT)}`);
}

main();
