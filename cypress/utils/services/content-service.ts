import { Workout } from "../../fixtures/interfaces/workout.interface";

class ContentService {
  get baseServiceUrl() {
    return "/api/content-service/items/Cyber_Workouts/";
  }

  intercept(alias: string, workout: Workout) {
    cy.intercept({
      method: "GET",
      url: `${this.baseServiceUrl}/${workout.workoutId}`,
    }).as(alias);
  }

  verify(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 200);
  }
}

export default new ContentService();
