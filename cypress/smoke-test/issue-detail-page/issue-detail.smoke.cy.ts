import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issueDetail from "../../utils/pages/issue-detail";

describe("Issue detail smoke test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testIssueDetail =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Smoke test issue detail - prod"]
      : issuesTest["Smoke test issue detail - test"];

  it("Should be able to smoke test issue detail", () => {
    /**
     * 1. Verify issue detail card is visible
     * 2. Verify new issues number is visible
     * 3. Verify active issues number is visible
     * 4. Verify resurfaced issues number is visible
     * 5. Verify Remediated issues number is visible
     * 6. Verify falsePositive issues number is visible
     * 7. Verify issue detail table is loaded
     */
    cy.login(orgAdmin);
    issueDetail.openIssueDetail(testIssueDetail);

    issueDetail.issueDetailCard.should("be.visible");
    issueDetail.totalNewIssues.should("be.visible");
    issueDetail.totalActiveIssues.should("be.visible");
    issueDetail.totalResurfacedIssues.should("be.visible");
    issueDetail.totalRemediatedIssues.should("be.visible");
    issueDetail.totalFalsePositiveIssues.should("be.visible");
    table.isLoaded(tables["Issue detail"]);
  });
});
