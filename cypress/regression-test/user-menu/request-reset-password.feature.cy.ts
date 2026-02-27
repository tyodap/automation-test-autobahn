import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import setting from "../../utils/pages/setting";
import authService from "../../utils/services/auth-service";
import mailosaur from "../../utils/services/mailosaur";

describe("Request password change", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  it("Should be able to request change password on personal setting", () => {
    /**
     * 1. Go to setting page
     * 2. Click change password
     * 3. Verify email come in to inbox
     */
    cy.openPageUsingSession(orgOwner, pages.Settings);

    const alias = `Change password-${orgOwner.name}`;
    authService.interceptChangePassword(alias);
    setting.changePassword.click();
    modal.modalTitle("Request password change").should("be.visible");
    modal.approveActionButton.contains("Request Email").click();
    authService.verifyChangePassword(alias);
    cy.wait(5000);
    mailosaur.checkResetPasswordEmail(orgOwner);
  });
});
