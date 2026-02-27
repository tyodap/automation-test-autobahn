import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import scanning from "../../utils/pages/scanning";
import fileUpload from "../../utils/pages/file-upload";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";

describe("Scanning page smoke test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
  });

  it("Should verify layout button routing", () => {
    /**
     * Test case
     * 1. Verify upload file button routing
     * 2. Verify create scan button routing
     * 3. Verify integrate button routing
     */
    // Upload
    scanning.importFileButton.should("be.visible").click();
    scanning.importFileDrawerButton.should("be.visible").click();
    cy.verifyIfOpen(pages.ImportFile);
    fileUpload.backButton.click();

    // Create scan
    scanning.createScanButton.should("be.visible").click();
    cy.verifyIfOpen(pages["Create Scan"]);
    cy.go("back");

    // Integrate
    scanning.integrateButton.should("be.visible").click();
    cy.verifyIfOpen(pages.Integrations);
  });

  it("Should verify action button clicking", () => {
    /**
     * Test case
     * 1. Verify download
     * 2. Verify edit scan name
     * 3. Verify rescan
     * 4. Verify hide
     */
    table.filterSearch(tables["All Scans"], "Scan", "new scan");

    // Download
    scanning.downloadScanReport();

    // Edit scan name
    scanning.actionButton.click();
    scanning.actionButtonModal.should("be.visible");
    scanning.editScanName.click();

    // Rescan
    scanning.actionButton.click();
    scanning.actionButtonModal.should("be.visible");
    scanning.rescanButton.should("be.visible").click();
    modal.modalTitle("Start a rescan").should("be.visible");
    modal.cancelActionButton.contains("No").click();

    // Hide
    scanning.actionButton.click();
    scanning.actionButtonModal.should("be.visible");
    scanning.hideButton.should("be.visible").click();
    modal.modalTitle("Hide scan").should("be.visible");
    modal.cancelActionButton.contains("Cancel");
    modal.cancelActionButton.click();
  });
});
