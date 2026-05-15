#!/usr/bin/env node
'use strict';
/**
 * re-export-components.js
 * For each COMPONENT_SET node, fetches all variant children from the Figma API,
 * exports each as a properly-named HTML file in output/components/.
 *
 * Usage: FIGMA_TOKEN=<token> node re-export-components.js
 */

const fs   = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_TOKEN environment variable is not set.');
  console.error('Usage: FIGMA_TOKEN=<token> node re-export-components.js');
  process.exit(1);
}

const BASE_DIR = __dirname;
const FILE_KEY = 'gfKQ2RqCwrHJLv1PyglC2l';

// Each entry: nodeId (COMPONENT_SET or single COMPONENT), family prefix for filenames,
// optional skipIfExists to avoid overwriting already-renamed Group A files.
const COMPONENTS = [
  { nodeId: '11683:15465',   family: 'badge' },
  { nodeId: '11640:3625',    family: 'progress-indicator_-type_circular' },
  { nodeId: '13946:104134',  family: 'progress-indicator_-type_line' },
  { nodeId: '13953:70243',   family: 'approval-unit_-type_approver-row' },
  { nodeId: '13953:70110',   family: 'approval-unit_-type_status-row' },
  { nodeId: '13953:70220',   family: 'approval-unit_-type_deadline' },
  { nodeId: '13309:43163',   family: 'card_-type_status' },
  { nodeId: '11651:3777',    family: 'card_-type_task',      skipIfExists: true },
  { nodeId: '13238:20040',   family: 'card_-type_task-link', skipIfExists: true },
  { nodeId: '11640:1363',    family: 'checkbox_-type_default' },
  { nodeId: '11676:205010',  family: 'link' },
  { nodeId: '14015:69086',   family: 'radio_-type_item' },
  { nodeId: '13338:38966',   family: 'segmented-control' },
  { nodeId: '13338:38945',   family: 'segmented-control-item' },
  { nodeId: '11644:6897',    family: 'column-header_-type_my-tasks' },
  { nodeId: '11689:41300',   family: 'checklist-item',  skipIfExists: true },
  { nodeId: '14493:93299',   family: 'comment-item',    skipIfExists: true },
  { nodeId: '13305:49308',   family: 'header_-type_content' },
  { nodeId: '11696:73275',   family: 'status' },
  { nodeId: '14754:93295',   family: 'smaller-post-set-item' },
];

// ── Parse a Figma variant name into a filename suffix ──────────────────────────
// "State=Default, Type=Checked" → "_-state_default_-type_checked"
// "OR=Single Default"           → "_-or_single-default"
// ""                            → ""
function parseVariantName(name) {
  if (!name || name.trim() === '') return '';
  return name.split(', ').map(pair => {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      return `_-${pair.trim().toLowerCase().replace(/\s+/g, '-')}`;
    }
    const key = pair.slice(0, eqIdx).trim().toLowerCase().replace(/\s+/g, '-');
    const val = pair.slice(eqIdx + 1).trim().toLowerCase().replace(/\s+/g, '-');
    return `_-${key}_${val}`;
  }).join('');
}

// ── HTML template ──────────────────────────────────────────────────────────────
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
    <div class="checker"></div>
  </div>
</div>
</body>
</html>`;
}

function patchHtml(filePath, svg) {
  const html = fs.readFileSync(filePath, 'utf8');
  const patched = html.replace(
    /^(\s*<div class="checker">).*(<\/div>)\s*$/m,
    `$1${svg}$2`
  );
  return patched;
}

// ── Figma API helpers ──────────────────────────────────────────────────────────
async function figmaGet(endpoint) {
  const url = `https://api.figma.com${endpoint}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchSvgBatch(nodeIds) {
  const ids = nodeIds.join(',');
  const data = await figmaGet(
    `/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg&svg_include_id=false`
  );
  return data.images ?? {};
}

async function downloadSvg(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const text = await res.text();
  return text.replace(/<\?xml[^?]*\?>\s*/i, '').trim();
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalFailed  = 0;

  for (const { nodeId, family, skipIfExists } of COMPONENTS) {
    console.log(`\n── ${family} (node ${nodeId}) ──`);

    // 1. Fetch node to get children
    let children = [];
    try {
      const data = await figmaGet(`/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(nodeId)}`);
      const node = data.nodes?.[nodeId]?.document;
      if (!node) { console.warn(`  ✗ Node not found`); totalFailed++; continue; }

      if (node.type === 'COMPONENT_SET' || node.type === 'FRAME') {
        children = (node.children || []).filter(c =>
          c.type === 'COMPONENT' || c.type === 'INSTANCE'
        );
      } else if (node.type === 'COMPONENT') {
        // Single component — use it directly with no variant suffix
        children = [{ id: nodeId, name: '' }];
      } else {
        console.warn(`  ✗ Unexpected node type: ${node.type}`);
        totalFailed++; continue;
      }
      console.log(`  ${node.type} "${node.name}" — ${children.length} variant(s)`);
    } catch (err) {
      console.error(`  ✗ Failed to fetch node: ${err.message}`);
      totalFailed++; continue;
    }

    if (children.length === 0) {
      console.warn(`  ✗ No children found`); totalFailed++; continue;
    }

    // 2. Build file entries and filter already-existing ones
    const entries = children.map(child => ({
      nodeId:      child.id,
      filename:    `${family}${parseVariantName(child.name)}.html`,
      variantName: child.name,
    }));

    const toProcess = entries.filter(e => {
      const exists = fs.existsSync(path.join(BASE_DIR, 'output', 'components', e.filename));
      if (exists && skipIfExists) {
        console.log(`  → skip (exists) ${e.filename}`);
        totalSkipped++;
        return false;
      }
      return true;
    });

    if (toProcess.length === 0) continue;

    // 3. Batch-fetch SVG render URLs
    let urlMap = {};
    try {
      urlMap = await fetchSvgBatch(toProcess.map(e => e.nodeId));
    } catch (err) {
      console.error(`  ✗ SVG batch failed: ${err.message}`);
      totalFailed += toProcess.length; continue;
    }

    // 4. Create HTML files
    for (const { nodeId: childId, filename, variantName } of toProcess) {
      const filePath = path.join(BASE_DIR, 'output', 'components', filename);
      fs.writeFileSync(filePath, placeholderHtml(variantName || family), 'utf8');

      const url = urlMap[childId];
      if (!url) {
        console.warn(`  ✗ No SVG URL for ${filename}`);
        totalFailed++; continue;
      }
      try {
        const svg = await downloadSvg(url);
        fs.writeFileSync(filePath, patchHtml(filePath, svg), 'utf8');
        console.log(`  ✓ ${filename}`);
        totalCreated++;
      } catch (err) {
        console.error(`  ✗ ${filename}: ${err.message}`);
        totalFailed++;
      }
    }
  }

  console.log(`\nDone — ${totalCreated} created, ${totalSkipped} skipped, ${totalFailed} failed.\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
