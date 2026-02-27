import table from "../components/table";
import { tables } from "../../fixtures/constants/table";
import vulnerabilityManagementService from "../services/vulnerability-management-service";
import { Table } from "../../fixtures/interfaces/table.interface";
import { pages } from "../../fixtures/constants/pages";
import { Scan } from "../../fixtures/interfaces/scan.interface";
import { recurse } from "cypress-recurse";

class ScanReportPage {
  get scanName() {
    return cy.get("span.ant-page-header-heading-title");
  }

  get rescanButton() {
    return cy.get("[data-testid='rescan-button']");
  }

  get downloadButton() {
    return cy.get("[data-testid='download-report-dropdown']");
  }

  get downloadScopeButton() {
    return cy.get("[data-testid='download-scan-scope-menu']");
  }

  get downloadReportButton() {
    return cy.get(`[data-menu-id*="xlsx"]`);
  }

  get issuesOverviewCard() {
    return cy.get("[data-testid='issues-overview']");
  }

  get generalDetailsCard() {
    return cy.get("[data-testid='general-details']");
  }

  get severityDistributionChart() {
    return cy.get("[data-testid='severity-distribution']");
  }

  get workoutTable() {
    return cy.get("[data-testid='scr--cyber-fitness-workouts']");
  }

  get individualIssuesTable() {
    return cy.get("[data-testid='scr--tbl--issues-1']");
  }

  get assetsTable() {
    return cy.get("[data-testid='scr--asset-details']");
  }

  get nonAliveHostTable() {
    return cy.get("[data-testid='scr--non-alive-hosts']");
  }

  get manualTargetsTable() {
    return cy.get("[data-testid='scr--manual-targets']");
  }

  get portsTable() {
    return cy.get("[data-testid='scr--manual-targets']");
  }

  get originTooltip() {
    return cy.get("[role='tooltip']").not(".ant-tooltip-hidden");
  }

  get editTagsButton() {
    return cy.get(".ant-btn-default").contains("Edit tags");
  }

  get editTagsDrawer() {
    return cy.get("[data-testid='scr--drw--edit-tags--1']");
  }

  get addTags() {
    return cy.get("[value='add']");
  }

  get scriptOutputDrawer() {
    return cy.get("div.ant-drawer-body");
  }

  get scriptOutputColumn() {
    return cy.get("[type='button']").contains("View script");
  }

  get scriptOutputText() {
    return this.scriptOutputDrawer.children().invoke("text");
  }

  get selectTagPlaceholder() {
    return cy.get("[type='search']").not("[aria-expanded='false']");
  }

  get applyTags() {
    return cy.get("button.ant-btn-primary").contains("Apply");
  }

  get tagsUpdateNotification() {
    return cy
      .get("div.ant-message-success")
      .contains("Issue's tags successfully updated");
  }

  get removeTags() {
    return cy.get("[value='remove']");
  }

  get selectedTags() {
    return cy.get("[data-testid='scr--opt--tag--1']");
  }

  get markIssueAsButton() {
    return cy.get(
      ".table-action-container__bulk-action-container > .ant-dropdown-trigger"
    );
  }

  get successUpdateIssueNotification() {
    return cy.get("div.ant-message-success").contains("Issues are updated");
  }

  markIssueAs(status: string) {
    cy.get("span.ant-dropdown-menu-title-content").contains(status).click();
  }

  get criticalVulnScanReportTile() {
    return cy.get("[class='font-semibold text-3xl']").eq(0).invoke("text");
  }

  get highVulnScanReportTile() {
    return cy.get("[class='font-semibold text-3xl']").eq(1).invoke("text");
  }

  get mediumVulnScanReportTile() {
    return cy.get("[class='font-semibold text-3xl']").eq(2).invoke("text");
  }

  get lowVulnScanReportTile() {
    return cy.get("[class='font-semibold text-3xl']").eq(3).invoke("text");
  }

  get criticalVulnScanReport() {
    return cy.get("[class='font-semibold']").contains("issues").invoke("text");
  }

  get highVulnScanReport() {
    return cy.get("[class='font-semibold']").contains("issues").invoke("text");
  }

  get mediumVulnScanReport() {
    return cy.get("[class='font-semibold']").contains("issues").invoke("text");
  }

  get lowVulnScanReport() {
    return cy.get("[class='font-semibold']").contains("issues").invoke("text");
  }

  get assetScanReport() {
    return cy.get("[class='col-span-2']").eq(4).invoke("text");
  }

  get assetScanReportTable() {
    return cy.get("[class='font-semibold']").contains("assets").invoke("text");
  }

  get startedOn() {
    return cy
      .get("div.grid")
      .contains("Started on")
      .parent()
      .find('[data-testid="date-formatter"]')
      .invoke("text");
  }

  get completedOn() {
    return cy
      .get("div.grid")
      .contains("Completed on")
      .parent()
      .find('[data-testid="date-formatter"]')
      .invoke("text");
  }

  get backScanReport() {
    return cy.get("[type='button']").contains("Back to"); //The back to scan report from each page are different, this is temporary
  }

  openScanReport(scan: Scan) {
    cy.visit(`${pages["Scanning"].url}/${scan.scanId}/report`);
    this.scanName.should("have.text", scan.scanName);
  }

  addTag(tag: string) {
    vulnerabilityManagementService.interceptAddTags(tag);
    table.selectOnlyDataRowBulkActions(tables["Scan report individual issues"]);
    this.editTagsButton.click();
    this.editTagsDrawer.should("be.visible");
    cy.wait(3000);
    this.addTags
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(3000);
    this.selectTagPlaceholder
      .type(tag, { force: true })
      .type("{enter}", { force: true });
    this.addTags.click({ force: true });
    this.selectedTags.should("be.visible").contains(tag);
    this.applyTags.click();
    this.tagsUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyAddTags(tag);
  }

  removeTag(tag: string) {
    vulnerabilityManagementService.interceptRemoveTags(tag);
    table.selectOnlyDataRowBulkActions(tables["Scan report individual issues"]);
    this.editTagsButton.click();
    this.editTagsDrawer.should("be.visible");
    cy.wait(3000);
    this.removeTags
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(3000);
    this.selectTagPlaceholder.type("{enter}", { force: true });
    this.selectedTags.should("be.visible").contains(tag);
    this.applyTags.click();
    this.tagsUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyRemoveTags(tag);
  }

  updateIssueUsingBulkAction(status: string, tableType: Table) {
    table.selectOnlyDataRowBulkActions(tableType);
    this.markIssueAsButton.click();
    this.markIssueAs(status);
    this.successUpdateIssueNotification.should("be.visible");
  }

  checkIssueState(tables: Table, column: string, state: string) {
    recurse(
      () => table.getListOfColumnValues(tables, column),
      (result) => result.includes(state),
      {
        limit: 5,
        timeout: 60_000,
        delay: 5000,
        log: true,
        post() {
          cy.reload();
          table.isLoaded(tables);
        },
      }
    );
  }

  checkTagPresence(tables: Table, column: string, tag: string) {
    recurse(
      () => table.getListOfColumnValues(tables, column),
      (result) => result.includes(tag),
      {
        limit: 5,
        timeout: 60_000,
        delay: 5000,
        log: true,
        post() {
          cy.reload();
          table.isLoaded(tables);
        },
      }
    );
  }
}

export default new ScanReportPage();
