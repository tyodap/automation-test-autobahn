import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { pages } from "../../fixtures/constants/pages";
import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import table from "../../utils/components/table";
import assetDetail from "../../utils/pages/asset-detail";
import issueDetail from "../../utils/pages/issue-detail";
import scanReport from "../../utils/pages/scan-report";
import scanning from "../../utils/pages/scanning";
import workoutDetail from "../../utils/pages/workout-detail";

describe("Scan report link page", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["Initial Scan Prod"]
      : scansTest["Initial Scan Test"];

  const testWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Update JQuery"]
      : workoutsTest["Secure SSH"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Filter Check Prod"]
      : issuesTest["Filter Check Test"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Filter Check Scan Report Prod"]
      : assetTest["Filter Check Scan Report Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Scanning);
    table.filterSearch(tables["All Scans"], "Scan", testScan.scanName);
    table.isColumnValueMatch(tables["All Scans"], "Scan", [testScan.scanName]);
    scanning.scanButton.contains(testScan.scanName).click();

    cy.url().should("include", testScan.scanId, { timeout: 30000 });
    scanReport.scanName.should("be.visible", {
      timeout: 80000,
    });
    scanReport.scanName.should("have.text", testScan.scanName, {
      timeout: 80000,
    });
  });

  it("Should be able to open workout from scan report page", () => {
    /**
     * 1. Filter the workout
     * 2. Open the workout
     * 3. Verified the workout is correct
     */
    table.filterSearch(
      tables["Scan report workouts"],
      "Workout",
      testWorkout.name
    );
    table.isColumnValueMatch(tables["Scan report workouts"], "Workout", [
      testWorkout.name,
    ]);
    table.clickOnColumnValueOrLink(tables["Scan report workouts"], "Workout");
    workoutDetail.verifyPage(testWorkout);
  });

  it("Should be able to open issue detail from scan report page", () => {
    /**
     * 1. Filter the issue
     * 2. Open the issue
     * 3. Verified the issue is correct
     */
    table.filterSearch(
      tables["Scan report individual issues"],
      "Issue",
      testIssue.issue
    );
    table.isColumnValueMatch(tables["Scan report individual issues"], "Issue", [
      testIssue.issue,
    ]);
    table.clickOnColumnValueOrLink(
      tables["Scan report individual issues"],
      "Issue"
    );
    issueDetail.verifyLink(testIssue);
    issueDetail.issueTitle.should("contain", testIssue.issue);
    scanReport.backScanReport.click();
    scanReport.scanName.should("be.visible", {
      timeout: 80000,
    });
  });

  it("Should be able to open asset from scan report page", () => {
    /**
     * 1. Filter the asset
     * 2. Open the asset
     * 3. Verified the asset is correct
     */
    table.filterSearch(
      tables["Scan report assets"],
      "Asset",
      testAsset.assetDomain
    );
    table.isColumnValueMatch(tables["Scan report assets"], "Asset", [
      testAsset.assetDomain,
    ]);
    table.clickOnColumnValueOrLink(tables["Scan report assets"], "Asset");
    assetDetail.verifyLink(testAsset);
    assetDetail.assetName.should("contain", testAsset.assetDomain);
    scanReport.backScanReport.click();
    scanReport.scanName.should("be.visible", {
      timeout: 80000,
    });
  });
});
