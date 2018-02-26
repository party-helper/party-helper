/**
 * Based on similar script in React
 * https://github.com/facebook/react/blob/master/scripts/prettier/index.js
 */
/* eslint-disable no-console, import/no-extraneous-dependencies */
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const execSync = require('./_exec');
const changedFiles = require('./_changed').diff();

const mode = process.argv[2] || 'check';
const shouldWrite = mode === 'write' || mode === 'write-changed';
const onlyChanged = mode === 'check-changed' || mode === 'write-changed';

const isWindows = process.platform === 'win32';
const prettier = isWindows ? 'prettier.cmd' : 'prettier';
const prettierCmd = path.resolve(__dirname, '../node_modules/.bin', prettier);

const defaultOptions = {
  'single-quote': 'true',
  'trailing-comma': 'all',
  'jsx-bracket-same-line': 'true',
  parser: 'flow',
};

const config = {
  default: {
    patterns: ['**/*.js'],
    ignore: ['node_modules/**'],
  },
};

Object.keys(config).forEach(key => {
  const { patterns, options, ignore } = config[key];

  const globPattern =
    patterns.length > 1 ? `{${patterns.join(',')}}` : `${patterns.join(',')}`;

  const files = glob
    .sync(globPattern, { ignore })
    .filter(f => !onlyChanged || changedFiles.has(f));

  if (!files.length) return;

  const args = Object.keys(defaultOptions).map(
    k => `--${k}=${(options && options[k]) || defaultOptions[k]}`,
  );
  args.push(`--${shouldWrite ? 'write' : 'l'}`);

  try {
    execSync(prettierCmd, [...args, ...files]);
  } catch (e) {
    if (!shouldWrite) {
      console.log(
        '\n' + // eslint-disable-line prefer-template
          chalk.red(
            `  This project uses prettier to format all JavaScript code.\n`,
          ) +
          chalk.dim(`    Please run `) +
          chalk.reset('yarn prettier') +
          chalk.dim(` and add changes to files listed above to your commit.`) +
          `\n`,
      );
      process.exit(1);
    }
    throw e;
  }
  execSync('git', ['add', ...files]);
});
