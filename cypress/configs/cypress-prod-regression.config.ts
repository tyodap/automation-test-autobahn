import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "3qsg54",
  retries: {
    // retry for headless (npx cypress run)
    runMode: 1,
    // retry for interactive mode (npx cypress open)
    openMode: 0,
  },
  env: {
    experimentalSessionAndOrigin: true,
    environment: "PROD",
    grepFilterSpecs: true,
    loginUrl: "https://identity.autobahn-security.com",
  },
  e2e: {
    baseUrl: "https://app.autobahn-security.com",
    specPattern: ["cypress/regression-test/**/*.cy.ts"],
  },
});
