import { Page } from "../../fixtures/interfaces/page.interface";

class Sidebar {
  get sidebar() {
    return cy.get('[data-testid="sidebar"]');
  }

  get expandSidebar() {
    return cy.get('[data-testid="toggle-collapsed"]');
  }

  openMenu(page: Page) {
    this.sidebar.contains(page.menu).click();
    cy.verifyIfOpen(page);
  }
}

export default new Sidebar();
