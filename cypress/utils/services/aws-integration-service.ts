import { User } from "../../fixtures/interfaces/user.interface";

class AwsInventoryService {
  get baseServiceUrl() {
    return "/api/aws-integration/aws-integration";
  }

  setAwsCredentials(
    authorizedUser: User,
    labelName: string,
    scope: boolean,
    accessKey: string,
    secretId: string
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
          label: labelName,
          aws_id: accessKey,
          aws_secret: secretId,
          is_all_project: scope,
        },
      }).then((response) => {
        if (response.status == 201) {
          cy.log("Adding aws creds success");
        } else {
          throw new Error(`Error: ${response.status} - error`);
        }
      });
    });
  }

  removeAwsCredentials(authorizedUser: User) {
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
          cy.log("AWS creds already removed");
        } else if (response.status == 200) {
          cy.log("Removing AWS creds success");
        } else {
          throw new Error(`Error: ${response.status} - error`);
        }
      });
    });
  }

  interceptAwsIntegrationService(method: string, alias: string) {
    cy.intercept({
      method: method,
      url: this.baseServiceUrl,
    }).as(alias);
  }

  verifyAwsIntegrationService(alias: string, status: number) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", status);
  }

  verifyWrongCredsAWS(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(400);
      expect(interceptions.response.body.error.message).eq(
        "Credential is not valid"
      );
    });
  }
}

export default new AwsInventoryService();
