import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import table from "../../utils/components/table";
import scanning from "../../utils/pages/scanning";
import scanReport from "../../utils/pages/scan-report";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { scansProd, scansTest } from "../../fixtures/constants/scan";
import modal from "../../utils/components/modal";

describe("Scan report page smoke test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Initial Scan Prod"]
      : scansTest["New scan"];

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    table.filterSearch(tables["All Scans"], "Scan", testScan.scanName);
    scanning.scanButton.contains(testScan.scanName).click();

    cy.url().should("include", testScan.scanId, { timeout: 30000 });
  });

  it("Should open scan report page", () => {
    /**
     * Test case
     * 1. Verify that every card loads
     * 2. Verify that every table loads
     */
    scanReport.rescanButton.should("be.visible");
    scanReport.downloadButton.should("be.visible").click();
    scanReport.downloadScopeButton.should("be.visible");
    scanReport.downloadReportButton.should("be.visible");

    scanReport.issuesOverviewCard
      .should("be.visible")
      .contains("CRITICAL SEVERITY");
    scanReport.generalDetailsCard.should("be.visible").contains(orgAdmin.name);
    scanReport.severityDistributionChart.should("be.visible");

    table.isLoaded(tables["Scan report workouts"]);
    table.isLoaded(tables["Scan report individual issues"]);
    table.isLoaded(tables["Scan report assets"]);
    table.isLoaded(tables["Non alive hosts"]);
    scanReport.manualTargetsTable.should("be.visible");
    scanReport.portsTable.should("be.visible").contains("TCP Basic");
  });

  it("Should verify action button clicking", () => {
    /**
     * Test case
     * 1. Verify rescan
     * 2. Verify download
     */
    scanReport.downloadButton.click();
    scanReport.downloadScopeButton.should("be.visible").click();
    scanReport.downloadButton.click();
    scanReport.downloadReportButton.should("be.visible").click();

    scanReport.rescanButton.click();
    modal.modalTitle("Start a rescan").should("be.visible");
    modal.cancelActionButton.contains("No").click();
  });
});
