#!/usr/bin/env node

/**
 * fix-skill-paths.js
 * Standardizes relative paths in skill prompts to absolute SHEAF-style paths.
 * Usage: node bin/fix-skill-paths.js <skill-name>
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillName = process.argv[2];

if (!skillName) {
  console.error('Error: Skill name is required.');
  console.log('Usage: node bin/fix-skill-paths.js <skill-name>');
  process.exit(1);
}

const skillDir = path.resolve(__dirname, '../src/skills', skillName);

if (!fs.existsSync(skillDir)) {
  console.error(`Error: Skill directory not found at ${skillDir}`);
  process.exit(1);
}

const SHEAF_PREFIX = '{{RUNTIME_DIR}}/sheaf/skills/';

/**
 * Recursively scans a directory for markdown files and replaces paths.
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (entry.name.endsWith('.md')) {
      fixPathsInFile(fullPath);
    }
  }
}

/**
 * Replaces relative paths with standardized SHEAF paths.
 * Handles:
 *   prompts/ -> {{RUNTIME_DIR}}/sheaf/skills/<skill>/prompts/
 *   ./prompts/ -> {{RUNTIME_DIR}}/sheaf/skills/<skill>/prompts/
 *   ../prompts/ -> {{RUNTIME_DIR}}/sheaf/skills/<skill>/prompts/
 * Resolves paths relative to the current file.
 */
function fixPathsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileDirRelative = path.dirname(path.relative(skillDir, filePath));

  // Replace relative path prefixes or local file references
  // Matches:
  // 1. (dots/)?(prompts|resources|agents|steps)/
  // 2. filename.md (if it's one of our known folders' contents or just a .md file in the same dir)

  // First, handle the directory-based matches (prompts/, agents/, etc.)
  let updated = content.replace(
    /(^|[\s`"'(])((?:\.\.?\/)*)(prompts|resources|agents|steps)\//gm,
    (match, prefix, dots, group) => {
      const resolvedPath = path.join(fileDirRelative, dots, group);
      return `${prefix}${SHEAF_PREFIX}${skillName}/${resolvedPath}/`;
    },
  );

  // Second, handle direct file references in the same directory (e.g., "finalize.md" inside prompts/)
  // We look for .md files that don't have a slash before them and aren't already part of a SHEAF path
  updated = updated.replace(
    /(^|[\s`"'(])(?!\/|{{)([\w-]+\.md)([\s`"')|$])/gm,
    (match, prefix, fileName, suffix) => {
      // Only replace if the file exists in the same directory as the current file
      const localFilePath = path.join(path.dirname(filePath), fileName);
      if (fs.existsSync(localFilePath)) {
        const resolvedPath = path.join(fileDirRelative, fileName);
        return `${prefix}${SHEAF_PREFIX}${skillName}/${resolvedPath}${suffix}`;
      }
      return match;
    },
  );

  if (content !== updated) {
    fs.writeFileSync(filePath, updated);
    console.log(`✓ Fixed paths in ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log(`Processing skill: ${skillName}...`);
processDirectory(skillDir);
console.log('Done.');
