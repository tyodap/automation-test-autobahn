import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import modal from "../../utils/components/modal";
import sidebar from "../../utils/components/sidebar";
import setting from "../../utils/pages/setting";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["Owner Smoke Prod"]
    : usersTest["Owner Smoke Test"];

const validRuleName = setting.generateRandomRuleName("Rule-_.123+");
const updateRuleName = setting.generateRandomRuleName("Rule-updated");
const existingRuleName = "existing-rule";
const tag = "another-tag";
const specialChar = "@#!*()撾部غانتنع";
const longRuleName =
  "This is the test of e2e automation for scan validation on this part we would like to test the maximum character";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Settings);
});

describe("Auto assignment rule", () => {
  it("Should be able to create a new rule", () => {
    /**
     * 1. Verify add form visible
     * 2. User able to input rule name
     * 3. User able to input tags
     * 4. User able to input assignee
     * 5. User able to save the rule
     * 6. Verify rule created
     * 7. Verify the rule tag
     * 8. Verify the rule assignee
     */
    setting.ruleTab.click();
    setting.createNewRule(validRuleName, tag, orgAdmin.name);
    setting.checkRuleCreated(validRuleName, tag, orgAdmin.name);
  });

  it("Should not be able to user existing rule name", () => {
    /**
     * 1. Should get error message use existing rule name
     */
    setting.ruleTab.click();
    setting.addRuleButton.click();
    setting.ruleDrawer.should("be.visible");
    setting.ruleName.type(existingRuleName);
    setting.inputTag.click();
    setting.errorMessage.should(
      "contain.text",
      "This rule name is already taken"
    );
  });

  it("Should not be able to use another special char", () => {
    /**
     * 1. Should get error message use special char on rule name
     */
    setting.ruleTab.click();
    setting.addRuleButton.click();
    setting.ruleDrawer.should("be.visible");
    setting.ruleName.type(specialChar);
    setting.inputTag.click();
    setting.errorMessage.should(
      "contain.text",
      `Invalid format. Please use only A-Z, a-z, 0-9, space or special characters like "_-.+", trailing and leading space is not alowed`
    );
  });

  it("Should not be able to use rule name more than 64 character", () => {
    /**
     * 1. Should get error message use more than 64 char for name
     */
    setting.ruleTab.click();
    setting.addRuleButton.click();
    setting.ruleDrawer.should("be.visible");
    cy.wait(1500);
    setting.ruleName.type(longRuleName);
    setting.inputTag.click();
    setting.errorMessage.should(
      "contain.text",
      "Rule name must be 64 characters or fewer"
    );
  });

  it("Should not be able to have empty rule name", () => {
    /**
     * 1. Should get error with empty rule name
     */
    setting.ruleTab.click();
    setting.addRuleButton.click();
    setting.ruleDrawer.should("be.visible");
    cy.wait(1500);
    setting.ruleName.type(validRuleName);
    setting.ruleName.clear();
    setting.errorMessage.should("contain", "Rule name is required");
  });

  it("Should not be able to have empty tag", () => {
    /**
     * 1. Should get error with empty tag
     */
    setting.ruleTab.click();
    setting.addRuleButton.click();
    setting.ruleDrawer.should("be.visible");
    setting.ruleName.type("dummyRuleName");
    setting.removeTag(tag);
    setting.errorMessage.should("contain", "Tags is required");
  });

  it("Should not be able to have empty assignee", () => {
    /**
     * 1. Should get error with empty assignee
     */
    setting.ruleTab.click();
    setting.addRuleButton.click();
    setting.ruleDrawer.should("be.visible");
    setting.ruleName.type("dummyRuleName");
    setting.removeAssignee(orgAdmin.name);
    setting.errorMessage.should("contain", "Assignees is required");
  });

  it("Should be able to update rule", () => {
    setting.ruleTab.click();
    setting.actionRuleButton.click();
    setting.editRule.click();
    setting.ruleDrawer.should("be.visible");
    cy.wait(1500);
    setting.tagColumn.should("contain", tag);
    setting.assigneeColumn.should("contain", orgAdmin.name);
    setting.ruleName.clear().type(updateRuleName);
    setting.saveRuleButton.click();
    modal.messageComponent.should("not.exist");
    cy.wait(2000);
    cy.reload();
    setting.checkRuleList(updateRuleName);
  });

  it("Should not be able to update rule with existing name", () => {
    setting.ruleTab.click();
    setting.actionRuleButton.click();
    setting.editRule.click();
    setting.ruleDrawer.should("be.visible");
    cy.wait(1500);
    setting.ruleName.clear().type(existingRuleName);
    setting.errorMessage.should(
      "contain.text",
      "This rule name is already taken"
    );
  });

  it("Should be able to disable and enable rule", () => {
    /**
     * 1. Verify rule can be enable and disable
     */
    setting.ruleTab.click();
    setting.toggleButton.click();
    setting.toggleButton.should("have.attr", "aria-checked", "false");
    setting.toggleButton.click();
    setting.toggleButton.should("have.attr", "aria-checked", "true");
  });

  it("Should be able to see the asset assignment rule is enable and able to go rule page", () => {
    /**
     * 1. Verify asset page that org has rule assignment enable
     * 2. Verify go to view setting to open rule
     */
    sidebar.openMenu(pages.Assets);
    setting.ruleAssignmentEnable.should("be.visible");
    setting.goToRulePage.click();
    setting.addRuleButton.should("be.visible");
  });
});
