import team from "../../utils/pages/team";
import { usersProd } from "../../fixtures/constants/user";
import { usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import table from "../../utils/components/table";

describe("Team page smoke test ", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const defaultPageValue = "50";

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Team);
  });

  it("Should contain table and invite button", () => {
    /**
     * Test case
     * 1. Verify that table headers is visible
     * 2. Verify that all table rows is visible
     * 3. Verify that invite member button is visible
     * 4. Verify that invite member drawer is visible after clicking invite member
     * 5. Verify that invite member drawer button is all present
     */
    table.isTableHeadersVisible(tables.Team);
    table.getAllTableRows(tables.Team).should("be.visible");
    team.inviteUser.should("be.visible").click();
    team.inviteMemberDrawer.should("be.visible").within(() => {
      team.inputEmail.should("be.visible");
      team.checkButton.should("be.visible");
      team.clearFormButton.should("be.visible");
    });
  });

  it("Should be able to filter all column", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Status
    table.runFilterCheckbox(tables.Team, "Status", ["active"]);

    //Filter by Email
    table.runFilterSearch(tables.Team, "Email", orgAdmin.email);

    //Filter by Role
    table.runFilterCheckbox(tables.Team, "Role", ["org-owner"], orgAdmin.role);

    //Filter by Phone
    table.runFilterSearch(tables.Team, "Phone", orgAdmin.phoneNumber);

    //Filter by Job
    table.runFilterSearch(tables.Team, "Job", orgAdmin.jobTitle);
  });

  it("Should be able to sort all column", () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     */
    //Sort by Status
    table.runSort(tables.Team, "Status", "ascending", defaultPageValue);
    table.runSort(tables.Team, "Status", "descending", defaultPageValue);

    //Sort by Member
    table.runSort(tables.Team, "Member", "ascending", defaultPageValue);
    table.runSort(tables.Team, "Member", "descending", defaultPageValue);

    //Sort by Email
    table.runSort(tables.Team, "Email", "ascending", defaultPageValue);
    table.runSort(tables.Team, "Email", "descending", defaultPageValue);

    //Sort by Role
    table.runCustomSort(tables.Team, "Role", "ascending", defaultPageValue);
    table.runCustomSort(tables.Team, "Role", "descending", defaultPageValue);

    //Sort by Phone
    table.runSort(tables.Team, "Phone", "ascending", defaultPageValue);
    table.runSort(tables.Team, "Phone", "descending", defaultPageValue);

    //Sort by Job
    table.runSort(tables.Team, "Job", "ascending", defaultPageValue);
    table.runSort(tables.Team, "Job", "descending", defaultPageValue);
  });

  it("Should be able to verify pagination", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    table.runChangePagination(tables.Team, "Email", defaultPageValue);
  });
});
