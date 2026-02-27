import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import scanning from "../../utils/pages/scanning";

describe("Scanning page button routing", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages["Scanning"]);
    cy.verifyIfOpen(pages["Scanning"]);
  });

  it("Should open upload page after clicking upload button", () => {
    /**
     * 1. Click file upload button
     * 2. Verify that user is redirected to upload page
     */
    scanning.importFileButton.should("be.visible").click();
    scanning.importFileDrawerButton.should("be.visible").click();
    cy.verifyIfOpen(pages.ImportFile);
  });

  it("Should open integration page after clicking integrate button", () => {
    /**
     * 1. Click integrate button
     * 2. Verify that user is redirected to integration page
     */
    scanning.integrateButton.should("be.visible");
    scanning.integrateButton.click();
    cy.verifyIfOpen(pages.Integrations);
  });

  it("Should open create scan page after clicking create scan button", () => {
    /**
     * 1. Click create scan button
     * 2. Verify that user is redirected to create scan page
     */
    scanning.createScanButton.should("be.visible");
    scanning.createScanButton.click();
    cy.verifyIfOpen(pages["Create Scan"]);
  });
});
