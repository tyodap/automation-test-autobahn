import { User } from "../../fixtures/interfaces/user.interface";

class MsdeInventoryService {
  get baseServiceUrl() {
    return "/api/ms-defender-integration/endpoint";
  }

  interceptMSDE(alias: string) {
    cy.intercept({
      method: "POST",
      url: this.baseServiceUrl,
    }).as(alias);
  }

  interceptMSDEConfiguration(alias: string) {
    cy.intercept({
      method: "GET",
      url: this.baseServiceUrl,
    }).as(alias);
  }

  verifyWrongCredsMSDE(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(400);
      expect(interceptions.response.body.client_message).eq(
        "Invalid credential"
      );
    });
  }

  removeMsdeCredentials(alias: string, authorizedUser: User) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      if (interceptions.response.statusCode === 500) {
        cy.log("Expected 500 error because no config exist, continuing test");
      } else {
        const msdeID = interceptions.response.body.data[1].id;

        const filename = authorizedUser.tokenLink;
        cy.readFile(filename).then((json) => {
          if (!(json.email == authorizedUser.email)) {
            throw new Error(
              `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
            );
          }
          cy.request({
            method: "DELETE",
            url: `${this.baseServiceUrl}/${msdeID}`,
            auth: {
              bearer: json.token,
            },
            failOnStatusCode: false,
          }).then((response) => {
            if (response.status == 500) {
              cy.log("MSDE creds already removed");
            } else if (response.status == 200) {
              cy.log("Removing MSDE creds success");
            } else {
              throw new Error(`Error: ${response.status} - error`);
            }
          });
        });
      }
    });
  }
}

export default new MsdeInventoryService();
