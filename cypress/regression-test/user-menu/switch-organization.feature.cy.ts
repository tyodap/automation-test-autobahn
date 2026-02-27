import { usersProd, usersTest } from "../../fixtures/constants/user";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import userMenu from "../../utils/components/user-menu";
import dashboard from "../../utils/pages/dashboard";
import login from "../../utils/pages/login";
import accessManagementService from "../../utils/services/access-management-service";
import workoutDetails from "../../utils/pages/workout-detail";

describe("Switch organization", () => {
  const testUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Change Org Admin"]
      : usersTest["Change Org Test"];

  const testWorkout =
    Cypress.env("environment") === "PROD"
      ? workoutsProd["Invalid workout prod"]
      : workoutsTest["Invalid workout test"];

  const startOrg = testUser.orgs[0];
  const targetOrg = testUser.orgs[1];

  beforeEach(() => {
    cy.login(testUser);
  });

  it("Should be able to logout from platform", () => {
    /**
     * 1. Verify user can logout
     */
    accessManagementService.switchOrganisation(testUser, startOrg);
    userMenu.logoutUser();
    login.emailSelector.should("be.visible");
  });

  it("Should not be able to open a workout outside an organization", () => {
    /**
     * 1. Verify user can't open workout outside an organization
     * 2. Verify no workout after open workout details
     */
    workoutDetails.openWorkout(testWorkout);
    workoutDetails.noWorkout();
  });

  it("Should successfully change organization", () => {
    /**
     * 1. Verify user can change organization
     * 2. Check the hackability score after switch organization
     *
     */
    userMenu.userMenu.should("contain.text", startOrg.name);
    dashboard.hackabilityScore.should("be.visible").within(() => {
      dashboard.hackabilityScoreValue.should("have.text", startOrg.hsValue);
    });

    userMenu.changeOrg(targetOrg);
    userMenu.userMenu.should("contain.text", targetOrg.name);
    dashboard.hackabilityScore.should("be.visible").within(() => {
      dashboard.hackabilityScoreValue.should("have.text", targetOrg.hsValue);
    });
  });

  it("Should successfully open a workout after switching an organization", () => {
    /**
     * 1. Verify user should be able open the workout
     * 2. Check the workout have an asset
     */
    workoutDetails.openWorkout(testWorkout);
    workoutDetails.verifyPage(testWorkout);
  });
});
