#!/usr/bin/env node
// Fix blank/broken component HTML files in output/components/ and output/components2/
// Usage: FIGMA_TOKEN=<your_token> node fix-blank-components.js
'use strict';

const fs   = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_TOKEN environment variable is not set.');
  console.error('Usage: FIGMA_TOKEN=<your_token> node fix-blank-components.js');
  process.exit(1);
}

const BASE_DIR = __dirname;

// ── Node IDs identified by inspecting the Figma file directly ────────────────
// fileKey → list of { nodeId, filename, dir, createIfMissing?, resolveSelectedChild? }
const FIXES = {
  'gfKQ2RqCwrHJLv1PyglC2l': [
    { nodeId: '14499:89777', filename: 'notification.html',   dir: 'components2' }, // Notification component
    { nodeId: '13954:70260', filename: 'approval-card.html',  dir: 'components'  }, // Approval Card
    { nodeId: '13330:33365', filename: 'post-pool.html',      dir: 'components2' }, // Post Set
    { nodeId: '13379:57946', filename: 'app-sidebar.html',    dir: 'components',   createIfMissing: 'App Sidebar' },
  ],
  'iskI6eokj50ZA7WunMjEVd': [
    { nodeId: '3801:115364', filename: 'media-element_medialibrary_default.html',  dir: 'components2' },
    { nodeId: '3801:115364', filename: 'media-element_medialibrary_selected.html', dir: 'components2', resolveSelectedChild: true },
  ],
};

// ── Minimal HTML shell for new files ─────────────────────────────────────────

function placeholderHtml(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#f0f0f0;padding:2rem;color:#111}
.page{max-width:1400px;margin:0 auto}
header{margin-bottom:1.25rem}
h1{font-size:1.25rem;font-weight:600;margin-bottom:.2rem}
h2{font-size:.9rem;font-weight:600;margin:1.25rem 0 .5rem;text-transform:uppercase;letter-spacing:.05em;color:#555}
.preview-wrap{background:#fff;border-radius:8px;padding:2rem;overflow:auto;margin-bottom:1.25rem;display:flex;align-items:flex-start;justify-content:flex-start;min-height:80px}
.checker{background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:16px 16px;background-position:0 0,0 8px,8px -8px,-8px 0;border-radius:4px;display:inline-flex}
</style>
</head>
<body>
<div class="page">
  <header>
    <h1>${title}</h1>
  </header>
  <h2>Preview</h2>
  <div class="preview-wrap">
    <div class="checker"><span style="color:#999;font-style:italic">No node data</span></div>
  </div>
</div>
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function figmaGet(endpoint) {
  const url = `https://api.figma.com${endpoint}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchSvgBatch(fileKey, nodeIds) {
  const ids = nodeIds.join(',');
  const data = await figmaGet(
    `/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=svg&svg_include_id=false`
  );
  return data.images ?? {};
}

async function downloadSvg(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const text = await res.text();
  return text.replace(/<\?xml[^?]*\?>\s*/i, '').trim();
}

// Resolve the "Selected" variant child of a component set
async function resolveSelectedChildNode(fileKey, parentNodeId) {
  try {
    const data = await figmaGet(`/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(parentNodeId)}`);
    const node = data.nodes?.[parentNodeId]?.document;
    if (!node?.children) return null;
    const selected = node.children.find(c =>
      c.name && c.name.toLowerCase().includes('selected')
    );
    return selected ? selected.id : null;
  } catch (err) {
    console.warn(`  ⚠ Could not resolve selected child: ${err.message}`);
    return null;
  }
}

// Universal patch: the entire .checker div (open + content + close) is always one line
function patchHtml(filePath, svg) {
  const html = fs.readFileSync(filePath, 'utf8');
  const patched = html.replace(
    /^(\s*<div class="checker">).*(<\/div>)\s*$/m,
    `$1${svg}$2`
  );
  return patched;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let totalFixed = 0;
  let totalFailed = 0;

  for (const [fileKey, entries] of Object.entries(FIXES)) {
    console.log(`\nFetching SVG render URLs from file ${fileKey}…`);

    // Pre-resolve any selected-child node IDs
    const resolvedEntries = [];
    for (const entry of entries) {
      if (entry.resolveSelectedChild) {
        const childId = await resolveSelectedChildNode(fileKey, entry.nodeId);
        if (childId) {
          console.log(`  → Resolved selected child for ${entry.filename}: ${childId}`);
          resolvedEntries.push({ ...entry, nodeId: childId });
        } else {
          console.log(`  → No selected child found for ${entry.filename}, using parent node`);
          resolvedEntries.push({ ...entry });
        }
      } else {
        resolvedEntries.push(entry);
      }
    }

    const nodeIds = [...new Set(resolvedEntries.map(e => e.nodeId))];

    let urlMap = {};
    try {
      urlMap = await fetchSvgBatch(fileKey, nodeIds);
    } catch (err) {
      console.error(`  ✗ Failed to fetch batch: ${err.message}`);
      totalFailed += resolvedEntries.length;
      continue;
    }

    for (const { nodeId, filename, dir, createIfMissing } of resolvedEntries) {
      const filePath = path.join(BASE_DIR, 'output', dir, filename);

      // Create placeholder if file doesn't exist and createIfMissing title is set
      if (!fs.existsSync(filePath)) {
        if (createIfMissing) {
          fs.writeFileSync(filePath, placeholderHtml(createIfMissing), 'utf8');
          console.log(`  + Created placeholder: ${dir}/${filename}`);
        } else {
          console.warn(`  ⚠ File not found: ${dir}/${filename}`);
          totalFailed++;
          continue;
        }
      }

      const url = urlMap[nodeId];
      if (!url) {
        console.warn(`  ✗ No render URL for ${filename} (node ${nodeId})`);
        totalFailed++;
        continue;
      }
      try {
        const svg = await downloadSvg(url);
        const patched = patchHtml(filePath, svg);
        fs.writeFileSync(filePath, patched, 'utf8');
        console.log(`  ✓ Patched ${dir}/${filename}`);
        totalFixed++;
      } catch (err) {
        console.error(`  ✗ ${filename}: ${err.message}`);
        totalFailed++;
      }
    }
  }

  console.log(`\nDone — ${totalFixed} fixed, ${totalFailed} failed.\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
