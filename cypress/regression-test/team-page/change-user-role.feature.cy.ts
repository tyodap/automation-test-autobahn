import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import team from "../../utils/pages/team";
import table from "../../utils/components/table";
import accessManagementService from "../../utils/services/access-management-service";
import userMenu from "../../utils/components/user-menu";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Change user role", () => {
  const testUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Change Role Prod Env"]
      : usersTest["Change Role Test Env"];

  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  it("Should be able to change general user to admin", () => {
    cy.openPageUsingSession(orgOwner, pages.Team);
    accessManagementService.changeRole(orgOwner, testUser, "general-user");
    cy.reload();

    table.filterSearch(tables.Team, "Email", testUser.email);
    table.isOnlyValueInColumn(tables.Team, "Role", testUser.role[0]);
    team.changeRole(testUser, "Admin");
    table.isOnlyValueInColumn(tables.Team, "Role", "Admin");
  });

  it("Should be able to login as admin", () => {
    cy.login(testUser);
    userMenu.userRole.should("have.text", "Admin");
  });
});
