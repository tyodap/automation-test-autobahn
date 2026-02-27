import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import assetDetails from "../../utils/pages/asset-detail";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Smoke test asset detail assignee", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Prod Asset Details Update"]
      : assetTest["Test Asset Details Update"];

  it("Should be able to add and remove assignee from asset detail", () => {
    /**
     * 1. Verify add asset assignee
     * 2. Verify remove asset assignee
     */
    cy.loginUsingSession(orgOwner);
    assetInventoryService.removeAssetAssigneeAssetOverview(
      orgOwner,
      testAsset.assetId,
      orgOwner.uid
    );
    cy.visit(`${pages["Asset Details"].url}/${testAsset.assetId}`);
    cy.url().should("include", testAsset.assetId, { timeout: 30000 });

    //Add assignee
    assetDetails.editButton.should("be.visible");
    assetDetails.editButton.click();
    assetDetails.assigneeColumn.click().type(`${orgOwner.name}{enter}`);
    assetDetails.saveButton.click();
    modal.confirmAssetAssignee();

    cy.reload();
    assetDetails.checkAssigneePresence(orgOwner.name);

    //Remove assignee
    assetDetails.editButton.should("be.visible");
    assetDetails.editButton.click();
    assetDetails.assigneeColumn.click().type(`${orgOwner.name}{enter}`);
    assetDetails.saveButton.click();
    modal.confirmAssetAssignee();
  });
});
