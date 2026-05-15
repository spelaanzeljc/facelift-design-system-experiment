#!/usr/bin/env node
'use strict';
/**
 * rename-convention.js
 * Renames all HTML files in output/components/ and output/components2/ from the
 * old underscore-based convention to the new hyphen-only convention:
 *   - segment separator: _- → --
 *   - word separator:    _  → -
 *   - removes:          ( ) .
 *   - normalises:       3+ consecutive dashes → --
 *   - trims:            leading/trailing dashes per segment
 *
 * Also injects <meta name="figma-name"> from each file's <title> tag.
 */

const fs   = require('fs');
const path = require('path');

const BASE = __dirname;
const DIRS = ['output/components', 'output/components2'];

function toNewConvention(oldBase) {
  let name = oldBase;
  name = name.replace(/_-/g, '--');        // segment separator
  name = name.replace(/_/g, '-');          // word separator
  name = name.replace(/[().]/g, '');       // remove special chars
  name = name.replace(/-{3,}/g, '--');     // normalise 3+ dashes to --
  name = name.replace(/(?:^|(?<=--))--/g, '--'); // collapse adjacent --
  name = name.replace(/--+/g, '--');       // final: ensure at most --
  name = name.replace(/^-+|-+$/g, '');    // trim leading/trailing dashes
  return name;
}

function addFigmaNameMeta(html, figmaName) {
  if (html.includes('name="figma-name"')) return html; // already patched
  const escaped = figmaName.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return html.replace(
    /<meta name="viewport"/,
    `<meta name="figma-name" content="${escaped}">\n<meta name="viewport"`
  );
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/);
  return m ? m[1].trim() : '';
}

let renamed = 0, skipped = 0, collisions = 0;
const newNames = new Set();

for (const relDir of DIRS) {
  const absDir = path.join(BASE, relDir);
  const files = fs.readdirSync(absDir).filter(f => f.endsWith('.html')).sort();

  for (const file of files) {
    const oldBase = file.replace(/\.html$/, '');
    const newBase = toNewConvention(oldBase);
    const newFile = newBase + '.html';

    const oldPath = path.join(absDir, file);
    const newPath = path.join(absDir, newFile);

    // Read and patch HTML (add figma-name meta)
    let html = fs.readFileSync(oldPath, 'utf8');
    const figmaName = extractTitle(html) || oldBase;
    const patchedHtml = addFigmaNameMeta(html, figmaName);

    if (file === newFile) {
      // Only meta patch needed
      if (patchedHtml !== html) {
        fs.writeFileSync(oldPath, patchedHtml, 'utf8');
      }
      newNames.add(path.join(relDir, newFile));
      skipped++;
      continue;
    }

    // Check for collision
    const key = path.join(relDir, newFile);
    if (newNames.has(key)) {
      console.warn(`  COLLISION: ${file} → ${newFile} (already exists)`);
      collisions++;
      continue;
    }
    newNames.add(key);

    // Write patched HTML to new path, then delete old path
    fs.writeFileSync(newPath, patchedHtml, 'utf8');
    fs.unlinkSync(oldPath);
    console.log(`  ${relDir}/${file}\n    → ${newFile}`);
    renamed++;
  }
}

console.log(`\nDone — ${renamed} renamed, ${skipped} already correct, ${collisions} collisions.\n`);
