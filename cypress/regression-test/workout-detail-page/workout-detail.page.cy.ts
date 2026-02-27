import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import table from "../../utils/components/table";
import workoutDetails from "../../utils/pages/workout-detail";

describe("Workout detail regression", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Update OpenSSH"]
      : workoutsTest["Secure SSH"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["Smoke Workout Details Prod"]
      : assetTest["Smoke Workout Details Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Workouts);
    cy.visit(`${pages.Workouts.url}/${testWorkout.instanceId}`);
  });

  it("Should open workout details", () => {
    /**
     * Test case
     * 1. Verify that download button is visible
     * 2. Verify that Jira button not visible
     * 3. Verify that workout detail table is visible
     */

    workoutDetails.verifyPage(testWorkout);

    workoutDetails.downloadButton.should("be.visible");
    workoutDetails.shareButton.should("be.visible");

    workoutDetails.expandTable.click();
    table.isTableHeadersVisible(tables["Setup workout details tab"]);
  });

  it("Should be able to filter all columns on 'Setup tab'", () => {
    /**
     * 1. Verify filter all column in workout details
     */
    workoutDetails.expandTable.should("be.visible").click();
    table.isTableHeadersVisible(tables["Setup workout details tab"]);
    table.getAllTableRows(tables["Setup workout details tab"]);

    //Filter by Asset
    table.runFilterSearch(
      tables["Setup workout details tab"],
      "Asset",
      testAsset.assetDomain
    );

    //Filter by IP address
    table.runFilterSearch(
      tables["Setup workout details tab"],
      "IP Address",
      testAsset.ipAddress
    );

    //Filter by Hostnames
    table.runFilterSearch(
      tables["Setup workout details tab"],
      "Hostnames",
      testAsset.assetDomain
    );

    //Filter by Max severity
    table.runFilterCheckbox(
      tables["Setup workout details tab"],
      "Max severity",
      testAsset.maxSeverityValue,
      testAsset.maxSeverity
    );

    //Filter by Last detected
    table.runFilterDate(
      tables["Setup workout details tab"],
      "Last detected",
      testAsset.lastScanned,
      testAsset.lastScannedValue
    );

    //Filter by Assignee
    table.filterInputCheckbox(
      tables["Setup workout details tab"],
      "Asset Assignees",
      null,
      null,
      testAsset.assignee[0]
    );
    table.isColumnValueMatch(
      tables["Setup workout details tab"],
      "Asset Assignees",
      [testAsset.assignee[0].initial]
    );
    table.resetFilter(tables["Setup workout details tab"], "Asset Assignees");
    table
      .getAllTableRows(tables["Setup workout details tab"])
      .should("be.visible");

    //Filter Asset tags
    table.runFilterSearch(
      tables["Setup workout details tab"],
      "Asset Tags",
      testAsset.tag[0]
    );
  });
});
