import { usersProd, usersTest } from "../../fixtures/constants/user";
import dashboard from "../../utils/pages/dashboard";

describe.skip("Smoke test login page", { tags: ["@30minutes"] }, () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  it("Should be able to smoke test login page", () => {
    /**
     * 1. Verify email box
     * 2. Verify password box
     * 3. Verify login button
     */
    cy.login(orgOwner);

    cy.url({ timeout: 60000 }).should("include", "dashboard?view=organization");
    dashboard.hackabilityScoreChartLegend.should("be.visible");
    dashboard.topWorkouts.should("be.visible");
    dashboard.mostHackableAssetsWidget.should("be.visible");
    dashboard.issueStatusPerSeverity.should("be.visible");
  });
});
