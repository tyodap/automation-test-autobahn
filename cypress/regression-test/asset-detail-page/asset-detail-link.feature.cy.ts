import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import assetDetail from "../../utils/pages/asset-detail";
import issueDetail from "../../utils/pages/issue-detail";

describe("Asset detail link page", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Asset Details Prod Env"]
      : assetTest["Asset Details Test Env"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Smoke test issue detail - prod"]
      : issuesTest["Update tag issues - test"];

  beforeEach(() => {
    cy.loginUsingSession(orgAdmin);
    cy.visit(`${pages["Asset Details"].url}/${testAsset.assetId}`);
    cy.url().should("include", testAsset.assetId, { timeout: 30000 });
  });

  it("Should be able to open issue detail from asset detail page", () => {
    /**
     * 1. Filter the issue
     * 2. Open the issue
     * 3. Verified the issue is correct
     */
    table.filterSearch(
      tables["Asset Details - Issue Details"],
      "Issue",
      testIssue.issue
    );
    table.isColumnValueMatch(tables["Asset Details - Issue Details"], "Issue", [
      testIssue.issue,
    ]);
    table.clickOnColumnValueOrLink(
      tables["Asset Details - Issue Details"],
      "Issue"
    );
    issueDetail.verifyLink(testIssue);
    issueDetail.issueTitle.should("contain", testIssue.issue);
    assetDetail.backAssetDetails.click();
    assetDetail.assetName.should("be.visible", { timeout: 60000 });
    assetDetail.assetName.should("have.text", testAsset.domainName[0], {
      timeout: 60000,
    });
  });
});
