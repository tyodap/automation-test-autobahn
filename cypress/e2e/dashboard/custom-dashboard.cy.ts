import { assetProd, assetTest } from "../../fixtures/constants/asset";
import {
  dashboardProd,
  dashboardTest,
} from "../../fixtures/constants/dashboard";
import { pages } from "../../fixtures/constants/pages";
import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import modal from "../../utils/components/modal";
import table from "../../utils/components/table";
import assetDetail from "../../utils/pages/asset-detail";
import createCustomDashboard from "../../utils/pages/create-custom-dashboard";
import dashboard from "../../utils/pages/dashboard";
import issues from "../../utils/pages/issues";
import workoutDetail from "../../utils/pages/workout-detail";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const testDashboard =
  Cypress.env("environment") === "PROD"
    ? dashboardProd["Custom dashboard by assets"]
    : dashboardTest["Custom dashboard by assets"];

const testAsset =
  Cypress.env("environment") === "PROD"
    ? assetProd["Asset Custom Dashboard"]
    : assetTest["Asset Test Env"];

const testWorkout =
  Cypress.env("environment") === "PROD"
    ? workoutsProd["Update Microsoft .NET"]
    : workoutsTest["Secure SSH"];

const testScan =
  Cypress.env("environment") === "PROD"
    ? scansProd["Custom Dashboard By Scan - Prod"]
    : scansTest["Scan Custom Dashboard Test"];

const specialChar = "@#!*()撾部غانتنع";
const defaultPageValue = "5";

const dashboardByAsset =
  createCustomDashboard.generateValidCustomDashboardName("By-Asset");
const dashboardByAssetTag =
  createCustomDashboard.generateValidCustomDashboardName("By-Asset-tag");
const dashboardByScan =
  createCustomDashboard.generateValidCustomDashboardName("By-Scan");
const updatedCustom = "Updated Custom Dashboard";

const assetTag = "asset-tagging";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Dashboard);
});

