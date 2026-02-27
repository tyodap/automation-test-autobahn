import { usersProd, usersTest } from "../fixtures/constants/user";
import { pages } from "../fixtures/constants/pages";
import { tables } from "../fixtures/constants/table";
import table from "../utils/components/table";
import assets from "../utils/pages/asset";

describe("Asset integration check", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Integration Checker Prod"]
      : usersTest["Integration Checker Test"];

  it("Fetch asset on scanning page", () => {
    let assetScanning;

    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    table.isLoaded(tables["All Scans"]);

    assetScanning = table
      .getListOfColumnValues(tables["All Scans"], "Assets")
      .then((text) => {
        assetScanning = text as string[];
        Cypress.env("assetScanning", assetScanning);
      });
  });

  it("Fetch asset on asset page", () => {
    let assetOverviewAsset;

    cy.openPageUsingSession(orgAdmin, pages.Assets);

    assets.assetListPage.should("be.visible");
    table.isLoaded(tables["Assets"]);
    table.filterCheckbox(tables["Assets"], "Max. Severity", [
      "4",
      "3",
      "2",
      "1",
    ]);

    assets.assetOverviewAsset.then((text) => {
      assetOverviewAsset = text as string;
      assetOverviewAsset = text.replace(" assets in total", "");
      if (assetOverviewAsset == "0") {
        assetOverviewAsset = "None";
      }
      Cypress.env("assetOverviewAsset", assetOverviewAsset);
    });
  });

  it("Compare asset from all pages", () => {
    const assetScanning = Cypress.env("assetScanning");
    const assetOverviewAsset = Cypress.env("assetOverviewAsset");

    console.log("Asset scan list = " + assetScanning[0]);
    console.log("Asset asset overview = " + assetOverviewAsset);

    expect(assetScanning[0]).to.equal(assetOverviewAsset);
  });
});
