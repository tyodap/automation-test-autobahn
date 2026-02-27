import { usersProd, usersTest } from "../fixtures/constants/user";
import { pages } from "../fixtures/constants/pages";
import { tables } from "../fixtures/constants/table";
import table from "../utils/components/table";
import asset from "../utils/pages/asset";
import assetDetail from "../utils/pages/asset-detail";

describe("Asset assignee integration check", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Integration Checker Prod"]
      : usersTest["Integration Checker Test"];

  it("Fetch asset assignee on asset page", () => {
    let assetOverviewAssignee;

    cy.openPageUsingSession(orgAdmin, pages.Assets);
    table.isLoaded(tables["Assets"]);

    assetOverviewAssignee = table
      .getListOfColumnValues(tables["Assets"], "Assignee")
      .then((text) => {
        assetOverviewAssignee = text as string[];
        Cypress.env("assetOverviewAssignee", assetOverviewAssignee);
      });
  });

  it("Fetch asset assignee on asset detail page", () => {
    let assetDetailAssignee;

    cy.openPageUsingSession(orgAdmin, pages.Assets);
    asset.firstAsset.click();

    assetDetail.assetDetailOverview.should("be.visible");

    assetDetail.assetDetailAssignee.then((text) => {
      assetDetailAssignee = text as string;
      Cypress.env("assetDetailAssignee", assetDetailAssignee);
    });
  });

  it("Compare asset assignee from all pages", () => {
    const assetOverviewAssignee = Cypress.env("assetOverviewAssignee");
    const assetDetailAssignee = Cypress.env("assetDetailAssignee");
    const slicedAssetDetailAssignee = assetDetailAssignee.slice(2);

    console.log("Asset overview assignee = " + assetOverviewAssignee[0]);
    console.log("Asset detail assignee = " + slicedAssetDetailAssignee);

    expect(assetOverviewAssignee[0]).to.equal(slicedAssetDetailAssignee);
  });
});
