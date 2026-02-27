import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { presetsProd, presetsTest } from "../../fixtures/constants/preset";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issues from "../../utils/pages/issues";
import dataWarehouse from "../../utils/services/data-warehouse";
import vulnerabilityManagementService from "../../utils/services/vulnerability-management-service";

describe("Issue tag smoke test", () => {
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

  it("Should be able to add and remove issue tag", () => {
    /**
     * 1. Verify add issue tag
     * 2. Verify remove issue tag
     */
    cy.openPageUsingSession(orgOwner, pages.Issues);
    vulnerabilityManagementService.removeTags(orgOwner, testIssues.tag[0], [
      testIssues.issueId,
    ]);

    issues.selectPreset(testPreset);

    //Add issue tag
    table.singleCheckboxBulkSelect.last().click();
    dataWarehouse.interceptIssueTags("tag");
    issues.editTagsButton.click();
    dataWarehouse.verifyIssueTags("tag");
    issues.addTags.click({ force: true });
    issues.addTagPlaceholder
      .type(testIssues.tag[0], { force: true })
      .type("{enter}", { force: true });
    issues.addTags.click({ force: true });
    issues.applyButton.click();
    issues.tagsUpdateNotification.should("be.visible");

    cy.reload();
    issues.checkTagPresence(
      tables["Issues List - Optional"],
      "Issue tags",
      testIssues.tag[0]
    );

    //Remove issue tag
    table.singleCheckboxBulkSelect.last().click();
    dataWarehouse.interceptIssueTags("tag");
    issues.editTagsButton.click();
    dataWarehouse.verifyIssueTags("tag");
    issues.removeTags.click({ force: true });
    cy.wait(2000);
    issues.removeTagPlaceholder.type("{enter}", { force: true });
    issues.applyButton.click();
    issues.tagsUpdateNotification.should("be.visible");
  });
});
