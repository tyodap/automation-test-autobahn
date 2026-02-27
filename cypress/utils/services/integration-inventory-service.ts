class IntegrationInventoryService {
  get baseServiceUrl() {
    return "/api/integration-inventory/";
  }

  get msdeServiceUrl() {
    return "/api/ms-defender-integration/endpoint";
  }

  get msdcServiceUrl() {
    return "/api/msdc-integration/config";
  }

  interceptIntegrationInventoryService(alias: string) {
    cy.intercept({
      method: "GET",
      url: this.baseServiceUrl,
    }).as(alias);
  }

  verifyIntegrationInventoryService(alias: string) {
    cy.wait(`@${alias}`, { timeout: 15000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptIntegrationInventoryServiceStatus(
    alias: string,
    integrationName: string
  ) {
    cy.intercept({
      method: "GET",
      url: `${this.baseServiceUrl}status/${integrationName}`,
    }).as(alias);
  }

  interceptIntegrationService(
    integrationName: string,
    method: string,
    alias: string
  ) {
    let url;
    if (integrationName == "MSDE") {
      url = this.msdeServiceUrl;
    } else if (integrationName == "MSDC") {
      url = `${this.msdcServiceUrl}`;
    }
    cy.intercept({
      method: method,
      url: url,
    }).as(alias);
  }

  verifyIntegrationService(alias: string, status: number) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", status);
  }
}

export default new IntegrationInventoryService();
