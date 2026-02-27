import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import sidebar from "../../utils/components/sidebar";
import dashboard from "../../utils/pages/dashboard";
import workout from "../../utils/pages/workout";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import integration from "../../utils/pages/integration";
import scanning from "../../utils/pages/scanning";

describe("Sidebar redirection smoke test", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  it("Should be able to verify sidebar clicking", () => {
    /**
     * 1. Open each sidebar
     * 2. Verify that data is loaded with no error
     */
    cy.login(orgOwner);

    // Workouts
    sidebar.openMenu(pages.Workouts);
    table.isLoaded(tables["To do workouts"]);
    workout.completedWorkoutsTitle.click();
    table.isLoaded(tables["Completed workouts"]);

    // Issues
    sidebar.openMenu(pages.Issues);
    table.isLoaded(tables["Issues"]);

    // Assets
    sidebar.openMenu(pages.Assets);
    table.isLoaded(tables["Assets"]);

    // Integrations
    sidebar.openMenu(pages.Integrations);
    integration.integrationCard().should("be.visible");

    // Scanning
    sidebar.openMenu(pages.Scanning);
    table.isLoaded(tables["All Scans"]);
    scanning.scheduledScanTable.click();
    table.isLoaded(tables["Scheduled scans"]);

    // Team
    sidebar.openMenu(pages.Team);
    table.isLoaded(tables["Team"]);

    // Cyber Fitness
    sidebar.openMenu(pages.Dashboard);
    dashboard.hackabilityScoreChartLegend.should("be.visible");
    dashboard.topWorkouts.should("be.visible");
    dashboard.mostHackableAssetsWidget.should("be.visible");
    dashboard.issueStatusPerSeverity.should("be.visible");
  });
});
