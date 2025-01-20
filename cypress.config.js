const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1337',
    specPattern: '**/*.cy.{js,ts,jsx,tsx}',
    video: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here.
      // eslint-disable-next-line global-require
      require('cypress-terminal-report/src/installLogsPrinter')(on);
    },
  },
});
