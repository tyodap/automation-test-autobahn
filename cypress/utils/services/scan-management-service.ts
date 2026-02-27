import { User } from "../../fixtures/interfaces/user.interface";

class ScanManagementService {
  get baseServiceUrl() {
    return "api/scan-management";
  }

  interceptCancelScan(alias: string) {
    cy.intercept({
      method: "PUT",
      url: `${this.baseServiceUrl}/**`,
    }).as(alias);
  }

  interceptDeleteScheduledScan(alias: string) {
    cy.intercept({
      method: "POST",
      url: `${this.baseServiceUrl}/schedule/v2/scans/delete`,
    }).as(alias);
  }

  verifyDeleteScheduledScan(alias: string) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 201);
  }

  cancelScan(authorizedUser: User, scanId: string) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename, { timeout: 60000 }).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/scans/${scanId}`,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 409) {
          cy.log("Scan already cancelled");
        } else if (response.status == 200) {
          cy.log("Scan successfully cancelled");
        } else {
          throw new Error(
            `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
          );
        }
      });
    });
  }

  verifyCancelScan(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(200);
      expect(interceptions.response.body.data.success).eq(true);
      expect(interceptions.response.body.error_detail.server_message).eq(null);
    });
  }

  updateScanName(authorizedUser: User, scanConfigId: string, scanName: string) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename, { timeout: 60000 }).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/configs/${scanConfigId}/metadata`,
        auth: {
          bearer: json.token,
        },
        body: { name: scanName },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 409) {
          cy.log("Scan name already updated");
        } else if (response.status == 200) {
          cy.log("Scan name update successfully");
        } else {
          throw new Error(
            `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
          );
        }
      });
    });
  }
}

export default new ScanManagementService();
