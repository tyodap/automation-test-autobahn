import {
  organizationsProd,
  organizationsTest,
} from "../../fixtures/constants/organization";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import userMenu from "../../utils/components/user-menu";
import login from "../../utils/pages/login";
import setting from "../../utils/pages/setting";

describe("Setting menu", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Change Org Admin"]
      : usersTest["Change Org Test"];

  const searchOrg =
    Cypress.env("environment") === "PROD"
      ? organizationsProd["Smoke Test Org Prod"]
      : organizationsTest["Smoke Test Org"];

  it("Should be able to verify user menu clicking", () => {
    /**
     * 1. Verify open setting
     * 2. Verify search organization
     * 3. Verify logout
     */

    cy.login(orgOwner);

    //Open setting page
    userMenu.openSettings();
    setting.firstNameInput.should("be.visible");
    setting.lastNameInput.should("be.visible");

    //Search organization
    userMenu.userMenu.click();
    userMenu.search.first().type(searchOrg.name);
    userMenu.orgSearching.contains(searchOrg.name, {
      timeout: 10000,
    });

    //Logout
    userMenu.logout.first().click();
    login.emailSelector.should("be.visible");
    login.passwordSelector.should("be.visible");
  });
});
