import integrationInventoryService from "../services/integration-inventory-service";
import { pages } from "../../fixtures/constants/pages";
import modal from "../components/modal";
import { IntegrationName } from "../../fixtures/interfaces/integration.interface";
import { BaseCredentials } from "../../fixtures/interfaces/integration.interface";

class IntegrationsPage {
  integrationStatus(integrationName: number) {
    return cy.get(
      `[data-testid="integrations-app"] div .ant-card:nth-child(${integrationName}) button[role="switch"]`
    );
  }

  integrationCard() {
    return cy.get(
      `[class="ant-card ant-card-bordered ant-card-default integration-card"]`
    );
  }

  getEditButton(integrationOrder: number) {
    return cy.get(
      `[data-testid="integrations-app"] div .ant-card:nth-child(${integrationOrder}) .action button`
    );
  }

  getToggleButtonByIntegration(integrationOrder: number) {
    return cy.get(
      `[data-testid="integrations-app"] div .ant-card:nth-child(${integrationOrder}) button[role="switch"]`
    );
  }

  placeholder(placeholder: string) {
    return cy.get(`[id=${placeholder}]`);
  }

  get deleteInstanceButton() {
    return cy.get('[aria-label="Delete instance"]');
  }

  get addInstanceButton() {
    return cy.get("button.ant-btn-primary").contains("Add instance");
  }

  get wrongCredsError() {
    return cy.get('[data-testid="wrong-credential-error-message"]');
  }

  get permissionDeniedError() {
    return cy.get('[data-testid="permission-denied-error-message"]');
  }

  get duplicateCredentialLabelError() {
    return cy.get('[data-testid="duplicate-credential-label-error-message"]');
  }

  get tutorialLink() {
    return cy
      .get(
        '[href="https://support.autobahn-security.com/knowledge/set-up-your-ms-defender-for-endpoint-integration"]'
      )
      .invoke("removeAttr", "target");
  }

  get saveButton() {
    return cy.get("[class='ant-btn ant-btn-primary']").contains("Save");
  }

  get toggleButton() {
    return cy.get('button[role="switch"]');
  }

  get deleteThisConfiguration() {
    return cy.get("[type='button']").contains("Delete this configuration");
  }

  get resetButton() {
    return cy.get("[class='ant-btn ant-btn-default']");
  }

  get backButton() {
    return cy.get("[href='/integrations']").contains("Back to integrations");
  }

  get errorMessage() {
    return cy.get("div.ant-form-item-explain-error");
  }

  get errorPopUp() {
    return cy.get("div.ant-message-custom-content");
  }

  get specialCharNotAllowedErrorMessage() {
    return cy
      .get("div.ant-form-item-explain-error")
      .contains("special character not allowed");
  }

  configureIntegration(integrationName: string) {
    integrationInventoryService.interceptIntegrationService(
      integrationName,
      "POST",
      "saveCreds"
    );
    this.saveButton.click();
    integrationInventoryService.verifyIntegrationService("saveCreds", 201);
    modal.confirmIntegration();
  }

  isIntegrationDisabled(integrationOrder: number): Cypress.Chainable<boolean> {
    return this.getToggleButtonByIntegration(integrationOrder)
      .invoke("attr", "aria-checked")
      .then((value) => value === "false");
  }

  typeCredential(integrationName: IntegrationName, creds: BaseCredentials) {
    const {
      labelName,
      tenantId,
      appId,
      appSecret,
      apiKey,
      apiSecret,
      apiEndpoint,
    } = creds;

    switch (integrationName) {
      case "MSDE":
        if (labelName) this.placeholder("msd_label").type(labelName);
        if (tenantId) this.placeholder("msd_tenant_id").type(tenantId);
        if (appId) this.placeholder("msd_application_id").type(appId);
        if (appSecret)
          this.placeholder("msd_application_secret").type(appSecret);
        break;

      case "MSDC":
        if (labelName) this.placeholder("label").type(labelName);
        if (tenantId) this.placeholder("tenant_id").type(tenantId);
        if (tenantId) this.placeholder("client_id").type(appId);
        if (appId) this.placeholder("client_secret").type(appSecret);
        break;

      case "CyCognito":
        if (labelName) this.placeholder("label").type(labelName);
        break;

      case "Qualys":
        if (labelName) this.placeholder("label").type(labelName);
        break;

      case "Cisco":
        if (labelName) this.placeholder("label").type(labelName);
        if (apiEndpoint) this.placeholder("api_endpoint").type(apiEndpoint);
        if (apiKey) this.placeholder("api_key").type(apiKey);
        if (apiSecret) this.placeholder("api_secret").type(apiSecret);
        break;

      default:
        throw new Error(`Unsupported integration: ${integrationName}`);
    }
  }

  deleteCredentials(integrationName: string) {
    integrationInventoryService.interceptIntegrationService(
      integrationName,
      "DELETE",
      "removeCreds"
    );
    this.resetButton.click();
    integrationInventoryService.verifyIntegrationService("removeCreds", 200);
  }

  generateRandomLabelName(prefix: string) {
    return `${prefix}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-")}`;
  }

  openIntegration(
    integrationOrder: number,
    integrationName:
      | "AWS"
      | "Azure"
      | "Jira Software"
      | "MSDC"
      | "MSDE"
      | "Cisco"
  ) {
    this.getEditButton(integrationOrder).click();
    cy.verifyIfOpen(pages[integrationName]);
  }

  verifyIntegrationText(description: string) {
    this.integrationCard().contains(description);
  }
}

export default new IntegrationsPage();
