import table from "../components/table";
import analyticsService from "../services/analytics-service";
import scanManagementService from "../services/scan-management-service";
import { Table } from "../../fixtures/interfaces/table.interface";
import { User } from "../../fixtures/interfaces/user.interface";
import { recurse } from "cypress-recurse";
import modal from "../components/modal";

class ScanningPage {
  get scanningPage() {
    return cy.get("[data-testid='typography-title']").contains("All scans");
  }

  get scheduledScanTable() {
    return cy
      .get("[data-testid='typography-title']")
      .contains("Scheduled scans");
  }

  get scanListTable() {
    return cy.get("[data-testid='scan-list-table']");
  }

  get createScanButton() {
    return cy.get(".ab-special-page-header-extras").contains("Create scan");
  }

  get importFileButton() {
    return cy.get("[type='button']").contains("Upload");
  }

  get deleteSchedule() {
    return cy.get("[type='button']").contains("Delete schedule");
  }

  get importFileDrawerButton() {
    return cy.get("[type='button']").contains("Import file");
  }

  get canceledScan() {
    return cy.get("[data-testid='status-canceled']").first();
  }

  get runningScan() {
    return cy.get("[data-testid='status-running']").first();
  }

  get successNotification() {
    return cy.get("[data-testid='success-rescan-notification']");
  }

  get editScanNameSuccessNotification() {
    return cy
      .get("div.fast-message-success")
      .contains("Scan is successfully renamed");
  }

  get actionButton() {
    return cy.get("[data-testid='button-drowdown-action']");
  }

  get actionButtonModal() {
    return cy.get(".ant-dropdown-menu").not(".ant-dropdown-hidden");
  }

  get editScanName() {
    return cy.get("[data-testid='button-edit-scan']");
  }

  get editScanNamePlaceholder() {
    return cy.get("[data-testid='input-rename-scan']");
  }

  get downloadButton() {
    return cy.get("[data-testid='button-download']");
  }

  get downloadNotification() {
    return cy.get("[class='icon-circle-out info']");
  }

  get excelButton() {
    return cy.get(".ant-dropdown-menu-title-content");
  }

  get hideRevision() {
    return cy.get("[data-testid='button-hide-unhide-scan']");
  }

  get changeScanScope() {
    return cy.get("[data-testid='btn-change-scope']");
  }

  get actionChangeSchedule() {
    return cy.get("[data-testid='sco-button-drowdown-action']");
  }

  get changeScheduleScope() {
    return cy.get("span.fast-dropdown-menu-title-content");
  }

  get excelModal() {
    return cy.get("[data-testid='button-download-XLSX']");
  }

  get rescanButton() {
    return cy.get("[data-testid='button-cancel-scan']");
  }

  get cancelButton() {
    return cy.get("[data-testid='button-cancel-scan']");
  }

  get hideButton() {
    return cy.get("[data-testid='button-hide-unhide-scan']");
  }

  get changeScanConfig() {
    return cy
      .get(".spanfast-dropdown-menu-title-content")
      .contains("Change scan configuration");
  }

  get scanHostStatus() {
    return cy.get("[data-testid='scan-status'] .text-xs");
  }

  get scanStatus() {
    return cy.get("[data-testid='scan-vulnerability-status'] .text-xs");
  }

  get cancelScanButton() {
    return cy.get(".ant-btn-dangerous");
  }

  get scanButton() {
    return cy.get("div.text-ellipsis");
  }

  get fileUploadsButton() {
    return cy.get("[data-icon='arrow-alt-from-bottom']");
  }

  get fileUploadDrawer() {
    return cy.get("[class='ant-drawer-header-title']").contains("File uploads");
  }

  get integrateButton() {
    return cy.get(".ab-special-page-header-extras").contains("Integrate");
  }

  hoverDownloadButton() {
    this.downloadButton.trigger("mouseover").invoke("show");
  }

