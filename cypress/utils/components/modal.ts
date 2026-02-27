class Modal {
  /**
   * Getter methods for retrieving elements in the modal and associated UI components.
   */

  get modalBody() {
    return cy.get('div[aria-modal="true"]', { timeout: 20000 });
  }

  get approveActionButton() {
    return this.modalBody.find(".ant-btn-primary");
  }

  get approveScanCreateButton() {
    return this.modalBody.find(".fast-btn-primary");
  }

  get approveDelete() {
    return this.modalBody.find(".ant-btn-dangerous");
  }

  get approveDeleteInstance() {
    return this.modalBody.find(".ant-btn-primary").contains("Yes");
  }

  get cancelActionButton() {
    return this.modalBody.find(".ant-btn-default");
  }

  get messageComponent() {
    return cy.get('[class="ant-message-notice-content"]', { timeout: 20000 });
  }

  get messagePopup() {
    return cy.get('[class="fast-message-notice-content"]', { timeout: 20000 });
  }

  get acceptCheckbox() {
    return cy.get(".ant-modal-content").find(".ant-checkbox-input");
  }

  get acceptCheckboxScanCreate() {
    return cy.get(".fast-modal-content").find(".fast-checkbox-input");
  }

  get modalScanScopeCreated() {
    return cy.get(".fast-message-custom-content");
  }
  /**
   * Functions for interacting with the modal.
   * These functions utilize the getter methods defined above.
   */

  modalTitle(title: string) {
    return this.modalBody.contains(title);
  }

  confirmAssetOwnership() {
    this.modalTitle("Asset ownership confirmation").should("be.visible");
    this.approveScanCreateButton.should("have.attr", "disabled");
    this.acceptCheckboxScanCreate.check();
    this.approveScanCreateButton.click();
    this.modalBody.should("not.exist");
  }

  noAssetSelectedWarning() {
    this.modalTitle("No targets selected").should("be.visible");
  }

  cancelFileUpload() {
    this.modalTitle("Cancel upload").should("be.visible");
    this.cancelActionButton.last().click();
  }

  confirmCustomDashboardDelete() {
    this.modalTitle("Delete dashboard").should("be.visible");
    this.approveDelete.click();
  }

  confirmAssetAssignee() {
    this.messageComponent.should("not.exist");
  }

  confirmIntegration() {
    this.messageComponent.should("not.exist");
  }

  confirmDeletionAsset() {
    this.messageComponent.should("not.exist");
  }

  confirmUpdateTag() {
    this.messageComponent.should("not.exist");
  }

  confirmUpdateCriticality() {
    this.messageComponent.should("not.exist");
  }

  confirmDeleteInstances() {
    this.modalTitle("Delete this instance").should("be.visible");
    this.approveDeleteInstance.click();
  }
}

export default new Modal();
