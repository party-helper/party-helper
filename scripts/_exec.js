/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk');
const { execFileSync } = require('child_process');

module.exports = function execSync(command, args, options = {}) {
  const displayArgs =
    args.length > 25 ? `${args.slice(0, 25)}...` : args.join(' ');

  // eslint-disable-next-line no-console
  console.log(chalk.dim(`$ ${command} ${displayArgs}`));
  return execFileSync(command, args, options).toString();
};
