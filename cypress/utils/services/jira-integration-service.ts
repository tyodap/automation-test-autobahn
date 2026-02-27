import { User } from "../../fixtures/interfaces/user.interface";

class JiraIntegrationService {
  get jiraStatusUrl() {
    return "api/integration-inventory/";
  }

  get configJiraIntegration() {
    return "api/jira-integration/jira-integration";
  }

  get removeJiraUrl() {
    return `${this.configJiraIntegration}/remove`;
  }

  removeJiraIntegrationCredentials(authorizedUser: User) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: this.removeJiraUrl,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 500) {
          cy.log("Jira creds already removed");
        } else if (response.status == 201) {
          cy.log("Removing Jira creds success");
        } else {
          throw new Error(`Error: ${response.status} - error`);
        }
      });
    });
  }

  intercept(alias: string) {
    cy.intercept({
      method: "GET",
      url: this.jiraStatusUrl,
    }).as(alias);
  }

  verify(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(200);
    });
  }

  interceptConfigJiraService(method: string, alias: string) {
    cy.intercept({
      method: method,
      url: this.configJiraIntegration,
    }).as(alias);
  }

  interceptRemoveConfigJiraService(method: string, alias: string) {
    cy.intercept({
      method: method,
      url: this.removeJiraUrl,
    }).as(alias);
  }

  verifyConfigJiraService(alias: string, status: number) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", status);
  }

  verifyWrongCredential(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(500);
      expect(interceptions.response.body.error.message).eq(
        '"Client must be authenticated to access this resource."'
      );
    });
  }
}

export default new JiraIntegrationService();
