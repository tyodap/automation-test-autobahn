import { pages } from "../../fixtures/constants/pages";
import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import scanReport from "../../utils/pages/scan-report";
import scanning from "../../utils/pages/scanning";
import reportEngineService from "../../utils/services/report-engine-service";

describe("Download scan report", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Initial Scan Prod"]
      : scansTest["Initial Scan Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
  });

  it("Should be able to download scan report from scanning page", () => {
    /**
     * 1. Filter the scan
     * 2. Click download scan report
     * 2. Verify download scan report
     */
    table.filterSearch(tables["All Scans"], "Scan", testScan.scanName);
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", testScan.scanName);

    reportEngineService.interceptReportEngine(testScan.scanName, testScan);
    scanning.downloadScanReport();
    reportEngineService.verifyReportEngine(testScan.scanName);
  });

  it("Should be able to download scan report from scan report page", () => {
    /**
     * 1. Filter the scan
     * 2. Open the scan report and download it
     * 3. Verify download scan report
     */
    table.filterSearch(tables["All Scans"], "Scan", testScan.scanName);
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", testScan.scanName);
    table.clickOnColumnValueOrLink(tables["All Scans"], "Scan");

    cy.url().should("include", testScan.scanId, { timeout: 30000 });
    scanReport.scanName.should("be.visible", {
      timeout: 80000,
    });
    scanReport.scanName.should("have.text", testScan.scanName, {
      timeout: 80000,
    });

    reportEngineService.interceptReportEngine(testScan.scanName, testScan);
    scanReport.downloadButton.should("be.visible").click();
    scanReport.downloadReportButton.should("be.visible").click();
    reportEngineService.verifyReportEngine(testScan.scanName);
  });
});
