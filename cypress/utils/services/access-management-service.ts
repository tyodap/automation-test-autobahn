import { Organization } from "../../fixtures/interfaces/organization.interface";
import { User } from "../../fixtures/interfaces/user.interface";

class AccessManagementService {
  get baseServiceUrl() {
    return "api/access-management";
  }
  interceptUnblockUser(user: User, alias: string) {
    cy.intercept({
      method: "PATCH",
      url: `**/${user.uid}/unblock`,
    }).as(alias);
  }

  interceptBlockUser(user: User, alias: string) {
    cy.intercept({
      method: "PATCH",
      url: `**/${user.uid}/block`,
    }).as(alias);
  }

  interceptInvitationEmail(user: User, alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/users/resend-verification-email`,
    }).as(alias);
  }

  interceptDeleteRequest(user: User, alias: string) {
    cy.intercept({
      method: "DELETE",
      url: `**/${this.baseServiceUrl}/users/**`,
    }).as(alias);
  }

  interceptGetSettingPersonal(alias: string) {
    cy.intercept({
      method: "GET",
      url: `**/${this.baseServiceUrl}/settings/personal`,
    }).as(alias);
  }

  interceptGetActiveOrg(user: User, alias: string) {
    cy.intercept({
      method: "GET",
      url: `**/${this.baseServiceUrl}/users/${user.email}/active-organization`,
    }).as(alias);
  }

  unblockUser(authorizedUser: User, userToUnblock: User) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "PATCH",
        url: `${this.baseServiceUrl}/users/${userToUnblock.uid}/unblock`,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 409) {
          cy.log("User already active");
        } else if (response.status == 200) {
          cy.log("Unblock user success");
        } else {
          throw new Error(
            `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
          );
        }
      });
    });
  }

  interceptChangeRole(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/users/change-role`,
    }).as(alias);
  }

  changeRole(
    authorizedUser: User,
    user: User,
    requestRole: "general-user" | "org-admin"
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
        url: `${this.baseServiceUrl}/users/change-role`,
        auth: {
          bearer: json.token,
        },
        body: {
          user_id: user.uid,
          user_role: requestRole,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 409) {
          cy.log(
            `Requested role for user is already set. ${user.email} ${requestRole}`
          );
        } else if (response.status == 201) {
          cy.log(`Setting ${requestRole} role to ${user.email}`);
        } else {
          throw new Error(
            `Error: ${response.status} - invalid token. Expected status codes are 409 or 201`
          );
        }
      });
    });
  }

  verifyChangeRole(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 201);
  }

  verifyUnblockUser(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  verifyBlockUser(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  verifyResendInvitation(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 201);
  }

  verifyGetSettingsPersonal(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  verifyDeletUser(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  verifyActiveOrg(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  switchOrganisation(authorizedUser: User, targetOrg: Organization) {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/organization/${targetOrg.orgId}`,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 409) {
          cy.log("User already active");
        } else if (response.status == 200) {
          cy.log("Org switch successfull");
        } else {
          throw new Error(
            `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
          );
        }
      });
    });
  }
}
export default new AccessManagementService();
