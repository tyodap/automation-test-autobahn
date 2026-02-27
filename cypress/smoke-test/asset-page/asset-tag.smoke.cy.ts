import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import assetInventoryService from "../../utils/services/asset-inventory-service";

describe("Smoke test asset tag", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Prod Asset Overview Update"]
      : assetTest["Test Asset Overview Update"];

  it("Should be able to add and remove asset tag from asset page", () => {
    /**
     * 1. Verify add asset tag
     * 2. Verfy remove asset tag
     */

    cy.openPageUsingSession(orgOwner, pages.Assets);
    assetInventoryService.removeTagsAssetOverview(
      orgOwner,
      testAsset.assetId,
      testAsset.tag[0]
    );
    table.filterSearch(tables.Assets, "IPs", testAsset.ipAddress);

    //Add tag
    table.singleCheckboxBulkSelect.last().click();
    asset.editTag.click();
    asset.addTagsButton.click();
    asset.selectTagPlaceholder
      .type(testAsset.tag[0], { force: true })
      .type("{enter}", { force: true });
    asset.addTagsButton.click();
    cy.wait(2000);
    asset.applyButton.click();
    modal.confirmUpdateTag();

    cy.reload();
    table.isLoaded(tables.Assets),
      asset.checkTagPresence(tables.Assets, "Tag", testAsset.tag[0]);

    //Remove tag
    assetInventoryService.interceptRetrieveTag("waitTag");
    table.singleCheckboxBulkSelect.last().click();
    asset.editTag.click();
    asset.removeTagsButton.click();
    cy.wait(2000);
    assetInventoryService.verifyRetrieveTag("waitTag");
    asset.selectTagPlaceholder
      .type(testAsset.tag[0], { force: true })
      .type("{enter}", { force: true });
    asset.removeTagsButton.click();
    asset.applyButton.click();
  });
});
