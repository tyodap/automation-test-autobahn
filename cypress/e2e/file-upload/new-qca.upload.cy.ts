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

const internalScanName = fileUpload.generateUploadFileName("QCA-internal");

describe.skip("Upload New QCA", { tags: ["@daily"] }, () => {
  it("Should be able to upload new internal QCA file", () => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    scanning.importFileButton.click();
    scanning.importFileDrawerButton.should("be.visible").click();
    fileUpload.selectOriginAndType("New", "Qualys Cloud Agents");

    fileUpload.scanType.should("have.attr", "disabled");
    fileUpload.internalType.should("exist").and("have.text", "Internal");

    fileUpload.network.click();
    fileUpload.networkDropdown
      .should("be.visible")
      .and("not.have.class", "ant-dropdown-hidden")
      .within(() => {
        fileUpload.getNetworkDropdown("Default Internal").click();
      });

    fileUpload.scanName.type(internalScanName);
    fileUpload.selectAssignee(orgAdmin);

    fileUpload.uploadFile("cypress/fixtures/data/qca.csv");

    fileUpload.fileSnapshot.should("be.visible");
    fileUpload.importFile("Qualys Cloud Agents");

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
