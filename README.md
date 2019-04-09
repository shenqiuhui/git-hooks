## 简介

该项目提供了 `git` 命令执行时的校验功能，如校验失败，则 `git` 命令不生效。

## package.json 配置

该检测依赖于 `hasky`，需提前在项目中安装：

> npm install hasky --save-dev

`package.json` 配置如下：

```json
"husky": {
  "hooks": {
    "pre-commit": "node githooks/pre-commit.js"
  }
}
```

## 使用方式

在上面 `husky` 的配置中，`husky` 支持的参数为键，`git` 对应的命令检测的文件路径为值，以 `pre-commit.js` 文件为例。

```js
const GitChecker = require('./git-checker');

const commitChecker = new GitChecker('pre-commit', {
  defaultEventNames: ['isGit', 'email', 'conflict', 'eslint'], // default event names
  checkEvents: {
    // your custom check events
  }，
  rules: {
    // your costom rules
  },
});

commitChecker.checkStart();
```

只需创建实例并传递参数，`defaultEventNames` 为支持的默认检测功能的集合

- `isGit`：检测是否为 `git` 管理的项目；
- `email`：检测提交的邮箱是否为 `ele` 或者 `alibaba-inc` 的邮箱；
- `conflict`：检测文件是否有冲突，目的是为了让没有支持 `eslint` 的项目使用；
- `eslint`：用来检测时自动检测代码是否符合 `eslint` 规范。

默认事件的函数名称为 `isGitCheckTask`、`emailCheckTask`、`conflictCheckTask`、`eslintCheckTask`。

`checkEvents` 是自定义检测函数，`GitChecker` 会将自定义的检测函数和 `defaultEventNames` 中配置的默认检测函数进行整合，也可以取同名的自定义检测函数来覆盖默认的检测函数，每一个检测函数的默认参数为当前 `GitChecker` 的实例 `checker`。

`rules` 为自定义检测函数中使用的规则（正则）集合，可以在自定义检测函数中通过 `checker.rules` 获取。

另外 `checker` 中还提供 `log`（打印）、`chalk`（为打印设置颜色）、`exec`（执行命令）和 `forbiddenCommit` （改变是否可以提交的结果）等函数。

在编写自定义检测函数时可以若不通过则调用 `forbiddenCommit()`。

```js
checkEvents: {
  myHook: ({ log, chalk, forbiddenCommit }) => {
    try {
      log(chalk('检测通过'));
    } catch (e) {
      log(chalk('检测不通过'));
      forbiddenCommit();
    }
  }
}
```

具体可参照 `default-events.js` 文件中默认检测函数的写法。
