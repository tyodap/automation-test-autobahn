import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import createScan from "../../utils/pages/create-scan";
import scanReport from "../../utils/pages/scan-report";
import scanStatus from "../../utils/pages/scan-status";
import scanning from "../../utils/pages/scanning";
import scanConfigService from "../../utils/services/scan-config-service";
import asset from "../../utils/pages/asset";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["Critical Owner Prod"]
    : usersTest["Owner Smoke Test"];

const testAsset =
  Cypress.env("environment") === "PROD"
    ? assetProd["Create Scan Flow"]
    : assetTest["Asset Test Env"];

const scanName = createScan.generateRandomScanName("Automation-scan");
const scanDescription = "E2E Scan Flow";

describe.skip("Create scan flow", () => {
  it("Should be able to create scan", { tags: ["@cron8am"] }, () => {
    /**
     * 1. Open scanning page
     * 2. Click create scan button
     * 3. Input details needed on each page
     * 4. Wrap the scan name
     * 5. Go to scan status
     */
    cy.writeFile("cypress/scan-name/scan-name.txt", scanName);

    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    scanning.createScanButton.click();

    //Page 1
    cy.verifyIfOpen(pages["Create Scan"]);
    scanConfigService.interceptValidation("scanName");
    createScan.inputScanDetail(scanName, scanDescription);
    scanConfigService.verifyValidation("scanName");
    createScan.inputAssignee.click().type(`${orgAdmin.name}{enter}`);
    createScan.formAssignee.click();
    createScan.formAssignee.should("contain.text", orgAdmin.name);
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
    cy.wait(15000);
    cy.reload();

    table.filterSearch(tables["All Scans"], "Scan", scanName);
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", scanName);

    table.clickOnColumnValueOrLink(tables["All Scans"], "Scan");

    pages["Scan Status"].name = scanName;
    cy.verifyIfOpen(pages["Scan Status"]);
    scanStatus.scanStatusCard.should("be.visible");
    scanStatus.scanAssignee.should("contain", orgAdmin.name);
    scanStatus.scanDescription.should("contain", scanDescription);
    scanStatus.openServiceLabel.should("be.visible");
    scanStatus.nonAliveHostLabel.should("be.visible");
    scanStatus.manualTargetLabel.should("be.visible");
    scanStatus.portLabel.should("be.visible");
    scanStatus.scanHostStatus.should("not.contain.text", "Finished");
    scanStatus.scanStatus.should("not.contain.text", "Finished");
  });

  it(
    "Should be able to check scan report after scan is finished",
    { tags: ["@cron5pm"] },
    () => {
      /**
       * 1. Check scan finished belong to started scan
       * 2. Open scan report
       * 3. Compare started on scanning page and scan report page
       * 4. Verify that started on and completed on on scan report page is on the same date
       */
      const scanNameAfterFinished = cy.readFile(
        "cypress/scan-name/scan-name.txt"
      );

      cy.openPageUsingSession(orgAdmin, pages.Scanning);
      scanNameAfterFinished.then((scan) => {
        table.filterSearch(tables["All Scans"], "Scan", scan);
        scanning.checkScanStatusState(
          tables["All Scans"],
          "Status",
          "Finished"
        );

        table
          .getListOfColumnValues(tables["All Scans"], "Started on")
          .then((text) => {
            const textBeforeFormatReplace = text as string[];
            const startedOnScanning = textBeforeFormatReplace[0].replace(
              "\n",
              " "
            );

            table.clickOnColumnValueOrLink(tables["All Scans"], "Scan");
            scanReport.scanName.should("have.text", scan, {
              timeout: 30000,
            });
            scanReport.startedOn.then((startedOnScanReport) => {
              startedOnScanReport = startedOnScanReport.replace(" at ", "");
              expect(startedOnScanReport).to.equal(startedOnScanning);

              scanReport.completedOn.then((text) => {
                const completedOnScanReport = text.split(" at ");
                expect(startedOnScanReport).to.include(
                  completedOnScanReport[0]
                );
              });
            });
          });
      });
    }
  );

  it(
    "Should be able to check asset after scan is finished",
    { tags: ["@cron5pm"] },
    () => {
      /**
       * 1. Check asset belong to started scan
       */
      cy.openPageUsingSession(orgAdmin, pages.Assets);
      table.filterCheckbox(tables.Assets, "Source", testAsset["originValue"]);
      table.sort(tables.Assets, "Last scanned", "descending");
      table
        .getListOfColumnValues(tables.Assets, "Last scanned")
        .then((text) => {
          const textBeforeFormatReplace = text as string[];
          const lastScannedAsset = textBeforeFormatReplace[0].replace(
            "\n",
            " "
          );

          expect(lastScannedAsset).to.include(
            asset.generateTodayFormattedDate()
          );
        });
    }
  );
});
