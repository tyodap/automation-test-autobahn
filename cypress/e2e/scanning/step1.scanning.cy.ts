import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import createScan from "../../utils/pages/create-scan";
import scanning from "../../utils/pages/scanning";
import scanConfigService from "../../utils/services/scan-config-service";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const invitedUser =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod Two"]
    : usersTest["Owner Smoke Test"];

const validScanName = createScan.generateRandomScanName("Scan-name_.123+");
const existingScanName = "external-qualys-kratos";
const specialChar = "@#!*()撾部غانتنع";
const longScanName =
  "This is the test of e2e automation for scan validation, on this part we would like to test the maximum character";

const validDescription = "Scan+description_.123+";
const longDescription =
  "This is the test of e2e automation for scan validation. On this part we would like to test the maximum character on description field.";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
  scanning.createScanButton.click();
});

describe("Scan name validation", { tags: ["@daily"] }, () => {
  it("Valid scan name", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    scanConfigService.interceptValidation("scanName");
    createScan.formScanName.type(validScanName);
    createScan.addDescription.click();
    scanConfigService.verifyValidation("scanName");
    createScan.validScanName.should("be.visible");
  });

  it("Existing scan name", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    scanConfigService.interceptValidation("existingScanName");
    createScan.formScanName.type(existingScanName);
    createScan.addDescription.click();
    scanConfigService.verifyExistingName("existingScanName");
    createScan.errorMessage.should(
      "contain.text",
      "This scan name is already taken"
    );
    createScan.nextButton.click();
    createScan.previousButton.should("not.exist");
    table.tableNotExist(tables["Asset from inventory"]);
  });

  it("Invalid special char scan name", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(specialChar);
    createScan.addDescription.click();
    createScan.errorMessage.should(
      "contain.text",
      `Invalid format. Please use only A-Z, a-z, 0-9, space or special characters like "_-.+".`
    );
    createScan.nextButton.click();
    createScan.previousButton.should("not.exist");
    table.tableNotExist(tables["Asset from inventory"]);
  });

  it("Invalid long char scan name", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(longScanName);
    createScan.addDescription.click();
    createScan.errorMessage.should(
      "contain.text",
      "Scan name must be 64 characters or fewer"
    );
    createScan.nextButton.click();
    createScan.previousButton.should("not.exist");
    table.tableNotExist(tables["Asset from inventory"]);
  });
});

describe("Description validation", { tags: ["@daily"] }, () => {
  it("Valid scan description", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(validScanName);
    createScan.addDescription.click();
    createScan.formAddDescription.type(validDescription);
    createScan.errorMessage.should("not.exist");
  });

  it("Invalid scan description", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(validScanName);
    createScan.addDescription.click();
    createScan.formAddDescription.type(specialChar);
    createScan.errorMessage.should(
      "contain.text",
      `Invalid format. Please use only A-Z, a-z, 0-9, space or special characters like "_-.+".`
    );
    createScan.nextButton.click();
    createScan.previousButton.should("not.exist");
    table.tableNotExist(tables["Asset from inventory"]);
  });

  it("Invalid long char description", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(validScanName);
    createScan.addDescription.click();
    createScan.formAddDescription.type(longDescription);
    createScan.errorMessage.should(
      "contain.text",
      "Scan description must be 128 characters or fewer"
    );
    createScan.nextButton.click();
    createScan.previousButton.should("not.exist");
    table.tableNotExist(tables["Asset from inventory"]);
  });
});

// describe.("Assignee validation", { tags: ["@daily"] }, () => {
//   it("Input scan assignee", () => {
//     cy.verifyIfOpen(pages["Create Scan"]);
//     createScan.formScanName.type(validScanName);
//     createScan.inputAssignee.click().type(`${invitedUser.name}{enter}`);
//     createScan.formAssignee.should("contain.text", invitedUser.name);
//     createScan.errorMessage.should("not.exist");
//   });
// });

describe("Tag validation", { tags: ["@daily"] }, () => {
  it("Input tag scan", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(validScanName);
    createScan.inputTag.type("tag撾部賀{enter}");
    createScan.formTag.should("contain.text", "tag撾部賀");
    createScan.errorMessage.should("not.exist");
  });

  it("Invalid tag scan", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(validScanName);
    createScan.inputTag.type(`${longScanName}{enter}`);
    createScan.errorMessage.should(
      "contain.text",
      `Tag "${longScanName}" exceeds 64 characters`
    );
  });
});

describe("Button function", { tags: ["@daily"] }, () => {
  it("Next button function", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.formScanName.type(validScanName);
    createScan.nextButton.click();
    createScan.previousButton.should("exist");
    table.isLoaded(tables["Asset from inventory"]);
  });

  it("Cancel button function", () => {
    cy.verifyIfOpen(pages["Create Scan"]);
    createScan.cancelButton.click();
    cy.verifyIfOpen(pages.Scanning);
  });
});
