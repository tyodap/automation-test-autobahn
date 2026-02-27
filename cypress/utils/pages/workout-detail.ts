import { Workout } from "../../fixtures/interfaces/workout.interface";

class WorkoutsDetail {
  get title() {
    return cy.get("div.ab-special-page-header-info");
  }

  get buttonsList() {
    return cy.get("div.ab-special-page-header-extras");
  }

  get shareButton() {
    return cy.get('[data-icon="share-nodes"]');
  }

  get jiraButton() {
    return cy.get("span.fast-dropdown-menu-title-content").contains("Jira");
  }

  get downloadButton() {
    return cy.get('[data-icon="arrow-down-to-bracket"]');
  }

  get downloadWorkout() {
    return cy.get('[data-testid="download-workout"]');
  }

  get tabList() {
    return cy.get("div.ant-tabs-nav");
  }

  get warmupScoring() {
    return cy.get('[data-testid="warmup-scoring"]');
  }

  get warmupSteps() {
    return cy.get('[data-testid="warmup-mitigation-steps"]');
  }

  get workoutSteps() {
    return cy.get("div.workout-mitigation-steps");
  }

  get workoutsMitigationContent() {
    return cy.get("div.workout-mitigation-content");
  }
  get workoutsTab() {
    return cy.get('[data-testid="workout-tab"]');
  }

  get workoutContent() {
    return cy.get('[data-testid="workout-detail-page"]');
  }

  get setupTab() {
    return cy.get("div.ant-tabs-tab-btn").contains("Setup");
  }

  get workoutDetailAssetTable() {
    return cy.get('[data-testid="scrollable-assets-table"]');
  }

  get expandTable() {
    return cy.get('[data-icon="circle-caret-left"]');
  }

  clickColumnValue(value: string) {
    return cy.get("[type='button']").contains(value).click();
  }

  openWorkout(workout: Workout) {
    cy.visit(`/cyberfitness-workouts/${workout.instanceId}`);
  }

  noWorkout() {
    this.workoutContent.should(
      "contain.text",
      "You don't have any workouts yet"
    );
  }

  verifyPage(workout: Workout) {
    cy.url().should("include", `cyberfitness-workouts/${workout.instanceId}`);

    this.title.should("have.text", workout.name, {
      timeout: 40000,
    });
  }
}

export default new WorkoutsDetail();
