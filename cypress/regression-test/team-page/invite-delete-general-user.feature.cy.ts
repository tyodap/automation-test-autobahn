import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import team from "../../utils/pages/team";
import mailosaur from "../../utils/services/mailosaur";

describe("Invite and delete an general user", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Delete User Prod"]
      : usersTest["Delete User Test"];

  before(() => {
    mailosaur.clearUserMailbox(testUser);
  });

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Team);
  });

  it("Should be able to add new member as general user", () => {
    /**
     * 1. Open the team page
     * 2. Invite new member as general user
     * 3. Verify the invitation from mailosaur
     */
    team.inviteUser.click();
    team.inputEmail.type(testUser.email);
    team.checkButton.click();
    team.setRole("General user");
    team.inputFirstName.type("Delete").blur();
    team.inputLastName.type("general user").blur();
    cy.wait(1000);
    team.inputFirstName.should("have.value", "Delete");
    team.inputLastName.should("have.value", "general user");
    team.inviteButton.click();

    team.inviteMemberDrawer.should(
      "contain.text",
      "Invitation successfully sent"
    );
    team.inviteMemberDrawer.should("contain.text", testUser.name);
  });

  it("Should be able to delete pending general user", () => {
    /**
     * 1. Open the team page
     * 2. Filter the new general user member
     * 3. Delete the new general user member
     */
    table.filterSearch(tables.Team, "Email", testUser.email);
    table.isColumnValueMatch(tables.Team, "Status", ["Pending"]);
    team.deleteUser(testUser);
    table.isTableEmpty(tables.Team);
  });
});
