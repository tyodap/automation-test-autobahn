import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import assetDetail from "../../utils/pages/asset-detail";

describe("Smoke test asset detail", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Asset Details Prod Env"]
      : assetTest["Asset Details Test Env"];

  it("Should be able to smoke test asset details", () => {
    /**
     * 1. Verify asset detail overview is visible
     * 2. Verify edit button asset detail is visible
     * 3. Verify port count is visible
     * 4. Verify table port details is loaded
     * 5. Verify table issue details is loaded
     */
    cy.login(orgOwner);
    cy.visit(`${pages["Asset Details"].url}/${testAsset.assetId}`);
    assetDetail.verifyLink(testAsset);

    assetDetail.assetDetailOverview.should("be.visible").within(() => {
      assetDetail.assigneeName.should("be.visible");
    });
    assetDetail.editButton.should("be.visible");
    assetDetail.portOverview.should("be.visible").within(() => {
      assetDetail.portCount.should("be.visible");
    });
    table.isLoaded(tables["Asset Details - Port Details"]);
    table.isLoaded(tables["Asset Details - Issue Details"]);
  });
});
