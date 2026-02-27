import { User } from "../../fixtures/interfaces/user.interface";

class AzureInventoryService {
  get baseServiceUrl() {
    return "/api/azure-integration/";
  }

  setAzureCredential(
    authorizedUser: User,
    labelName: string,
    tenantId: string,
    clientId: string,
    clientSecret: string
  ) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: this.baseServiceUrl,
        auth: {
          bearer: json.token,
        },
        body: {
          azure_label: labelName,
          azure_tenant_id: tenantId,
          azure_client_id: clientId,
          azure_client_secret: clientSecret,
        },
      }).then((response) => {
        if (response.status == 201) {
          cy.log("Adding Azure creds success");
        } else {
          throw new Error(`Error: ${response.status} - error`);
        }
      });
    });
  }

  removeAzureCredentials(authorizedUser: User) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "DELETE",
        url: this.baseServiceUrl,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 500) {
          cy.log("Azure creds already removed");
        } else if (response.status == 200) {
          cy.log("Removing Azure creds success");
        } else {
          throw new Error(`Error: ${response.status} - error`);
        }
      });
    });
  }

  interceptAzureIntegrationService(method: string, alias: string) {
    cy.intercept({
      method: method,
      url: this.baseServiceUrl,
    }).as(alias);
  }

  interceptDeleteAzureIntegration(method: string, alias: string) {
    cy.intercept({
      method: method,
      url: `${this.baseServiceUrl}*`,
    }).as(alias);
  }

  verifyAzureIntegrationService(alias: string, status: number) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", status);
  }
}

export default new AzureInventoryService();
