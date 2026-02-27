import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import team from "../../utils/pages/team";

describe("Resend invitation", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const pendingUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Pending User"]
      : usersTest["Pending User"];

  it("Should be able to resend an invitation to pending user", () => {
    /**
     * 1. Search the pending user
     * 2. Resend invitation
     * 3. Check email invitation
     */
    cy.openPageUsingSession(orgOwner, pages.Team);
    table.filterSearch(tables.Team, "Email", pendingUser.email);
    table.isColumnValueMatch(tables.Team, "Email", [pendingUser.email]);
    team.resendInvitation(pendingUser);
  });
});
