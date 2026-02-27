import { usersProd, usersTest } from "../../fixtures/constants/user";
import dashboard from "../../utils/pages/dashboard";

describe("Smoke test dashboard", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Owner Smoke Prod"]
      : usersTest["Owner Smoke Test"];

  const customDashboard = "All assets";

  beforeEach(() => {
    cy.login(orgOwner);
  });

  it("Should be able to smoke test my view dashboard", () => {
    /**
     * 1. Verify hackability score is visible
     * 2. Verify top workout list is visible
     * 3. Verify custom dashboard by scan is visible
     * 4. Verify custom dashboard by assets is visible
     * 5. Verify custom dashboard by asset tags is visible
     */
    dashboard.myViewTab.click();

    dashboard.hackabilityScoreChartLegend.should("be.visible").within(() => {
      dashboard.hackabilityScoreValue.should("be.visible");
    });
    dashboard.workoutTitle.should("be.visible");

    dashboard.downloadDashboard.should("be.visible");
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.should("be.visible");
    dashboard.createCustomDashboardByAssets.should("be.visible");
    dashboard.createCustomDashboardByAssetTags.should("be.visible");
  });

  it("Should be able to smoke test organization view dashboard", () => {
    /**
     * 1. Verify hackability score is visible
     * 2. Verify top workout list is visible
     * 3. Verify most hackable asset list is visible
     * 4. Verify issue status per severity is visible
     * 5. Verify custom dashboard by scan is visible
     * 6. Verify custom dashboard by assets is visible
     * 7. Verify custom dashboard by asset tags is visible
     */
    dashboard.hackabilityScoreChartLegend.should("be.visible").within(() => {
      dashboard.hackabilityScoreValue.should("be.visible");
    });
    dashboard.workoutTitle.should("be.visible");
    dashboard.mostHackableAssetsWidget.should("be.visible").within(() => {
      dashboard.mostHackableAssetTable.should("be.visible");
    });
    dashboard.issuePerSeverityTile.should("be.visible");

    dashboard.downloadDashboard.should("be.visible");
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.should("be.visible");
    dashboard.createCustomDashboardByAssets.should("be.visible");
    dashboard.createCustomDashboardByAssetTags.should("be.visible");
  });

  it("Should be able to smoke test custom dashboard", () => {
    /**
     * 1. Verify hackability score is visible
     * 2. Verify top workout list is visible
     * 3. Verify most hackable asset list is visible
     * 4. Verify issue status per severity is visible
     * 5. Verify custom dashboard by scan is visible
     * 6. Verify custom dashboard by assets is visible
     * 7. Verify custom dashboard by asset tags is visible
     */
    dashboard.openCustomDashboard(customDashboard);

    dashboard.hackabilityScoreChartLegend.should("be.visible").within(() => {
      dashboard.hackabilityScoreValue.should("be.visible");
    });
    dashboard.workoutTitle.should("be.visible");
    dashboard.mostHackableAssetsWidget.should("be.visible").within(() => {
      dashboard.mostHackableAssetTable.should("be.visible");
    });
    dashboard.issuePerSeverityTile.should("be.visible");

    dashboard.downloadDashboard.should("be.visible");
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.should("be.visible");
    dashboard.createCustomDashboardByAssets.should("be.visible");
    dashboard.createCustomDashboardByAssetTags.should("be.visible");
  });
});
