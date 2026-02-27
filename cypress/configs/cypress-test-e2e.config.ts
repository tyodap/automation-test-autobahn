import { defineConfig } from "cypress";
import { rm } from "fs";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "7zjpzt",
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
    specPattern: ["cypress/e2e/**/*.cy.ts"],
    setupNodeEvents(on, config) {
      on("task", {
        deleteFolder(folderName: string) {
          console.log("Deleting folder %s", folderName);

          return new Promise((resolve, reject) => {
            rm(
              folderName,
              { recursive: true, force: true, maxRetries: 10 },
              (err) => {
                if (err) {
                  console.error(err);
                  return reject(err);
                }
                resolve(null);
              }
            );
          });
        },
      });

      return config;
    },
  },
});
