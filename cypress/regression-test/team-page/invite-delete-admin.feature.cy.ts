import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import team from "../../utils/pages/team";
import mailosaur from "../../utils/services/mailosaur";

describe("Invite and delete an admin", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Delete Admin Prod"]
      : usersTest["Delete Admin Test"];

  before(() => {
    mailosaur.clearUserMailbox(testAdmin);
  });

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Team);
  });

  it("Should be able to add new member as admin", () => {
    /**
     * 1. Open the team page
     * 2. Invite new member as admin
     * 3. Verify the invitation from mailosaur
     */
    team.inviteUser.click();
    team.inputEmail.type(testAdmin.email);
    team.checkButton.click();
    team.setRole("Admin");
    team.inputFirstName.type("Delete").blur();
    team.inputLastName.type("Admin").blur();
    cy.wait(1000);
    team.inputFirstName.should("have.value", "Delete");
    team.inputLastName.should("have.value", "Admin");
    team.inviteButton.click();

    team.inviteMemberDrawer.should(
      "contain.text",
      "Invitation successfully sent"
    );
    team.inviteMemberDrawer.should("contain.text", testAdmin.name);
  });

  it("Should be able to delete pending admin", () => {
    /**
     * 1. Open the team page
     * 2. Filter the new admin member
     * 3. Delete the new admin member
     */
    table.filterSearch(tables.Team, "Email", testAdmin.email);
    table.isColumnValueMatch(tables.Team, "Status", ["Pending"]);
    team.deleteUser(testAdmin);
    table.isTableEmpty(tables.Team);
  });
});
