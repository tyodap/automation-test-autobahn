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

const externalScanName = "Existing-external-MSDC";
const internalScanName = "Existing-internal-MSDC";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
  scanning.importFileButton.click();
  scanning.importFileDrawerButton.should("be.visible").click();
  fileUpload.selectOriginAndType("Existing", "MS Defender for Cloud");
});

describe.skip("Upload existing MSDC", { tags: ["@daily"] }, () => {
  it("Should be able to upload existing external MSDC file", () => {
    fileUpload.scanNameSelection.type(externalScanName);
    fileUpload.existingScan.click();

    fileUpload.origin.contains("MS Defender for Cloud");

    fileUpload.uploadFile("cypress/fixtures/data/existing-msdc.csv");
    fileUpload.fileSnapshot.should("be.visible");

    fileUpload.importFile("MS Defender for Cloud");

    cy.verifyIfOpen(pages.Scanning);
    cy.wait(55000);
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

  it("Should be able to upload existing internal MSDC file", () => {
    fileUpload.scanNameSelection.type(internalScanName);
    fileUpload.existingScan.click();

    fileUpload.origin.contains("MS Defender for Cloud");

    fileUpload.uploadFile("cypress/fixtures/data/existing-msdc.csv");
    fileUpload.fileSnapshot.should("be.visible");

    fileUpload.importFile("MS Defender for Cloud");

    cy.verifyIfOpen(pages.Scanning);

    //Debug wait time
    console.log(new Date());

    cy.wait(55000);
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
