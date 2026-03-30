#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'),
);

const banner = `
${cyan}  ███████╗██╗  ██╗███████╗ █████╗ ███████╗
  ██╔════╝██║  ██║██╔════╝██╔══██╗██╔════╝
  ███████╗███████║█████╗  ███████║█████╗  
  ╚════██║██╔══██║██╔══╝  ██╔══██║██╔══╝  
  ███████║██║  ██║███████╗██║  ██║██║     
  ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ${reset}

  Sheaf ${dim}v${pkg.version}${reset}
  ${pkg.tagline}
`;

const APP_DIRNAME = '.codecompanion';
const DEFAULT_GLOBAL_DIR = path.join(os.homedir(), APP_DIRNAME);
const DEFAULT_LOCAL_DIR = path.join(process.cwd(), APP_DIRNAME);
const DEFAULT_GLOBAL_LABEL = DEFAULT_GLOBAL_DIR.replace(os.homedir(), '~');
const DEFAULT_LOCAL_LABEL = `./${APP_DIRNAME}`;

// canonical token used inside markdown docs/templates
const DOCS_DEFAULT_ROOT = `~/${APP_DIRNAME}`;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Match "~/.codecompanion" when followed by "/" or word boundary
const docsDefaultRootRegex = new RegExp(
  `${escapeRegExp(DOCS_DEFAULT_ROOT)}(?=\\/|\\b)`,
  'g',
);

// Parse args
const args = process.argv.slice(2);
const hasHelp = args.includes('--help') || args.includes('-h');
const hasDryRun = args.includes('--dry-run') || args.includes('-d');
const hasClaude = args.includes('--claude');

function parseToArg(argv) {
  let target = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--to' || arg === '-t') {
      const nextArg = argv[i + 1];
      if (!nextArg || nextArg.startsWith('-')) {
        console.error(`  ${yellow}--to requires a non-empty value${reset}`);
        process.exit(1);
      }
      if (target !== null) {
        console.error(`  ${yellow}--to can only be specified once${reset}`);
        process.exit(1);
      }
      target = nextArg.trim();
      i += 1;
      continue;
    }

    if (arg.startsWith('--to=') || arg.startsWith('-t=')) {
      const inlineValue = arg.slice(arg.indexOf('=') + 1).trim();
      if (!inlineValue) {
        console.error(`  ${yellow}--to requires a non-empty value${reset}`);
        process.exit(1);
      }
      if (target !== null) {
        console.error(`  ${yellow}--to can only be specified once${reset}`);
        process.exit(1);
      }
      target = inlineValue;
    }
  }

  return target;
}

/**
 * Expand ~ to home directory
 */
function expandTilde(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return filePath;
  }
  if (filePath === '~') {
    return os.homedir();
  }
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

function resolvePathFromCwd(inputPath) {
  const expanded = expandTilde(inputPath);

  if (typeof expanded !== 'string' || expanded.length === 0) {
    return expanded;
  }

  if (path.isAbsolute(expanded)) {
    return expanded;
  }

  return path.resolve(process.cwd(), expanded);
}

