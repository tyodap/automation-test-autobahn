class Step2Scanning {
  get assetInput() {
    return cy.get('[data-testid="domain-input"]');
  }

  get scanName() {
    return cy.get('[id="scan_name"]');
  }

  get nextButton() {
    return cy.get('[type="button"]').contains("Next");
  }

  get assetInputErrorMessage() {
    return cy
      .get('[id="addAssetForm_preImportAsset_help"]')
      .contains("Invalid IP address or domain");
  }

  get assetInputDuplicatedErrorMessage() {
    return cy
      .get('[id="addAssetForm_preImportAsset_help"]')
      .contains("IP address or domain already added");
  }

  get assetInputEmptyErrorMessage() {
    return cy
      .get('[id="addAssetForm_preImportAsset_help"]')
      .contains("Domain or IP address can't be blank");
  }

  get tooManyTagsErrorMessage() {
    return cy
      .get('[id="addAssetForm_preImportAsset_help"]')
      .contains("Tags limit reached");
  }

  get criticalityInput() {
    return cy.get('[id="cyber-report-industry-select"]');
  }

  get criticalityDropdown() {
    return cy.get("div.rc-virtual-list-holder-inner");
  }

  get criticalCriticality() {
    return cy.get("div.fast-select-item-option-content").contains("(Critical)");
  }

  get criticalCriticalityTable() {
    return cy.get('[aria-label="Critical"]');
  }

  get tagInput() {
    return cy.get('[data-testid="criticality-tags"]');
  }

  get addAsset() {
    return cy.get('[data-testid="add-pre-import-asset-button"]');
  }

  get emptyAddedAssetTable() {
    return cy
      .get('[class="grid place-items-center h-full"]')
      .contains("Here are the assets you added");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadFile(file: any) {
    cy.get("[data-testid='asset-upload']").selectFile(file, {
      force: true,
    });
  }

  get errorFileDrawer() {
    return cy.get('[data-testid="error-drawer"]');
  }

  get downloadTemplateFile() {
    return cy.get("[data-testid='download-assets-template']");
  }

  get uploadedFile() {
    return cy.get('[title="autobahn_manual_import_assets.csv"]');
  }

  get scanSettingsPage3() {
    return cy.get("span.fast-typography").contains("Scan settings");
  }
}

export default new Step2Scanning();
