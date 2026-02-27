import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import scanReport from "../../utils/pages/scan-report";
import vulnerabilityManagementService from "../../utils/services/vulnerability-management-service";

describe("Add and remove issue tag on scan report page", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Update issue in scan report - prod"]
      : issuesTest["Update issue in scan report - test"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Scan for update issue in scan report - prod"]
      : scansTest["Scan for update issue in scan report - test"];

  before(() => {
    cy.loginUsingSession(orgOwner);
    vulnerabilityManagementService.removeTags(orgOwner, testIssue.tag[0], [
      testIssue.issueId,
    ]);
  });

  after(() => {
    vulnerabilityManagementService.removeTags(orgOwner, testIssue.tag[0], [
      testIssue.issueId,
    ]);
  });

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
    scanReport.openScanReport(testScan);
  });

  it("Should be able to add tag from scan report page", () => {
    /**
     * 1. Filter the issues
     * 2. Add issue tag
     * 3. Verify issue tag is added
     */
    table
      .getAllTableRows(tables["Scan report individual issues"])
      .should("be.visible");
    table.filterSearch(
      tables["Scan report individual issues"],
      "Issue",
      testIssue.issue
    );
    table.isColumnValueMatch(tables["Scan report individual issues"], "Issue", [
      testIssue.issue,
    ]);

    scanReport.addTag(testIssue.tag[0]);
    cy.reload();
    table.isLoaded(tables["Scan report individual issues"]),
      scanReport.checkTagPresence(
        tables["Scan report individual issues"],
        "Tag",
        testIssue.tag[0]
      );
    table.isColumnValueMatch(
      tables["Scan report individual issues"],
      "Tag",
      testIssue.tag
    );
  });

  it("Should be able to remove tag from scan report page", () => {
    /**
     * 1. Filter the issues
     * 2. Remove issue tag
     * 3. Verify issue tag is removed
     */
    table
      .getAllTableRows(tables["Scan report individual issues"])
      .should("be.visible");
    table.filterSearch(
      tables["Scan report individual issues"],
      "Issue",
      testIssue.issue
    );
    table.isColumnValueMatch(tables["Scan report individual issues"], "Issue", [
      testIssue.issue,
    ]);

    scanReport.removeTag(testIssue.tag[0]);
    cy.reload();
    table.isLoaded(tables["Scan report individual issues"]),
      scanReport.checkTagPresence(
        tables["Scan report individual issues"],
        "Tag",
        "None"
      );
    table.isColumnValueMatch(tables["Scan report individual issues"], "Tag", [
      "None",
    ]);
  });
});