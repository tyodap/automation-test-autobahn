import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "dncq6f",
  env: {
    experimentalSessionAndOrigin: true,
    environment: "PROD",
    loginUrl: "https://identity.autobahn-security.com",
  },
  e2e: {
    baseUrl: "https://app.autobahn-security.com",
    specPattern: ["cypress/smoke-test/**/*.cy.ts"],
  },
});
