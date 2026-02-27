import { recurse } from "cypress-recurse";
import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { Table } from "../../fixtures/interfaces/table.interface";
import table from "../components/table";
import vulnerabilityManagementService from "../services/vulnerability-management-service";
import { Issues } from "../../fixtures/interfaces/issue.interface";

class IssueDetailPage {
  get issueTitle() {
    return cy.get('h1[data-testid="typography-title"]', { timeout: 30000 });
  }
  get issueDetailCard() {
    const selector = "div.issue-details-content-wrapper div.title";
    return (
      cy.get(selector).contains("Severity") &&
      cy.get(selector).contains("Last detected") &&
      cy.get(selector).contains("First reported") &&
      cy.get(selector).contains("Description") &&
      cy.get(selector).contains("Risk") &&
      cy.get(selector).contains("CVE-ID") &&
      cy.get(selector).contains("Link to workout") &&
      cy.get(selector).contains("Quick remediation suggestion")
    );
  }

  get issueOverviewCard() {
    const selector = "div.accented-data-card.text-gray-9";
    return (
      cy.get(selector).contains("NEW") &&
      cy.get(selector).contains("ACTIVE") &&
      cy.get(selector).contains("RESURFACED") &&
      cy.get(selector).contains("RISK ACCEPTED") &&
      cy.get(selector).contains("REMEDIATED") &&
      cy.get(selector).contains("FALSE POSITIVE")
    );
  }

  get issueTotalIssueDetail() {
    return cy.get("[class='font-semibold']").contains("issues").invoke("text");
  }

  get totalNewIssues() {
    return cy.get("span.text-green-6");
  }

  get totalActiveIssues() {
    return cy.get("span.text-blue-5");
  }

  get totalResurfacedIssues() {
    return cy.get("span.text-magenta-5");
  }

  get totalRiskAcceptedIssues() {
    return cy.get("span.text-gold-6");
  }

  get totalRemediatedIssues() {
    return cy.get("span.text-purple-5");
  }

  get totalFalsePositiveIssues() {
    return cy.get("span.text-gray-7");
  }

  get scriptOutputColumn() {
    return cy.get("[type='button']").contains("View script");
  }

  get scriptOutputDrawer() {
    return cy.get("div.ant-drawer-body");
  }

  get scriptOutputText() {
    return this.scriptOutputDrawer.children().invoke("text");
  }

  get totalNewIssuesNumber() {
    return cy.get("span.text-green-6").invoke("text");
  }

  get totalActiveIssuesNumber() {
    return cy.get("span.text-blue-5").invoke("text");
  }

  get totalResurfacedIssuesNumber() {
    return cy.get("span.text-magenta-5").invoke("text");
  }

  get totalRiskAcceptedIssuesNumber() {
    return cy.get("span.text-gold-6").invoke("text");
  }

  get totalRemediatedIssuesNumber() {
    return cy.get("span.text-purple-5").invoke("text");
  }

  get totalFalsePositiveIssuesNumber() {
    return cy.get("span.text-gray-7").invoke("text");
  }

  get markIssueAsButton() {
    return cy.get(
      ".table-action-container__bulk-action-container > .ant-dropdown-trigger"
    );
  }

  get backLinkUrl() {
    return cy.get('[data-testid="issue-detail-app"] button.text-xs');
  }

  get issueStatus() {
    return cy.get('.issue-title [data-testid^="issue-asset-status-"]');
  }

  get severity() {
    return cy.get('[data-testid="level-severity"]');
  }

  get successUpdateIssueNotification() {
    return cy
      .get("div.ant-message-success")
      .contains("Issue is successfully updated");
  }

  get totalIssuesCount() {
    return cy.get(".score-section > span");
  }

  markIssueAs(status: string) {
    cy.get(`[data-menu-list="true"]`).contains(status).click();
  }

  verifyLink(issues: Issues) {
    cy.url().should(
      "include",
      `${issues.link}?origin_type=${issues.origin}&origin_source=${issues.originSource}`
    );
  }

  openIssueDetail(issues: Issues) {
    cy.visit(
      `${pages["Issue detail"].url}/${issues.link}?origin_type=${issues.origin}&origin_source=${issues.originSource}`
    );
    this.issueTitle.should("have.text", issues.issue);
  }

