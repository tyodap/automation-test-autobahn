import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { presetsProd, presetsTest } from "../../fixtures/constants/preset";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import issues from "../../utils/pages/issues";
import vulnerabilityManagementService from "../../utils/services/vulnerability-management-service";

describe("Add and remove issue assignee", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testIssues =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Update tag issues - prod"]
      : issuesTest["Update tag issues - test"];

  const testPreset =
    Cypress.env("environment") === "PROD"
      ? presetsProd["update tag issues page - prod"]
      : presetsTest["update tag issues page - test"];

  before(() => {
    cy.loginUsingSession(orgOwner);
    vulnerabilityManagementService.removeIssueAssignee(
      orgOwner,
      [orgOwner.uid],
      [testIssues.issueId]
    );
  });

  after(() => {
    vulnerabilityManagementService.removeIssueAssignee(
      orgOwner,
      [orgOwner.uid],
      [testIssues.issueId]
    );
  });

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Issues);
  });

  it("Should be able to add assignee to the issues", () => {
    /**
     * 1. Select preset for the issues
     * 2. Add issue assignee
     * 3. Verify issue assignee is added
     */
    issues.selectPreset(testPreset);
    issues.addIssueAssignee(orgOwner);
    cy.reload();
    issues.assignedAvatar.should("be.visible").contains(orgOwner.initial);
  });

  it("Should be able to remove assignee from the issues", () => {
    /**
     * 1. Select preset for the issues
     * 2. Remove issue assignee
     * 3. Verify issue assignee is removed
     */
    issues.selectPreset(testPreset);
    issues.removeIssueAssignee(orgOwner);
    cy.reload();
    issues.unassignedAvatar
      .should("be.visible")
      .should("not.contain", orgOwner.initial);
  });
});
