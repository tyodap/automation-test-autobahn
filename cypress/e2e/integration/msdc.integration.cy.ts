import { usersProd, usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import { credential } from "../../fixtures/constants/integration-credential";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import integration from "../../utils/pages/integration";
import analyticsService from "../../utils/services/analytics-service";
import scanManagementService from "../../utils/services/scan-management-service";
import sidebar from "../../utils/components/sidebar";
import mailosaur from "../../utils/services/mailosaur";
import scanning from "../../utils/pages/scanning";
import msdcIntegrationService from "../../utils/services/msdc-integration-service";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const msdcIntegrationNumber = 7;
const specialChar = "@#!*()撾部غانتنع";
const labelName = integration.generateRandomLabelName("MSDC Testing");
const scanName = `MS Defender Cloud Report - ${labelName}`;

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Integrations);
  integration.openIntegration(msdcIntegrationNumber, "MSDC");
});

describe("Integration - MSDC", { tags: ["@daily"] }, () => {
  it("Add MSDC credentials", () => {
    integration.typeCredential("MSDC", {
      labelName: labelName,
      tenantId: credential.assessmentBasedIntegration.MSDC.tenantId,
      appId: credential.assessmentBasedIntegration.MSDC.appId,
      appSecret: credential.assessmentBasedIntegration.MSDC.appSecret,
    });
    integration.configureIntegration("MSDC");

    cy.verifyIfOpen(pages["Integrations"]);
    integration
      .integrationStatus(msdcIntegrationNumber)
      .should("have.attr", "aria-checked", "true");

    sidebar.openMenu(pages.Scanning);
    cy.verifyIfOpen(pages.Scanning);
    cy.wait(45000);

    cy.reload();
    table.isLoaded(tables["All Scans"]),
      scanning.checkScanPresence(tables["All Scans"], "Scan", scanName);

    table.filterSearch(tables["All Scans"], "Scan", scanName);

    scanning.verifyScanCreated(tables["All Scans"]);

    analyticsService.fetchRunningScanId(orgAdmin, scanName, (scanId) => {
      scanManagementService.cancelScan(orgAdmin, scanId);
    });
    mailosaur.checkCancelScanEmail(orgAdmin, scanName);
  });

  it("Remove MSDC credentials", () => {
    integration.deleteThisConfiguration.click();
    integration.backButton.click();

    cy.verifyIfOpen(pages["Integrations"]);
    cy.reload();

    integration
      .getEditButton(msdcIntegrationNumber)
      .should("contain.text", "Configure");
  });

  it("Should not be able to proceed using wrong credentials", () => {
    integration.typeCredential("MSDC", {
      labelName: labelName,
      tenantId: credential.assessmentBasedIntegration.MSDE.wrongTenantId,
      appId: credential.assessmentBasedIntegration.MSDC.appId,
      appSecret: credential.assessmentBasedIntegration.MSDC.appSecret,
    });

    msdcIntegrationService.interceptMSDC("MSDC wrong creds");
    integration.saveButton.click();
    msdcIntegrationService.verifyWrongCredsMSDC("MSDC wrong creds");
    integration.errorPopUp
      .should("be.visible")
      .and("have.text", "Invalid microsoft defender for cloud credential");
  });

  it("Should not be able to proceed if field is empty", () => {
    integration.placeholder("label").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Label is required");
    integration.placeholder("label").type(labelName);

    integration.placeholder("tenant_id").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Tenant ID is required");
    integration
      .placeholder("tenant_id")
      .type(credential.assessmentBasedIntegration.MSDE.wrongTenantId);

    integration.placeholder("client_id").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "App ID is required");
    integration
      .placeholder("client_id")
      .type(credential.assessmentBasedIntegration.MSDE.appId);

    integration.placeholder("client_secret").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "App secret is required");
    integration
      .placeholder("client_secret")
      .type(credential.assessmentBasedIntegration.MSDE.appSecret);
  });

  it("Should not be able to proceed if label uses special char", () => {
    integration.typeCredential("MSDC", {
      labelName: specialChar,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDC.appId,
      appSecret: credential.assessmentBasedIntegration.MSDC.appSecret,
    });

    integration.specialCharNotAllowedErrorMessage.should("be.visible");
  });

  it("Should not be able to proceed if permission is denied", () => {
    integration.typeCredential("MSDC", {
      labelName: labelName,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDC.noPermissionAppId,
      appSecret:
        credential.assessmentBasedIntegration.MSDC.noPermissionAppSecret,
    });

    integration.errorMessage
      .should("be.visible")
      .and("have.text", "permission denied");
  });
});
