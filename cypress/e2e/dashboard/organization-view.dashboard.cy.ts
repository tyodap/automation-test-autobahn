import { assetProd } from "../../fixtures/constants/asset";
import { pages } from "../../fixtures/constants/pages";
import { usersProd } from "../../fixtures/constants/user";
import { workoutsProd } from "../../fixtures/constants/workout";
import assetDetail from "../../utils/pages/asset-detail";
import dashboard from "../../utils/pages/dashboard";
import issues from "../../utils/pages/issues";
import workoutDetail from "../../utils/pages/workout-detail";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";

const orgAdmin = usersProd["QC Prod One"];
const testAsset = assetProd["QC Asset"];
const testWorkout =
  workoutsProd["Update SAP NetWeaver Application Server Java"];

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Dashboard);
});

describe("Organization view dashboard", { tags: ["@daily"] }, () => {
  it("Should be able to open organization view dashboard", () => {
    /**
     * 1. Verify custom dashboard by asset tags is visible
     * 2. Verify custom dashboard by assets is visible
     * 3. Verify custom dashboard by scan is visible
     * 4. Verify hackability score is visible
     * 5. Verify top workout list is visible
     * 6. Verify most hackable assets list is visible
     * 7. Verify issue status per severity is visible
     */
    dashboard.downloadDashboard.should("be.visible");
    dashboard.createCustomDashboard.click();
    dashboard.createCustomDashboardByAssetTags.should("be.visible");
    dashboard.createCustomDashboardByAssets.should("be.visible");
    dashboard.createCustomDashboardByScans.should("be.visible");

    dashboard.hackabilityScoreChartLegend.should("be.visible");
    dashboard.topWorkouts.should("be.visible");
    dashboard.mostHackableAssetsWidget.should("be.visible");
    dashboard.issueStatusPerSeverity.should("be.visible");
  });

  it("Should be able to open asset from dashboard", () => {
    /**
     * 1. Verify asset can be opened from dashboard
     */
    dashboard.openAsset(testAsset);

    cy.url().should("include", `assets/${testAsset.assetId}`);
    assetDetail.assetName.should("have.text", testAsset.domainName[0]);
  });

  it("Should be able to open issue from issue per severity", () => {
    /**
     * 1. Verify issue can be opened from dashboard
     * 2. Verify issue filtering
     */
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

  it("Should be able to open workout from dashboard", () => {
    /**
     * 1. Verify workout can be opened from dashboard
     * 2. Verify that workout detail table is loaded
     */
    dashboard.openWorkout(testWorkout);

    cy.url().should(
      "include",
      `cyberfitness-workouts/${testWorkout.instanceId}/workout`
    );
    workoutDetail.title.should("have.text", testWorkout.name);
    workoutDetail.workoutDetailAssetTable.should("be.visible");
  });

  it("Should be able to open asset from see all button on most hackable asset", () => {
    /**
     * 1. Verify asset can be opened from see all button on most hackable asset
     * 2. Verify that asset table is loaded
     */
    dashboard.seeAllMostHackableAssets.click();

    cy.verifyIfOpen(pages["Assets"]);
    table.verifySort(tables["Assets"], "Max. Severity", "descending");
  });

  it("Impact should be sorted numerically", () => {
    /**
     * 1. Verify that impact number is sorted
     */
    dashboard.isImpactNumberSorted();
  });

  it("Should be able to download dashboard", () => {
    /**
     * 1. Verify that user can download dashboard
     * 2. Verify file download
     */
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const pMonth = month.toString().padStart(2, "0");
    const pDay = day.toString().padStart(2, "0");
    const newPaddedDate = `${year}_${pMonth}_${pDay}`;

    cy.deleteDownloadsFolder();
    dashboard.downloadDashboard.click();
    cy.readFile(`cypress/downloads/${newPaddedDate} - Dashboard.pdf`);
  });
});
