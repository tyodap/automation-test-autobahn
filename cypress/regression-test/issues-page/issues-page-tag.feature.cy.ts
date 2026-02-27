import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { presetsProd, presetsTest } from "../../fixtures/constants/preset";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issues from "../../utils/pages/issues";
import vulnerabilityManagementService from "../../utils/services/vulnerability-management-service";

describe("Add and remove issue tag from issues page", () => {
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
    vulnerabilityManagementService.removeTags(orgOwner, testIssues.tag[0], [
      testIssues.issueId,
    ]);
  });

  after(() => {
    vulnerabilityManagementService.removeTags(orgOwner, testIssues.tag[0], [
      testIssues.issueId,
    ]);
  });

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Issues);
  });

  it("Should be able to add tag from issues page", () => {
    /**
     * 1. Select preset for the issues
     * 2. Add issue tag
     * 3. Verify issue tag is added
     */
    issues.selectPreset(testPreset);

    issues.addTag(testIssues.tag[0]);
    cy.reload();
    table.isLoaded(tables["Issues List - Optional"]),
      issues.checkTagPresence(
        tables["Issues List - Optional"],
        "Issue tags",
        testIssues.tag[0]
      );

    table.isColumnValueMatch(
      tables["Issues List - Optional"],
      "Issue tags",
      testIssues.tag
    );
  });

  it("Should be able to remove tag from issues page", () => {
    /**
     * 1. Select preset for the issues
     * 2. Remove issue tag
     * 3. Verify issue tag is removed
     */
    issues.selectPreset(testPreset);

    issues.removeTag(testIssues.tag[0]);
    cy.reload();
    table.isLoaded(tables["Issues List - Optional"]),
      issues.checkTagPresence(
        tables["Issues List - Optional"],
        "Issue tags",
        "None"
      );

    table.isColumnValueMatch(tables["Issues List - Optional"], "Issue tags", [
      "None",
    ]);
  });
});
