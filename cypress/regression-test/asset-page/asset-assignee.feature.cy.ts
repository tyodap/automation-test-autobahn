import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Add and remove asset assignee from asset overview", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Prod Asset Overview Update"]
      : assetTest["Test Asset Overview Update"];

  before(() => {
    cy.loginUsingSession(orgOwner);
    assetInventoryService.removeAssetAssigneeAssetOverview(
      orgOwner,
      testAsset.assetId,
      orgOwner.uid
    );
  });

  after(() => {
    assetInventoryService.removeAssetAssigneeAssetOverview(
      orgOwner,
      testAsset.assetId,
      orgOwner.uid
    );
  });

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Assets);
  });

  it("Should be able to add assignee from asset overview", () => {
    /**
     * Test case
     * 1. Open asset overview page
     * 2. Filter the asset
     * 3. Add assignee from asset overview
     * 4. Verify on asset overview page
     */
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "IPs", testAsset.ipAddress);
    asset.addOverviewAssignee(orgOwner);
    modal.confirmAssetAssignee();
    table.isLoaded(tables.Assets);
    table.resetFilter(tables.Assets, "IPs");
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Assignee", orgOwner.initial);
  });

  it("Should be able to remove assignee from asset overview", () => {
    /**
     * Test case
     * 1. Open asset overview page
     * 2. Filter the asset
     * 3. Remove assignee from asset overview
     * 4. Verify on asset overview page
     */
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Assignee", orgOwner.initial);

    asset.removeOverviewAssignee(orgOwner);
    modal.confirmAssetAssignee();
    table.isLoaded(tables.Assets);
    table.resetFilter(tables.Assets, "IPs");
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Assignee", "");
  });
});
