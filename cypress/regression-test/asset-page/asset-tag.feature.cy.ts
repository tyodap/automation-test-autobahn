import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Add and remove asset tags from asset overview", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Prod Asset Overview Update"]
      : assetTest["Test Asset Overview Update"];

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Assets);
  });

  it("Should be able to add asset tags from asset overview", () => {
    /**
     * Test case
     * 1. Open asset overview page
     * 2. Filter the asset
     * 2. Add the tags from asset overview
     * 3. Verify on asset overview page
     */
    assetInventoryService.removeTagsAssetOverview(
      orgOwner,
      testAsset.assetId,
      testAsset.tag[0]
    );

    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "IPs", testAsset.ipAddress);

    //Add tags
    asset.addTag(testAsset.tag[0]);
    cy.reload();
    table.isLoaded(tables.Assets),
      asset.checkTagPresence(tables.Assets, "Tag", testAsset.tag[0]);
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Tag", testAsset.tag[0]);
  });

  it("Should be able to remove asset tags from asset overview", () => {
    /**
     * Test case
     * 1. Open asset overview page
     * 2. Filter the asset
     * 2. remove the tags from asset overview
     * 3. Verify on asset overview page
     */
    assetInventoryService.addTagsAssetOverview(
      orgOwner,
      testAsset.assetId,
      testAsset.tag[0]
    );

    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "IPs", testAsset.ipAddress);

    //Remove tags
    asset.removeTag(testAsset.tag[0]);
    cy.reload();
    table.isLoaded(tables.Assets),
      asset.checkTagPresence(tables.Assets, "Tag", "None");
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Tag", "None");
  });
});
