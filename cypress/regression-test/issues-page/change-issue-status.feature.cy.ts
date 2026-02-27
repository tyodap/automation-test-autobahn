import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { presetsProd, presetsTest } from "../../fixtures/constants/preset";
import { tables } from "../../fixtures/constants/table";
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

  before(() => {
    cy.loginUsingSession(orgAdmin);
    vulnerabilityManagementService.updateIssueStatus(
      orgAdmin,
      [testIssue],
      "Active"
    );
  });

  after(() => {
    vulnerabilityManagementService.updateIssueStatus(
      orgAdmin,
      [testIssue],
      "Active"
    );
  });

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages["Issues"]);
  });

  it("Change issue status to remediated", () => {
    /**
     * 1. Choose preset for filter the issue
     * 2. Change issue to remediated
     * 3. Verify status change
     */
    issues.selectPreset(testPreset);

    issues.updateIssueUsingBulkAction("Remediated", tables["Issues"]);
    cy.reload();
    table.isLoaded(tables["Issues"]),
      issues.checkIssueState(tables["Issues"], "Status", "Remediated");
    table.isColumnValueMatch(tables["Issues"], "Status", ["Remediated"]);
  });

  it("Change issue status to false positive", () => {
    /**
     * 1. Choose preset for filter the issue
     * 2. Change issue to false positive
     * 3. Verify status change
     */
    issues.selectPreset(testPreset);

    issues.updateIssueUsingBulkAction("False positive", tables["Issues"]);
    cy.reload();
    table.isLoaded(tables["Issues"]),
      issues.checkIssueState(tables["Issues"], "Status", "False positive");
    table.isColumnValueMatch(tables["Issues"], "Status", ["False positive"]);
  });

  it("Change issue status to risk accepted", () => {
    /**
     * 1. Choose preset for filter the issue
     * 2. Change issue to risk accepted
     * 3. Verify status change
     */
    issues.selectPreset(testPreset);

    issues.updateIssueUsingBulkAction("Risk accepted", tables["Issues"]);
    cy.reload();
    table.isLoaded(tables["Issues"]),
      issues.checkIssueState(tables["Issues"], "Status", "Risk accepted");
    table.isColumnValueMatch(tables["Issues"], "Status", ["Risk accepted"]);
  });

  it("Change issue status to active", () => {
    /**
     * 1. Choose preset for filter the issue
     * 2. Change issue to active
     * 3. Verify status change
     */
    issues.selectPreset(testPreset);
    issues.updateIssueUsingBulkAction("Active", tables["Issues"]);
    cy.reload();
    table.isLoaded(tables["Issues"]),
      issues.checkIssueState(tables["Issues"], "Status", "Active");
    table.isColumnValueMatch(tables["Issues"], "Status", ["Active"]);
  });
});
