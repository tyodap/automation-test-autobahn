import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issueDetail from "../../utils/pages/issue-detail";
import vulnerabilityManagementService from "../../utils/services/vulnerability-management-service";

describe("Add and remove tag from issue detail page", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Regression Owner Prod 2"]
      : usersTest["Regression Owner"];

  const testIssueDetail =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Update tag issues - prod"]
      : issuesTest["Update tag issues - test"];

  before(() => {
    cy.loginUsingSession(orgOwner);
    vulnerabilityManagementService.removeTags(
      orgOwner,
      testIssueDetail.tag[0],
      [testIssueDetail.issueId]
    );
  });

  after(() => {
    vulnerabilityManagementService.removeTags(
      orgOwner,
      testIssueDetail.tag[0],
      [testIssueDetail.issueId]
    );
  });

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
    issueDetail.openIssueDetail(testIssueDetail);
  });

  it("Should  be able to change tag from issue detail page", () => {
    /**
     * 1. Open issue detail page
     * 2. Add issue tag
     * 3. Verify issue tag is added
     */
    issueDetail.issueName.should("have.text", testIssueDetail.issue, {
      timeout: 80000,
    });

    issueDetail.addTag(testIssueDetail.tag[0]);
    cy.reload();
    table.isLoaded(tables["Issue detail"]),
      issueDetail.checkTagPresence(
        tables["Issue detail"],
        "Tags",
        testIssueDetail.tag[0]
      );
    table.isColumnValueMatch(
      tables["Issue detail"],
      "Tags",
      testIssueDetail.tag
    );
  });

  it("Should be able to remove tag from issue detail page", () => {
    /**
     * 1. Open issue detail page
     * 2. Remove issue tag
     * 3. Verify issue tag is added
     */
    issueDetail.issueName.should("have.text", testIssueDetail.issue, {
      timeout: 80000,
    });

    issueDetail.removeTag(testIssueDetail.tag[0]);
    cy.reload();
    table.isLoaded(tables["Issue detail"]),
      issueDetail.checkTagPresence(tables["Issue detail"], "Tags", "None");
    table.isColumnValueMatch(tables["Issue detail"], "Tags", ["None"]);
  });
});
