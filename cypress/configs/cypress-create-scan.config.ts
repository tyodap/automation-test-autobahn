import { defineConfig } from "cypress";
import { rm } from "fs";

export default defineConfig({
  defaultCommandTimeout: 50000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: "7gaye7",
  retries: {
    runMode: 1,
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
    specPattern: ["cypress/e2e/create-scan-flow/*.cy.ts"],
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@cypress/grep/src/plugin")(config);
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
