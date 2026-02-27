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

const externalScanName = "Existing-external-qualys";
const internalScanName = "Existing-internal-qualys";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
  scanning.importFileButton.click();
  scanning.importFileDrawerButton.should("be.visible").click();
  fileUpload.selectOriginAndType("Existing", "Qualys");
});

describe.skip("Upload existing Qualys", { tags: ["@daily"] }, () => {
  it("Should be able to upload existing external Qualys file", () => {
    fileUpload.scanNameSelection.type(externalScanName);
    fileUpload.existingScan.click();

    fileUpload.origin.contains("Qualys");

    fileUpload.uploadFile("cypress/fixtures/data/existing-qualys.csv");
    fileUpload.fileSnapshot.should("be.visible");

    fileUpload.importFile("Qualys");

    cy.verifyIfOpen(pages.Scanning);
    cy.wait(45000);
    cy.reload();

    table.filterSearch(tables["All Scans"], "Scan", externalScanName);

    scanning.verifyScanCreated(tables["All Scans"]);

    analyticsService.fetchRunningScanId(
      orgAdmin,
      externalScanName,
      (scanId) => {
        scanManagementService.cancelScan(orgAdmin, scanId);
      }
    );
    scanning.checkCancelScanState(
      tables["All Scans"],
      "Status",
      orgAdmin,
      externalScanName
    );
  });

  it("Should be able to upload existing internal Qualys file", () => {
    fileUpload.scanNameSelection.type(internalScanName);
    fileUpload.existingScan.click();

    fileUpload.origin.contains("Qualys");

    fileUpload.uploadFile("cypress/fixtures/data/existing-qualys.csv");
    fileUpload.fileSnapshot.should("be.visible");

    fileUpload.importFile("Qualys");

    cy.verifyIfOpen(pages.Scanning);

    //Debug wait time
    console.log(new Date());

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
      externalScanName
    );
  });
});
