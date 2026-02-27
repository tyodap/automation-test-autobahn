class Workouts {
  get completedWorkoutsTitle() {
    return cy.get(
      '[data-testid="completed-workouts-card"] [data-testid="typography-title"]'
    );
  }
}

export default new Workouts();
