import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetDetails from "../../utils/pages/asset-detail";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Add and remove asset tags from asset details", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Prod Asset Details Update"]
      : assetTest["Test Asset Details Update"];

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
    cy.visit(`${pages["Asset Details"].url}/${testAsset.assetId}`);
    cy.url().should("include", testAsset.assetId, { timeout: 30000 });
  });

  it("Should be able to add asset tags from asset details", () => {
    /**
     * Test case
     * 1. Open directed to asset details
     * 2. Add the tags from asset details
     * 3. Verify on asset overview page
     */
    assetDetails.assetDetailOverview.should("be.visible");
    assetDetails.editButton.should("be.visible");
    assetDetails.addTag(testAsset);
    modal.confirmUpdateTag();
    assetDetails.backToAssetOverview.click();
    cy.verifyIfOpen(pages.Assets);
    table.isLoaded(tables.Assets),
      asset.checkTagPresence(tables.Assets, "Tag", testAsset.tag[0]);
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Tag", testAsset.tag[0]);
  });

  it("Should be able to remove asset tags from asset details", () => {
    /**
     * Test case
     * 1. Open directed to asset details
     * 2. Remove the tags from asset details
     * 3. Verify on asset overview page
     */
    assetInventoryService.addTagAssetDetail(orgOwner, testAsset, testAsset.tag);

    cy.wait(3000);
    cy.url().should("include", testAsset.assetId, { timeout: 30000 });
    assetDetails.assetName.should("have.text", testAsset.assetDomain, {
      timeout: 60000,
    });

    assetDetails.assetDetailOverview.should("be.visible");
    assetDetails.editButton.should("be.visible");
    assetDetails.removeTag(testAsset);
    modal.confirmUpdateTag();
    assetDetails.backToAssetOverview.click();
    cy.verifyIfOpen(pages.Assets);
    table.isLoaded(tables.Assets),
      asset.checkTagPresence(tables.Assets, "Tag", "None");
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Tag", "None");
  });
});
