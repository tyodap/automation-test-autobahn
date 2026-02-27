import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import scanning from "../../utils/pages/scanning";
import table from "../../utils/components/table";
import sidebar from "../../utils/components/sidebar";
import modal from "../../utils/components/modal";
import scanConfigService from "../../utils/services/scan-config-service";
import analyticsService from "../../utils/services/analytics-service";
import scanManagementService from "../../utils/services/scan-management-service";
import mailosaur from "../../utils/services/mailosaur";
import scanStatus from "../../utils/pages/scan-status";

describe("Rescan regression test", () => {
  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Rescan Prod"]
      : scansTest["Rescan Test"];

  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Rescan Owner Prod"]
      : usersTest["Rescan Owner Test"];

  const scanName = testScan.scanName;

  afterEach(() => {
    analyticsService.fetchRunningScanId(orgAdmin, scanName, (scanId) => {
      scanManagementService.cancelScan(orgAdmin, scanId);
    });
  });

  it("Should be able to rescan canceled scan", () => {
    /**
     * 1. Open scanning page
     * 2. Search for rescan's scan
     * 3. Make sure that scan status is cancelled
     * 4. Rescan
     * 5. Cancel scan through scan status page
     */
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    table.filterSearch(tables["All Scans"], "Scan", scanName);

    scanning.checkCancelScanState(
      tables["All Scans"],
      "Status",
      orgAdmin,
      testScan.scanName
    );

    const revision = table.getListOfColumnValues(
      tables["All Scans"],
      "Revision"
    );

    scanning.actionButton.click();
    scanning.rescanButton.click();

    scanConfigService.interceptRescanRequest(testScan);
    modal.modalTitle("Start a rescan").should("be.visible");
    modal.approveActionButton.contains("Yes").click();
    scanConfigService.verifyScanRestarted(testScan);

    cy.wait(20000);
    cy.reload();
    scanning.checkScanStatusState(tables["All Scans"], "Status", "Running");

    table.clickOnColumnValueOrLink(tables["All Scans"], "Scan");

    scanStatus.cancelScan(testScan.scanName);
    scanStatus.scanHostStatus.should("contain.text", "Canceled");
    scanStatus.scanStatus.should("contain.text", "Canceled");

    sidebar.openMenu(pages.Scanning);
    cy.verifyIfOpen(pages.Scanning);

    table.filterSearch(tables["All Scans"], "Scan", scanName);

    table.verifyRevisionIsIncremented(
      tables["All Scans"],
      "Revision",
      revision
    );
    mailosaur.checkCancelScanEmail(orgAdmin, scanName);
  });
});
