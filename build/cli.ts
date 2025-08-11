import enquirer, { Prompt } from 'enquirer'
import fs from 'fs'
import { execSync, type ExecSyncOptions } from 'child_process'

type MenuOption = {
  name: string;
  message: string;
  command?: string;
  submenu?: MenuOption[];
};

const Select = (enquirer as any).Select as new (...args: any[]) => Prompt

const hasAndroidFolder = fs.existsSync('./android');

const runCommand = (command: string) => {
  console.clear();
  console.log(`\n🔧 Running: ${command}\n`);

  const options: ExecSyncOptions = {
    stdio: 'inherit',
    shell: process.env['SHELL'] || '/bin/sh'
  };

  execSync(command, options);
};

// Main menu options
const menu: MenuOption[] = [
  ...(hasAndroidFolder ? [] : [{
    name: 'setup',
    message: 'Setup Project (Android + Neu)',
    command: 'npm run setup'
  }]),
  {
    name: 'dev',
    message: 'Dev & Test Tools',
    submenu: [
      { name: 'dev', message: 'Run Dev Server', command: 'npm run dev' },
      { name: 'dev:desktop', message: 'Run Desktop Dev', command: 'npm run dev:desktop' },
      { name: 'test', message: 'Run Tests', command: 'npm run test' },
      { name: 'lint', message: 'Lint Code', command: 'npm run lint' }
    ]
  },
  {
    name: 'build',
    message: 'Build Options',
    submenu: [
      { name: 'build:web', message: 'Build for Web', command: 'npm run build:web' },
      { name: 'build:standalone', message: 'Build Standalone', command: 'npm run build:standalone' },
      { name: 'build:desktop', message: 'Build for Desktop', command: 'npm run build:desktop' },
      { name: 'build:android', message: 'Build for Android', command: 'npm run build:android' },
      { name: 'build:ios', message: 'Build for iOS', command: 'npm run build:ios' },
      { name: 'build:mobile', message: 'Build All Mobile (Android & iOS)', command: 'npm run build:mobile' }
    ]
  }
];

async function showMenu(options: MenuOption[]) {
  const prompt = new Select({
    name: 'main',
    message: '📦 Select an option:',
    choices: options.map(opt => opt.message)
  });

  const answer = await prompt.run();

  const selected = options.find(opt => opt.message === answer);
  if (!selected) return;

  if (selected.submenu) {
    await showMenu(selected.submenu);
  } else if (selected.command) {
    runCommand(selected.command);
  }
}

(async () => {
  try {
    await showMenu(menu);
  } catch (err) {
    console.error('⚠️ Menu cancelled or error occurred:', err);
  }
})();
