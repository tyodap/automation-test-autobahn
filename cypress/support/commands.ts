import { Page } from "../fixtures/interfaces/page.interface";
import { pages } from "../fixtures/constants/pages";
import { User } from "../fixtures/interfaces/user.interface";
import authService from "../utils/services/auth-service";
import login from "../utils/pages/login";

const envUrl = Cypress.config().baseUrl;

const roleSelector = "div.cursor-default";
const nameSelector = "span.ant-typography";

Cypress.Commands.add("login", (user: User) => {
  cy.visit(envUrl);

  authService.interceptToken();

  login.emailSelector.type(user.email);
  login.loginSelector.click();
  login.passwordSelector.should("be.visible");
  login.passwordSelector.type(user.password, {
    log: false,
  });
  login.loginSelector.click();
  login.loginLoading.should("not.exist", { timeout: 20000 });

  authService.saveTokenToFile(user);

  cy.get(nameSelector, { timeout: 30000 }).should("be.visible");

  cy.get(roleSelector, { timeout: 30000 })
    .should("be.visible")
    .then(($el) => {
      if ($el[0].innerText === "General user") {
        cy.verifyIfOpen(pages.Workouts);
      } else {
        cy.verifyIfOpen(pages.Dashboard);
      }
    });
});

Cypress.Commands.add("verifyIfOpen", (page: Page) => {
  cy.url({ timeout: 60000 }).should("include", page.url);
  cy.get(nameSelector, { timeout: 60000 }).should("be.visible");
  if (
    page.name == "Scanning" ||
    page.name == "Issues" ||
    page.name == "Create a scan" ||
    page.name == "Assets"
  ) {
    cy.get("[data-testid='typography-title']")
      .should("be.visible")
      .and("contain.text", page.name);
  } else {
    cy.get("span.ant-page-header-heading-title", { timeout: 30000 })
      .should("be.visible")
      .and("contain.text", page.name);
  }
});

Cypress.Commands.add("loginUsingSession", (user: User) => {
  cy.session(
    user.name,
    () => {
      cy.login(user);
    },
    {
      cacheAcrossSpecs: false,
    }
  );
});

Cypress.Commands.add("openPageUsingSession", (user: User, page: Page) => {
  cy.loginUsingSession(user);

  if (page.url == pages.Workouts.url) {
    if (user.role[0] == "General user") {
      cy.visit(`${page.url}/?view=personal`);
      cy.get('div.ant-tabs-nav [id*="tab-personal"]').should(
        "have.attr",
        "aria-selected",
        "true"
      );
    } else {
      cy.visit(`${page.url}/?view=organization`);
    }
  } else {
    cy.visit(page.url);
  }

  cy.verifyIfOpen(page);
});

Cypress.Commands.add("deleteDownloadsFolder", () => {
  const downloadsFolder = Cypress.config("downloadsFolder");

  cy.task("deleteFolder", downloadsFolder);
});
