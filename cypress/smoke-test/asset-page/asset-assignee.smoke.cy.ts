import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Smoke test asset page assignee", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Prod Asset Overview Update"]
      : assetTest["Test Asset Overview Update"];

  it("Should be able to add and remove asset assignee from asset page", () => {
    /**
     * 1. Verify add asset assignee
     * 2. Verify remove asset assignee
     */
    cy.openPageUsingSession(orgAdmin, pages.Assets);
    assetInventoryService.removeAssetAssigneeAssetOverview(
      orgAdmin,
      testAsset.assetId,
      orgAdmin.uid
    );

    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);

    table.singleCheckboxBulkSelect.last().click();
    asset.editAssignee.click();
    asset.addAssignee.click();
    asset.inputAssignee.click();
    asset.assigneeDropdown
      .should("be.visible")
      .within(() => asset.getAssigneeSelection(orgAdmin).click());
    asset.drawerTitle.click();
    asset.applyButton.click();
    modal.confirmAssetAssignee();

    cy.reload();
    table.isLoaded(tables.Assets),
      asset.checkAssigneePresence(tables.Assets, "Assignee", orgAdmin.initial);

    //remove assignee
    table.singleCheckboxBulkSelect.last().click();
    asset.editAssignee.click();
    asset.removeAssignee.click();
    asset.inputAssignee.click();
    asset.assigneeDropdown
      .should("be.visible")
      .within(() => asset.getAssigneeSelection(orgAdmin).click());
    asset.drawerTitle.click();
    asset.applyButton.click();
  });
});
