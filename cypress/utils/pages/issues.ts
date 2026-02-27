import { recurse } from "cypress-recurse";
import { tables } from "../../fixtures/constants/table";
import { Preset } from "../../fixtures/interfaces/preset.interface";
import { Table } from "../../fixtures/interfaces/table.interface";
import table from "../components/table";
import vulnerabilityManagementService from "../services/vulnerability-management-service";
import { User } from "../../fixtures/interfaces/user.interface";

class Issues {
  get preset() {
    return cy.get('[id="preset"]');
  }

  presetSelection(preset: string) {
    return cy.get(".fast-select-item-option").contains(preset).click();
  }

  get markIssueAsButton() {
    return cy.get('[type="button"]').contains("Mark issue as ");
  }

  markIssueAs(status: string) {
    cy.get("span.fast-dropdown-menu-title-content").contains(status).click();
  }

  get successUpdateIssueNotification() {
    return cy
      .get("div.fast-message-notice-content")
      .contains("Issue is successfully updated");
  }

  get editTagsButton() {
    return cy.get('[type="button"]').contains("Edit tag");
  }

  get editDrawer() {
    return cy.get("div.fast-drawer-body");
  }

  get addTags() {
    return cy.get("[value='add']");
  }

  get removeTags() {
    return cy.get("[value='remove']");
  }

  get addTagPlaceholder() {
    return cy.get("input[aria-label='add custom tag']");
  }

  get removeTagPlaceholder() {
    return cy.get("input[aria-label='remove custom tag']");
  }

  get selectedTags() {
    return cy.get('[class="fast-select-selection-overflow-item"]');
  }

  get applyButton() {
    return cy.get(".fast-btn-primary").contains("Apply");
  }

  get tagsUpdateNotification() {
    return cy
      .get("div.fast-message-notice-content")
      .contains("Issue's tags successfully updated");
  }

  get assigneeDropdown() {
    return cy.get("div.fast-select-dropdown").last();
  }

  get inputAssignee() {
    return cy.get("input.fast-select-selection-search-input").last();
  }

  getAssigneeSelection(user: User) {
    return cy.get('[data-testid="select-users-option"]').contains(user.name);
  }

  get editAssigneeButton() {
    return cy.get('[type="button"]').contains("Edit Assignees");
  }

  get addAssignee() {
    return cy.get("[value='add']");
  }

  get removeAssignee() {
    return cy.get("[value='remove']");
  }

  get selectedAssignee() {
    return cy.get("div.fast-select-selection-overflow");
  }

  get assigneeUpdateNotification() {
    return cy
      .get("div.fast-message-notice-content")
      .contains("Issue's assignees successfully updated");
  }

  get drawerTitle() {
    return cy.get("div.fast-drawer-title");
  }

  get assignedAvatar() {
    return cy.get("[data-testid='scr--assignee-display--1']");
  }

  get unassignedAvatar() {
    return cy.get("[data-testid='avatar']");
  }

  get drawerBody() {
    return cy.get("div.fast-drawer-body");
  }

  get scriptOutputDrawer() {
    return cy.get("div.ant-drawer-body");
  }

  get scriptOutputText() {
    return this.scriptOutputDrawer.children().invoke("text");
  }

  get saveButton() {
    return cy.get("[type=button]").contains("Save");
  }

  get totalCriticalIssue() {
    return cy
      .get("span.fast-typography strong")
      .contains("Critical")
      .invoke("text");
  }

  get setupFilterButton() {
    return cy.get("[aria-label='open filter preset creation']");
  }

  get scriptOutputToggleButton() {
    return cy.get("[id='script_output_id_visibility']");
  }

  updateIssueUsingBulkAction(status: string, tableType: Table) {
    if (status == "Risk accepted") {
      table.selectOnlyDataRowBulkActions(tableType);
      this.markIssueAsButton.click();
      this.markIssueAs(status);
      this.drawerBody.should("be.visible");
      this.saveButton.click();
    } else {
      table.selectOnlyDataRowBulkActions(tableType);
      this.markIssueAsButton.click();
      this.markIssueAs(status);
      this.successUpdateIssueNotification.should("be.visible");
    }
  }

  selectPreset(preset: Preset) {
    this.preset.click();
    this.presetSelection(preset.name);
    cy.wait(2000);
  }

  addTag(tag: string) {
    vulnerabilityManagementService.interceptAddTags(tag);
    table.selectOnlyDataRowBulkActions(tables["Issues List - Optional"]);
    this.editTagsButton.click();
    this.editDrawer.should("be.visible");
    cy.wait(3000);
    this.addTags
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(3000);
    this.addTagPlaceholder
      .type(tag, { force: true })
      .type("{enter}", { force: true });
    this.addTags.click({ force: true });
    this.selectedTags.should("be.visible").contains(tag);
    this.applyButton.click();
    this.tagsUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyAddTags(tag);
  }

  removeTag(tag: string) {
    vulnerabilityManagementService.interceptRemoveTags(tag);
    table.selectOnlyDataRowBulkActions(tables["Issues List - Optional"]);
    this.editTagsButton.click();
    this.editDrawer.should("be.visible");
    cy.wait(3000);
    this.removeTags
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(3000);
    this.removeTagPlaceholder.type("{enter}", { force: true });
    this.selectedTags.should("be.visible").contains(tag);
    this.applyButton.click();
    this.tagsUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyRemoveTags(tag);
  }

  private inputUserDrawer(user: User) {
    this.inputAssignee.click();
    this.assigneeDropdown
      .should("be.visible")
      .within(() => this.getAssigneeSelection(user).click());
    this.drawerTitle.click();
    cy.wait(1000);
  }

  addIssueAssignee(user: User) {
    const alias = `addIssueAssignee-${user.name}`;
    vulnerabilityManagementService.interceptAddAssignee(alias);
    table.selectOnlyDataRowBulkActions(tables["Issues List - Optional"]);
    this.editAssigneeButton.click();
    this.editDrawer.should("be.visible");
    cy.wait(2000);
    this.addAssignee
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(2000);
    this.inputUserDrawer(user);
    this.applyButton.click();
    this.assigneeUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyAddAssignee(alias);
  }

  removeIssueAssignee(user: User) {
    const alias = `removeIssueAssignee-${user.name}`;
    vulnerabilityManagementService.interceptRemoveAssignee(alias);
    table.selectOnlyDataRowBulkActions(tables["Issues List - Optional"]);
    this.editAssigneeButton.click();
    this.editDrawer.should("be.visible");
    cy.wait(2000);
    this.removeAssignee
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(2000);
    this.inputUserDrawer(user);
    this.applyButton.click();
    this.assigneeUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyRemoveAssignee(alias);
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

export default new Issues();
