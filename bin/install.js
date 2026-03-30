#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import * as clack from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const AGENTS = {
  codecompanion: {
    name: 'CodeCompanion',
    dirName: '.codecompanion',
    promptsDir: 'prompts/sheaf',
    description: 'Install Sheaf artifacts for CodeCompanion (Neovim)',
    transform: (content) => content,
  },
  claude: {
    name: 'Claude Code',
    dirName: '.claude',
    promptsDir: 'commands/sheaf',
    description: 'Install Sheaf artifacts for Claude Code',
    transform: (content, fileName, srcDir) => {
      if (!srcDir.endsWith('prompts')) return content;

      const nameMatch = content.match(/name:\s*(.+)/);
      const descMatch = content.match(/description:\s*(.+)/);
      const name = nameMatch ? nameMatch[1].trim() : fileName.replace('.md', '');
      const desc = descMatch ? descMatch[1].trim() : '';

      const newFrontmatter = `---\nname: ${name}\ndescription: ${desc}\ndisable-model-invocation: true\n---`;

      return `${newFrontmatter}\n\n${content
        .replace(/^---[\s\S]*?---\n*/, '')
        .replace(
          /## user[\s\S]*?(?=<objective>|<process>|<execution_context>|<context>)/i,
          '',
        )
        .trim()}\n`;
    },
  },
};

const DOCS_DEFAULT_ROOT = '{{AGENT_DIR}}';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Match placeholder used in markdown docs/templates
const docsDefaultRootRegex = new RegExp(
  `${escapeRegExp(DOCS_DEFAULT_ROOT)}`,
  'g',
);

// Parse args
const rawArgs = process.argv.slice(2);
const hasHelp = rawArgs.includes('--help') || rawArgs.includes('-h');
const hasDryRun = rawArgs.includes('--dry-run') || rawArgs.includes('-d');

function parseArgs(argv) {
  const options = {
    scope: null, // local | global
    installDir: null,
    agents: {
      codecompanion: false,
      claude: false,
    },
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--scope' || arg === '-s') {
      const value = argv[i + 1];
      if (value === 'local' || value === 'global') {
        options.scope = value;
        i += 1;
      } else {
        console.error(
          `  ${yellow}Invalid scope: "${value}". Use local or global.${reset}`,
        );
        process.exit(1);
      }
      continue;
    }

    if (arg === '--install-dir' || arg === '-t') {
      const value = argv[i + 1];
      if (value && !value.startsWith('-')) {
        options.installDir = value;
        i += 1;
      } else {
        console.error(
          `  ${yellow}--install-dir requires a non-empty value${reset}`,
        );
        process.exit(1);
      }
      continue;
    }

    if (arg === '--codecompanion') {
      options.agents.codecompanion = true;
      continue;
    }

    if (arg === '--claude') {
      options.agents.claude = true;
      continue;
    }
  }

  return options;
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

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

/**
 * Resolves the final configuration, either from flags or interactive prompts.
 */
async function resolveConfig(options) {
  const isInteractive = !options.agents.codecompanion && !options.agents.claude;

  if (!isInteractive) {
    const scope = options.scope || 'local';
    const installDir = options.installDir
      ? path.resolve(process.cwd(), expandTilde(options.installDir))
      : scope === 'local'
        ? process.cwd()
        : os.homedir();

    return {
      scope,
      installDir,
      agents: options.agents,
    };
  }

  // Clack interactive flow
  clack.intro(banner);

  const selectedAgents = await clack.multiselect({
    message: 'Which agents do you want to install?',
    options: Object.entries(AGENTS).map(([id, agent]) => ({
      value: id,
      label: agent.name,
      hint: agent.description,
    })),
    initialValues: ['codecompanion'],
  });

  if (clack.isCancel(selectedAgents) || selectedAgents.length === 0) {
    clack.cancel('Installation cancelled. No agents selected.');
    process.exit(0);
  }

  const scope = await clack.select({
    message: 'Select path strategy (Scope):',
    options: [
      {
        value: 'local',
        label: 'Local',
        hint: 'Relative paths (recommended for portability)',
      },
      {
        value: 'global',
        label: 'Global',
        hint: 'Absolute paths (recommended for global installs)',
      },
    ],
    initialValue: 'local',
  });

  if (clack.isCancel(scope)) {
    clack.cancel('Installation cancelled.');
    process.exit(0);
  }

  const defaultDir = options.installDir
    ? path.resolve(process.cwd(), expandTilde(options.installDir))
    : scope === 'local'
      ? './'
      : '~/';
  const installDirInput = await clack.text({
    message: 'Base installation directory:',
    placeholder: defaultDir,
    initialValue: defaultDir,
    validate(value) {
      if (!value) return 'Directory is required';
    },
  });

  if (clack.isCancel(installDirInput)) {
    clack.cancel('Installation cancelled.');
    process.exit(0);
  }

  const installDir = path.resolve(process.cwd(), expandTilde(installDirInput));

  return {
    scope,
    installDir,
    agents: {
      codecompanion: selectedAgents.includes('codecompanion'),
      claude: selectedAgents.includes('claude'),
    },
  };
}

