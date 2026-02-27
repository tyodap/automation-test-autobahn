import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import sidebar from "../../utils/components/sidebar";
import table from "../../utils/components/table";
import createScan from "../../utils/pages/create-scan";
import scanning from "../../utils/pages/scanning";
import scanConfigService from "../../utils/services/scan-config-service";

describe("update scope", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Rescan Owner Prod"]
      : usersTest["Rescan Owner Test"];

  const currentAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Current Asset Prod"]
      : assetTest["Current Asset Test"];

  const additionalAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Additional Asset Prod"]
      : assetTest["Additional Asset Test"];

  const scanName = createScan.generateRandomScanName("Autobahn-external");
  const scanDescription = "Regular Smoke Test";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    scanning.createScanButton.click();
  });

  it("Should be able to update scan configuration", () => {
    /**
     * Test cases
     * 1. Verify current scope
     * 2. Verify tag and criticality on current scope
     * 3. Verify new asset not exist on current scope
     * 4. Verify current scope not exist on additional scope
     * 5. Add new asset
     * 6. Re-open change scope
     * 7. Verify new asset on current scope
     * 8. Verify tag and criticality new asset on current scope
     * 9. Verify new asset not exist on additional scope
     */

    //Page 1
    cy.verifyIfOpen(pages["Create Scan"]);
    scanConfigService.interceptValidation("scanName");
    createScan.inputScanDetail(scanName, scanDescription);
    scanConfigService.verifyValidation("scanName");
    createScan.createSchedule("30 Dec, 2026");
    createScan.nextButton.click();

    //page 2
    table.filterSearch(
      tables["Asset from inventory"],
      "Asset",
      currentAsset.assetDomain
    );
    table.selectOnlyDataRowBulkActions(tables["Asset from inventory"]);
    createScan.nextButton.click();
    modal.confirmAssetOwnership();

    //page 3
    createScan.detailScans(scanName).should("be.visible");
    createScan.detailScans(scanDescription).should("be.visible");
    createScan.startScan(scanName);

    cy.verifyIfOpen(pages.Scanning);
    cy.reload();

    //Open schedule scan
    table.filterSearch(tables["Scheduled scans"], "Scan", scanName);
    table.isColumnValueMatch(tables["Scheduled scans"], "Scan", [scanName]);
    scanning.changeScanScopeConfiguration();
    cy.wait(3000);
    createScan.nextButton.should("be.visible").click();

    //Search current scope
    //Verify tag and criticality
    table.filterSearch(
      tables["Create scan - current scope"],
      "Asset",
      currentAsset.assetDomain
    );
    table.isColumnValueMatch(tables["Create scan - current scope"], "Asset", [
      currentAsset.assetDomain,
    ]);
    table.isColumnValueMatch(
      tables["Create scan - current scope"],
      "Tags",
      currentAsset.tag
    );
    createScan.criticalityTwo.should("be.visible");

    //Search additonal scope on current scope
    table.filterSearch(
      tables["Create scan - current scope"],
      "Asset",
      additionalAsset.assetDomain
    );
    table.isTableEmpty(tables["Create scan - current scope"]);

    createScan.tableList.contains("Additional scope").click();

    //Search current scope on additional scope
    table.filterSearch(
      tables["Asset from inventory"],
      "Asset",
      currentAsset.assetDomain
    );
    table.isTableEmpty(tables["Asset from inventory"]);

    //Add new asset on additional scope
    table.filterSearch(
      tables["Asset from inventory"],
      "Asset",
      additionalAsset.assetDomain
    );
    table.selectOnlyDataRowBulkActions(tables["Asset from inventory"]);
    createScan.nextButton.click();
    modal.confirmAssetOwnership();

    createScan.detailScans(scanName).should("be.visible");
    createScan.startScanButton.click();
    createScan.startScanButton.should("not.have.class", "ant-button-loading");

    cy.verifyIfOpen(pages.Scanning);
    cy.reload();

    table.filterSearch(tables["Scheduled scans"], "Scan", scanName);
    table.isColumnValueMatch(tables["Scheduled scans"], "Scan", [scanName]);
    scanning.changeScanScopeConfiguration();

    cy.wait(3000);
    createScan.nextButton.click();

    //Search new asset on current scope
    //Verify tag and criticality
    table.filterSearch(
      tables["Create scan - current scope"],
      "Asset",
      additionalAsset.assetDomain
    );
    table.isColumnValueMatch(tables["Create scan - current scope"], "Asset", [
      additionalAsset.assetDomain,
    ]);
    table.isColumnValueMatch(
      tables["Create scan - current scope"],
      "Tags",
      additionalAsset.tag
    );
    createScan.criticalityOne.should("be.visible");

    createScan.tableList.contains("Additional scope").click();

    table.filterSearch(
      tables["Asset from inventory"],
      "Asset",
      additionalAsset.assetDomain
    );
    table.isTableEmpty(tables["Asset from inventory"]);

    sidebar.openMenu(pages.Scanning);

    table.filterSearch(tables["Scheduled scans"], "Scan", scanName);
    table.isColumnValueMatch(tables["Scheduled scans"], "Scan", [scanName]);
    table.selectOnlyDataRowBulkActions(tables["Scheduled scans"]);
    scanning.deleteScheduledScan(scanName);

    table.filterSearch(tables["Scheduled scans"], "Scan", scanName);
    table.isTableEmpty(tables["Scheduled scans"]);
  });
});
