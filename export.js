#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_TOKEN environment variable is not set');
  process.exit(1);
}

const FILE_KEYS = {
  foundation: 'LH68OKCGmWNb0cctCGSdI3',
  components: 'gfKQ2RqCwrHJLv1PyglC2l',
  components2: 'iskI6eokj50ZA7WunMjEVd',
  icons: 'Urnuy7hyPbvqvp3JVT0V0t',
};

const OUTPUT = {
  root: path.join(__dirname, 'output'),
  tokens: path.join(__dirname, 'output', 'tokens'),
  components: path.join(__dirname, 'output', 'components'),
  components2: path.join(__dirname, 'output', 'components2'),
  icons: path.join(__dirname, 'output', 'icons'),
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDirs() {
  for (const dir of Object.values(OUTPUT)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function figmaGet(endpoint) {
  const url = `https://api.figma.com${endpoint}`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${endpoint} → ${res.status}: ${text}`);
  }
  return res.json();
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_\-. ]/g, '_').replace(/\s+/g, '-').toLowerCase();
}

// ─── 1. Tokens → tokens.css ─────────────────────────────────────────────────

function rgbaToHex({ r, g, b, a }) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a === 1 ? hex : `${hex}${toHex(a)}`;
}

function cssVarName(name) {
  return name.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-_]/g, '');
}

function colorToRgba(c, opacity = 1) {
  if (!c || c.r == null) return 'transparent';
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = Math.round((c.a ?? 1) * opacity * 100) / 100;
  return a === 1 ? `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

async function exportTokens() {
  console.log('Fetching Foundation file styles…');
  const data = await figmaGet(`/v1/files/${FILE_KEYS.foundation}`);
  const styles = data.styles ?? {};
  const styleIds = Object.keys(styles);

  if (styleIds.length === 0) {
    console.log('  No local styles found');
    return;
  }
  console.log(`  Found ${styleIds.length} styles — fetching node values…`);

  // Fetch style node values in batches (URL length limit)
  const BATCH = 100;
  const nodeData = {};
  for (let i = 0; i < styleIds.length; i += BATCH) {
    const batch = styleIds.slice(i, i + BATCH);
    const result = await figmaGet(
      `/v1/files/${FILE_KEYS.foundation}/nodes?ids=${encodeURIComponent(batch.join(','))}`
    );
    Object.assign(nodeData, result.nodes ?? {});
  }

  const fills = [];
  const typography = [];
  const effects = [];
  const grids = [];

  for (const [styleId, meta] of Object.entries(styles)) {
    const node = nodeData[styleId]?.document;
    if (!node) continue;
    const varName = cssVarName(meta.name);

    switch (meta.styleType) {
      case 'FILL': {
        const fill = node.fills?.[0];
        if (!fill || fill.type !== 'SOLID') break;
        fills.push(`  --${varName}: ${colorToRgba(fill.color, fill.opacity)};  /* ${meta.name} */`);
        break;
      }
      case 'TEXT': {
        const s = node.style;
        if (!s) break;
        typography.push(`  /* ${meta.name} */`);
        if (s.fontFamily)   typography.push(`  --${varName}-font-family: "${s.fontFamily}";`);
        if (s.fontSize)     typography.push(`  --${varName}-font-size: ${s.fontSize}px;`);
        if (s.fontWeight)   typography.push(`  --${varName}-font-weight: ${s.fontWeight};`);
        if (s.lineHeightPx) typography.push(`  --${varName}-line-height: ${Math.round(s.lineHeightPx * 100) / 100}px;`);
        if (s.letterSpacing !== undefined && s.letterSpacing !== 0)
                            typography.push(`  --${varName}-letter-spacing: ${s.letterSpacing}px;`);
        if (s.textCase && s.textCase !== 'ORIGINAL')
                            typography.push(`  --${varName}-text-transform: ${s.textCase.toLowerCase()};`);
        break;
      }
      case 'EFFECT': {
        const shadows = (node.effects ?? []).filter(
          (e) => (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') && e.visible !== false
        );
        if (!shadows.length) break;
        const value = shadows
          .map((e) => {
            const c = colorToRgba(e.color);
            return `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread ?? 0}px ${c}`;
          })
          .join(', ');
        effects.push(`  --${varName}: ${value};  /* ${meta.name} */`);
        break;
      }
      case 'GRID': {
        grids.push(`  /* ${meta.name}: grid style (no direct CSS equivalent) */`);
        break;
      }
    }
  }

  const lines = [
    '/* Design Tokens — auto-generated from Figma Foundation library */',
    '/* Source: local styles via files API (file_content:read) */',
    '',
    ':root {',
    ...(fills.length   ? ['  /* ── Colors ── */', ...fills, '']         : []),
    ...(typography.length ? ['  /* ── Typography ── */', ...typography, ''] : []),
    ...(effects.length ? ['  /* ── Shadows / Effects ── */', ...effects, ''] : []),
    ...(grids.length   ? ['  /* ── Grids ── */', ...grids, '']          : []),
    '}',
  ];

  const outPath = path.join(OUTPUT.tokens, 'tokens.css');
  fs.writeFileSync(outPath, lines.join('\n'));
  console.log(`  ✓ Wrote ${outPath} (${fills.length} colors, ${typography.length > 0 ? Math.floor(typography.filter(l => l.startsWith('  /*')).length) : 0} text styles, ${effects.length} shadows)`);
}

// ─── 2. Components → HTML ───────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function paintToCss(paints) {
  if (!paints?.length) return null;
  const visible = paints.filter((p) => p.visible !== false);
  if (!visible.length) return null;
  const p = visible[visible.length - 1]; // Figma stacks bottom-to-top
  if (p.type === 'SOLID') return p.color ? colorToRgba(p.color, p.opacity ?? 1) : null;
  if (p.type === 'GRADIENT_LINEAR') {
    const stops = (p.gradientStops ?? [])
      .filter((s) => s.color)
      .map((s) => `${colorToRgba(s.color)} ${Math.round(s.position * 100)}%`)
      .join(', ');
    return stops ? `linear-gradient(to bottom, ${stops})` : null;
  }
  if (p.type === 'GRADIENT_RADIAL') {
    const stops = (p.gradientStops ?? [])
      .filter((s) => s.color)
      .map((s) => `${colorToRgba(s.color)} ${Math.round(s.position * 100)}%`)
      .join(', ');
    return stops ? `radial-gradient(circle, ${stops})` : null;
  }
  return null;
}

function shadowToCss(effects) {
  const shadows = (effects ?? []).filter(
    (e) => (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') && e.visible !== false && e.color && e.offset
  );
  if (!shadows.length) return null;
  return shadows
    .map((e) => {
      const c = colorToRgba(e.color);
      return `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.offset.x}px ${e.offset.y}px ${e.radius ?? 0}px ${e.spread ?? 0}px ${c}`;
    })
    .join(', ');
}

function flexAlign(v) {
  return { MIN: 'flex-start', MAX: 'flex-end', CENTER: 'center', SPACE_BETWEEN: 'space-between' }[v] ?? 'flex-start';
}

function nodeToStyle(node, parent) {
  const r = {};
  const box = node.absoluteBoundingBox;
  const pBox = parent?.absoluteBoundingBox;
  const parentIsAutoLayout = parent?.layoutMode === 'HORIZONTAL' || parent?.layoutMode === 'VERTICAL';

  if (node.opacity != null && node.opacity !== 1) r.opacity = node.opacity;

  // ── Size & position ──
  if (box) {
    const w = Math.round(box.width);
    const h = Math.round(box.height);
    if (parentIsAutoLayout) {
      r.width = node.layoutGrow === 1 ? undefined : `${w}px`;
      r.flex = node.layoutGrow === 1 ? '1' : undefined;
      r.height = node.layoutAlign === 'STRETCH' ? undefined : `${h}px`;
      if (node.layoutAlign === 'STRETCH') r['align-self'] = 'stretch';
    } else if (pBox && parent?.type !== 'DOCUMENT') {
      r.position = 'absolute';
      r.left = `${Math.round(box.x - pBox.x)}px`;
      r.top = `${Math.round(box.y - pBox.y)}px`;
      r.width = `${w}px`;
      r.height = `${h}px`;
    } else {
      r.width = `${w}px`;
      r.height = `${h}px`;
    }
  }

  // ── Background ──
  const bg = paintToCss(node.fills);
  if (bg && node.type !== 'TEXT') {
    if (bg.startsWith('#') || bg.startsWith('rgb')) r['background-color'] = bg;
    else r.background = bg;
  }

  // ── Border radius ──
  if (node.cornerRadius) {
    r['border-radius'] = `${node.cornerRadius}px`;
  } else if (node.rectangleCornerRadii?.some(Boolean)) {
    r['border-radius'] = node.rectangleCornerRadii.map((v) => `${v}px`).join(' ');
  }

  // ── Border / strokes ──
  if (node.strokes?.length && node.strokeWeight) {
    const sc = node.strokes.find((s) => s.visible !== false && s.color);
    if (sc) {
      r.border = `${node.strokeWeight}px solid ${colorToRgba(sc.color, sc.opacity ?? 1)}`;
      r['box-sizing'] = 'border-box';
    }
  }

  // ── Shadows ──
  const shadow = shadowToCss(node.effects);
  if (shadow) r['box-shadow'] = shadow;

  // ── Blur ──
  const blur = (node.effects ?? []).find((e) => e.type === 'LAYER_BLUR' && e.visible !== false);
  if (blur) r.filter = `blur(${blur.radius}px)`;

  // ── Auto-layout → flexbox ──
  if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
    r.display = 'flex';
    r['flex-direction'] = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
    r['align-items'] = flexAlign(node.counterAxisAlignItems);
    r['justify-content'] = flexAlign(node.primaryAxisAlignItems);
    if (node.itemSpacing) r.gap = `${node.itemSpacing}px`;
    const { paddingTop: pt = 0, paddingRight: pr = 0, paddingBottom: pb = 0, paddingLeft: pl = 0 } = node;
    if (pt || pr || pb || pl) r.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
    if (node.layoutWrap === 'WRAP') r['flex-wrap'] = 'wrap';
  } else if ((node.children?.length ?? 0) > 0) {
    // Non-auto-layout container: ensure it creates a positioning context so that
    // position:absolute grandchildren anchor here, not to a distant ancestor.
    // Works whether this node is a flex child (no position yet → relative) or
    // is itself absolute (absolute already establishes a context, ?? is a no-op).
    r.position = r.position ?? 'relative';
  }

  if (node.clipsContent) r.overflow = 'hidden';
  if (node.type === 'ELLIPSE') r['border-radius'] = '50%';

  // ── Text ──
  if (node.type === 'TEXT') {
    const s = node.style ?? {};
    const textColor = paintToCss(node.fills);
    if (textColor) r.color = textColor;
    if (s.fontFamily) r['font-family'] = `"${s.fontFamily}", sans-serif`;
    if (s.fontSize) r['font-size'] = `${s.fontSize}px`;
    if (s.fontWeight) r['font-weight'] = s.fontWeight;
    if (s.italic) r['font-style'] = 'italic';
    if (s.lineHeightPx) r['line-height'] = `${Math.round(s.lineHeightPx * 10) / 10}px`;
    if (s.letterSpacing) r['letter-spacing'] = `${s.letterSpacing}px`;
    const ta = { LEFT: 'left', RIGHT: 'right', CENTER: 'center', JUSTIFIED: 'justify' }[s.textAlignHorizontal];
    if (ta && ta !== 'left') r['text-align'] = ta;
    const tc = { UPPER: 'uppercase', LOWER: 'lowercase', TITLE: 'capitalize' }[s.textCase];
    if (tc) r['text-transform'] = tc;
    const td = { UNDERLINE: 'underline', STRIKETHROUGH: 'line-through' }[s.textDecoration];
    if (td) r['text-decoration'] = td;
    // Remove background for text nodes (Figma fills on TEXT = text color)
    delete r['background-color'];
    delete r.background;
  }

  return Object.entries(r)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

const SKIP_TYPES = new Set(['SLICE', 'STICKY', 'CONNECTOR', 'SHAPE_WITH_TEXT', 'CODE_BLOCK', 'WASHI_TAPE']);

function nodeToHtml(node, parent, depth = 0) {
  if (!node || node.visible === false) return '';
  if (SKIP_TYPES.has(node.type)) return '';
  if (depth > 10) return '';

  const style = nodeToStyle(node, parent);
  const sa = style ? ` style="${style}"` : '';
  const da = node.name ? ` data-name="${escapeHtml(node.name)}"` : '';

  if (node.type === 'TEXT') {
    const text = escapeHtml(node.characters ?? '').replace(/\n/g, '<br>');
    return `<span${sa}${da}>${text}</span>`;
  }

  const children = (node.children ?? [])
    .map((c) => nodeToHtml(c, node, depth + 1))
    .filter(Boolean)
    .join('');

  return `<div${sa}${da}>${children}</div>`;
}

function propsTable(defs) {
  if (!defs || !Object.keys(defs).length) return '';
  const rows = Object.entries(defs)
    .map(([name, def]) => {
      const opts = Array.isArray(def.variantOptions)
        ? def.variantOptions.map((v) => `<span class="tag">${escapeHtml(v)}</span>`).join(' ')
        : '';
      const defaultVal = def.defaultValue !== undefined ? escapeHtml(String(def.defaultValue)) : '—';
      return `<tr><td>${escapeHtml(name)}</td><td>${def.type ?? ''}</td><td>${defaultVal}</td><td>${opts}</td></tr>`;
    })
    .join('');
  return `<section><h2>Properties</h2><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Options</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

function componentToHtml(meta, nodeWrapper) {
  const node = nodeWrapper?.document;
  const box = node?.absoluteBoundingBox;
  const w = box ? `${Math.round(box.width)}px` : '—';
  const h = box ? `${Math.round(box.height)}px` : '—';

  const renderedHtml = node
    ? nodeToHtml(node, null, 0)
    : '<span style="color:#999;font-style:italic">No node data</span>';

  const desc = meta.description
    ? `<p class="desc">${escapeHtml(meta.description)}</p>`
    : '';

  const props = node?.componentPropertyDefinitions ? propsTable(node.componentPropertyDefinitions) : '';

  // Checkerboard background to make transparency visible
  const checkerCss = `background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:16px 16px;background-position:0 0,0 8px,8px -8px,-8px 0`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(meta.name)}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#f0f0f0;padding:2rem;color:#111}
.page{max-width:1400px;margin:0 auto}
header{margin-bottom:1.25rem}
h1{font-size:1.25rem;font-weight:600;margin-bottom:.2rem}
h2{font-size:.9rem;font-weight:600;margin:1.25rem 0 .5rem;text-transform:uppercase;letter-spacing:.05em;color:#555}
.meta{font-size:.75rem;color:#888;font-family:monospace}
.desc{background:#fff;border-left:3px solid #ddd;padding:.5rem .75rem;font-size:.875rem;color:#555;margin:.75rem 0;border-radius:0 4px 4px 0}
.preview-wrap{background:#fff;border-radius:8px;padding:2rem;overflow:auto;margin-bottom:1.25rem;display:flex;align-items:flex-start;justify-content:flex-start;min-height:80px}
.checker{${checkerCss};border-radius:4px;display:inline-flex}
table{width:100%;border-collapse:collapse;font-size:.8rem;background:#fff;border-radius:8px;overflow:hidden}
th,td{text-align:left;padding:.5rem .75rem;border-bottom:1px solid #eee}
th{background:#fafafa;font-weight:600;color:#555}
.tag{display:inline-block;background:#e0f2fe;color:#0369a1;border-radius:3px;padding:1px 5px;font-size:.7rem;margin:1px}
</style>
</head>
<body>
<div class="page">
  <header>
    <h1>${escapeHtml(meta.name)}</h1>
    <p class="meta">key: ${escapeHtml(meta.key)} &nbsp;·&nbsp; ${w} × ${h}</p>
  </header>
  ${desc}
  <h2>Preview</h2>
  <div class="preview-wrap">
    <div class="checker">${renderedHtml}</div>
  </div>
  ${props}
</div>
</body>
</html>`;
}

// Returns true when the checker div contains a single empty div — no visible content.
function isBlank(html) {
  return /<div class="checker"><div[^>]*><\/div><\/div>/.test(html);
}

async function exportComponents(fileKey, outputDir) {
  console.log(`  Fetching file ${fileKey}…`);
  const data = await figmaGet(`/v1/files/${fileKey}`);
  const components = data.components ?? {};
  const entries = Object.entries(components);
  const count = entries.length;
  console.log(`  Found ${count} components`);
  if (count === 0) { console.log('  No components found — skipping'); return; }

  // Fetch full node trees in batches
  const BATCH = 50;
  const nodeData = {};
  const totalBatches = Math.ceil(count / BATCH);
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const ids = batch.map(([id]) => id).join(',');
    const batchNum = Math.floor(i / BATCH) + 1;
    process.stdout.write(`  Fetching node data batch ${batchNum}/${totalBatches}…\r`);
    try {
      const result = await figmaGet(
        `/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`
      );
      Object.assign(nodeData, result.nodes ?? {});
    } catch (err) {
      console.warn(`\n  ⚠ Batch ${batchNum} failed: ${err.message}`);
    }
  }
  process.stdout.write('\n');

  // Write HTML files, collecting blank entries for SVG fallback
  const seen = new Map();
  const blankEntries = [];
  let written = 0;
  for (const [nodeId, meta] of entries) {
    let base = sanitizeFilename(meta.name);
    if (seen.has(base)) {
      base = `${base}_${nodeId.replace(/[^a-z0-9]/gi, '-')}`;
    }
    seen.set(base, true);
    const filePath = path.join(outputDir, base + '.html');
    const html = componentToHtml(meta, nodeData[nodeId] ?? null);
    fs.writeFileSync(filePath, html);
    if (isBlank(html)) blankEntries.push({ nodeId, filePath });
    written++;
    if (written % 50 === 0) process.stdout.write(`  … wrote ${written}/${count}\r`);
  }
  console.log(`  ✓ Wrote ${written} component HTML files`);

  // SVG fallback for blank components (remote references)
  if (blankEntries.length > 0) {
    console.log(`  ${blankEntries.length} blank previews — resolving component sources…`);
    await patchWithSvg(blankEntries, components);
  }
}

// ─── 3. SVG patch helpers ────────────────────────────────────────────────────

// Renders SVGs for {nodeId, filePath} entries from a single source file and patches the HTML.
async function renderAndPatch(fileKey, entries) {
  const SVG_BATCH = 200;
  const urlMap = {};
  const totalBatches = Math.ceil(entries.length / SVG_BATCH);
  for (let i = 0; i < entries.length; i += SVG_BATCH) {
    const batch = entries.slice(i, i + SVG_BATCH);
    const ids = batch.map((b) => b.nodeId);
    const batchNum = Math.floor(i / SVG_BATCH) + 1;
    process.stdout.write(`  Fetching SVG URLs batch ${batchNum}/${totalBatches}…\r`);
    try {
      const batchUrls = await fetchSvgBatch(fileKey, ids);
      Object.assign(urlMap, batchUrls);
    } catch (err) {
      console.warn(`\n  ⚠ SVG batch ${batchNum} failed: ${err.message}`);
    }
  }
  process.stdout.write('\n');

  let fixed = 0;
  let failed = 0;
  await Promise.all(
    entries.map(async ({ nodeId, filePath }) => {
      const url = urlMap[nodeId];
      if (!url) { failed++; return; }
      try {
        const svg = await downloadSvg(url);
        const html = fs.readFileSync(filePath, 'utf8');
        const patched = html.replace(
          /(<div class="checker">)<div[^>]*><\/div>(<\/div>)/,
          `$1${svg}$2`
        );
        fs.writeFileSync(filePath, patched);
        fixed++;
      } catch (err) {
        console.warn(`  ⚠ ${path.basename(filePath)}: ${err.message}`);
        failed++;
      }
    })
  );
  return { fixed, failed };
}

// Resolves remote component references via the component key API, groups by source file,
// then calls renderAndPatch per source file.
async function patchWithSvg(blankEntries, componentsMeta) {
  // Resolve each entry's component key → source {file_key, node_id}
  const RESOLVE_CONCURRENCY = 20;
  const resolved = []; // [{fileKey, nodeId, filePath}]

  for (let i = 0; i < blankEntries.length; i += RESOLVE_CONCURRENCY) {
    const batch = blankEntries.slice(i, i + RESOLVE_CONCURRENCY);
    await Promise.all(
      batch.map(async ({ nodeId, filePath }) => {
        const meta = componentsMeta[nodeId];
        if (!meta?.key) return;
        try {
          const data = await figmaGet(`/v1/components/${meta.key}`);
          const fileKey = data.meta?.file_key;
          const renderNodeId = data.meta?.node_id;
          if (fileKey && renderNodeId) {
            resolved.push({ fileKey, nodeId: renderNodeId, filePath });
          }
        } catch (_) {}
      })
    );
  }

  // Group by source file
  const byFile = new Map();
  for (const { fileKey, nodeId, filePath } of resolved) {
    if (!byFile.has(fileKey)) byFile.set(fileKey, []);
    byFile.get(fileKey).push({ nodeId, filePath });
  }

  let totalFixed = 0;
  let totalFailed = blankEntries.length - resolved.length; // unresolvable count as failed
  for (const [fileKey, entries] of byFile) {
    console.log(`  Rendering ${entries.length} components from file ${fileKey}…`);
    const { fixed, failed } = await renderAndPatch(fileKey, entries);
    totalFixed += fixed;
    totalFailed += failed;
  }
  console.log(`  ✓ Fixed ${totalFixed} blank files${totalFailed ? ` (${totalFailed} failed/unresolvable)` : ''}`);
}

// Scans an already-exported outputDir for blank HTML files and patches them.
async function fixBlanks(fileKey, outputDir) {
  console.log(`  Fetching component list for ${fileKey}…`);
  const data = await figmaGet(`/v1/files/${fileKey}`);
  const components = data.components ?? {};
  const entries = Object.entries(components);

  // Replicate the same filename deduplication used in exportComponents
  const filenameToNodeId = new Map();
  const seen = new Map();
  for (const [nodeId, meta] of entries) {
    let base = sanitizeFilename(meta.name);
    if (seen.has(base)) {
      base = `${base}_${nodeId.replace(/[^a-z0-9]/gi, '-')}`;
    }
    seen.set(base, true);
    filenameToNodeId.set(base + '.html', nodeId);
  }

  // Find blank HTML files on disk
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.html'));
  const blankList = [];
  for (const filename of files) {
    const filePath = path.join(outputDir, filename);
    const html = fs.readFileSync(filePath, 'utf8');
    if (!isBlank(html)) continue;
    const nodeId = filenameToNodeId.get(filename);
    if (!nodeId) {
      console.warn(`  ⚠ No node ID for ${filename} — skipping`);
      continue;
    }
    blankList.push({ nodeId, filePath });
  }

  console.log(`  Found ${blankList.length} blank files — resolving component sources…`);
  if (blankList.length === 0) return;

  await patchWithSvg(blankList, components);
}

// ─── 4. Icons → SVG ─────────────────────────────────────────────────────────

function collectIconNodes(node, results = []) {
  if (!node) return results;
  // Collect COMPONENT nodes (each icon is typically a component)
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    results.push({ id: node.id, name: node.name });
  }
  for (const child of node.children ?? []) {
    collectIconNodes(child, results);
  }
  return results;
}

async function fetchSvgBatch(fileKey, ids) {
  const idStr = ids.join(',');
  const data = await figmaGet(`/v1/images/${fileKey}?ids=${encodeURIComponent(idStr)}&format=svg&svg_include_id=false`);
  return data.images ?? {};
}

async function downloadSvg(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  return res.text();
}

async function exportIcons() {
  console.log('Fetching Icons file…');
  const data = await figmaGet(`/v1/files/${FILE_KEYS.icons}`);
  const document = data.document;
  const icons = collectIconNodes(document);

  if (icons.length === 0) {
    // Fallback: use the components map from the file
    const components = data.components ?? {};
    for (const [id, comp] of Object.entries(components)) {
      icons.push({ id, name: comp.name });
    }
  }

  console.log(`  Found ${icons.length} icon nodes`);

  if (icons.length === 0) {
    console.log('  No icons found — skipping');
    return;
  }

  // Batch SVG export requests (Figma allows up to ~500 ids per request)
  const BATCH = 200;
  const urlMap = {};
  for (let i = 0; i < icons.length; i += BATCH) {
    const batch = icons.slice(i, i + BATCH);
    const ids = batch.map((ic) => ic.id);
    console.log(`  Requesting SVG URLs (batch ${Math.floor(i / BATCH) + 1})…`);
    const batchUrls = await fetchSvgBatch(FILE_KEYS.icons, ids);
    Object.assign(urlMap, batchUrls);
  }

  let written = 0;
  let failed = 0;
  await Promise.all(
    icons.map(async (icon) => {
      const url = urlMap[icon.id];
      if (!url) { failed++; return; }
      try {
        const svg = await downloadSvg(url);
        const filename = sanitizeFilename(icon.name) + '.svg';
        fs.writeFileSync(path.join(OUTPUT.icons, filename), svg);
        written++;
      } catch (err) {
        console.warn(`  ⚠ ${icon.name}: ${err.message}`);
        failed++;
      }
    })
  );

  console.log(`  ✓ Wrote ${written} SVG files${failed ? ` (${failed} failed)` : ''}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const fixOnly = process.argv.includes('--fix-blanks-only');

  if (fixOnly) {
    console.log('=== Fix Blank Component Previews ===\n');
    ensureDirs();
    const steps = [
      ['Fix blanks (library 1)', () => fixBlanks(FILE_KEYS.components,  OUTPUT.components)],
      ['Fix blanks (library 2)', () => fixBlanks(FILE_KEYS.components2, OUTPUT.components2)],
    ];
    for (const [label, fn] of steps) {
      console.log(`\n[${label}]`);
      try { await fn(); } catch (err) { console.error(`  ✗ Failed: ${err.message}`); }
    }
    console.log('\n=== Done ===');
    return;
  }

  console.log('=== Figma Design System Export ===\n');
  ensureDirs();

  const steps = [
    ['Tokens → tokens.css', exportTokens],
    ['Components (library 1) → HTML', () => exportComponents(FILE_KEYS.components, OUTPUT.components)],
    ['Components (library 2) → HTML', () => exportComponents(FILE_KEYS.components2, OUTPUT.components2)],
    ['Icons → SVG', exportIcons],
  ];

  for (const [label, fn] of steps) {
    console.log(`\n[${label}]`);
    try {
      await fn();
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  console.log('\n=== Export complete ===');
  console.log(`Output: ${OUTPUT.root}`);
}

main();
