import { usersProd, usersTest } from "../fixtures/constants/user";
import { pages } from "../fixtures/constants/pages";
import { tables } from "../fixtures/constants/table";
import table from "../utils/components/table";
import scanning from "../utils/pages/scanning";

describe("Scanning suite", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Integration Checker Prod"]
      : usersTest["Integration Checker Test"];

  const originName = "MS Defender for Endpoint (external)";
  const originValue = "ms-defender-endpoint_external";
  const scanLabel = "MS Defender for Endpoint";
  const scanName = "POC";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
  });

  it("Verify that data displayed on scanning is correct (including [Integration] logo)", () => {
    table
      .getListOfColumnValues(tables["All Scans"], "Scan")
      .then((fetchedScanName) => {
        expect(fetchedScanName[0]).to.be.equal(scanLabel + " - " + scanName);
      });
    table.verifyOrigin(tables["All Scans"], originName);
  });

  it("Verify that data displayed on scan status is correct (including [Integration] logo)", () => {});

  it("Verify that scan name cannot be edit", () => {
    scanning.actionButton.click();
    scanning.actionButtonModal.should("be.visible").within(() => {
      scanning.editScanName.should("not.exist");
      scanning.rescanButton.should("not.exist");
      scanning.downloadButton.should("not.exist");
    });
  });

  it("Verify that user can filter [Integration] scan on scanning", () => {
    table.filterCheckbox(tables["All Scans"], "Origin", [originValue]);
    table.verifyOrigin(tables["All Scans"], originName);
  });

  it("Verify that user can edit [Integration] scan assignee on scanning", () => {});
});
