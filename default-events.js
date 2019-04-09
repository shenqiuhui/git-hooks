exports.isGitCheckTask = ({ exec, log, chalk, forbiddenCommit }) => {
  try {
    exec('git status');
  } catch (e) {
    log(chalk.red('错误：当前不是一个git项目目录***************************'));
    forbiddenCommit();
  }
};

exports.emailCheckTask = ({ exec, log, chalk, forbiddenCommit, gitConfigEnvs, rules }) => {
  const checkEmailEnvs = (i) => {
    try {
      const userEmail = exec(`git config --${gitConfigEnvs[i]} user.email`).toString();
      const isValidate = rules.emailCheck.test(userEmail);

      if (!isValidate) {
        log(chalk.red('错误：请使用正确的邮箱提交代码***************************'));
        log(chalk.yellow(`你当前的邮箱是：${userEmail}`));
        forbiddenCommit();
      } else {
        log(chalk.green('邮箱校验通过***************************'));
      }
    } catch (e) {
      if (i === gitConfigEnvs.length) {
        log(chalk.red('错误：请设置git的提交邮箱***************************'));
        forbiddenCommit();
      } else {
        checkEmailEnvs(i + 1);
      }
    }
  };
  checkEmailEnvs(0);
};

exports.conflictCheckTask = ({ exec, log, chalk, forbiddenCommit, rules }) => {
  try {
    const conflicts = exec(`git grep -n -P -E "${rules.conflictCheck}"`, { encoding: 'utf-8' });
    if (conflicts) {
      log(chalk.red('错误：发现冲突，请解决后再提交***************************'));
      log(chalk.red('错误代码：'));
      log(chalk.red(conflicts.trim()));
      forbiddenCommit();
    }
  } catch (e) {
    log(chalk.green('未发现冲突***************************'));
  }
};

exports.eslintCheckTask = ({ exec, log, chalk, forbiddenCommit }) => {
  try {
    exec('lint-staged');
    log(chalk.green('Eslint 校验通过***************************'));
  } catch (e) {
    log(chalk.red('错误：Eslint 校验不通过***************************'));
    forbiddenCommit();
  }
};
