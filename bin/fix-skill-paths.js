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

const SHEAF_PREFIX = '{{SHEAF_RUNTIME_DIR}}/skills/';

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
 *   prompts/ -> {{SHEAF_RUNTIME_DIR}}/skills/<skill>/prompts/
 *   ./prompts/ -> {{SHEAF_RUNTIME_DIR}}/skills/<skill>/prompts/
 *   ../prompts/ -> {{SHEAF_RUNTIME_DIR}}/skills/<skill>/prompts/
 * Resolves paths relative to the current file.
 */
function fixPathsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // const fileDirRelative = path.dirname(path.relative(skillDir, filePath));

  const pathRegex =
    /(^|[\s`"'(])((?:\.\.?\/)[\w\-/.]*|[\w\-/]+\.md)([\s`"')|$])/gm;

  let updated = content.replace(pathRegex, (match, prefix, relPath, suffix) => {
    // Resolve the path relative to the current file
    const localFilePath = path.resolve(path.dirname(filePath), relPath);

    // Only convert if it exists on disk and is inside our skill directory
    if (fs.existsSync(localFilePath) && localFilePath.startsWith(skillDir)) {
      const relativeFromSkillRoot = path.relative(skillDir, localFilePath);

      // Ensure directories keep their trailing slash if they had it
      const trailingSlash = relPath.endsWith('/') ? '/' : '';
      return `${prefix}${SHEAF_PREFIX}${skillName}/${relativeFromSkillRoot}${trailingSlash}${suffix}`;
    }

    return match;
  });

  if (content !== updated) {
    fs.writeFileSync(filePath, updated);
    console.log(`✓ Fixed paths in ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log(`Processing skill: ${skillName}...`);
processDirectory(skillDir);
console.log('Done.');
