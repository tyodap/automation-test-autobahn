import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { presetsProd, presetsTest } from "../../fixtures/constants/preset";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issues from "../../utils/pages/issues";
import vulnerabilityManagementService from "../../utils/services/vulnerability-management-service";

describe("Change issue status on Issues page", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Change issue status - prod"]
      : issuesTest["Change issue status - test"];

  const testPreset =
    Cypress.env("environment") === "PROD"
      ? presetsProd["e2e-change-issues"]
      : presetsTest["change-issue-status"];

  it("Change issue status to remediated", () => {
    /**
     * 1. Choose preset for filter the issue
     * 2. Change issue to remediated
     */
    cy.openPageUsingSession(orgAdmin, pages["Issues"]);
    vulnerabilityManagementService.updateIssueStatus(
      orgAdmin,
      [testIssue],
      "Active"
    );

    issues.selectPreset(testPreset);

    table.singleCheckboxBulkSelect.last().click();
    issues.markIssueAsButton.click();
    issues.markIssueAs("Remediated");
    issues.successUpdateIssueNotification.should("be.visible");
  });
});
