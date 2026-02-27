import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import assetDetails from "../../utils/pages/asset-detail";
import { assetProd, assetTest } from "../../fixtures/constants/asset";

describe("Asset detail page regression test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Asset Details Prod Env"]
      : assetTest["Asset Details Test Env"];

  const defaultPageValue = "10";

  beforeEach(() => {
    cy.loginUsingSession(orgAdmin);
    cy.visit(`${pages["Asset Details"].url}/${testAsset.assetId}`);
    cy.url().should("include", testAsset.assetId, { timeout: 30000 });
  });

  it("Should open 'Asset Details' page", () => {
    /**
     * Test case
     * 1. Verify that asset detail page is visible
     * 2. Verify that edit button is visible
     * 3. Verify that port overview card is visible
     * 4. Verify that port detail table is visible
     * 5. Verify that issue details table is visible
     */
    assetDetails.assetDetailOverview.should("be.visible");
    assetDetails.editButton.should("be.visible");
    assetDetails.portOverview.should("be.visible");
    assetDetails.portDetails.should("be.visible");
    assetDetails.issueDetails.should("be.visible");
  });

  it("Should be able to filter all column on 'Port details' table", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Service
    table.runFilterSearch(
      tables["Asset Details - Port Details"],
      "Service",
      testAsset.serviceName
    );

    //Filter by Banner
    table.runFilterSearch(
      tables["Asset Details - Port Details"],
      "Banner",
      testAsset.bannerName
    );

    //Filter by Port
    table.runFilterSearch(
      tables["Asset Details - Port Details"],
      "Port",
      testAsset.portNumber
    );

    //Filter by Protocol
    table.runFilterSearch(
      tables["Asset Details - Port Details"],
      "Protocol",
      testAsset.protocolName
    );

    //Filter by Port status
    table.runFilterCheckbox(
      tables["Asset Details - Port Details"],
      "Port status",
      testAsset.openPortStatus
    );

    //Filter by Max severity
    table.runFilterCheckbox(
      tables["Asset Details - Port Details"],
      "Max severity",
      testAsset.maxSeverityValue,
      testAsset.maxSeverity
    );
  });

  it("Should be able to sort all column on 'Port details' table", () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     */
    //Sort by Service
    table.runSort(
      tables["Asset Details - Port Details"],
      "Service",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Port Details"],
      "Service",
      "descending",
      defaultPageValue
    );

    //Sort by Banner
    table.runSort(
      tables["Asset Details - Port Details"],
      "Banner",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Port Details"],
      "Banner",
      "descending",
      defaultPageValue
    );

    //Sort by Port
    table.runNumberSort(
      tables["Asset Details - Port Details"],
      "Port",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["Asset Details - Port Details"],
      "Port",
      "descending",
      defaultPageValue
    );

    //Sort by Protocol
    table.runSort(
      tables["Asset Details - Port Details"],
      "Protocol",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Port Details"],
      "Protocol",
      "descending",
      defaultPageValue
    );

    //Sort by Port Status
    table.runSort(
      tables["Asset Details - Port Details"],
      "Port status",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Port Details"],
      "Port status",
      "descending",
      defaultPageValue
    );

    //Sort by Max severity
    table.runSort(
      tables["Asset Details - Port Details"],
      "Max severity",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Port Details"],
      "Max severity",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to filter all column on 'Issue details' table", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Issue
    table.runFilterSearch(
      tables["Asset Details - Issue Details"],
      "Issue",
      testAsset.issueName
    );

    //Filter by Port
    table.runFilterSearch(
      tables["Asset Details - Issue Details"],
      "Port",
      testAsset.portNumber
    );

    //Filter by Protocol
    table.runFilterSearch(
      tables["Asset Details - Issue Details"],
      "Protocol",
      testAsset.protocolName
    );

    //Filter by Latest Scanned
    table.runFilterDate(
      tables["Asset Details - Issue Details"],
      "Latest Scanned",
      testAsset.lastScannedValue,
      testAsset.lastScanned
    );

    //Filter by Severity
    table.runFilterCheckbox(
      tables["Asset Details - Issue Details"],
      "Severity",
      ["low"],
      ["Low"]
    );

    //Filter by CVE
    table.runFilterSearch(
      tables["Asset Details - Issue Details"],
      "CVE",
      testAsset.cve
    );
  });

  it("Should be able to sort all column on 'Issue details' table", () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     */
    //Sort by Issue
    table.runSort(
      tables["Asset Details - Issue Details"],
      "Issue",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Issue Details"],
      "Issue",
      "descending",
      defaultPageValue
    );

    //Sort by Port
    table.runNumberSort(
      tables["Asset Details - Issue Details"],
      "Port",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["Asset Details - Issue Details"],
      "Port",
      "descending",
      defaultPageValue
    );

    //Sort by Protocol
    table.runSort(
      tables["Asset Details - Issue Details"],
      "Protocol",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Issue Details"],
      "Protocol",
      "descending",
      defaultPageValue
    );

    //Sort by Latest Scanned
    table.runDateSort(
      tables["Asset Details - Issue Details"],
      "Latest Scanned",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["Asset Details - Issue Details"],
      "Latest Scanned",
      "descending",
      defaultPageValue
    );

    //Sort by Severity
    table.runCustomSort(
      tables["Asset Details - Issue Details"],
      "Severity",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["Asset Details - Issue Details"],
      "Severity",
      "descending",
      defaultPageValue
    );

    //Sort by CVE
    table.runSort(
      tables["Asset Details - Issue Details"],
      "CVE",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset Details - Issue Details"],
      "CVE",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on 'Issue details' table", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    table.runChangePagination(
      tables["Asset Details - Issue Details"],
      "Issue",
      defaultPageValue
    );
  });
});
