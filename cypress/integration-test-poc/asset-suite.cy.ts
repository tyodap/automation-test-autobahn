import { usersProd, usersTest } from "../fixtures/constants/user";
import { pages } from "../fixtures/constants/pages";
import { tables } from "../fixtures/constants/table";
import table from "../utils/components/table";
import asset from "../utils/pages/asset";
import modal from "../utils/components/modal";
import assetDetail from "../utils/pages/asset-detail";

describe("Asset suite", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Integration Checker Prod"]
      : usersTest["Integration Checker Test"];

  const originName = "MS Defender for Endpoint";
  const assetNetwork = "Default Internal";
  const originValue = "ms-defender";
  const tag = "integration-test";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Assets);
  });

  it("Verify that data displayed on asset overview is correct (including [Integration] logo)", () => {
    table
      .getListOfColumnValues(tables["Assets"], "Network")
      .then((fetchedNetwork) => {
        expect(fetchedNetwork[0]).to.be.equal(assetNetwork);
      });
    table.verifyOrigin(tables["Assets"], originName);
  });

  it("Verify that data displayed on asset detail is correct (including [Integration] logo)", () => {
    asset.firstAsset.click();
    assetDetail.networkOverview.should("have.text", assetNetwork);
  });

  it("Verify that user can filter [Integration] asset on asset overview", () => {
    table.filterCheckbox(tables["Assets"], "Source", [originValue]);
  });

  it("Verify that user can edit [Integration] asset assignee on asset overview", () => {
    asset.addOverviewAssignee(orgAdmin);
    modal.confirmAssetAssignee();

    asset.removeOverviewAssignee(orgAdmin);
    modal.confirmAssetAssignee();
  });

  it("Verify that user can edit [Integration] asset tag on asset overview", () => {
    asset.addTag(tag);

    asset.removeTag(tag);
  });
});