  updateIssueUsingBulkAction(status: string, tables: Table) {
    table.selectOnlyDataRowBulkActions(tables);
    this.markIssueAsButton.click();
    this.markIssueAs(status);
    this.successUpdateIssueNotification.should("not.be.visible");
    cy.wait(3000);
  }

  get editTagsButton() {
    return cy.get(".ant-btn-default").contains("Edit tag");
  }

  get editTagsDrawer() {
    return cy.get("[data-testid='scr--drw--edit-tags--1']");
  }

  get addTags() {
    return cy.get("[value='add']");
  }

  get selectTagPlaceholder() {
    return cy.get("[type='search']").not("[aria-expanded='false']");
  }

  get applyTags() {
    return cy.get("button.ant-btn-primary").contains("Apply");
  }

  get tagsUpdateNotification() {
    return cy
      .get("div.ant-message-success")
      .contains("Issue's tags successfully updated");
  }

  get removeTags() {
    return cy.get("[value='remove']");
  }

  get issueName() {
    return cy.get("[data-testid='typography-title']").first();
  }

  get selectedTags() {
    return cy.get("span.ant-select-selection-item").last();
  }

  addTag(tag: string) {
    vulnerabilityManagementService.interceptAddTags(tag);
    table.selectOnlyDataRowBulkActions(tables["Issue detail"]);
    this.editTagsButton.click();
    this.editTagsDrawer.should("be.visible");
    cy.wait(3000);
    this.addTags
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(3000);
    this.selectTagPlaceholder
      .type(tag, { force: true })
      .type("{enter}", { force: true });
    this.addTags.click({ force: true });
    this.selectedTags.should("be.visible").contains(tag);
    this.applyTags.click();
    this.tagsUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyAddTags(tag);
  }

  removeTag(tag: string) {
    vulnerabilityManagementService.interceptRemoveTags(tag);
    table.selectOnlyDataRowBulkActions(tables["Issue detail"]);
    this.editTagsButton.click();
    this.editTagsDrawer.should("be.visible");
    cy.wait(3000);
    this.removeTags
      .click({ force: true })
      .parent()
      .should("have.class", "ant-radio-button-checked");
    cy.wait(3000);
    this.selectTagPlaceholder.type("{enter}", { force: true });
    this.selectedTags.should("be.visible").contains(tag);
    this.applyTags.click();
    this.tagsUpdateNotification.should("be.visible");
    vulnerabilityManagementService.verifyRemoveTags(tag);
  }

  assertIssueCountingRemediated(
    totalActiveCounting: string,
    totalRemediatedCounting: string
  ) {
    const maxRetries = 2;

    const assertion = (retries: number = 0) => {
      return this.totalActiveIssues.then((mention: any) => {
        if (
          mention.text().includes(totalActiveCounting) &&
          retries < maxRetries
        ) {
          cy.log(`Counting is failing to update, Retry number: ${retries + 1}`);
          cy.reload();
          cy.wait(15000);
          return assertion(retries + 1);
        } else if (retries === maxRetries) {
          throw new Error(
            `Failed to update counting after ${retries} retries.`
          );
        } else {
          this.totalActiveIssues.should("be.visible");
          this.totalActiveIssues.should("have.text", +totalActiveCounting - 1);
          this.totalRemediatedIssues.should(
            "have.text",
            +totalRemediatedCounting + 1
          );
        }
      });
    };
    return assertion();
  }

  assertIssueCountingActive(
    totalActiveCounting: string,
    totalRemediatedCounting: string
  ) {
    const maxRetries = 2;

    const assertion = (retries: number = 0) => {
      return this.totalActiveIssues.then((mention: any) => {
        if (
          mention.text().includes(totalActiveCounting) &&
          retries < maxRetries
        ) {
          cy.log(`Counting is failing to update, Retry number: ${retries + 1}`);
          cy.reload();
          cy.wait(3000);
          return assertion(retries + 1);
        } else if (retries === maxRetries) {
          throw new Error(
            `Failed to update counting after ${retries} retries.`
          );
        } else {
          this.totalActiveIssues.should("be.visible");
          this.totalActiveIssues.should("have.text", +totalActiveCounting + 1);
          this.totalRemediatedIssues.should(
            "have.text",
            +totalRemediatedCounting - 1
          );
        }
      });
    };
    return assertion();
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

export default new IssueDetailPage();