/**
 * Recursively copy directory, replacing path prefixes inside markdown files.
 */
function copyWithPathReplacement(
  srcDir,
  destDir,
  pathPrefix,
  dryRun,
  transform = (c) => c,
) {
  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  } else {
    console.log(`    ${dim}[dry-run] mkdir -p ${destDir}${reset}`);
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix, dryRun, transform);
      continue;
    }

    if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf8');

      // Replace root token; preserve original trailing "/" if present
      const targetRoot = pathPrefix.endsWith('/')
        ? pathPrefix.slice(0, -1)
        : pathPrefix;

      content = content.replace(docsDefaultRootRegex, targetRoot);
      content = transform(content, entry.name, srcDir);

      if (!dryRun) {
        fs.writeFileSync(destPath, content);
      } else {
        console.log(
          `    ${dim}[dry-run] write ${destPath} (with path replacement)${reset}`,
        );
      }
      continue;
    }

    if (!dryRun) {
      fs.copyFileSync(srcPath, destPath);
    } else {
      console.log(`    ${dim}[dry-run] copy ${srcPath} -> ${destPath}${reset}`);
    }
  }
}

function install(config, dryRun) {
  const srcRoot = path.join(__dirname, '..');
  const { scope, installDir, agents } = config;

  console.log(`\n  ${cyan}Installing agents...${reset}\n`);

  for (const [id, agent] of Object.entries(AGENTS)) {
    if (!agents[id]) continue;

    const targetDir = path.join(installDir, agent.dirName);
    const pathPrefix =
      scope === 'local'
        ? `./${agent.dirName}/`
        : ensureTrailingSlash(targetDir);

    console.log(
      `  Target: ${green}${agent.name}${reset} -> ${cyan}${targetDir}${reset} (${scope})`,
    );

    // prompts/sheaf
    const promptsSrc = path.join(srcRoot, 'src', 'prompts');
    const promptsDest = path.join(targetDir, agent.promptsDir);

    if (fs.existsSync(promptsSrc)) {
      copyWithPathReplacement(
        promptsSrc,
        promptsDest,
        pathPrefix,
        dryRun,
        agent.transform,
      );
      console.log(`    ${green}✓${reset} Installed prompts/commands`);
    }

    // sheaf/*
    const sheafDest = path.join(targetDir, 'sheaf');
    if (!dryRun) {
      fs.mkdirSync(sheafDest, { recursive: true });
    } else {
      console.log(`    ${dim}[dry-run] mkdir -p ${sheafDest}${reset}`);
    }

    const srcDirs = ['templates', 'workflows', 'references', 'skills', 'rules'];
    for (const dir of srcDirs) {
      const dirSrc = path.join(srcRoot, 'src', dir);
      const dirDest = path.join(sheafDest, dir);
      if (fs.existsSync(dirSrc)) {
        copyWithPathReplacement(
          dirSrc,
          dirDest,
          pathPrefix,
          dryRun,
          agent.transform,
        );
      }
    }
    console.log(`    ${green}✓${reset} Installed sheaf artifacts\n`);
  }

  console.log(`  ${green}${dryRun ? 'Dry-run complete!' : 'Done!'}${reset}\n`);
}

const options = parseArgs(rawArgs);

if (hasHelp) {
  console.log(banner);
  console.log(`  ${yellow}Usage:${reset} npx viespejo/sheaf [options]

  ${yellow}Options:${reset}
    ${cyan}-s, --scope <local|global>${reset}   Path strategy (default: local)
    ${cyan}-t, --install-dir <path>${reset}     Base installation directory
    ${cyan}--codecompanion${reset}              ${AGENTS.codecompanion.description}
    ${cyan}--claude${reset}                     ${AGENTS.claude.description}
    ${cyan}-d, --dry-run${reset}              Show what would be installed
    ${cyan}-h, --help${reset}                 Show this help message

  ${yellow}Note:${reset}
    If no agents are specified, the installer runs in interactive mode.
`);
  process.exit(0);
}

const config = await resolveConfig(options);

if (hasDryRun) {
  console.log(banner);
  console.log(`  ${yellow}DRY RUN MODE - No files will be written${reset}\n`);
}

install(config, hasDryRun);
process.exit(0);