function isWithin(baseDir, candidateDir) {
  const rel = path.relative(baseDir, candidateDir);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function resolveInstallTarget(targetInput) {
  const raw = targetInput.trim();
  const match = raw.match(/^(global|local)(?::(.+))?$/);

  if (!match) {
    console.error(
      `  ${yellow}Invalid --to value: "${targetInput}". Use global[:path] or local[:path].${reset}`,
    );
    process.exit(1);
  }

  const scope = match[1];
  const rawPath = match[2]; // undefined when omitted

  if (scope === 'global') {
    const dir = rawPath
      ? resolvePathFromCwd(rawPath.trim())
      : DEFAULT_GLOBAL_DIR;
    const label = dir.replace(os.homedir(), '~');
    const claudeDir = path.join(os.homedir(), '.claude');

    return {
      mode: 'global',
      dir,
      label,
      claudeDir,
      pathPrefix: ensureTrailingSlash(dir), // always absolute for global
      claudePathPrefix: ensureTrailingSlash(claudeDir),
    };
  }

  // local
  let dir = DEFAULT_LOCAL_DIR;

  if (rawPath) {
    const expanded = expandTilde(rawPath.trim());
    const candidate = path.isAbsolute(expanded)
      ? path.normalize(expanded)
      : path.resolve(process.cwd(), expanded);

    if (!isWithin(process.cwd(), candidate)) {
      console.error(
        `  ${yellow}Invalid local path: must stay inside current workspace.${reset}`,
      );
      console.error(`  ${dim}Received: ${candidate}${reset}`);
      process.exit(1);
    }

    dir = candidate;
  }

  const rel = path.relative(process.cwd(), dir);
  const relPosix = toPosix(rel);
  const label = rel === '' ? './' : `./${relPosix}`;
  const pathPrefix = rel === '' ? './' : `./${relPosix}/`;

  const claudeDir = path.join(process.cwd(), '.claude');
  const claudeRel = path.relative(process.cwd(), claudeDir);
  const claudePathPrefix = `./${toPosix(claudeRel)}/`;

  return {
    mode: 'local',
    dir,
    label,
    claudeDir,
    pathPrefix,
    claudePathPrefix,
  };
}

// Help first
if (hasHelp) {
  console.log(banner);
  console.log(`  ${yellow}Usage:${reset} npx sheaf [options]

  ${yellow}Options:${reset}
    ${cyan}-t, --to <target>${reset}          Install target:
                                 ${dim}global${reset}          -> ${DEFAULT_GLOBAL_LABEL}
                                 ${dim}global:<path>${reset}   -> absolute target (~/..., ./..., /...)
                                 ${dim}local${reset}           -> ${DEFAULT_LOCAL_LABEL}
                                 ${dim}local:<path>${reset}    -> must remain inside current workspace
    ${cyan}--claude${reset}                   Also install commands for Claude Code in .claude/
    ${cyan}-d, --dry-run${reset}              Show what would be installed without writing files
    ${cyan}-h, --help${reset}                 Show this help message

  ${yellow}Global vs Local:${reset}
    ${dim}global${reset}: install in a system path; markdown references are rewritten as absolute paths.
    ${dim}local${reset}:  install inside current workspace; markdown references are rewritten as workspace-relative paths.

  ${yellow}Behavior:${reset}
    If ${cyan}--to${reset} is omitted, installer prompts interactively in TTY.

  ${yellow}Examples:${reset}
    npx sheaf --to global
    npx sheaf --to global:~/${APP_DIRNAME}-custom
    npx sheaf --to local
    npx sheaf --to local:./.ai
`);
  process.exit(0);
}

async function promptForTarget() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error(
      `  ${yellow}Missing --to <target>. Interactive prompt requires a TTY.${reset}`,
    );
    console.error(`  ${dim}Try: npx sheaf --to local${reset}`);
    process.exit(1);
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let interruptedExitCode = null;

  const onSigint = () => {
    interruptedExitCode = 130;
    console.log(`\n  ${yellow}Cancelled by user (Ctrl+C).${reset}`);
    rl.close();
  };

  const onSigterm = () => {
    interruptedExitCode = 143;
    console.log(`\n  ${yellow}Terminated (SIGTERM).${reset}`);
    rl.close();
  };

  process.once('SIGINT', onSigint);
  process.once('SIGTERM', onSigterm);

  try {
    while (true) {
      console.log(`  ${yellow}Choose installation target:${reset}
  ${dim}global:${reset} install in system path, replacements become absolute
  ${dim}local:${reset}  install in workspace, replacements become relative

  ${cyan}1${reset}) global ${dim}(${DEFAULT_GLOBAL_LABEL})${reset}
  ${cyan}2${reset}) local  ${dim}(${DEFAULT_LOCAL_LABEL})${reset}
  ${cyan}3${reset}) global custom path
  ${cyan}4${reset}) local custom path
  ${cyan}q${reset}) quit
`);

      let choice;
      try {
        choice =
          (await rl.question(`  Choice ${dim}[2]${reset}: `))
            .trim()
            .toLowerCase() || '2';
      } catch (error) {
        if (interruptedExitCode !== null) {
          process.exit(interruptedExitCode);
        }

        if (error && error.name === 'AbortError') {
          process.exit(130);
        }

        throw error;
      }

      if (choice === 'q' || choice === 'quit' || choice === 'exit') {
        console.log(`  ${dim}Aborted.${reset}`);
        process.exit(0);
      }

      if (choice === '1') return 'global';
      if (choice === '2') return 'local';

      if (choice === '3') {
        const custom = (await rl.question(`  Global custom path: `)).trim();
        if (!custom) {
          console.error(`  ${yellow}Path cannot be empty${reset}`);
          continue;
        }
        return `global:${custom}`;
      }

      if (choice === '4') {
        const custom = (await rl.question(`  Local custom path: `)).trim();
        if (!custom) {
          console.error(`  ${yellow}Path cannot be empty${reset}`);
          continue;
        }
        return `local:${custom}`;
      }

      console.error(`  ${yellow}Invalid choice: ${choice}${reset}\n`);
    }
  } finally {
    process.removeListener('SIGINT', onSigint);
    process.removeListener('SIGTERM', onSigterm);
    rl.close();
  }
}

/**
 * Recursively copy directory, replacing path prefixes inside markdown files.
 */
