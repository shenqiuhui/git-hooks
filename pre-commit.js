const GitChecker = require('./git-checker');

const commitChecker = new GitChecker('pre-commit', {
  defaultEventNames: ['isGit', 'email', 'conflict', 'eslint'], // default event names
  rules: {
    // your costom rules
  },
  checkEvents: {
    // your custom check events
  }
});

commitChecker.checkStart();
