import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import createScan from "../../utils/pages/create-scan";
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

const scanName = createScan.generateRandomScanName("Scheduled-scan");
const scanDescription = "E2E Scan Test";

describe.skip("Create and cancel scheduled scan", { tags: ["@daily"] }, () => {
  it("Should be able to create and then cancel the scheduled scan with once repeat immediately", () => {
    /**
     * 1. Open scanning page
     * 2. Click create scan button
     * 3. Input details needed on each page
     * 4. Use the scheduled time
     * 5. Go to scanning page
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
    createScan.inputAssignee.click().type(`${assigneeUser.name}{enter}`);
    createScan.formAssignee.click();
    createScan.formAssignee.should("contain.text", assigneeUser.name);

    createScan.scheduleSelection.click();
    createScan.scheduleRepeatOnce.should("be.visible").click();
    createScan.timeRange.clear().type("04:00{enter}");
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

    cy.wait(25000);
    scanning.checkScanPresence(tables["All Scans"], "Scan", scanName);
    table.filterSearch(tables["All Scans"], "Scan", scanName);
    scanning.checkScanStatusState(tables["All Scans"], "Status", "Running");

    scanning.cancelScan();

    cy.wait(10000);
    cy.reload();
    scanning.checkScanStatusState(tables["All Scans"], "Status", "Canceled");
    mailosaur.checkCancelScanEmail(orgAdmin, scanName);
  });
});
