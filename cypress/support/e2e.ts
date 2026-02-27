import "./commands";

Cypress.on("uncaught:exception", () => {
  return false;
});
// eslint-disable-next-line @typescript-eslint/no-require-imports
const registerCypressGrep = require("@cypress/grep");
registerCypressGrep();
