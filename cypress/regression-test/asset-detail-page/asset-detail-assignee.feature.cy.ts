import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetDetails from "../../utils/pages/asset-detail";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Add and remove asset assignee from asset details", () => {
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

  after(() => {
    assetInventoryService.removeAssetAssigneeAssetDetail(orgOwner, testAsset, [
      orgOwner.uid,
    ]);
  });

  it("Should be able to assign assignee from asset details", () => {
    /**
     * Test case
     * 1. Open asset details page
     * 2. Add assignee from asset details
     * 3. Verify on asset overview page
     */
    assetInventoryService.removeAssetAssigneeAssetDetail(orgOwner, testAsset, [
      orgOwner.uid,
    ]);
    cy.wait(5000);

    assetDetails.assetDetailOverview.should("be.visible");
    assetDetails.editButton.should("be.visible");
    assetDetails.addAssignee(orgOwner, testAsset.assetId);
    modal.confirmAssetAssignee();
    assetDetails.backToAssetOverview.click();
    table.isLoaded(tables.Assets),
      asset.checkAssigneePresence(tables.Assets, "Assignee", orgOwner.initial);

    cy.verifyIfOpen(pages.Assets);
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Assignee", orgOwner.initial);
  });

  it("Should be able to unassign assignee from asset details", () => {
    /**
     * Test case
     * 1. Open asset details page
     * 2. Remove assignee from asset details
     * 3. Verify on asset overview page
     */
    assetInventoryService.addAssetAssigneeAssetDetail(orgOwner, testAsset, [
      orgOwner.uid,
    ]);
    cy.wait(5000);

    assetDetails.assetName.should("have.text", testAsset.assetDomain, {
      timeout: 80000,
    });
    assetDetails.removeAssignee(orgOwner, testAsset.assetId);
    modal.confirmAssetAssignee();
    asset.checkAssigneePresence;
    assetDetails.backToAssetOverview.click();
    table.isLoaded(tables.Assets),
      asset.checkAssigneePresence(tables.Assets, "Assignee", "");
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);
    table.isOnlyValueInColumn(tables.Assets, "Assignee", "");
  });
});
