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

const externalScanName = fileUpload.generateUploadFileName("Nessus-external");
const internalScanName = fileUpload.generateUploadFileName("Nessus-internal");

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
  scanning.importFileButton.click();
  scanning.importFileDrawerButton.should("be.visible").click();
  fileUpload.selectOriginAndType("New", "Nessus Professional");

  fileUpload.scanType.click();
});

describe.skip("Upload new nessus", { tags: ["@daily"] }, () => {
  it("Should be able to upload new external Nessus file", () => {
    fileUpload.scanTypeDropdown
      .should("be.visible")
      .and("not.have.class", "ant-dropdown-hidden")
      .within(() => {
        fileUpload.getScanTypeDropdown("External").click();
      });
    fileUpload.network.should("not.exist");
    fileUpload.scanName.type(externalScanName);

    fileUpload.uploadFile("cypress/fixtures/data/nessus.csv");

    fileUpload.fileSnapshot.should("be.visible");
    fileUpload.importFile("Nessus Professional");

    cy.verifyIfOpen(pages.Scanning);
    cy.wait(30000);
    cy.reload();
    table.isLoaded(tables["All Scans"]),
      scanning.checkScanPresence(tables["All Scans"], "Scan", externalScanName);

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

  it("Should be able to upload new internal Nessus file", () => {
    fileUpload.scanTypeDropdown
      .should("be.visible")
      .and("not.have.class", "ant-dropdown-hidden")
      .within(() => {
        fileUpload.getScanTypeDropdown("Internal").click();
      });

    fileUpload.network.click();
    fileUpload.networkDropdown
      .should("be.visible")
      .and("not.have.class", "ant-dropdown-hidden")
      .within(() => {
        fileUpload.getNetworkDropdown("Default Internal").click();
      });

    fileUpload.scanName.type(internalScanName);

    fileUpload.uploadFile("cypress/fixtures/data/nessus.csv");

    fileUpload.fileSnapshot.should("be.visible");
    fileUpload.importFile("Nessus Professional");

    cy.verifyIfOpen(pages.Scanning);
    cy.wait(30000);
    cy.reload();
    table.isLoaded(tables["All Scans"]);

    scanning.checkScanPresence(tables["All Scans"], "Scan", internalScanName);

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
