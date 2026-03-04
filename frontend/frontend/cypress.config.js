
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    env: {
      apiUrl: "http://localhost:8081",
    },
    setupNodeEvents(on, config) {
       require("cypress-mochawesome-reporter/plugin")(on);   //
      return config;
    },
  },
reporter: "cypress-mochawesome-reporter",  //
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true
  }


});


