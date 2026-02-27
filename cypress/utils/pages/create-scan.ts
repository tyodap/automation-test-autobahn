import scanConfigService from "../services/scan-config-service";

class CreateScanPage {
  get validScanName() {
    return cy.get('[aria-label="check-circle"]');
  }

  get titleScanConfiguration() {
    return cy.get("h2[data-testid='typography-title']");
  }

  get titleAddAssets() {
    return cy.get("h3[data-testid='typography-title']");
  }

  get formScanName() {
    return cy.get("#scan_name");
  }

  get addDescription() {
    return cy.get('[type="button"]').contains("Add description");
  }
  get formAddDescription() {
    return cy.get("#scan_description");
  }

  get formCompanyName() {
    return cy.get("[data-testid='company-name-input']");
  }

  get formAssets() {
    return cy.get("#pre-import-asset");
  }

  get formDescription() {
    return cy.get("[data-testid='description-input']");
  }

  get addAssetButton() {
    return cy.get('[data-testid="add-pre-import-asset-button"]');
  }

  get nextButton() {
    return cy.get('[type="button"]').contains("Next");
  }

  get previousButton() {
    return cy.get('[type="button"]').contains("Previous");
  }

  get cancelButton() {
    return cy.get('[type="button"]').contains("Cancel");
  }

  get startScanButton() {
    return cy.get('[type="button"]').contains("Apply");
  }

  get scanSummary() {
    return cy.get(".fast-card-body");
  }

  get tableList() {
    return cy.get(".fast-tabs-nav-list");
  }

  get scanName() {
    return cy.get("input#scan_name", { timeout: 60000 });
  }

  get scheduleSelection() {
    return cy.get("[title='No schedule (start immediately)']");
  }

  get scheduleRepeatOnce() {
    return cy.get("[data-testid='repeat-type-once']");
  }

  get scheduleRepeatMonthly() {
    return cy.get("[data-testid='repeat-type-monthly']");
  }

  get dateTimeRange() {
    return cy.get("[data-testid='date-picker']");
  }

  get timeRange() {
    return cy.get('[data-testid="time-picker"]');
  }

  get monthlyTypeDay() {
    return cy.get("[value='DAY']");
  }

  get criticalityOne() {
    return cy.get("[aria-label='Moderate']");
  }

  get criticalityTwo() {
    return cy.get("[aria-label='Substantial']");
  }

  get errorMessage() {
    return cy.get("[class='fast-form-item-explain-error']");
  }

  get inputAssignee() {
    return cy.get("input[id='assignees']");
  }

  get inputTag() {
    return cy.get("input[id='tags']");
  }

  get formAssignee() {
    return cy.get("[class='fast-select-selection-overflow']").first();
  }

  get formTag() {
    return cy.get("[class='fast-select-selection-overflow']").last();
  }

  checkboxPorts(portName: string) {
    return cy
      .get("span")
      .contains(portName)
      .then(($port) => {
        $port.siblings("span.ant-checkbox");
      });
  }

  detailScans(expectedName: string) {
    return this.scanSummary.contains(expectedName);
  }

  inputScanDetail(scanName: string, scanDescription: string) {
    this.formScanName.type(scanName);
    this.addDescription.click();
    this.formAddDescription.should("be.visible");
    this.formAddDescription.type(scanDescription);
    this.validScanName.should("be.visible");
  }

  inputManualAsset(assetDomain: string) {
    this.formAssets.type(assetDomain);
    this.addAssetButton.click();
  }

  checkSelected(assetDomain: string) {
    return cy.get(`[data-row-key="${assetDomain}"]`).find("span");
  }

  startScan(scanName: string) {
    scanConfigService.interceptScanCreate(scanName);
    this.startScanButton.click();
    this.startScanButton.should("not.have.class", "ant-button-loading");
    scanConfigService.verifyScanCreate(scanName);
  }

  generateRandomScanName(prefix: string) {
    return `${prefix}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-")}`;
  }

  get checkSelectedAsset() {
    return cy.get('[data-testid="table-added-asset"] tbody > tr').find("span");
  }

  createSchedule(date: string) {
    this.scheduleSelection.click();
    cy.wait(1000);
    this.scheduleRepeatMonthly.click();
    cy.wait(1000);
    this.monthlyTypeDay.click();
    this.dateTimeRange.clear();
    this.dateTimeRange
      .type(date, { force: true })
      .type("{enter}", { force: true });
    cy.wait(2000);
  }
}

export default new CreateScanPage();