function copyWithPathReplacement(
  srcDir,
  destDir,
  pathPrefix,
  dryRun,
  isClaude = false,
) {
  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  } else {
    console.log(`  ${dim}[dry-run] mkdir -p ${destDir}${reset}`);
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix, dryRun, isClaude);
      continue;
    }

    if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf8');

      // Replace root token; preserve original trailing "/" if present
      const targetRoot = pathPrefix.endsWith('/')
        ? pathPrefix.slice(0, -1)
        : pathPrefix;

      content = content.replace(docsDefaultRootRegex, targetRoot);

      if (isClaude && srcDir.endsWith('prompts')) {
        // Extract frontmatter name/description
        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        const name = nameMatch
          ? nameMatch[1].trim()
          : entry.name.replace('.md', '');
        const desc = descMatch ? descMatch[1].trim() : '';

        const newFrontmatter = `---\nname: ${name}\ndescription: ${desc}\ndisable-model-invocation: true\n---`;

        // Remove existing frontmatter and "## user" section with tool boilerplate
        content = content
          .replace(/^---[\s\S]*?---\n*/, '')
          .replace(
            /## user[\s\S]*?(?=<objective>|<process>|<execution_context>|<context>)/i,
            '',
          );

        content = `${newFrontmatter}\n\n${content.trim()}\n`;
      }

      if (!dryRun) {
        fs.writeFileSync(destPath, content);
      } else {
        console.log(
          `  ${dim}[dry-run] write ${destPath} (with path replacement${isClaude ? ' and Claude adaptation' : ''})${reset}`,
        );
      }
      continue;
    }

    if (!dryRun) {
      fs.copyFileSync(srcPath, destPath);
    } else {
      console.log(`  ${dim}[dry-run] copy ${srcPath} -> ${destPath}${reset}`);
    }
  }
}

function install(target, dryRun) {
  const srcRoot = path.join(__dirname, '..');
  const targetDir = target.dir;
  const pathPrefix = target.pathPrefix;

  console.log(
    `  Installing to ${cyan}${target.label}${reset}${dryRun ? ` ${dim}(dry-run)${reset}` : ''}\n`,
  );

  // prompts/sheaf
  const promptsSrc = path.join(srcRoot, 'src', 'prompts');
  const promptsDest = path.join(targetDir, 'prompts', 'sheaf');

  if (fs.existsSync(promptsSrc)) {
    copyWithPathReplacement(promptsSrc, promptsDest, pathPrefix, dryRun);
    console.log(`  ${green}✓${reset} Installed prompts/sheaf`);
  } else {
    console.log(`  ${yellow}!${reset} Skipped prompts (src/prompts not found)`);
  }

  // sheaf/*
  const sheafDest = path.join(targetDir, 'sheaf');
  if (!dryRun) {
    fs.mkdirSync(sheafDest, { recursive: true });
  } else {
    console.log(`  ${dim}[dry-run] mkdir -p ${sheafDest}${reset}`);
  }

  const srcDirs = ['templates', 'workflows', 'references', 'skills', 'rules'];
  for (const dir of srcDirs) {
    const dirSrc = path.join(srcRoot, 'src', dir);
    const dirDest = path.join(sheafDest, dir);
    if (fs.existsSync(dirSrc)) {
      copyWithPathReplacement(dirSrc, dirDest, pathPrefix, dryRun);
    }
  }
  console.log(`  ${green}✓${reset} Installed sheaf`);

  // Claude Code installation if requested
  if (hasClaude) {
    const claudeCommandsDest = path.join(target.claudeDir, 'commands', 'sheaf');
    const claudeSheafDest = path.join(target.claudeDir, 'sheaf');
    const claudeLabel = target.mode === 'global' ? '~/.claude' : './.claude';
    const claudePrefix = target.claudePathPrefix;

    if (fs.existsSync(promptsSrc)) {
      copyWithPathReplacement(
        promptsSrc,
        claudeCommandsDest,
        claudePrefix,
        dryRun,
        true,
      );
    }

    const srcDirs = ['templates', 'workflows', 'references', 'skills', 'rules'];
    for (const dir of srcDirs) {
      const dirSrc = path.join(srcRoot, 'src', dir);
      const dirDest = path.join(claudeSheafDest, dir);
      if (fs.existsSync(dirSrc)) {
        copyWithPathReplacement(dirSrc, dirDest, claudePrefix, dryRun, false);
      }
    }
    console.log(
      `  ${green}✓${reset} Installed Claude files in ${cyan}${claudeLabel}${reset} (pointing to ${claudePrefix})`,
    );
  }

  console.log(`
  ${green}${dryRun ? 'Dry-run complete!' : 'Done!'}${reset}
`);
}

let toTarget = parseToArg(args);

if (!toTarget) {
  console.log(banner);
  toTarget = await promptForTarget();
}

const target = resolveInstallTarget(toTarget);

console.log(banner);
console.log(
  `  ${green}Target:${reset} ${target.mode} -> ${cyan}${target.dir}${reset}${hasDryRun ? ` ${dim}(dry-run)${reset}` : ''}`,
);

install(target, hasDryRun);
process.exit(0);
