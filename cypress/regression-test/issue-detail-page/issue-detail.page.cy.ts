import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issueDetail from "../../utils/pages/issue-detail";

describe("Issue detail regression test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testIssueDetail =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Smoke test issue detail - prod"]
      : issuesTest["Smoke test issue detail - test"];

  beforeEach(() => {
    cy.loginUsingSession(orgAdmin);
    issueDetail.openIssueDetail(testIssueDetail);
  });

  it("Should be able to open issue detail page", () => {
    /**
     * 1. Verify issue detail card is visible
     * 2. Verify issue detail overview card is visible
     * 3. Verify issue detail table is visible
     */
    issueDetail.issueDetailCard.should("be.visible");
    issueDetail.issueOverviewCard.should("be.visible");
    table.isTableHeadersVisible(tables["Issue detail"]);
  });

  it("Should be able to filter all column on 'Issue detail' table", () => {
    /**
     * 1. Verify all column in the issue detail
     */
    table.isLoaded(tables["Issue detail"]);

    //Filter by status column
    table.runFilterCheckbox(
      tables["Issue detail"],
      "Status",
      [testIssueDetail.statusValue],
      [testIssueDetail.status]
    );

    //Filter by asset column
    table.runFilterSearch(
      tables["Issue detail"],
      "Asset",
      testIssueDetail.asset
    );

    //Filter by protocol column
    table.runFilterSearch(
      tables["Issue detail"],
      "Protocol",
      testIssueDetail.protocol
    );

    //Filter by port column
    table.runFilterSearch(tables["Issue detail"], "Port", testIssueDetail.port);

    //Filter by service column
    table.runFilterSearch(
      tables["Issue detail"],
      "Service",
      testIssueDetail.service
    );

    //Filter by banner column
    table.runFilterSearch(
      tables["Issue detail"],
      "Banner",
      testIssueDetail.banner
    );

    //Filter by network column
    table.runFilterCheckbox(
      tables["Issue detail"],
      "Network",
      [testIssueDetail.networkValue],
      [testIssueDetail.network]
    );

    //Filter by tags column
    table.runFilterCheckbox(
      tables["Issue detail"],
      "Tags",
      testIssueDetail.tag
    );

    //Filter by last detected column
    table.runFilterDate(
      tables["Issue detail"],
      "Last detected",
      testIssueDetail.lastDetectedValue,
      testIssueDetail.lastDetected
    );

    //Filter by first reported column
    table.runFilterDate(
      tables["Issue detail"],
      "First reported",
      testIssueDetail.firstReportedValue,
      testIssueDetail.firstReported
    );
  });
});
