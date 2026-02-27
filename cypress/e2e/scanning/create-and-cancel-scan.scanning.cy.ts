import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import createScan from "../../utils/pages/create-scan";
import scanStatus from "../../utils/pages/scan-status";
import scanning from "../../utils/pages/scanning";
import mailosaur from "../../utils/services/mailosaur";
import scanConfigService from "../../utils/services/scan-config-service";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const assigneeUser =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod Two"]
    : usersTest["QC Test Two"];

const testAsset =
  Cypress.env("environment") === "PROD"
    ? assetProd["Asset Create Scan Prod"]
    : assetTest["Asset Test Env"];

const scanName = createScan.generateRandomScanName("Automation-scan");
const scanDescription = "E2E Scan Test";

describe.skip("Create and cancel scan", { tags: ["@daily"] }, () => {
  it("User successfully create scan and cancel running scan", () => {
    /**
     * 1. Open scanning page
     * 2. Click create scan button
     * 3. Input details needed on each page
     * 4. Verify that running scan cannot be hidden
     * 5. Go to scan status
     * 6. Cancel scan
     * 7. Verify cancel scan state
     * 8. Verify cancel email
     */
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    scanning.createScanButton.click();

    //Page 1
    cy.verifyIfOpen(pages["Create Scan"]);
    scanConfigService.interceptValidation("scanName");
    createScan.inputScanDetail(scanName, scanDescription);
    scanConfigService.verifyValidation("scanName");
    createScan.nextButton.click();

    //Page 2
    table.isTableHeadersVisible(tables["Asset from inventory"]);
    table.filterSearch(
      tables["Asset from inventory"],
      "Asset",
      testAsset.assetDomain
    );
    table.selectOnlyDataRowBulkActions(tables["Asset from inventory"]);
    createScan.nextButton.click();
    modal.confirmAssetOwnership();

    //Page3
    createScan.detailScans(scanName).should("be.visible");
    createScan.detailScans(scanDescription).should("be.visible");
    createScan.startScan(scanName);

    //Scanning page
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    cy.wait(5000);
    cy.reload();
    table.filterSearch(tables["All Scans"], "Scan", scanName);
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", scanName);

    scanning.actionButton.click();
    scanning.hideRevision.should("not.exist");

    table.clickOnColumnValueOrLink(tables["All Scans"], "Scan");

    pages["Scan Status"].name = scanName;
    cy.verifyIfOpen(pages["Scan Status"]);
    scanStatus.scanStatusCard.should("be.visible");
    scanStatus.scanDescription.should("contain", scanDescription);
    scanStatus.openServiceLabel.should("be.visible");
    scanStatus.nonAliveHostLabel.should("be.visible");
    scanStatus.manualTargetLabel.should("be.visible");
    scanStatus.portLabel.should("be.visible");
    scanStatus.scanHostStatus.should("not.contain.text", "Finished");
    scanStatus.scanStatus.should("not.contain.text", "Finished");

    scanStatus.cancelScan(scanName);

    scanStatus.scanHostStatus.should("contain.text", "Canceled");
    scanStatus.scanStatus.should("contain.text", "Canceled");

    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    cy.wait(15000);
    table.filterSearch(tables["All Scans"], "Scan", scanName);

    scanning.checkCancelScanState(
      tables["All Scans"],
      "Status",
      orgAdmin,
      scanName
    );
    mailosaur.checkCancelScanEmail(orgAdmin, scanName);
  });
});
