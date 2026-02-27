import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "b6xswz",
  retries: {
    // retry for headless (npx cypress run)
    runMode: 1,
    // retry for interactive mode (npx cypress open)
    openMode: 0,
  },
  env: {
    experimentalSessionAndOrigin: true,
    environment: "TEST",
    grepFilterSpecs: true,
    loginUrl: "auth.test-hetzner.atbhn.io",
  },
  e2e: {
    baseUrl: "https://test-hetzner.atbhn.io",
    specPattern: ["cypress/api-test/**/*.cy.ts"],
  },
});
