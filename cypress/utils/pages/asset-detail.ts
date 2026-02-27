import { recurse } from "cypress-recurse";
import { Asset } from "../../fixtures/interfaces/asset.interface";
import { User } from "../../fixtures/interfaces/user.interface";
import assetInventoryService from "../services/asset-inventory-service";

class AssetDetailsPage {
  get assetName() {
    return cy.get("span.ant-page-header-heading-title");
  }

  get assetDetailOverview() {
    return cy.get('[data-testid="asset-detail-overview"]');
  }

  get assetDetailAssignee() {
    return cy.get('[data-testid="assignee-info"]').last().invoke("text");
  }

  get assetDetailTag() {
    return cy
      .get('[class="item-title"]')
      .contains("Tags")
      .siblings()
      .invoke("text");
  }

  get downloadButton() {
    return cy.get("[type='button']").contains("Download");
  }

  get networkOverview() {
    return cy.get('[class="item-title"]').contains("Network").siblings();
  }

  get scannedByOverview() {
    return cy.get('[class="item-title"]').contains("Source").siblings();
  }

  get originLogo() {
    return cy.get("div.shrink-0");
  }

  get originTooltip() {
    return cy.get("[role='tooltip']").not(".ant-tooltip-hidden");
  }

  get portOverview() {
    return cy.get('[data-testid="ports-breakdown-section"]');
  }

  get portCount() {
    return cy.get("div.score-section");
  }

  get portDetails() {
    return cy.get('[data-testid="assets-details-table-card"]');
  }

  get issueDetails() {
    return cy.get('[data-testid="issue-details"]');
  }

  get issueDetailNewlyDetectedCard() {
    return cy.get(
      '[data-testid="issue-detail-datacard-container"] :nth-child(1) div .card-body.center .ant-spin-container > span'
    );
  }

  get editButton() {
    return cy.get('[data-testid="adt--btn--overview-3"]');
  }

  get saveButton() {
    return cy.get('[data-testid="adt--btn--overview-2"]');
  }

  get assigneeColumn() {
    return cy.get(
      '[class="ant-select ab-select-user ant-select-multiple ant-select-show-search"]'
    );
  }

  get assigneeName() {
    return cy.get('[data-testid="assignee-info"]');
  }

  get backToAssetOverview() {
    return cy.get(".page-header-back-wrapper > div > .text-xs");
  }

  get buttonRemoveAssignee() {
    return cy.get('[data-testid="assignee-info"] [data-icon="times"]');
  }

  get tagColumn() {
    return cy.get('[class="asset-tags-container item-progress w-full"]');
  }

  get buttonRemoveTag() {
    return cy.get(
      '[class="ant-select-selection-item-remove"] [data-icon="times"]'
    );
  }

  get backAssetDetails() {
    return cy.get("[type='button']").contains("Back to asset detail");
  }

  addAssignee(user: User, assetId: string) {
    const alias = `addAssignee-${user.name}`;
    assetInventoryService.interceptAssigneeUser(assetId, alias);
    this.editButton.click();
    this.assigneeColumn.click().type(`${user.name}{enter}`);
    this.saveButton.click();
    assetInventoryService.verifyAssigneeUser(alias);
  }

  removeAssignee(user: User, assetId: string) {
    const alias = `removeAssignee-${user.name}`;
    assetInventoryService.interceptAssigneeUser(assetId, alias);
    this.editButton.click();
    this.buttonRemoveAssignee.should("be.visible").click();
    this.saveButton.click();
    assetInventoryService.verifyAssigneeUser(alias);
  }

  verifyLink(assetData: Asset) {
    cy.url().should("include", `${assetData.assetId}`);
  }

  addTag(asset: Asset) {
    const alias = `addTag-${asset.domainName}`;
    assetInventoryService.interceptAssetDetailsTags(asset.assetId, alias);
    this.editButton.click();
    this.tagColumn.click().type(`${asset.tag}{enter}`);
    this.saveButton.click();
    assetInventoryService.verifyAssetDetialsTags(alias);
  }

  removeTag(asset: Asset) {
    const alias = `removeTag-${asset.domainName}`;
    assetInventoryService.interceptAssetDetailsTags(asset.assetId, alias);
    this.editButton.click();
    this.buttonRemoveTag.should("be.visible").click();
    this.saveButton.click();
    assetInventoryService.verifyAssetDetialsTags(alias);
  }

  checkAssigneePresence(assignee: string) {
    recurse(
      () => this.assigneeName.invoke("text"),
      (result) => result.includes(assignee),
      {
        limit: 5,
        timeout: 60_000,
        delay: 5000,
        log: true,
        post() {
          cy.reload();
        },
      }
    );
  }
}

export default new AssetDetailsPage();
