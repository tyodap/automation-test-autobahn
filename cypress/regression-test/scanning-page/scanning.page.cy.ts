import { usersProd } from "../../fixtures/constants/user";
import { usersTest } from "../../fixtures/constants/user";
import { scansProd } from "../../fixtures/constants/scan";
import { scansTest } from "../../fixtures/constants/scan";
import { tables } from "../../fixtures/constants/table";
import table from "../../utils/components/table";
import { pages } from "../../fixtures/constants/pages";
import scanning from "../../utils/pages/scanning";

describe("Scanning page regression test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Initial Scan Prod"]
      : scansTest["Initial Scan Test"];

  const testScheduledScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Scheduled Scan Prod"]
      : scansTest["Scheduled Scan Test"];

  const defaultPageValue = "20";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
  });

  it("Should open Scanning page", () => {
    /**
     * Test case
     * 1. Verify that Scanning page title is visible
     * 2. Verify that create  scan button is visible
     * 3. Verify that import file button is visible
     * 4. Verify that integrate button is visible
     * 5. Verify that action button contains edit scan name, rescan and download button
     */
    scanning.scanningPage.should("be.visible");
    scanning.createScanButton.should("be.visible");
    scanning.importFileButton.should("be.visible");
    scanning.integrateButton.should("be.visible");
    scanning.verifyActionButton(tables["All Scans"], "Scan", testScan.scanName);
  });

  it('Should be able to filter all column on "Scheduled scans" table', () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Scan
    table.runFilterSearch(
      tables["Scheduled scans"],
      "Scan",
      testScheduledScan.scanName
    );

    //Filter by Interval
    table.runFilterCheckbox(
      tables["Scheduled scans"],
      "Interval",
      testScheduledScan["interval"]
    );

    //Filter by Interval start
    table.runFilterDate(
      tables["Scheduled scans"],
      "Interval start",
      testScheduledScan.intervalStart
    );

    //Filter by Interval end
    table.runFilterDate(
      tables["Scheduled scans"],
      "Interval end",
      testScheduledScan.intervalEnd
    );

    //Filter by Next scan
    table.runFilterDate(
      tables["Scheduled scans"],
      "Next scan",
      testScheduledScan.nextScan
    );

    //Filter by Assignee
    table.filterInputCheckbox(
      tables["Scheduled scans"],
      "Assignee",
      null,
      null,
      testScheduledScan.assignee[0]
    );
    table.isColumnValueMatch(tables["Scheduled scans"], "Assignee", [
      testScheduledScan.assignee[0].name,
    ]);
    table.resetFilter(tables["Scheduled scans"], "Assignee");
    table.getAllTableRows(tables["Scheduled scans"]).should("be.visible");

    //Filter by Origin
    table.runFilterCheckbox(
      tables["Scheduled scans"],
      "Origin",
      testScheduledScan["originValue"],
      null,
      "Autobahn (external) Powered by Qualys"
    );
  });

  it('Should be able to sort all column on "Scheduled scans" table', () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     *
     * Origin column is not verifiable using runSort method
     */
    //Sort Scan column
    table.runSort(
      tables["Scheduled scans"],
      "Scan",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scheduled scans"],
      "Scan",
      "descending",
      defaultPageValue
    );

    //Sort Interval column
    table.runCustomSort(
      tables["Scheduled scans"],
      "Interval",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["Scheduled scans"],
      "Interval",
      "descending",
      defaultPageValue
    );

    //Sort Interval start
    table.runDateSort(
      tables["Scheduled scans"],
      "Interval start",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["Scheduled scans"],
      "Interval start",
      "descending",
      defaultPageValue
    );

    //Sort Interval end
    table.runDateSort(
      tables["Scheduled scans"],
      "Interval end",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["Scheduled scans"],
      "Interval end",
      "descending",
      defaultPageValue
    );

    //Sort Next scan
    table.runDateSort(
      tables["Scheduled scans"],
      "Next scan",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["Scheduled scans"],
      "Next scan",
      "descending",
      defaultPageValue
    );

    //Sort Assignee
    table.runSort(
      tables["Scheduled scans"],
      "Assignee",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scheduled scans"],
      "Assignee",
      "descending",
      defaultPageValue
    );
  });

  it('Should be able to filter all column on "All scans" table', () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Scan
    table.runFilterSearch(tables["All Scans"], "Scan", testScan.scanName);

    //Filter by Revision
    table.runFilterSearch(tables["All Scans"], "Revision", testScan.revision);

    //Filter by Started on
    table.runFilterDate(
      tables["All Scans"],
      "Started on",
      testScan.startedOnValue,
      testScan.startedOn
    );

    //Filter by Status
    table.runFilterCheckbox(
      tables["All Scans"],
      "Status",
      testScan["finishedStatusValue"],
      testScan["finishedStatus"]
    );

    //Filter by Assignee
    table.filterInputCheckbox(
      tables["All Scans"],
      "Assignee",
      null,
      null,
      testScan.assignee[0]
    );
    table.isColumnValueMatch(tables["All Scans"], "Assignee", [
      testScan.assignee[0].name,
    ]);
    table.resetFilter(tables["All Scans"], "Assignee");
    table.getAllTableRows(tables["All Scans"]).should("be.visible");

    //Filter by Assets
    table.runFilterSearch(tables["All Scans"], "Assets", testScan.Assets);

    //Filter by Critical
    table.runFilterSearch(
      tables["All Scans"],
      "Critical",
      testScan.criticalSeverity
    );

    //Filter by High
    table.runFilterSearch(tables["All Scans"], "High", testScan.highSeverity);

    //Filter by Medium
    table.runFilterSearch(
      tables["All Scans"],
      "Medium",
      testScan.mediumSeverity
    );

    //Filter by Origin
    table.runFilterCheckbox(
      tables["All Scans"],
      "Origin",
      testScan["originValue"],
      null,
      "Autobahn (external) Powered by Qualys"
    );
  });

  it('Should be able to sort all column on "All scans" table', () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     *
     * Origin is not verifiable using runSort method
     */
    //Sort Scan column
    table.runSort(tables["All Scans"], "Scan", "ascending", defaultPageValue);
    table.runSort(tables["All Scans"], "Scan", "descending", defaultPageValue);

    //Sort Revision column
    table.runNumberSort(
      tables["All Scans"],
      "Revision",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["All Scans"],
      "Revision",
      "descending",
      defaultPageValue
    );

    //Sort Started on column
    table.runDateSort(
      tables["All Scans"],
      "Started on",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["All Scans"],
      "Started on",
      "descending",
      defaultPageValue
    );

    //Sort Status column
    table.runCustomSort(
      tables["All Scans"],
      "Status",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["All Scans"],
      "Status",
      "descending",
      defaultPageValue
    );

    //Sort Assignee column
    table.runSort(
      tables["All Scans"],
      "Assignee",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["All Scans"],
      "Assignee",
      "descending",
      defaultPageValue
    );

    //Sort Assets column
    table.runNumberSort(
      tables["All Scans"],
      "Assets",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["All Scans"],
      "Assets",
      "descending",
      defaultPageValue
    );

    //Sort Critical column
    table.runNumberSort(
      tables["All Scans"],
      "Critical",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["All Scans"],
      "Critical",
      "descending",
      defaultPageValue
    );

    //Sort High column
    table.runNumberSort(
      tables["All Scans"],
      "High",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["All Scans"],
      "High",
      "descending",
      defaultPageValue
    );

    //Sort Medium column
    table.runNumberSort(
      tables["All Scans"],
      "Medium",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["All Scans"],
      "Medium",
      "descending",
      defaultPageValue
    );
  });
});
