import {
  dashboardProd,
  dashboardTest,
} from "../../fixtures/constants/dashboard";
import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import createCustomDashboard from "../../utils/pages/create-custom-dashboard";
import dashboard from "../../utils/pages/dashboard";
import dashboardManagement from "../../utils/services/dashboard-management";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const testDashboard =
  Cypress.env("environment") === "PROD"
    ? dashboardProd["Custom dashboard by assets"]
    : dashboardTest["Custom dashboard by assets"];

beforeEach(() => {
  cy.loginUsingSession(orgAdmin);
  dashboardManagement.publicDashboard(orgAdmin, testDashboard);
});

afterEach(() => {
  dashboardManagement.publicDashboard(orgAdmin, testDashboard);
});

describe("Dashboard visibility", { tags: ["@daily"] }, () => {
  it("Should be able to change dashboard visibility", () => {
    /**
     * 1. Verify to update visibility of custom dashboard
     */
    cy.openPageUsingSession(orgAdmin, pages.Dashboard);
    dashboardManagement.publicDashboard(orgAdmin, testDashboard);
    dashboard.openCustomDashboard(testDashboard.name);
    createCustomDashboard.changeVisibility();
    createCustomDashboard.displayPrivate.should("be.visible");
  });
});
