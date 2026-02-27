import { User } from "../../fixtures/interfaces/user.interface";

class AuthService {
  interceptToken() {
    cy.intercept({
      method: "POST",
      url: "oauth2/token",
      times: 1,
    }).as("getToken");
  }

  saveTokenToFile(user: User) {
    const fileName = user.tokenLink;
    if (!fileName) {
      throw new Error(`${user.name} doesn't have defined path to store token`);
    }

    cy.wait("@getToken", { timeout: 60000 }).then((interception) => {
      expect(interception.response.statusCode).to.be.eq(200);
      const userToken = {
        email: user.email,
        token: interception.response.body.access_token,
      };
      cy.writeFile(fileName, userToken);
    });
  }

  interceptChangePassword(alias: string) {
    cy.intercept({
      method: "POST",
      url: "/api/user/forgot-password",
    }).as(alias);
  }

  verifyChangePassword(alias: string) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
  }

  interceptForgotPassword(alias: string) {
    cy.intercept({
      method: "POST",
      url: "/api/access-management/users/forgot-password",
    }).as(alias);
  }

  verifyForgotPassword(alias: string) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 201);
  }
}

export default new AuthService();
