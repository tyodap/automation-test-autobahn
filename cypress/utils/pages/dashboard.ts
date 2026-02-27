import { Asset } from "../../fixtures/interfaces/asset.interface";
import { Workout } from "../../fixtures/interfaces/workout.interface";

class DashboardPage {
  get updatedAt() {
    return cy.get(".pt-2");
  }
  get orgViewTab() {
    return cy.get("div#rc-tabs-0-tab-organization");
  }
  get myViewTab() {
    return cy.get("div#rc-tabs-0-tab-personal");
  }

  get dashboardList() {
    return cy.get('div[role="tablist"]');
  }
  get downloadDashboard() {
    return cy.get('[data-icon="arrow-down-to-bracket"]');
  }

  get editCustomDashboard() {
    return cy.get('[data-icon="pen-to-square"]');
  }

  get createCustomDashboard() {
    return cy.get('[data-icon="square-plus"]');
  }

  get createCustomDashboardByScans() {
    return cy
      .get('[class="ant-dropdown-menu-title-content"]')
      .contains("By scans");
  }

  get createCustomDashboardByAssets() {
    return cy
      .get('[class="ant-dropdown-menu-title-content"]')
      .contains("By assets");
  }

  get createCustomDashboardByAssetTags() {
    return cy
      .get('[class="ant-dropdown-menu-title-content"]')
      .contains("By asset tags");
  }

  get hackabilityScoreChart() {
    return cy.get('div[data-chart-source-type="G2Plot"] canvas');
  }

  get hackabilityScoreChartLegend() {
    return cy.get('[id="progress-area-chart"]');
  }

  get hackabilityScoreValue() {
    return cy.get("div.text-base-black");
  }

  get hackabilityScore() {
    return cy
      .get("[data-testid='cyf--lbl--hackability-score-chart--legend']")
      .within(() => {
        return cy.get("div.text-base-black");
      });
  }

  get hackabilityScoreTooltip() {
    return cy.get("div#progress-area-chart svg[data-icon='question-circle']");
  }

  get hackabilityScoreChartRail() {
    return cy.get("div.ant-slider-rail");
  }

  get topWorkouts() {
    return cy
      .get("div.ant-card.ant-card-default.flex.flex-col.rounded-none")
      .contains("Top Workouts");
  }

  get workoutTitle() {
    return cy.get('[data-testid="workout-title"]');
  }

  get seeAllMostHackableAssets() {
    return cy
      .get('[buttonname="See all (Most hackable assets)"]')
      .invoke("removeAttr", "target");
  }

  get issuePerSeverityTile() {
    return cy.get("div#issue-status-per-severity div.issue-count-tile");
  }

  get issueOpenCritical() {
    return cy
      .get('[data-testid="issue-count-open-critical"]')
      .children()
      .invoke("removeAttr", "target");
  }

  get issueOpenCriticalNumber() {
    return cy
      .get('[data-testid="issue-count-open-critical"] div.issue-tile')
      .invoke("text");
  }

  get mostHackableAssetsWidget() {
    return cy.get(`[data-testid="most-hackable-assets-widget"]`);
  }

  get mostHackableAssetsCard() {
    return cy.get(`[data-testid="most-hackable-assets-widget"]`);
  }

  get mostHackableAssetTable() {
    return cy.get("thead.ant-table-thead");
  }

  get issueStatusPerSeverity() {
    return cy
      .get("div.ant-card.ant-card-default.flex.flex-col.rounded-none")
      .contains("Issue status per severity");
  }

  get expiredBanner() {
    return cy
      .get("span.alert-text")
      .contains(
        "Your subscription has expired. To regain access to the application’s features, please "
      );
  }

  get impactNumber() {
    return cy.get("[data-icon='arrow-down']").parent().invoke("text");
  }

  verifyExpiredBannerNotVisible() {
    cy.get("body").then(($element) => {
      const banner = $element.find(
        'span.alert-text:contains("Your subscription has expired. To regain access to the application’s features, please ")'
      );
      if (banner.length === 0) {
        cy.log("Expired banner is not visible ✅");
      } else if (banner.length !== 0) {
        throw new Error("Banner is visible when org is not expired!");
      } else {
        throw new Error("Unknown error, please manually check");
      }
    });
  }

  isImpactNumberSorted() {
    this.impactNumber.then((text) => {
      const impactNumber = text.trim().split("").map(Number);
      const sortedImpactNumber = impactNumber.sort(
        (comparatorA: number, comparatorB: number) => {
          return comparatorB - comparatorA;
        }
      );
      expect(sortedImpactNumber).to.equal(impactNumber);
    });
  }

  openCustomDashboard(name: string) {
    cy.wait(2000);
    this.dashboardList.contains(name).click();
  }

  verifyGeneratingDashboardData() {
    cy.get("div.ant-typography.text-center").contains(
      "We’re generating data for your new dashboard."
    );
  }

  verifyDashboardDataIsVisible() {
    this.hackabilityScoreChartLegend.should("be.visible", {
      timeout: 30000,
    });
    this.hackabilityScoreChart.should("be.visible");
    this.hackabilityScoreChartRail.should("be.visible");
    this.issuePerSeverityTile.should("be.visible");
    this.mostHackableAssetsCard.should("be.visible");
  }

  openWorkout(workout: Workout) {
    cy.get(
      `a[href*="/cyberfitness-workouts/${workout.instanceId}/workout"]`
    ).click();
  }

  openAsset(asset: Asset) {
    this.mostHackableAssetsWidget.within(() => {
      cy.get(`a[href*="assets/${asset.assetId}"]`)
        .invoke("removeAttr", "target")
        .click();
    });
  }
}

export default new DashboardPage();
