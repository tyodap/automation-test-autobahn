import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import team from "../../utils/pages/team";
import accessManagementService from "../../utils/services/access-management-service";
import mailosaur from "../../utils/services/mailosaur";

describe("Deactive user", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const deactiveUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Deactivate User"]
      : usersTest["Deactivate User"];

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Team);
    accessManagementService.unblockUser(orgOwner, deactiveUser);
    mailosaur.clearUserMailbox(deactiveUser);
  });

  it("Should be able to deactive user", () => {
    /**
     * 1. Search the user
     * 2. Deactive the user
     */
    table.filterSearch(tables.Team, "Email", deactiveUser.email);
    table.isColumnValueMatch(tables.Team, "Email", [deactiveUser.email]);
    team.blockUser(deactiveUser);
    team.activateUser(deactiveUser);
  });
});
