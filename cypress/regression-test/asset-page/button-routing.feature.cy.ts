import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import asset from "../../utils/pages/asset";

describe("Asset page button routing", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Assets);
    cy.verifyIfOpen(pages.Assets);
  });

  it("Should be able to open upload asset page after click upload button", () => {
    /**
     * 1. Click upload button
     * 2. Verify user will be directed to upload asset page
     */
    asset.uploadButton.should("be.visible");
    asset.uploadButton.click();
    cy.verifyIfOpen(pages.UploadAsset);
  });

  it("Should be able to open integration page after click integrate button", () => {
    /**
     * 1. Click integrate button
     * 2. Verify user will be directed to integration page
     */
    asset.integrateButton.should("be.visible");
    asset.integrateButton.click();
    cy.verifyIfOpen(pages.Integrations);
  });
});
