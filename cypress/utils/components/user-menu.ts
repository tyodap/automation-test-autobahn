import { Organization } from "../../fixtures/interfaces/organization.interface";
import { pages } from "../../fixtures/constants/pages";

class UserMenu {
  get userMenu() {
    return cy.get("div.flex.items-center.w-full.mb-sm");
  }

  get openedMenu() {
    return cy.get("ul.ab-org-panel-menu");
  }

  get settings() {
    return cy.get("[data-icon='cog']");
  }

  get userRole() {
    return cy.get("span.text-xs");
  }

  get logout() {
    return cy.get("[data-icon='sign-out']");
  }

  get search() {
    return cy.get("input[placeholder='Search']");
  }

  get searchButton() {
    return cy.get("span.ant-input-group-addon");
  }

  get orgList() {
    return cy.get("ul.ant-dropdown-menu-item-group-list");
  }

  get orgSearching() {
    return cy.get("li.ant-dropdown-menu-item-only-child");
  }

  openSettings() {
    this.userMenu.click();
    this.openedMenu.should("be.visible").within(() => {
      this.settings.click();
    });

    cy.verifyIfOpen(pages.Settings);
  }

  changeOrg(targetOrg: Organization) {
    this.userMenu.click();
    this.search.first().type(targetOrg.name).blur();
    this.searchButton.first().click();
    cy.wait(2000);
    this.orgList.contains(targetOrg.name).click();
  }

  logoutUser() {
    this.userMenu.click();
    this.openedMenu.should("be.visible");
    cy.wait(2000);
    this.logout.first().click();
  }
}

export default new UserMenu();
