import { usersProd, usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import { credential } from "../../fixtures/constants/integration-credential";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import integration from "../../utils/pages/integration";
import msdeIntegrationService from "../../utils/services/msde-integration-service";
import analyticsService from "../../utils/services/analytics-service";
import scanManagementService from "../../utils/services/scan-management-service";
import sidebar from "../../utils/components/sidebar";
import mailosaur from "../../utils/services/mailosaur";
import scanning from "../../utils/pages/scanning";
import modal from "../../utils/components/modal";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];
const msdeIntegrationNumber = 8;
const specialChar = "@#!*()撾部غانتنع";
const labelName = integration.generateRandomLabelName("MSDE");
const firstInstanceLabel = "First instance";
const secondInstanceLabel = "Second instance";
const activeInstanceLabel = "Enable disable";
const exceedsCharLabel = "thisisatwentyeightcharacters";
const scanName = `MS Defender for Endpoint - ${labelName}`;

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Integrations);
  msdeIntegrationService.interceptMSDEConfiguration("MSDE");
  integration.openIntegration(msdeIntegrationNumber, "MSDE");
});

describe("MSDE multiple instances", { tags: ["@daily"] }, () => {
  it("Should be able add MSDE credentials", () => {
    msdeIntegrationService.removeMsdeCredentials("MSDE", orgAdmin);
    integration.addInstanceButton.click();

    integration.typeCredential("MSDE", {
      labelName: labelName,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDE.appId,
      appSecret: credential.assessmentBasedIntegration.MSDE.appSecret,
    });

    integration.configureIntegration("MSDE");

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

  it("Should be able to remove MSDE credentials", () => {
    integration.deleteInstanceButton.click();
    modal.confirmDeleteInstances();
    integration.backButton.click();
    cy.verifyIfOpen(pages["Integrations"]);
    integration
      .getEditButton(msdeIntegrationNumber)
      .should("contain.text", "Configure");
  });

  it("Should not be able to proceed using wrong credentials", () => {
    integration.addInstanceButton.click();

    integration.typeCredential("MSDE", {
      labelName: labelName,
      tenantId: credential.assessmentBasedIntegration.MSDE.wrongTenantId,
      appId: credential.assessmentBasedIntegration.MSDE.appId,
      appSecret: credential.assessmentBasedIntegration.MSDE.appSecret,
    });

    msdeIntegrationService.interceptMSDE("MSDE wrong creds");
    integration.saveButton.click();
    msdeIntegrationService.verifyWrongCredsMSDE("MSDE wrong creds");
    integration.errorPopUp.should("have.text", "Invalid credential");
  });

  it("Should be able to redirect user to user manual if tutorial is clicked", () => {
    integration.tutorialLink.click();
    cy.url().should(
      "equal",
      "https://support.autobahn-security.com/knowledge/set-up-your-ms-defender-for-endpoint-integration"
    );
  });

  it("Should not be able to proceed if field is empty", () => {
    integration.addInstanceButton.click();

    integration.placeholder("msd_label").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage.should("have.text", "Label is required");
    integration.placeholder("msd_label").type(labelName);

    integration.placeholder("msd_tenant_id").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage.should("have.text", "Tenant ID is required");
    integration
      .placeholder("msd_tenant_id")
      .type(credential.assessmentBasedIntegration.MSDE.wrongTenantId);

    integration.placeholder("msd_application_id").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage.should("have.text", "Client ID is required");
    integration
      .placeholder("msd_application_id")
      .type(credential.assessmentBasedIntegration.MSDE.appId);

    integration.placeholder("msd_application_secret").click();
    integration.saveButton.click({ force: true });
    integration.errorMessage.should("have.text", "Client Secret is required");
  });

  it("Should not be able to proceed if label uses special char", () => {
    integration.addInstanceButton.click();

    integration.typeCredential("MSDE", {
      labelName: specialChar,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDE.appId,
      appSecret: credential.assessmentBasedIntegration.MSDE.appSecret,
    });
    integration.saveButton.click();

    integration.errorPopUp.should("have.text", "Validation error");
  });

  it("Should not be able to proceed if label exceeds 27 char", () => {
    integration.addInstanceButton.click();

    integration.placeholder("msd_label").type(exceedsCharLabel);
    integration.saveButton.click({ force: true });
    integration.errorMessage.should(
      "have.text",
      "Label must be 27 characters or fewer"
    );
  });

  it("Should not be able to proceed if permission is denied", () => {
    integration.addInstanceButton.click();

    integration.typeCredential("MSDE", {
      labelName: labelName,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDE.noPermissionAppId,
      appSecret:
        credential.assessmentBasedIntegration.MSDE.noPermissionAppSecret,
    });
    integration.saveButton.click();

    integration.errorPopUp.should(
      "have.text",
      "Missing application roles permission to get machine data"
    );
  });

  it("Should be able to add multiple MSDE credentials", () => {
    msdeIntegrationService.removeMsdeCredentials("MSDE", orgAdmin);
    cy.reload();

    integration.addInstanceButton.click();

    integration.typeCredential("MSDE", {
      labelName: firstInstanceLabel,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDE.appId,
      appSecret: credential.assessmentBasedIntegration.MSDE.appSecret,
    });
    integration.configureIntegration("MSDE");

    integration.addInstanceButton.click();

    integration.typeCredential("MSDE", {
      labelName: secondInstanceLabel,
      tenantId: credential.assessmentBasedIntegration.MSDE.tenantId,
      appId: credential.assessmentBasedIntegration.MSDE.appId,
      appSecret: credential.assessmentBasedIntegration.MSDE.appSecret,
    });
    integration.configureIntegration("MSDE");

    integration.backButton.click();

    sidebar.openMenu(pages.Scanning);
    cy.verifyIfOpen(pages.Scanning);
    cy.wait(45000);
    cy.reload();
    table.isLoaded(tables["All Scans"]),
      table.filterSearch(tables["All Scans"], "Scan", firstInstanceLabel);
    scanning.verifyScanCreated(tables["All Scans"]);

    table.filterSearch(tables["All Scans"], "Scan", secondInstanceLabel);
    scanning.verifyScanCreated(tables["All Scans"]);

    analyticsService.fetchRunningScanId(
      orgAdmin,
      firstInstanceLabel,
      (scanId) => {
        scanManagementService.cancelScan(orgAdmin, scanId);
      }
    );
    analyticsService.fetchRunningScanId(
      orgAdmin,
      secondInstanceLabel,
      (scanId) => {
        scanManagementService.cancelScan(orgAdmin, scanId);
      }
    );
  });

  it("Should be able to remove multiple MSDE credentials", () => {
    integration.deleteInstanceButton.first().click();
    modal.confirmDeleteInstances();
    cy.reload();

    integration.deleteInstanceButton.click();
    modal.confirmDeleteInstances();

    integration.backButton.click();
    cy.verifyIfOpen(pages["Integrations"]);
    integration
      .getEditButton(msdeIntegrationNumber)
      .should("contain.text", "Configure");
  });

  it("Should not be able to add MSDE instance with the same label as other instance", () => {
    integration.addInstanceButton.click();

    integration.placeholder("msd_label").type(activeInstanceLabel);
    integration.saveButton.click({ force: true });
    integration.errorMessage.should(
      "have.text",
      "Duplicate label is not allowed"
    );
  });

  it("Should be able to enable and disable instances", () => {
    integration.toggleButton
      .click()
      .should("have.attr", "aria-checked", "true");

    integration.toggleButton
      .click()
      .should("have.attr", "aria-checked", "false");
  });
});
