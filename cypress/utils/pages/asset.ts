import { User } from "../../fixtures/interfaces/user.interface";
import { Asset } from "../../fixtures/interfaces/asset.interface";
import { tables } from "../../fixtures/constants/table";
import assetInventoryService from "../services/asset-inventory-service";
import modal from "../components/modal";
import { Table } from "../../fixtures/interfaces/table.interface";
import { recurse } from "cypress-recurse";
import table from "../../utils/components/table";

class AssetsPage {
  get assetListPage() {
    return cy.get('[data-testid="assets-overview"]');
  }

  get uploadButton() {
    return cy.get('a[href="/assets/import/manual"]');
  }

  get downloadButton() {
    return cy.get("[type='button']").contains("Download");
  }

  get integrateButton() {
    return cy.get("[type='button']").contains("Integrate");
  }

  get discoverButton() {
    return cy.get('a[href="/assets/import/discover"]');
  }

  get assetsBreakdownSection() {
    return cy.get(
      '[data-testid="assets-breakdown-section"] [data-testid="typography-title"]'
    );
  }

  get portsBreakdownSection() {
    return cy.get(
      '[data-testid="ports-breakdown-section"] [data-testid="typography-title"]'
    );
  }

  get assetOverviewCardDate() {
    return cy.get(
      "[data-testid='assets-breakdown-section'] :nth-child(2) .grid > :nth-child(1) div .text-xs"
    );
  }

  get portOverviewCardDate() {
    return cy.get(
      "[data-testid='ports-breakdown-section'] :nth-child(2) .grid > :nth-child(1) div .text-xs"
    );
  }

  get criticalityLevelThree() {
    return (
      cy.get(
        '[data-testid="assets-list-table"] tr [aria-posinset="1"][aria-checked="true"]'
      ),
      cy.get(
        '[data-testid="assets-list-table"] tr [aria-posinset="2"][aria-checked="true"]'
      ),
      cy.get(
        '[data-testid="assets-list-table"] tr [aria-posinset="3"][aria-checked="true"]'
      )
    );
  }

  get criticialityLevelZero() {
    return cy.get('[data-testid="assets-list-table"]').contains("Not set");
  }

  get editCriticality() {
    return cy.get("[type=button]").contains("Edit criticality");
  }

  get selectCriticalLevelThree() {
    return cy.get("label.ant-radio-button-wrapper").contains("Critical");
  }

  get selectCriticalLevelZero() {
    return cy.get("label.ant-radio-button-wrapper").contains("Not set");
  }

  get editAssignee() {
    return cy.get(
      ".table-action-container__bulk-action-container > :nth-child(2)"
    );
  }

  get editTag() {
    return cy.get(
      ".table-action-container__bulk-action-container > :nth-child(3)"
    );
  }

  get addTagsButton() {
    return cy.get(".ant-radio-group > :nth-child(1)");
  }

  get removeTagsButton() {
    return cy.get(".ant-radio-group > :nth-child(2)");
  }

  get selectedTag() {
    return cy.get('[class="ant-select-selector"]');
  }

  get selectTagPlaceholder() {
    return cy.get("[type='search']").not("[aria-expanded='false']");
  }

  get deleteAssetButton() {
    return cy.get(".ant-btn-dangerous").contains("Delete");
  }

  get deleteConfirmation() {
    return cy
      .get(".ant-modal-confirm-btns > .ant-btn-dangerous > span")
      .contains("Delete");
  }

  get addAssignee() {
    return cy.get(".ant-radio-group > :nth-child(1)");
  }

  get drawerTitle() {
    return cy.get(".ant-drawer-header-title");
  }

  get selectedActionTitle() {
    return cy.get("div.mt-12 h3");
  }

  get selectedAssetsAssignees() {
    return cy.get('[data-testid="selected-assets-wrapper"]');
  }

  get firstAsset() {
    return cy
      .get(
        '[class="text-ellipsis whitespace-nowrap overflow-hidden absolute left-0 right-0"]'
      )
      .first();
  }

  get removeAssignee() {
    return cy.get(".ant-radio-group > :nth-child(2)");
  }

  get inputAssignee() {
    return cy.get(".ant-select-selection-overflow");
  }

  get assigneeDropdown() {
    return cy.get("div.ant-select-dropdown");
  }

  getAssigneeSelection(user: User) {
    return cy.get('[data-testid="select-users-option"]').contains(user.name);
  }

  get selectedUser() {
    return cy.get('[data-testid="label-option-select-user"]');
  }

  get listOfUsers() {
    return cy.get(".rc-virtual-list-holder-inner");
  }

  get applyButton() {
    return cy.get('[data-testid="aov--btn--apply--1"]');
  }

  get assetOverviewAsset() {
    return cy.get("[class='font-semibold']").contains("assets").invoke("text");
  }

  private checkDrawerOpen() {
    this.drawerTitle.should("be.visible");
    this.drawerTitle.should("contain.text", "Edit");
  }

