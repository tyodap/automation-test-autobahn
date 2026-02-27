import modal from "../components/modal";

class SettingsPage {
  get tabsList() {
    return cy.get("div.ant-tabs-nav-list");
  }

  // Personal
  get firstNameInput() {
    return cy.get("input#firstname");
  }

  get lastNameInput() {
    return cy.get("input#lastname");
  }

  get phonenNumberInput() {
    return cy.get("input#input-phone-number");
  }

  get inputFieldError() {
    return cy.get('div[role="alert"]');
  }

  get changePassword() {
    return cy.get('[data-testid="change-password-confirmation"]');
  }

  get inputJobTitle() {
    return cy.get("input#jobTitle");
  }

  get updateUserButton() {
    return cy.get('[data-testid="update-user-button"]');
  }

  //Security
  get manageOtpbutton() {
    return cy.get(`[data-testid="security-settings"] button`);
  }

  get securityTabBody() {
    return cy.get(`[data-testid="security-settings"]`);
  }

  get ruleTab() {
    return cy.get('[id="rc-tabs-0-tab-6"]');
  }

  get addRuleButton() {
    return cy.get("[type='button']").contains("Add rule");
  }

  get ruleDrawer() {
    return cy.get("div.fast-modal-content");
  }

  get ruleName() {
    return cy.get('[id="rule_name"]');
  }

  get inputTag() {
    return cy.get("input#tag_ids.fast-select-selection-search-input");
  }

  get tagColumn() {
    return cy.get("div.fast-select-selector").first();
  }

  get removeTagButton() {
    return cy.get('[data-icon="circle-xmark"]').first();
  }

  get ruleCondition() {
    return cy.get('[id="rule_type"]');
  }

  get ruleAssignee() {
    return cy.get("input#assignee_ids.fast-select-selection-search-input");
  }

  get assigneeColumn() {
    return cy.get("div.fast-select-selector").last();
  }

  get removeAssigneeButton() {
    return cy.get('[data-icon="close-circle"]');
  }

  get saveRuleButton() {
    return cy.get('[type="submit"]').contains("Save");
  }

  get errorMessage() {
    return cy.get("[class='fast-form-item-explain-error']");
  }

  get actionRuleButton() {
    return cy.get("button.fast-dropdown-trigger").first();
  }

  get editRule() {
    return cy.get("span.fast-dropdown-menu-title-content").contains("Edit");
  }

  generateRandomRuleName(prefix: string) {
    return `${prefix}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-")}`;
  }

  get ruleNameList() {
    return cy.get("span.ant-collapse-header-text");
  }

  checkRuleList(ruleName: string) {
    cy.get("span.ant-collapse-header-text").contains(ruleName).click();
  }

  checkAssignee(name: string) {
    cy.get("div.flex.flex-col.gap-md").last().should("contain", name);
  }

  checkTag(tag: string) {
    cy.get("div.flex.flex-col.gap-md.mb-md").last().should("contain", tag);
  }

  get actionButton() {
    return cy.get('[data-icon="ellipsis"]').last();
  }

  get editButton() {
    return cy
      .get("span.fast-dropdown-menu-title-content")
      .last()
      .contains("Edit");
  }

  get toggleButton() {
    return cy.get('button[role="switch"]').last();
  }

  get ruleAssignmentEnable() {
    return cy.get("div.fast-alert-message");
  }

  get goToRulePage() {
    return cy.get('a[href="/settings?active_tab=6"]');
  }

  get showMoreButton() {
    return cy.get('[type="button"]').contains("Show More");
  }

  get deleteAssetOlderThanRadio() {
    return cy.get('[name="onlyRemediateIssueRadio"]').eq(0);
  }

  get updateButton() {
    return cy.get('[type="submit"]').contains("Update").parent();
  }

  get successNotification() {
    return cy
      .get("div.fast-message-success")
      .contains("Features settings updated");
  }

