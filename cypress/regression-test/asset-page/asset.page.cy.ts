import table from "../../utils/components/table";
import asset from "../../utils/pages/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { assetProd, assetTest } from "../../fixtures/constants/asset";

describe("Asset page regression test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Asset Prod Env"]
      : assetTest["Asset Test Env"];

  const defaultPageValue = "10";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Assets);
  });

  it("Should open 'Assets' page", () => {
    /**
     * Test case
     * 1. Verify that asset table is visible
     * 2. Verify that upload button is visible
     * 3. Verify that integrate button is visible
     * 4. Verify that discover button is visible
     */
    asset.assetListPage.should("be.visible");
    asset.uploadButton.should("be.visible");
    asset.integrateButton.should("be.visible");
  });

  it("Should be able to filter all column", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Asset
    table.runFilterSearch(tables.Assets, "Asset", testAsset.domainName[0]);

    //Filter by IPs
    table.runFilterSearch(tables.Assets, "IPs", testAsset.ipAddress);

    //Filter by Hostnames
    table.runFilterSearch(tables.Assets, "Hostnames", testAsset.hostnames);

    //Filter by Network
    table.runFilterCheckbox(
      tables.Assets,
      "Network",
      [testAsset.networkValue],
      [testAsset.networkName]
    );

    //Filter by Source
    table.runFilterCheckbox(
      tables.Assets,
      "Source",
      testAsset["originValue"],
      null,
      "Autobahn"
    );

    //Filter by Last scanned
    table.runFilterDate(
      tables.Assets,
      "Last scanned",
      testAsset.lastScanned,
      testAsset.lastScannedValue
    );

    //Filter by Criticality
    table.filterCheckbox(tables.Assets, "Criticality", [
      testAsset.assetCriticality,
    ]);
    asset.criticalityLevelThree.should("be.visible");
    table.resetFilter(tables.Assets, "Criticality");
    table.getAllTableRows(tables.Assets).should("be.visible");

    //Filter by Assignee
    table.filterInputCheckbox(
      tables.Assets,
      "Assignee",
      null,
      null,
      testAsset.assignee[0]
    );
    table.isColumnValueMatch(tables.Assets, "Assignee", [
      testAsset.assignee[0].initial,
    ]);
    table.resetFilter(tables.Assets, "Assignee");
    table.getAllTableRows(tables.Assets).should("be.visible");

    //Filter by Tag
    table.runFilterInputCheckbox(tables.Assets, "Tag", testAsset.tag[0]);

    //Filter by Max. Severity
    table.runFilterCheckbox(
      tables.Assets,
      "Max. Severity",
      testAsset.maxSeverityValue,
      testAsset.maxSeverity
    );
  });

  it("Should be able to sort all column", () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     *
     * Source, Hostnames and Criticality column is not verifiable using runSort method
     */
    //Sort by Asset
    table.runSort(tables.Assets, "Asset", "ascending", defaultPageValue);
    table.runSort(tables.Assets, "Asset", "descending", defaultPageValue);

    //Sort by IPs
    table.runSort(tables.Assets, "IPs", "ascending", defaultPageValue);
    table.runSort(tables.Assets, "IPs", "descending", defaultPageValue);

    //Sort by Network
    table.runSort(tables.Assets, "Network", "ascending", defaultPageValue);
    table.runSort(tables.Assets, "Network", "descending", defaultPageValue);

    //Sort by Last scanned
    table.runDateSort(
      tables.Assets,
      "Last scanned",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables.Assets,
      "Last scanned",
      "descending",
      defaultPageValue
    );

    //Sort by Assignee
    table.runSort(tables.Assets, "Assignee", "ascending", defaultPageValue);
    table.runSort(tables.Assets, "Assignee", "descending", defaultPageValue);

    //Sort by Tag
    table.runSort(tables.Assets, "Tag", "ascending", defaultPageValue);
    table.runSort(tables.Assets, "Tag", "descending", defaultPageValue);

    //Sort by Max. Severity
    table.runCustomSort(
      tables.Assets,
      "Max. Severity",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables.Assets,
      "Max. Severity",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    table.runChangePagination(tables.Assets, "Asset", defaultPageValue);
  });
});
