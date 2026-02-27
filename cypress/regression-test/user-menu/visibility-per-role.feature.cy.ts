import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import sidebar from "../../utils/components/sidebar";
import userMenu from "../../utils/components/user-menu";

describe("Verify menu per user role", () => {
  const owner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const admin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Admin Smoke Prod"]
      : usersTest["Admin Smoke Test"];

  const user =
    Cypress.env("environment") === "PROD"
      ? usersProd["GU Smoke Prod"]
      : usersTest["GU Smoke Test"];

  it("Should be able verify menu as owner", () => {
    /**
     * 1. Verify owner can open dashboard page
     * 2. Verify owner can open workouts page
     * 3. Verify owner can open issues page
     * 4. Verify owner can open assets page
     * 5. Verify owner can open integrations page
     * 6. Verify owner can open scanning page
     * 7. Verify owner can open settings page
     */

    cy.login(owner);
    userMenu.userRole.should("have.text", "Owner");
    cy.verifyIfOpen(pages.Dashboard);
    sidebar.openMenu(pages.Workouts);
    sidebar.openMenu(pages.Issues);
    sidebar.openMenu(pages.Assets);
    sidebar.openMenu(pages.Integrations);
    sidebar.openMenu(pages.Scanning);
    sidebar.openMenu(pages.Team);
    userMenu.openSettings();
  });

  it("Should be able verify menu as admin", () => {
    /**
     * 1. Verify admin can open dashboard page
     * 2. Verify admin can open workouts page
     * 3. Verify admin can open issues page
     * 4. Verify admin can open assets page
     * 5. Verify admin can open integrations page
     * 6. Verify admin can open scanning page
     * 7. Verify admin can open settings page
     */

    cy.login(admin);
    userMenu.userRole.should("have.text", "Admin");
    cy.verifyIfOpen(pages.Dashboard);
    sidebar.openMenu(pages.Workouts);
    sidebar.openMenu(pages.Issues);
    sidebar.openMenu(pages.Assets);
    sidebar.openMenu(pages.Integrations);
    sidebar.openMenu(pages.Scanning);
    sidebar.openMenu(pages.Team);
    userMenu.openSettings();
  });

  it("Should be able verify menu as general user", () => {
    /**
     * 1. Verify general user can open workouts page
     * 2. Verify general user can open issues page
     * 3. Verify general user can open assets page
     * 4. Verify general user can open settings page
     */

    cy.login(user);
    userMenu.userRole.should("have.text", "General user");
    sidebar.openMenu(pages.Workouts);
    sidebar.openMenu(pages.Issues);
    sidebar.openMenu(pages.Assets);
    userMenu.openSettings();
  });
});