  get assetTableView() {
    return cy.get(".ant-table-expanded-row-fixed");
  }

  get selectAllAssets() {
    return cy.get('[data-testid="mass-selection-btn"]');
  }

  private inputUserDrawer(user: User) {
    this.inputAssignee.click();
    this.assigneeDropdown
      .should("be.visible")
      .and("not.have.class", "ant-dropdown-hidden")
      .within(() => this.getAssigneeSelection(user).click());
    this.drawerTitle.click();
    this.selectedActionTitle.click();
    this.listOfUsers.should("not.be.visible");
    cy.wait(1000);
  }

  generateTodayFormattedDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return day + " " + month + ", " + year;
  }

  addOverviewAssignee(user: User) {
    const alias = `addAssignee-${user.name}`;
    assetInventoryService.interceptAddOverviewAssigneeUser(alias);
    table.selectOnlyDataRowBulkActions(tables.Assets);
    this.editAssignee.click();
    this.checkDrawerOpen();
    this.addAssignee.click();
    this.addAssignee.should("have.class", "ant-radio-button-wrapper-checked");
    this.selectedActionTitle.contains("Add assignees");
    this.inputUserDrawer(user);
    cy.wait(2000);
    this.applyButton.click();
    assetInventoryService.verifyBulkAssignee(alias);
  }

  removeOverviewAssignee(user: User) {
    const alias = `removeAssignee-${user.name}`;
    assetInventoryService.interceptRemoveOverviewAssigneeUser(alias);
    table.selectOnlyDataRowBulkActions(tables.Assets);
    this.editAssignee.click();
    this.checkDrawerOpen();
    this.removeAssignee.click();
    this.removeAssignee.should(
      "have.class",
      "ant-radio-button-wrapper-checked"
    );
    this.selectedActionTitle.contains("Remove assignees");
    this.inputUserDrawer(user);
    cy.wait(2000);
    this.applyButton.click();
    assetInventoryService.verifyBulkAssignee(alias);
  }

  deleteAsset(asset: Asset) {
    const alias = `assetDeletion-${asset.assetDomain}`;
    assetInventoryService.interceptDeletionAsset(alias);
    table.selectOnlyDataRowBulkActions(tables.Assets);
    cy.wait(2000);
    this.deleteAssetButton.click();
    cy.wait(2000);
    this.deleteConfirmation.click();
    assetInventoryService.verifyDeletionAsset(alias);
  }

  addTag(tag: string) {
    assetInventoryService.interceptAddTags(tag);
    table.selectOnlyDataRowBulkActions(tables.Assets);
    this.editTag.click();
    this.checkDrawerOpen();
    this.addTagsButton.click();
    this.addTagsButton.should("have.class", "ant-radio-button-wrapper-checked");
    cy.wait(3000);
    this.selectTagPlaceholder
      .type(tag, { force: true })
      .type("{enter}", { force: true });
    this.addTagsButton.click({ force: true });
    this.selectedTag.should("be.visible").contains(tag);
    this.applyButton.click();
    assetInventoryService.verifyAddTags(tag);
    modal.confirmUpdateTag();
  }

  removeTag(tag: string) {
    assetInventoryService.interceptRemoveTags(tag);
    table.selectOnlyDataRowBulkActions(tables.Assets);
    this.editTag.click();
    this.checkDrawerOpen();
    this.removeTagsButton.click();
    this.removeTagsButton.should(
      "have.class",
      "ant-radio-button-wrapper-checked"
    );
    cy.wait(3000);
    this.selectTagPlaceholder
      .type(tag, { force: true })
      .type("{enter}", { force: true });
    this.selectedTag.should("be.visible").contains(tag);
    this.applyButton.click();
    assetInventoryService.verifyAddTags(tag);
    modal.confirmUpdateTag();
  }

  addCriticality() {
    assetInventoryService.interceptUpdateCriticality("Update Criticality");
    table.selectOnlyDataRowBulkActions(tables.Assets);
    this.editCriticality.click();
    this.checkDrawerOpen();
    this.selectCriticalLevelThree.click();
    cy.wait(1000);
    this.applyButton.click();
    assetInventoryService.verifyUpdateCriticality("Update Criticality");
    modal.confirmUpdateCriticality();
  }

  removeCriticality() {
    assetInventoryService.interceptUpdateCriticality("Update Criticality");
    table.selectOnlyDataRowBulkActions(tables.Assets);
    this.editCriticality.click();
    this.checkDrawerOpen();
    this.selectCriticalLevelZero.click();
    cy.wait(1000);
    this.applyButton.click();
    assetInventoryService.verifyUpdateCriticality("Update Criticality");
    modal.confirmUpdateCriticality();
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
        },
      }
    );
  }

  checkAssigneePresence(tables: Table, column: string, assignee: string) {
    recurse(
      () => table.getListOfColumnValues(tables, column),
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

export default new AssetsPage();
