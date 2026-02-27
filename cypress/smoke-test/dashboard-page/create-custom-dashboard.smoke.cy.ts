import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import createCustomDashboard from "../../utils/pages/create-custom-dashboard";
import dashboard from "../../utils/pages/dashboard";

describe("Create custom dashboard", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["Custom Dashboard Prod"]
      : usersTest["Regression Owner"];

  const dashboardByAsset =
    createCustomDashboard.generateValidCustomDashboardName("By-Asset-");
  const dashboardByAssetTag =
    createCustomDashboard.generateValidCustomDashboardName("By-Asset-tag-");
  const dashboardByScan =
    createCustomDashboard.generateValidCustomDashboardName("By-Scan-");
  const assetTag = "asset-tagging";

  beforeEach(() => {
    cy.login(orgOwner);
  });

  it("Should be able to create and delete new custom dashboard by asset", () => {
    /**
     * 1. Verify custom dashboard created
     * 2. Custom dasboard deleted
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();
    table.isLoaded(tables["Create Custom Dashboard by Assets"]);
    table.singleCheckboxBulkSelect.first().click();
    createCustomDashboard.createCustomDashboard(dashboardByAsset);
    modal.messageComponent.should("be.visible");
    dashboard.dashboardList.contains(dashboardByAsset).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messageComponent.should("be.visible");
    dashboard.dashboardList.should("not.include.text", dashboardByAsset);
  });

  it("Should be able to create and delete new custom dashboard by asset tags", () => {
    /**
     * 1. Verify custom dashboard created
     * 2. Custom dasboard deleted
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssetTags.click();
    cy.verifyIfOpen(pages["Create Custom Dashboard By Asset Tags"]);
    createCustomDashboard.inputDashboardName.type(dashboardByAssetTag);
    createCustomDashboard.inputTags(assetTag);
    createCustomDashboard.createButton.click({ force: true });
    modal.messageComponent.should("be.visible");
    dashboard.dashboardList.contains(dashboardByAssetTag).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messageComponent.should("be.visible");
    dashboard.dashboardList.should("not.include.text", dashboardByAssetTag);
  });

  it("Should be able to create and delete new custom dashboard by scan", () => {
    /**
     * 1. Verify custom dashboard created
     * 2. Custom dasboard deleted
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.click();
    table.isLoaded(tables["Create Custom Dashboard by Scans"]);
    table.singleCheckboxBulkSelect.first().click();
    createCustomDashboard.createCustomDashboard(dashboardByScan);
    modal.messageComponent.should("be.visible");
    dashboard.dashboardList.contains(dashboardByScan).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messageComponent.should("be.visible");
    dashboard.dashboardList.should("not.include.text", dashboardByScan);
  });
});
