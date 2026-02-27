import modal from "../components/modal";

class CreateCustomDashboard {
  get inputDashboardName() {
    return cy.get('[data-testid="dashboard-name-input"]');
  }

  get inputAssetTags() {
    return cy.get('[data-testid="asset-tags"]');
  }

  get selectTagPlaceholder() {
    return cy.get("[type='search']").not("[aria-expanded='false']");
  }

  get createButton() {
    return cy.get("[type='button']").contains("Create");
  }

  get applyButton() {
    return cy.get("[type='button']").contains("Apply");
  }

  get delete() {
    return cy.get("[type='button']").contains("Delete dashboard");
  }

  get errorMessage() {
    return cy.get("div.ant-form-item-explain-error");
  }

  get visibilityButton() {
    return cy.get('[data-icon="share-nodes"]');
  }

  get visibilityDrawer() {
    return cy.get('[data-testid="form-update-dashboard-visibility"]');
  }

  get privateVisibility() {
    return cy.get('[value="private"]');
  }

  get saveVisibilityButton() {
    return cy.get('[data-testid="submit-dashboard-visibility-button"]');
  }

  get displayPrivate() {
    return cy.get("span.fast-tag.status-tag-blue").contains("Private");
  }

  generateValidCustomDashboardName(prefix: string) {
    return `${prefix}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-")}`;
  }

  inputTags(tag: string) {
    this.inputAssetTags.click();
    cy.wait(1000);
    this.selectTagPlaceholder
      .type(tag, { force: true })
      .type("{enter}", { force: true });
  }

  createCustomDashboard(dashboardName: string) {
    this.inputDashboardName.type(dashboardName).blur();
    this.createButton.contains("Create").click();
  }

  deleteCustomDashboard() {
    this.delete.click();
    modal.confirmCustomDashboardDelete();
  }

  changeVisibility() {
    this.visibilityButton.click();
    this.visibilityDrawer.should("be.visible");
    this.privateVisibility.click();
    this.saveVisibilityButton.click();
  }
}

export default new CreateCustomDashboard();
