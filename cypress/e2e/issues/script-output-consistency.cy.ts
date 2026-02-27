import { pages } from "../../fixtures/constants/pages";
import { presetsProd, presetsTest } from "../../fixtures/constants/preset";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import issues from "../../utils/pages/issues";
import issueDetail from "../../utils/pages/issue-detail";
import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import scanReport from "../../utils/pages/scan-report";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import workoutDetail from "../../utils/pages/workout-detail";

describe("Script output consistency check", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["QC Prod One"]
      : usersTest["Owner Smoke Test"];

  const testPreset =
    Cypress.env("environment") === "PROD"
      ? presetsProd["Script output check"]
      : presetsTest["change-issue-status"];

  const testIssueDetail =
    Cypress.env("environment") === "PROD"
      ? issuesProd["Issue detail prod"]
      : issuesTest["Smoke test issue detail - test"];

  const testWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Harden a database against SQL injection"]
      : workoutsTest["Secure SSH"];

  const scanId = "5203dd33-998c-4eb3-af1a-cc5af6db000b";

  it("Fetch script output from Issues page", () => {
    let issuesScriptOutput;
    let issuesScriptOutputText;

    cy.openPageUsingSession(orgAdmin, pages["Issues"]);
    issues.selectPreset(testPreset);
    cy.wait(3000);

    issuesScriptOutput = table
      .getListOfColumnValues(tables["Issues"], "Script output")
      .then((text) => {
        issuesScriptOutput = text as string[];
        Cypress.env("issuesScriptOutput", issuesScriptOutput);
      });

    table.clickOnColumnValueOrLink(tables["Issues"], "Script output");
    issues.scriptOutputDrawer.should("be.visible");
    cy.wait(2500);
    issuesScriptOutputText = issues.scriptOutputText.then((text) => {
      issuesScriptOutputText = text as string;
      Cypress.env("issuesScriptOutputText", issuesScriptOutputText);
    });
  });

  it("Fetch script output from Issue Details page", () => {
    let issueDetailScriptOutput;
    let issueDetailScriptOutputText;

    cy.login(orgAdmin);
    issueDetail.openIssueDetail(testIssueDetail);

    issueDetailScriptOutput = table
      .getListOfColumnValues(tables["Issue detail"], "Script output")
      .then((text) => {
        issueDetailScriptOutput = text as string[];
        Cypress.env("issueDetailScriptOutput", issueDetailScriptOutput);
      });

    issueDetail.scriptOutputColumn.click();
    issueDetail.scriptOutputDrawer.should("be.visible");
    cy.wait(2500);
    issueDetailScriptOutputText = issueDetail.scriptOutputText.then((text) => {
      issueDetailScriptOutputText = text as string;
      Cypress.env("issueDetailScriptOutputText", issueDetailScriptOutputText);
    });
  });

  it("Fetch script output from Scan Report page", () => {
    let scanReportScriptOutput;
    let scanReportScriptOutputText;

    cy.login(orgAdmin);
    cy.visit(`/scans/${scanId}/report`);

    table.isLoaded(tables["Scan report individual issues"]);
    table.filterSearch(
      tables["Scan report individual issues"],
      "Issue",
      "SQL Injection"
    );
    table.filterCheckbox(tables["Scan report individual issues"], "Severity", [
      "3",
    ]);

    scanReportScriptOutput = table
      .getListOfColumnValues(
        tables["Scan report individual issues"],
        "First detected" // Even though it should be script output, since this part fetch revision of scan report, no bulk action exist so we fetch the previous table to bypass the logic.
      )
      .then((text) => {
        scanReportScriptOutput = text as string[];
        Cypress.env("scanReportScriptOutput", scanReportScriptOutput);
      });

    scanReport.scriptOutputColumn.click();
    scanReport.scriptOutputDrawer.should("be.visible");
    cy.wait(2500);
    scanReportScriptOutputText = scanReport.scriptOutputText.then((text) => {
      scanReportScriptOutputText = text as string;
      Cypress.env("scanReportScriptOutputText", scanReportScriptOutputText);
    });
  });

  it("Fetch script output from Asset preview workout detail page", () => {
    let workoutScriptOutputText;

    cy.login(orgAdmin);
    cy.visit(`${pages.Workouts.url}/${testWorkout.instanceId}`);

    cy.wait(5000);
    workoutDetail.expandTable.click();
    table.filterCheckbox(tables["Workout detail asset"], "Max severity", ["4"]);
    workoutDetail.clickColumnValue("1");
    cy.wait(5000);

    workoutScriptOutputText = table
      .getListOfColumnValues(tables["Asset preview - issue"], "Script output")
      .then((text) => {
        workoutScriptOutputText = text as string[];
        workoutScriptOutputText = workoutScriptOutputText[2];
        Cypress.env("workoutScriptOutputText", workoutScriptOutputText);
      });
  });

  it("Compare script output from all pages", () => {
    const issuesScriptOutput = Cypress.env("issuesScriptOutput");
    const issueDetailScriptOutput = Cypress.env("issueDetailScriptOutput");
    const issuesScriptOutputText = Cypress.env("issuesScriptOutputText");
    const issueDetailScriptOutputText = Cypress.env(
      "issueDetailScriptOutputText"
    );
    const scanReportScriptOutput = Cypress.env("scanReportScriptOutput");
    const scanReportScriptOutputText = Cypress.env(
      "scanReportScriptOutputText"
    );
    const workoutScriptOutputText = Cypress.env("workoutScriptOutputText");

    console.log("Script output issue = " + issuesScriptOutput);
    console.log("Script output issue detail = " + issueDetailScriptOutput);
    console.log("Script output issue text = " + issuesScriptOutputText);
    console.log(
      "Script output issue detail text = " + issueDetailScriptOutputText
    );
    console.log("Script output scan report = " + scanReportScriptOutput);
    console.log(
      "Script output scan report text = " + scanReportScriptOutputText
    );
    console.log(
      "Script output asset preview issue text = " + workoutScriptOutputText
    );

    expect(issuesScriptOutput).to.deep.equal(issueDetailScriptOutput);
    expect(issuesScriptOutput).to.deep.equal(scanReportScriptOutput);
    expect(issuesScriptOutputText).to.equal(issueDetailScriptOutputText);
    expect(issuesScriptOutputText).to.equal(scanReportScriptOutputText);
    expect(
      issuesScriptOutputText
        .replace(/\s+/g, " ") // Replace whitespace and newlines with single space so format is all the same
        .trim()
    ).to.equal(workoutScriptOutputText);
  });
});
