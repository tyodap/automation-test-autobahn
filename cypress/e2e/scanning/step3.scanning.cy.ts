import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import createScan from "../../utils/pages/create-scan";
import scanning from "../../utils/pages/scanning";
import scanConfigService from "../../utils/services/scan-config-service";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["QC Test One"];

const invitedUser =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod Two"]
    : usersTest["QC Test Two"];

const testAsset =
  Cypress.env("environment") === "PROD"
    ? assetProd["Asset Create Scan Prod"]
    : assetTest["Asset Test Env"];

const scanType = "Autobahn (external)";
const scanName = createScan.generateRandomScanName("Scan-name_.123+");
const description = "This is scan description";
const tag = "Tag for scan page";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
  scanning.createScanButton.click();
});

describe("Scan summary validation", { tags: ["@daily"] }, () => {
  it("Scan Summary validation", () => {
    /**
     * 1. Input each field on scan page 1
     * 2. Input asset on scan page 2
     * 3. Verify each of scan information
     */
    cy.verifyIfOpen(pages["Create Scan"]);
    scanConfigService.interceptValidation("scanName");
    createScan.formScanName.type(scanName);
    createScan.addDescription.click();
    scanConfigService.verifyValidation("scanName");
    createScan.validScanName.should("be.visible");

    createScan.formAddDescription.should("be.visible");
    createScan.formAddDescription.type(description);

    createScan.inputAssignee.click().type(`${invitedUser.name}{enter}`);
    createScan.formAssignee.click();
    createScan.formAssignee.should("contain.text", invitedUser.name);

    createScan.inputTag.click().type(`${tag}{enter}`);
    createScan.formTag.should("contain.text", tag);

    createScan.nextButton.click();

    table.isTableHeadersVisible(tables["Asset from inventory"]);
    table.filterSearch(
      tables["Asset from inventory"],
      "Asset",
      testAsset.assetDomain
    );
    table.selectOnlyDataRowBulkActions(tables["Asset from inventory"]);
    createScan.nextButton.click();
    modal.confirmAssetOwnership();

    createScan.detailScans(scanType).should("be.visible");
    createScan.detailScans(scanName).should("be.visible");
    createScan.detailScans(description).should("be.visible");
    createScan.detailScans(tag).should("be.visible");
    createScan.previousButton.should("be.visible");
  });
});
