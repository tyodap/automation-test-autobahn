import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import table from "../../utils/components/table";
import scanning from "../../utils/pages/scanning";
import scanReport from "../../utils/pages/scan-report";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { issuesProd, issuesTest } from "../../fixtures/constants/issue";

describe("Scan report page regression test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Initial Scan Prod"]
      : scansTest["Initial Scan Test"];

  const testWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Update JQuery"]
      : workoutsTest["Secure SSH"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Filter Check Scan Report Prod"]
      : assetTest["Filter Check Scan Report Test"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Filter Check Prod"]
      : issuesTest["Filter Check Test"];

  const defaultPageValue = "5";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    table.filterSearch(tables["All Scans"], "Scan", testScan.scanName);
    table.isColumnValueMatch(tables["All Scans"], "Scan", [testScan.scanName]);
    scanning.scanButton.contains(testScan.scanName).click();

    cy.url().should("include", testScan.scanId, { timeout: 30000 });
    scanReport.scanName.should("be.visible", {
      timeout: 80000,
    });
    scanReport.scanName.should("have.text", testScan.scanName, {
      timeout: 80000,
    });
  });

  it("Should open scan report page", () => {
    /**
     * Test case
     * 1. Verify that rescan button is visible
     * 2. Verify that download button is visible
     * 3. Verify that download button dropdown contains scope and xlsx
     * 4. Verify that issues overview card contains 4 severity
     * 5. Verify general details card content
     * 6. Verify that severity distribution chard is visible
     * 7. Verify all tables
     */
    scanReport.rescanButton.should("be.visible");
    scanReport.downloadButton.should("be.visible").click();
    scanReport.downloadScopeButton.should("be.visible");
    scanReport.downloadReportButton.should("be.visible");
    scanReport.issuesOverviewCard
      .should("be.visible")
      .contains("CRITICAL SEVERITY");

    scanReport.issuesOverviewCard
      .should("be.visible")
      .contains("HIGH SEVERITY");

    scanReport.issuesOverviewCard
      .should("be.visible")
      .contains("MEDIUM SEVERITY");

    scanReport.issuesOverviewCard.should("be.visible").contains("LOW SEVERITY");

    scanReport.generalDetailsCard.should("be.visible").contains(orgAdmin.name);
    scanReport.generalDetailsCard.should("be.visible").contains("Completed on");

    scanReport.generalDetailsCard.should("be.visible").contains("Started on");

    scanReport.generalDetailsCard
      .should("be.visible")
      .contains(testScan.revision);

    scanReport.severityDistributionChart.should("be.visible");

    scanReport.workoutTable.should("be.visible");
    table.getAllTableRows(tables["Scan report workouts"]).should("be.visible");

    scanReport.individualIssuesTable.should("be.visible");
    table
      .getAllTableRows(tables["Scan report individual issues"])
      .should("be.visible");

    scanReport.assetsTable.should("be.visible");
    table.getAllTableRows(tables["Scan report assets"]).should("be.visible");

    scanReport.nonAliveHostTable.should("be.visible");

    scanReport.manualTargetsTable.should("be.visible");

    scanReport.portsTable.should("be.visible").contains("TCP Basic");
  });

  it('Should be able to filter all column on "Workouts" table', () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Workout
    table.runFilterSearch(
      tables["Scan report workouts"],
      "Workout",
      testWorkout.name
    );

    //Filter by Assignee
    table.filterCheckbox(tables["Scan report workouts"], "Assignee", [
      testScan.assignee[0].uid,
    ]);
    table.isColumnValueMatch(tables["Scan report workouts"], "Assignee", [
      testScan.assignee[0].name,
    ]);
    table.resetFilter(tables["Scan report workouts"], "Assignee");
    table.getAllTableRows(tables["Scan report workouts"]).should("be.visible");

    //Filter by Effort
    table.runFilterCheckbox(
      tables["Scan report workouts"],
      "Effort",
      ["2"],
      [testWorkout.effort[0]]
    );

    //Filter by Status
    table.runFilterCheckbox(
      tables["Scan report workouts"],
      "Status",
      testWorkout["workoutStatus"]
    );
  });

  it('Should be able to sort all column on "Workouts" table', () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     */
    //Sort by Workout
    table.runSort(
      tables["Scan report workouts"],
      "Workout",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report workouts"],
      "Workout",
      "descending",
      defaultPageValue
    );

    //Sort by Assignee
    table.runSort(
      tables["Scan report workouts"],
      "Assignee",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report workouts"],
      "Assignee",
      "descending",
      defaultPageValue
    );

    //Sort by Effort
    table.runCustomSort(
      tables["Scan report workouts"],
      "Effort",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["Scan report workouts"],
      "Effort",
      "descending",
      defaultPageValue
    );

    //Sort by Status
    table.runSort(
      tables["Scan report workouts"],
      "Status",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report workouts"],
      "Status",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on 'Workouts' table", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    table.runChangePagination(
      tables["Scan report workouts"],
      "Workout",
      defaultPageValue
    );
  });

  it("Should be able to filter all column on 'Issues' table ", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Status
    table.runFilterCheckbox(
      tables["Scan report individual issues"],
      "Status",
      [testIssue.statusValue],
      [testIssue.status]
    );

    //Filter by Asset
    table.runFilterSearch(
      tables["Scan report individual issues"],
      "Asset",
      testIssue.asset
    );

    //Filter by Port
    table.runFilterSearch(
      tables["Scan report individual issues"],
      "Port",
      testIssue.port
    );

    //Filter by Protocol
    table.runFilterSearch(
      tables["Scan report individual issues"],
      "Protocol",
      testIssue.protocol
    );

    //Filter by Service
    table.runFilterSearch(
      tables["Scan report individual issues"],
      "Service",
      testIssue.service
    );

    //Filter by Issue
    table.runFilterSearch(
      tables["Scan report individual issues"],
      "Issue",
      testIssue.issue
    );

    //Filter by Severity
    table.runFilterCheckbox(
      tables["Scan report individual issues"],
      "Severity",
      [testIssue.severityValue],
      [testIssue.severity]
    );

    //Filter by Assignee
    table.filterInputCheckbox(
      tables["Scan report individual issues"],
      "Assignee",
      null,
      null,
      testScan.assignee[0]
    );
    table.isColumnValueMatch(
      tables["Scan report individual issues"],
      "Assignee",
      [testScan.assignee[0].name]
    );
    table.resetFilter(tables["Scan report individual issues"], "Assignee");
    table
      .getAllTableRows(tables["Scan report individual issues"])
      .should("be.visible");

    //Filter by Network
    table.runFilterCheckbox(
      tables["Scan report individual issues"],
      "Network",
      [testIssue.networkValue],
      [testIssue.network]
    );

    //Filter by Tag
    table.runFilterCheckbox(
      tables["Scan report individual issues"],
      "Tag",
      testIssue.tag
    );

    //Filter by Banner
    table.runFilterSearch(
      tables["Scan report individual issues"],
      "Banner",
      testIssue.banner
    );

    //Filter by First detected
    table.runFilterDate(
      tables["Scan report individual issues"],
      "First detected",
      testIssue.firstDetectedValue,
      testIssue.firstDetected
    );
  });

  it('Should be able to sort all column on "Issues" table', () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     *
     * Tag and Script output column is not verifiable using runSort.
     */
    //Sort by Status
    table.runSort(
      tables["Scan report individual issues"],
      "Status",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report individual issues"],
      "Status",
      "descending",
      defaultPageValue
    );

    //Sort by Asset
    table.runSort(
      tables["Scan report individual issues"],
      "Asset",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report individual issues"],
      "Asset",
      "descending",
      defaultPageValue
    );

    //Sort by Port
    table.runNumberSort(
      tables["Scan report individual issues"],
      "Port",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["Scan report individual issues"],
      "Port",
      "descending",
      defaultPageValue
    );

    //Sort by Protocol
    table.runSort(
      tables["Scan report individual issues"],
      "Protocol",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report individual issues"],
      "Protocol",
      "descending",
      defaultPageValue
    );

    //Sort by Service
    table.runSort(
      tables["Scan report individual issues"],
      "Service",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report individual issues"],
      "Service",
      "descending",
      defaultPageValue
    );

    //Sort by Issue
    table.runSort(
      tables["Scan report individual issues"],
      "Issue",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report individual issues"],
      "Issue",
      "descending",
      defaultPageValue
    );

    //Sort by Severity
    table.runCustomSort(
      tables["Scan report individual issues"],
      "Severity",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["Scan report individual issues"],
      "Severity",
      "descending",
      defaultPageValue
    );

    //Sort by Banner
    table.runSort(
      tables["Scan report individual issues"],
      "Banner",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Scan report individual issues"],
      "Banner",
      "descending",
      defaultPageValue
    );

    //Sort by First detected
    table.runDateSort(
      tables["Scan report individual issues"],
      "First detected",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["Scan report individual issues"],
      "First detected",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on 'Issues' table", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    table.runChangePagination(
      tables["Scan report individual issues"],
      "Banner",
      defaultPageValue
    );
  });

  it("Should be able to filter all column on 'Asset table", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Asset
    table.runFilterSearch(
      tables["Scan report assets"],
      "Asset",
      testAsset.assetDomain
    );

    //Filter by Hostnames
    table.runFilterSearch(
      tables["Scan report assets"],
      "Hostnames",
      testAsset.hostnames
    );

    //Filter by Port
    table.runFilterSearch(
      tables["Scan report assets"],
      "Port",
      testAsset.portNumber
    );

    //Filter by Service
    table.runFilterSearch(
      tables["Scan report assets"],
      "Service",
      testAsset.serviceName
    );

    //Filter by Protocol
    table.runFilterSearch(
      tables["Scan report assets"],
      "Protocol",
      testAsset.protocolName
    );

    //Filter by Network
    table.runFilterCheckbox(
      tables["Scan report assets"],
      "Network",
      [testAsset.networkValue],
      [testAsset.networkName]
    );

    //Filter by No. Issues
    table.runFilterSearch(
      tables["Scan report assets"],
      "No. Issues",
      testAsset.numberOfIssues
    );
  });
});
