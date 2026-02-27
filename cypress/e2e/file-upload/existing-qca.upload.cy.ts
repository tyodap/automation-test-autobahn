import { usersProd, usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import scanning from "../../utils/pages/scanning";
import fileUpload from "../../utils/pages/file-upload";
import "cypress-file-upload";
import analyticsService from "../../utils/services/analytics-service";
import scanManagementService from "../../utils/services/scan-management-service";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

describe.skip("Upload existing QCA", { tags: ["@daily"] }, () => {
  const internalScanName = "Existing-internal-qca";

  it("Should be able to upload existing internal QCA file", () => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    scanning.importFileButton.click();
    scanning.importFileDrawerButton.should("be.visible").click();
    fileUpload.selectOriginAndType("Existing", "Qualys Cloud Agents");

    fileUpload.scanNameSelection.type(internalScanName);
    fileUpload.existingScan.click();

    fileUpload.origin.contains("Qualys Cloud Agents");

    fileUpload.uploadFile("cypress/fixtures/data/existing-qca.csv");
    fileUpload.fileSnapshot.should("be.visible");

    fileUpload.importFile("Qualys Cloud Agents");

    cy.verifyIfOpen(pages.Scanning);
    cy.wait(45000);
    cy.reload();

    table.filterSearch(tables["All Scans"], "Scan", internalScanName);

    scanning.verifyScanCreated(tables["All Scans"]);

    analyticsService.fetchRunningScanId(
      orgAdmin,
      internalScanName,
      (scanId) => {
        scanManagementService.cancelScan(orgAdmin, scanId);
      }
    );
    scanning.checkCancelScanState(
      tables["All Scans"],
      "Status",
      orgAdmin,
      internalScanName
    );
  });
});
