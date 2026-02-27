import modal from "../components/modal";
import scanManagementService from "../services/scan-management-service";

class ScanStatusPage {
  get scanStatusCard() {
    return (
      cy.get(".ant-card-body").contains("Scan") &&
      cy.get(".ant-card-body").contains("Revision") &&
      cy.get(".ant-card-body").contains("Started on") &&
      cy.get(".ant-card-body").contains("Elapsed time") &&
      cy.get(".ant-card-body").contains("Assignee") &&
      cy.get(".ant-card-body").contains("Description")
    );
  }

  get scanAssignee() {
    return cy.get('[data-testid="assignee"]');
  }

  get scanDescription() {
    return cy.get("div.flex.flex-row").last();
  }

  get scanHostStatus() {
    return cy.get("[data-testid='scan-status']");
  }

  get scanStatus() {
    return cy.get("[data-testid='scan-vulnerability-status']");
  }

  get cancelScanButton() {
    return cy.get(".ant-btn-dangerous");
  }

  get openServiceLabel() {
    return cy
      .get('[data-testid="typography-title"]')
      .contains("Scanned open services");
  }

  get nonAliveHostLabel() {
    return cy
      .get('[data-testid="typography-title"]')
      .contains("Non alive hosts");
  }

  get manualTargetLabel() {
    return cy.get('[data-testid="typography-title"]').contains("Targets");
  }

  get portLabel() {
    return cy.get('[data-testid="typography-title"]').contains("Ports");
  }

  get backAllScansButton() {
    return cy.get('[data-testid="button-back-to-previous-page"]');
  }

  cancelScan(scanName: string) {
    this.cancelScanButton.should("not.have.attr", "disabled");
    this.cancelScanButton.click();
    modal.modalTitle("Cancel this scan").should("be.visible");
    scanManagementService.interceptCancelScan(scanName);
    modal.approveActionButton.click();
    modal.approveActionButton.should("not.have.class", "ant-button-loading");
    modal.modalBody.should("not.exist");
    this.cancelScanButton.should("have.attr", "disabled");
    scanManagementService.verifyCancelScan(scanName);
  }
}

export default new ScanStatusPage();
