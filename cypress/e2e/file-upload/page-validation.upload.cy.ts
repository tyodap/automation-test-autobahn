import { usersProd, usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import scanning from "../../utils/pages/scanning";
import fileUpload from "../../utils/pages/file-upload";
import "cypress-file-upload";
import modal from "../../utils/components/modal";

const specialChar = "@#!*()撾部غانتنع";
const longChar =
  "onkflwqenweifnewqoiefnewoiqlnfcbveowiefhnewoilnfweqlifnnwqlekfnwqlkefnwqelikfnweqliekjwqdbnwqeikjdnqwikljasjkbdcfkjasbdcjkawsdwqd";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
  scanning.importFileButton.click();
  scanning.importFileDrawerButton.should("be.visible").click();
  fileUpload.selectOriginAndType("New", "Manual Assurance Findings");

  fileUpload.scanType.click();
  fileUpload.scanTypeDropdown
    .should("be.visible")
    .and("not.have.class", "ant-dropdown-hidden")
    .within(() => {
      fileUpload.getScanTypeDropdown("External").click();
    });
});

describe.skip("File upload page validation", { tags: ["@daily"] }, () => {
  it("Should not be able to proceed if scan description has special character", () => {
    fileUpload.scanDescription.type(specialChar);
    fileUpload.specialCharErrorMessage.should("be.visible");
  });

  it("Should not be able to proceed if scan name has special character", () => {
    fileUpload.scanName.type(specialChar);
    fileUpload.scanDescription.click();
    fileUpload.specialCharErrorMessage.should("be.visible");
  });

  it("Should not be able to proceed if scan description has more than 64 characters", () => {
    fileUpload.scanName.type(longChar);
    fileUpload.scanDescription.click();
    fileUpload.longCharErrorMessage.should("be.visible");
  });

  it("Should not be able to proceed if scan name is empty", () => {
    fileUpload.uploadFile("cypress/fixtures/data/maf.xlsx");
    fileUpload.emptyScanNameAlert.should("be.visible");
    fileUpload.importButton.should("have.attr", "disabled");
    fileUpload.scanName.click();
    fileUpload.scanDescription.click();
    fileUpload.emptyScanNameErrorMessage.should("be.visible");
  });

  it("Should not be able to proceed if no file is uploaded", () => {
    fileUpload.scanName.type("random name for test");
    fileUpload.importButton.should("have.attr", "disabled");
  });

  it("Should be able to download template file", () => {
    cy.deleteDownloadsFolder();
    fileUpload.downloadMAFtemplate.click();
    cy.readFile("cypress/downloads/template_manual-assurance.xlsx");
  });

  it("Should be able to cancel upload", () => {
    fileUpload.scanName.type("random name for test");

    fileUpload.uploadFile("cypress/fixtures/data/maf.xlsx");
    fileUpload.fileSnapshot.should("be.visible");

    fileUpload.cancelButton.click();

    modal.cancelFileUpload();
  });
});
