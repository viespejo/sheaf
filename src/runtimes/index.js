import { toGeminiToml } from './gemini.js';

export const RUNTIMES = {
  codecompanion: {
    name: 'CodeCompanion',
    dirName: '.codecompanion',
    promptsDir: 'prompts/sheaf',
    description: 'Install Sheaf artifacts for CodeCompanion (Neovim)',
    promptOutputExt: '.md',
    transformPrompt({ composedMarkdown }) {
      return composedMarkdown;
    },
  },
  claude: {
    name: 'Claude Code',
    dirName: '.claude',
    promptsDir: 'commands/sheaf',
    description: 'Install Sheaf artifacts for Claude Code',
    promptOutputExt: '.md',
    transformPrompt({ composedMarkdown }) {
      return composedMarkdown;
    },
  },
  gemini: {
    name: 'Gemini CLI',
    dirName: '.gemini',
    promptsDir: 'commands/sheaf',
    description: 'Install Sheaf artifacts for Gemini CLI',
    promptOutputExt: '.toml',
    transformPrompt({ composedMarkdown, promptName }) {
      return toGeminiToml({ composedMarkdown, promptName });
    },
  },
};