  verifyActionButton(tables: Table, column: string, value: string) {
    table.filterSearch(tables, column, value);
    table.isColumnValueMatch(tables, column, [value]);
    this.actionButton.click();
    this.actionButtonModal.should("be.visible").within(() => {
      this.editScanName.should("be.visible");
      this.rescanButton.should("be.visible");
      this.downloadButton.should("be.visible");
    });
    this.hoverDownloadButton();
    this.excelModal.should("be.visible").within(() => {
      this.excelButton.should("have.text", "XLSX");
    });
  }

  cancelScan() {
    this.actionButton.click();
    this.actionButtonModal.should("be.visible");
    this.cancelButton.click();
    modal.approveActionButton.click();
  }

  checkCancelScanState(
    tables: Table,
    column: string,
    authorizedUser: User,
    scan: string
  ) {
    const maxRetries: number = 2;
    const scanName = scan;
    table.getListOfColumnValues(tables, column).then((values) => {
      const cancelScanState = (retry: number = 0) => {
        if (values[0] !== "Canceled" && retry < maxRetries) {
          cy.log("entering if condition");
          console.log(
            analyticsService.fetchRunningScanId(
              authorizedUser,
              scanName,
              (scanId) => {
                scanManagementService.cancelScan(authorizedUser, scanId);
              }
            )
          );
          cy.wait(5000);
          cy.reload();
          return cancelScanState(retry + 1);
        }
      };
      return cancelScanState();
    });
  }

  checkScanPresence(tables: Table, column: string, scanName: string) {
    recurse(
      () => table.getListOfColumnValues(tables, column),
      (result) => result.includes(scanName),
      {
        limit: 20,
        timeout: 120_000,
        delay: 5000,
        log: true,
        post() {
          cy.reload();
        },
      }
    );
  }

  checkScanStatusState(tables: Table, column: string, status: string) {
    recurse(
      () => table.getListOfColumnValues(tables, column),
      (result) => result.includes(status),
      {
        limit: 15,
        timeout: 120_000,
        delay: 7500,
        log: true,
        post() {
          cy.reload();
        },
      }
    );
  }

  verifyScanCreated(tableType: Table) {
    table.getListOfColumnValues(tableType, "Status").then((element) => {
      const scanStatus = element.includes("Running")
        ? "Running"
        : element.includes("Queued")
        ? "Queued"
        : null;

      if (!scanStatus) {
        throw new Error("Scan status should be either 'Running' or 'Queued'");
      }

      this.checkScanStatusState(tableType, "Status", scanStatus);
    });
  }

  downloadScanReport() {
    this.actionButton.click();
    this.actionButtonModal.should("be.visible");
    this.hoverDownloadButton();
    this.excelModal.should("be.visible").click();
    this.downloadNotification.should("be.visible");
  }

  changeScanScopeConfiguration() {
    this.actionChangeSchedule.click();
    cy.wait(1000);
    this.changeScheduleScope.click();
    modal.modalBody.should("be.visible");
    modal.approveActionButton.click();
  }

  deleteScheduledScan(scanName: string) {
    scanManagementService.interceptDeleteScheduledScan(scanName);
    this.deleteSchedule.click();
    modal.approveActionButton.click();
    scanManagementService.verifyDeleteScheduledScan(scanName);
  }

  getDaysAgo(daysAgo) {
    const today = new Date();
    today.setUTCDate(today.getUTCDate() - daysAgo);
    const day = today.getUTCDate();
    const month = today.toLocaleString("en-GB", {
      month: "short",
      timeZone: "UTC",
    });
    const year = today.getUTCFullYear();

    return `${day} ${month}, ${year}`;
  }

  getDaysLater(daysLater) {
    const today = new Date();
    today.setUTCDate(today.getUTCDate() + daysLater);
    const day = today.getUTCDate();
    const month = today.toLocaleString("en-GB", {
      month: "short",
      timeZone: "UTC",
    });
    const year = today.getUTCFullYear();

    return `${day} ${month}, ${year}`;
  }
}

export default new ScanningPage();
