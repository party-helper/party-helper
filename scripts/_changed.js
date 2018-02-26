/**
 * 分支变更文件列表
 */
const execSync = require('./_exec');

exports.diff = (...args) =>
  new Set(
    execSync('git', [
      'diff',
      '-z',
      '--cached',
      '--name-only',
      '--diff-filter=ACMRTUB',
      ...args,
    ]).match(/[^\0]+/g),
  );

exports.diffDevelop = () =>
  exports.diff(execSync('git', ['merge-base', 'HEAD', 'develop']).trim());
