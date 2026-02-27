import scanning from "../../utils/pages/scanning";
import { usersProd } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import scanManagementService from "../../utils/services/scan-management-service";
import { scansProd } from "../../fixtures/constants/scan";

const orgAdmin = usersProd["QC Prod One"];

const testScan = scansProd["Update Scan Name"];

const beforeEditScanName = "Before edit scan name";
const afterEditScanName = "After edit scan name";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
});

describe("Scanning page regression", { tags: ["@daily"] }, () => {
  it("Should be able to edit scan name", () => {
    /**
     * Can be improved by adding BE change name on hooks
     */
    table.filterSearch(tables["All Scans"], "Scan", beforeEditScanName);
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", beforeEditScanName);

    scanning.actionButton.click();
    scanning.editScanName.click();
    scanning.editScanNamePlaceholder
      .should("be.visible")
      .clear()
      .type(`${afterEditScanName}{enter}`);

    scanning.editScanNameSuccessNotification.should("be.visible");
    cy.wait(5000);
    cy.reload();
    table.resetFilter(tables["All Scans"], "Scan");
    table.filterSearch(tables["All Scans"], "Scan", afterEditScanName);
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", afterEditScanName);

    scanning.actionButton.click();
    scanning.editScanName.click();
    scanning.editScanNamePlaceholder
      .should("be.visible")
      .clear()
      .type(`${beforeEditScanName}{enter}`);
    scanManagementService.updateScanName(
      orgAdmin,
      testScan.configId,
      testScan.scanName
    );
  });

  it("Should be able to rescan error scan", () => {
    table.filterSearch(tables["All Scans"], "Scan", "error scan");
    table.isOnlyValueInColumn(tables["All Scans"], "Scan", "error scan");

    scanning.checkScanStatusState(tables["All Scans"], "Status", "Error");
    scanning.actionButton.click();
    scanning.rescanButton.should("be.visible");
  });
});
