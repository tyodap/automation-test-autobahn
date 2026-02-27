import { usersProd, usersTest } from "../../fixtures/constants/user";
import login from "../../utils/pages/login";
import authService from "../../utils/services/auth-service";
import mailosaur from "../../utils/services/mailosaur";

describe("Forgot password login page", () => {
  const envUrl = Cypress.config().baseUrl;

  const testUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const errorMsg =
    "Thank you, if the email address was correct and your organization doesn't use Single Sign On, you will receive a reset password email.";

  const alias = `password-reset-${testUser.name}`;

  it("Should be able to forgot password on login page", () => {
    /**
     * 1. Go to login page and click forgot password
     * 2. Verify the message show up
     * 3. Verify the forgot pasword email show up in mailosaur
     */
    cy.visit(envUrl);
    login.resetPassword.click();

    authService.interceptForgotPassword(alias);
    login.resetPasswordEmail.type(testUser.email).blur();
    login.resetPasswordEmail.should("have.value", testUser.email);
    login.confirmPasswordReset.click();
    login.alertMsg.should("contain.text", errorMsg);
    authService.verifyForgotPassword(alias);
    mailosaur.checkResetPasswordEmail(testUser);
  });
});