describe("Custom Dashboard", { tags: ["@daily"] }, () => {
  it("Should be able to check top workout, hackability score, most hackable asset and issue per serverity", () => {
    /**
     * 1. Verify create custom dashboard by asset tags is visible
     * 2. Verify create custom dashboard by assets is visible
     * 3. Verify create custom dashboard by scan is visible
     * 4. Verify top workout visible
     * 2. Verify hackability score visible
     * 3. Verify most hackable asset visible
     * 4. Verify issue per serverity visible
     */
    dashboard.openCustomDashboard(testDashboard.name);
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssetTags.should("be.visible");
    dashboard.createCustomDashboardByAssets.should("be.visible");
    dashboard.createCustomDashboardByScans.should("be.visible");

    dashboard.hackabilityScoreChartLegend.should("be.visible").within(() => {
      dashboard.hackabilityScoreValue.should("be.visible");
    });
    dashboard.workoutTitle.should("be.visible");
    dashboard.mostHackableAssetsWidget.should("be.visible").within(() => {
      dashboard.mostHackableAssetTable.should("be.visible");
    });
    dashboard.issuePerSeverityTile.should("be.visible");
  });

  it("Should be able to open asset from custom dashboard", () => {
    /**
     * 1. Verify asset can be opened from custom dashboard
     */
    dashboard.openCustomDashboard(testDashboard.name);
    dashboard.openAsset(testAsset);

    cy.url().should("include", `assets/${testAsset.assetId}`);
    assetDetail.assetName.should("have.text", testAsset.assetDomain);
  });

  it("Should be able to open workout from custom dashboard", () => {
    /**
     * 1. Verify workout can be opened from custom dashboard
     */
    dashboard.openCustomDashboard(testDashboard.name);
    dashboard.openWorkout(testWorkout);

    cy.url().should(
      "include",
      `cyberfitness-workouts/${testWorkout.instanceId}/workout?dashboard_id=${testDashboard.dashboardId}`
    );
    workoutDetail.title.should("contain", testWorkout.name);
  });

  it("Impact should be sorted numerically", () => {
    /**
     * 1. Verify that impact number is sorted
     */
    dashboard.openCustomDashboard(testDashboard.name);
    dashboard.isImpactNumberSorted();
  });

  it("Should be able to open issue per severity", () => {
    /**
     * 1. Verify issues can be opened from custom dashboard
     */
    dashboard.openCustomDashboard(testDashboard.name);
    dashboard.issuePerSeverityTile.should("be.visible");
    dashboard.issueOpenCriticalNumber.then((text) => {
      const openCriticalNumber = text as string;

      dashboard.issueOpenCritical.click();

      cy.verifyIfOpen(pages["Issues"]);
      cy.wait(3500);
      cy.url().should("include", "issues/list?filters");
      issues.totalCriticalIssue.then((text) => {
        const openCriticalNumberIssues = text as string;

        expect(openCriticalNumberIssues).to.include(openCriticalNumber);
      });
    });
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
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.contains(dashboardByAsset).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messagePopup.should("be.visible");
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
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.contains(dashboardByAssetTag).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messagePopup.should("be.visible");
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
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.contains(dashboardByScan).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.should("not.include.text", dashboardByScan);
  });

  it("Should be able update custom dashboard", () => {
    /**
     * 1. Verify custom dashboard created
     * 2. Update custom dashboard
     * 3. Custom dasboard deleted
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();
    table.isLoaded(tables["Create Custom Dashboard by Assets"]);
    table.singleCheckboxBulkSelect.first().click();
    createCustomDashboard.createCustomDashboard(dashboardByAsset);
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.contains(dashboardByAsset).click();
    dashboard.verifyGeneratingDashboardData();

    //update custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.inputDashboardName.clear().type(updatedCustom);
    createCustomDashboard.createButton.contains("Apply").click();
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.contains(updatedCustom).click();
    dashboard.verifyGeneratingDashboardData();

    //Delete custom dashboard
    dashboard.editCustomDashboard.click();
    createCustomDashboard.deleteCustomDashboard();
    modal.messagePopup.should("be.visible");
    dashboard.dashboardList.should("not.include.text", dashboardByAsset);
  });

  it("Should not be able to create custom dashboard with existing name", () => {
    /**
     * 1. Verify will get error with existing name while create custom dashboard
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();
    table.isLoaded(tables["Create Custom Dashboard by Assets"]);
    table.singleCheckboxBulkSelect.first().click();
    createCustomDashboard.createCustomDashboard(testDashboard.name);
    modal.messagePopup.should("contain", "The dashboard name must be unique");
  });

  it("Should not be able to create custom dashboard with special character", () => {
    /**
     * 1. Verify will get error with special character name while create custom dashboard
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();
    table.isLoaded(tables["Create Custom Dashboard by Assets"]);
    createCustomDashboard.inputDashboardName.type(specialChar);
    table.singleCheckboxBulkSelect.first().click();

    createCustomDashboard.errorMessage.should(
      "contain",
      "No special characters allowed"
    );
  });

  it("Should be able to filter on custom dashboard by scan", () => {
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.click();
    //Filter by Scan
    table.runFilterSearch(
      tables["Create Custom Dashboard by Scans"],
      "Scan",
      testScan.scanName
    );

    //Filter by Started on
    table.runFilterDate(
      tables["Create Custom Dashboard by Scans"],
      "Started on",
      testScan.startedOnValue
    );

    //Filter by Assignee
    table.filterInputCheckbox(
      tables["Create Custom Dashboard by Scans"],
      "Assignee",
      null,
      null,
      testScan.assignee[0]
    );
    table.isColumnValueMatch(
      tables["Create Custom Dashboard by Scans"],
      "Assignee",
      [testScan.assignee[0].name]
    );
    table.resetFilter(tables["Create Custom Dashboard by Scans"], "Assignee");
    table
      .getAllTableRows(tables["Create Custom Dashboard by Scans"])
      .should("be.visible");

    //Filter by IPs
    table.runFilterSearch(
      tables["Create Custom Dashboard by Scans"],
      "IPs",
      testScan.Assets
    );

    //Filter by Origin
    table.runFilterCheckbox(
      tables["Create Custom Dashboard by Scans"],
      "Origin",
      testScan["originValue"],
      null,
      "Autobahn (external) Powered by Qualys"
    );
  });

  it("Should be able to sort on custom dashboard by scan", () => {
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.click();

    //Sort by Scan
    table.runSort(
      tables["Create Custom Dashboard by Scans"],
      "Scan",
      "ascending",
      defaultPageValue
    );

    table.runSort(
      tables["Create Custom Dashboard by Scans"],
      "Scan",
      "descending",
      defaultPageValue
    );

    //Sort by Started on
    table.runDateSort(
      tables["Create Custom Dashboard by Scans"],
      "Started on",
      "ascending",
      defaultPageValue
    );

    table.runDateSort(
      tables["Create Custom Dashboard by Scans"],
      "Started on",
      "descending",
      defaultPageValue
    );

    //Sort by Assignee
    table.runSort(
      tables["Create Custom Dashboard by Scans"],
      "Assignee",
      "ascending",
      defaultPageValue
    );

    table.runDateSort(
      tables["Create Custom Dashboard by Scans"],
      "Assignee",
      "descending",
      defaultPageValue
    );

    //Sort by IPs
    table.runNumberSort(
      tables["Create Custom Dashboard by Scans"],
      "IPs",
      "ascending",
      defaultPageValue
    );

    table.runNumberSort(
      tables["Create Custom Dashboard by Scans"],
      "IPs",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on custom dashboard by scan", () => {
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByScans.click();

    table.runChangePagination(
      tables["Create Custom Dashboard by Scans"],
      "IPs",
      defaultPageValue
    );
  });

  it("Should be able to filter on custom dashboard by asset", () => {
    /**
     * Hostnames, Tag, Criticality is not included
     */
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();

    //Filter by Asset
    table.runFilterSearch(
      tables["Create Custom Dashboard by Assets"],
      "Asset",
      testAsset.assetDomain
    );

    //Filter by IPs
    table.runFilterSearch(
      tables["Create Custom Dashboard by Assets"],
      "IPs",
      testAsset.ipAddress
    );

    //Filter by Network
    table.runFilterCheckbox(
      tables["Create Custom Dashboard by Assets"],
      "Network",
      [testAsset.networkValue],
      [testAsset.networkName]
    );

    //Filter by Assignee
    table.filterInputCheckbox(
      tables["Create Custom Dashboard by Assets"],
      "Assignee",
      null,
      null,
      testAsset.assignee[0]
    );
    table.isColumnValueMatch(
      tables["Create Custom Dashboard by Assets"],
      "Assignee",
      [testAsset.assignee[0].name]
    );
    table.resetFilter(tables["Create Custom Dashboard by Assets"], "Assignee");
    table
      .getAllTableRows(tables["Create Custom Dashboard by Assets"])
      .should("be.visible");

    //Filter by Max. Severity
    table.runFilterCheckbox(
      tables["Create Custom Dashboard by Assets"],
      "Max. Severity",
      testAsset.maxSeverityValue,
      testAsset.maxSeverity
    );

    //Filter by Source
    table.runFilterCheckbox(
      tables["Create Custom Dashboard by Assets"],
      "Source",
      testAsset.originValue,
      null,
      "Autobahn"
    );
  });

  it("Should be able to sort on custom dashboard by assets", () => {
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();

    //Sort by Asset
    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "Asset",
      "ascending",
      defaultPageValue
    );

    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "Asset",
      "descending",
      defaultPageValue
    );

    //Sort by IPs
    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "IPs",
      "ascending",
      defaultPageValue
    );

    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "IPs",
      "descending",
      defaultPageValue
    );

    //Sort by Network
    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "Network",
      "ascending",
      defaultPageValue
    );

    table.runDateSort(
      tables["Create Custom Dashboard by Assets"],
      "Network",
      "descending",
      defaultPageValue
    );

    //Sort by Assignee
    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "Assignee",
      "ascending",
      defaultPageValue
    );

    table.runSort(
      tables["Create Custom Dashboard by Assets"],
      "Assignee",
      "descending",
      defaultPageValue
    );

    //Sort by Max. Severity
    table.runCustomSort(
      tables["Create Custom Dashboard by Assets"],
      "Max. Severity",
      "ascending",
      defaultPageValue
    );

    table.runCustomSort(
      tables["Create Custom Dashboard by Assets"],
      "Max. Severity",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to verify pagination on custom dashboard by asset", () => {
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssets.click();

    table.runChangePagination(
      tables["Create Custom Dashboard by Assets"],
      "Asset",
      defaultPageValue
    );
  });
});
