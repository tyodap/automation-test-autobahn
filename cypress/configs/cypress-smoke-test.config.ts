import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "zk4jt7",
  env: {
    experimentalSessionAndOrigin: true,
    environment: "TEST",
    loginUrl: "auth.test-hetzner.atbhn.io",
  },
  e2e: {
    baseUrl: "https://test-hetzner.atbhn.io",
    specPattern: ["cypress/smoke-test/**/*.cy.ts"],
  },
});
