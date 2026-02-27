import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "jb1x4e",
  env: {
    experimentalSessionAndOrigin: true,
    environment: "PROD",
    loginUrl: "https://identity.autobahn-security.com",
  },
  e2e: {
    baseUrl: "https://app.autobahn-security.com",
    specPattern: ["cypress/integration-test-poc/**/*.cy.ts"],
  },
});
