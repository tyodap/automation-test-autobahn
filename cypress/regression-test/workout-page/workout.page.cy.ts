import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import table from "../../utils/components/table";
import workout from "../../utils/pages/workout";

describe("Workout regression test", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const testToDoWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Update Apache Log4j"]
      : workoutsTest["Patching Cisco ASA and FTD"];

  const completedWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Harden FTP: Disable FTP service"]
      : workoutsTest["Disable SMB null sessions"];

  const defaultPageValue = "5";

  beforeEach(() => {
    cy.openPageUsingSession(orgOwner, pages.Workouts);
  });

  it("Should open workout page", () => {
    /**
     * Verify table To do workouts visible
     * Verify table Completed workouts visible
     */

    table.isTableHeadersVisible(tables["To do workouts"]);
    workout.completedWorkoutsTitle.click();
    table.isTableHeadersVisible(tables["Completed workouts"]);
  });

  it("Should be able to filter all column on To do workouts", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     */
    //Filter by Workout
    table.runFilterSearch(
      tables["To do workouts"],
      "Workout",
      testToDoWorkout.name
    );

    //Filter by Impact
    table.runFilterSearch(
      tables["To do workouts"],
      "Impact",
      testToDoWorkout.impact
    );

    //Filter by Effort
    table.runFilterCheckbox(
      tables["To do workouts"],
      "Effort",
      ["2"],
      [testToDoWorkout.effort[0]]
    );

    //Filter by Asset tag
    table.runFilterInputCheckbox(
      tables["To do workouts"],
      "Asset tag",
      testToDoWorkout.assetTag[0]
    );

    //Filter by Issue tag
    table.runFilterInputCheckbox(
      tables["To do workouts"],
      "Issue tag",
      testToDoWorkout.issueTag[0]
    );

    //Filter by Issue assignee
    table.filterInputCheckbox(
      tables["To do workouts"],
      "Issue assignee",
      null,
      null,
      testToDoWorkout.issueAssignee[0]
    );
    table.isColumnValueMatch(tables["To do workouts"], "Issue assignee", [
      testToDoWorkout.issueAssignee[0].name,
    ]);
    table.resetFilter(tables["To do workouts"], "Issue assignee");
    table.getAllTableRows(tables["To do workouts"]).should("be.visible");
  });

  it("Should be able to sort all column on To do workouts", () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     */
    //Sort by Workout
    table.runSort(
      tables["To do workouts"],
      "Workout",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["To do workouts"],
      "Workout",
      "descending",
      defaultPageValue
    );

    //Sort by Impact
    table.runNumberSort(
      tables["To do workouts"],
      "Impact",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["To do workouts"],
      "Impact",
      "descending",
      defaultPageValue
    );

    //Sort by Effort
    table.runCustomSort(
      tables["To do workouts"],
      "Effort",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["To do workouts"],
      "Effort",
      "descending",
      defaultPageValue
    );

    //Sort by Asset tag
    table.runSort(
      tables["To do workouts"],
      "Asset tag",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["To do workouts"],
      "Asset tag",
      "descending",
      defaultPageValue
    );

    //Sort by Issue tag
    table.runSort(
      tables["To do workouts"],
      "Issue tag",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["To do workouts"],
      "Issue tag",
      "descending",
      defaultPageValue
    );

    //Sort by Issue assignee
    table.runSort(
      tables["To do workouts"],
      "Issue assignee",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["To do workouts"],
      "Issue assignee",
      "descending",
      defaultPageValue
    );

    //Sort by Affected assets
    table.runNumberSort(
      tables["To do workouts"],
      "Affected assets",
      "ascending",
      defaultPageValue
    );
    table.runNumberSort(
      tables["To do workouts"],
      "Affected assets",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on To do workouts", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    table.runChangePagination(
      tables["To do workouts"],
      "Workout",
      defaultPageValue
    );
  });

  it("Should be able to filter all column on Completed workouts", () => {
    /**
     * Test case
     * 1. Verify that user can filter all column
     *
     * Issue tag has no data, not yet included
     */
    workout.completedWorkoutsTitle.click();

    //Filter by Workout
    table.runFilterSearch(
      tables["Completed workouts"],
      "Workout",
      completedWorkout.name
    );

    //Filter by Effort
    table.runFilterCheckbox(
      tables["Completed workouts"],
      "Effort",
      ["1"],
      [completedWorkout.effort[0]]
    );

    //Filter by Asset tag
    table.runFilterCheckbox(tables["Completed workouts"], "Asset tag", [
      completedWorkout.assetTag[0],
    ]);

    //Filter by Issue tag
    table.runFilterCheckbox(tables["Completed workouts"], "Issue tag", [
      completedWorkout.issueTag[0],
    ]);

    //Filter by Issue assignee
    table.filterInputCheckbox(
      tables["Completed workouts"],
      "Issue assignee",
      null,
      null,
      completedWorkout.issueAssignee[0]
    );
    table.isColumnValueMatch(tables["Completed workouts"], "Issue assignee", [
      completedWorkout.issueAssignee[0].name,
    ]);
    table.resetFilter(tables["Completed workouts"], "Issue assignee");
    table.getAllTableRows(tables["Completed workouts"]).should("be.visible");
  });

  it("Should be able to sort all column on Completed workouts", () => {
    /**
     * Test case
     * 1. Verify that user can sort all column
     *
     * Issue tag has no data, not yet included
     */
    workout.completedWorkoutsTitle.click();

    //Sort by Workout
    table.runSort(
      tables["Completed workouts"],
      "Workout",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Completed workouts"],
      "Workout",
      "descending",
      defaultPageValue
    );

    //Sort by Effort
    table.runCustomSort(
      tables["Completed workouts"],
      "Effort",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["Completed workouts"],
      "Effort",
      "descending",
      defaultPageValue
    );

    //Sort by Asset tag
    table.runSort(
      tables["Completed workouts"],
      "Asset tag",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Completed workouts"],
      "Asset tag",
      "descending",
      defaultPageValue
    );

    //Sort by Issue tag
    table.runSort(
      tables["Completed workouts"],
      "Issue tag",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Completed workouts"],
      "Issue tag",
      "descending",
      defaultPageValue
    );

    //Sort by Assignee
    table.runSort(
      tables["Completed workouts"],
      "Issue assignee",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Completed workouts"],
      "Issue assignee",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on Completed workouts", () => {
    /**
     * Test case
     * 1. Verify that pagination works.
     */
    workout.completedWorkoutsTitle.click();

    table.runChangePagination(
      tables["Completed workouts"],
      "Workout",
      defaultPageValue
    );
  });
});
