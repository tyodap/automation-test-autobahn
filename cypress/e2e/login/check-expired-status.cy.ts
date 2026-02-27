import dashboard from "../../utils/pages/dashboard";
import { usersProd } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";

const orgAdmin = usersProd["QC Prod One"];
const expiredAdmin = usersProd["Expired Admin"];

describe("Check expired banner", { tags: ["@daily"] }, () => {
  it("Should be able to verify that expired banner doesn't show up on unexpired org", () => {
    cy.openPageUsingSession(orgAdmin, pages.Dashboard);
    dashboard.verifyExpiredBannerNotVisible();
  });

  it("Should be able to check expired banner on expired org", () => {
    cy.login(expiredAdmin);
    dashboard.expiredBanner.should("be.visible");
  });
});
