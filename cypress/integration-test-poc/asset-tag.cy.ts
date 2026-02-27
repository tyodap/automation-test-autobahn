import { usersProd, usersTest } from "../fixtures/constants/user";
import { pages } from "../fixtures/constants/pages";
import { tables } from "../fixtures/constants/table";
import table from "../utils/components/table";
import asset from "../utils/pages/asset";
import assetDetail from "../utils/pages/asset-detail";

describe("Asset tag integration check", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Integration Checker Prod"]
      : usersTest["Integration Checker Test"];

  it("Fetch asset tag on asset page", () => {
    let assetOverviewTag;

    cy.openPageUsingSession(orgAdmin, pages.Assets);
    table.isLoaded(tables["Assets"]);

    assetOverviewTag = table
      .getListOfColumnValues(tables["Assets"], "Tag")
      .then((text) => {
        assetOverviewTag = text as string[];
        Cypress.env("assetOverviewTag", assetOverviewTag);
      });
  });

  it("Fetch asset tag on asset detail page", () => {
    let assetDetailTag;

    cy.openPageUsingSession(orgAdmin, pages.Assets);
    asset.firstAsset.click();

    assetDetail.assetDetailOverview.should("be.visible");

    assetDetail.assetDetailTag.then((text) => {
      assetDetailTag = text as string;
      Cypress.env("assetDetailTag", assetDetailTag);
    });
  });

  it("Compare asset tag from all pages", () => {
    const assetOverviewTag = Cypress.env("assetOverviewTag");
    const assetDetailTag = Cypress.env("assetDetailTag");

    console.log("Asset overview assignee = " + assetOverviewTag[0]);
    console.log("Asset detail assignee = " + assetDetailTag);

    expect(assetOverviewTag[0]).to.equal(assetDetailTag);
  });
});
