import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetInventoryService from "../../utils/services/asset-inventory-service";

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
  assetInventoryService.updateAssetCriticality(orgOwner, testAsset.assetId, 0);
});

after(() => {
  assetInventoryService.updateAssetCriticality(orgOwner, testAsset.assetId, 0);
});

beforeEach(() => {
  cy.openPageUsingSession(orgOwner, pages.Assets);
});

it("Should be able to add criticality", () => {
  /**
   * 1. Filter the asset
   * 2. Add the criticality from asset overview
   * 3. Verify on asset overview page
   */
  table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
  table.isOnlyValueInColumn(tables.Assets, "IPs", testAsset.ipAddress);

  asset.addCriticality();
  cy.reload();
  table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
  asset.criticalityLevelThree.should("be.visible");
});

it("Should be able to remove criticality", () => {
  /**
   * 1. Filter the asset
   * 2. Remove the criticality from asset overview
   * 3. Verify on asset overview page
   */
  table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
  table.isOnlyValueInColumn(tables.Assets, "IPs", testAsset.ipAddress);

  asset.removeCriticality();
  cy.reload();
  table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
  asset.criticialityLevelZero.should("be.visible");
});