  get resetRule() {
    return cy.get('[name="onlyRemediateIssueRadio"]').eq(2);
  }

  get assetUnitDropdown() {
    return cy.get('[id="false_unit"]');
  }

  get assetMonthDropDown() {
    return cy.get('[id="false_number"]');
  }

  get automatedRulesTooltipIcon() {
    return cy.get('[data-icon="circle-question"]');
  }

  get automatedRulesTooltip() {
    return cy.get('[role="tooltip"]');
  }

  hoverAutomatedRulesTooltip() {
    this.automatedRulesTooltipIcon.trigger("mouseover");
  }

  assetUnitSelection(unit: "Day(s)" | "Week(s)" | "Month(s)") {
    return cy.get(`[title="${unit}"]`);
  }

  assetMonthSelection(month: string) {
    return cy.get(`[title="${month}"]`);
  }

  verifyAllMonthSelectionExist() {
    for (let i = 1; i <= 6; i++) {
      this.assetMonthSelection(i.toString()).should("exist").and("be.visible");
    }

    cy.get(".rc-virtual-list-holder").then(($el) => {
      $el[0].scrollTop = $el[0].scrollHeight;
    });
    cy.wait(500);

    for (let i = 7; i <= 12; i++) {
      this.assetMonthSelection(i.toString()).should("exist").and("be.visible");
    }
  }

  openTab(tab: string) {
    this.tabsList.contains(tab).click();
  }

  //Security
  checkOtpStatus(status: string) {
    this.securityTabBody.contains(status).should("be.visible");
  }
  configureOTP(action: string) {
    this.manageOtpbutton.contains(action).click();
    modal.cancelActionButton.should("be.visible").click();
    //modal.cancelActionButton.click();
  }

  generateName() {
    return `${Math.floor(Math.random() * 100)}`;
  }

  selectTag(tag: string) {
    this.inputTag.click();
    cy.wait(1000);
    this.inputTag.type(tag, { force: true });
    cy.wait(2000);
    this.inputTag.type("{enter}", { force: true });
  }

  removeTag(tag: string) {
    this.inputTag.click();
    cy.wait(1000);
    this.inputTag.type(tag, { force: true });
    cy.wait(2000);
    this.inputTag.type("{enter}", { force: true });
    this.removeTagButton.click();
  }

  removeAssignee(user: string) {
    this.ruleAssignee
      .type(user, { force: true })
      .type("{enter}", { force: true });
    cy.wait(1000);
    this.removeAssigneeButton.click();
  }

  createNewRule(scanName: string, tag: string, user: string) {
    this.addRuleButton.click();
    this.ruleDrawer.should("be.visible");
    cy.wait(1000);
    this.ruleName.type(scanName);
    this.selectTag(tag);
    this.ruleAssignee
      .type(user, { force: true })
      .type("{enter}", { force: true });
    this.ruleName.click();
    this.tagColumn.should("contain", tag);
    this.assigneeColumn.should("contain", user);
    this.saveRuleButton.click();
    modal.messageComponent.should("not.exist");
    this.ruleDrawer.should("not.be.visible");
    cy.wait(2000);
  }

  checkData(ruleName: string, tag: string, name: string) {
    this.checkRuleList(ruleName);
    this.checkTag(tag);
    this.checkAssignee(name);
  }

  checkRuleCreated(ruleName: string, tag: string, name: string) {
    this.ruleNameList.then(($elements) => {
      let found = false;

      for (const index in $elements) {
        const el = $elements.get(Number(index));
        if (el?.innerText?.trim() === ruleName) {
          found = true;
          break;
        }
      }

      if (found) {
        this.checkData(ruleName, tag, name);
      } else {
        this.showMoreButton.click().then(() => {
          cy.wait(1000);
          this.checkRuleCreated(ruleName, tag, name);
        });
      }
    });
  }
}

export default new SettingsPage();
