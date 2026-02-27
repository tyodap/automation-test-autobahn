import { credential } from "../../fixtures/constants/integration-credential";
import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { workoutsProd, workoutsTest } from "../../fixtures/constants/workout";
import sidebar from "../../utils/components/sidebar";
import dashboard from "../../utils/pages/dashboard";
import integration from "../../utils/pages/integration";
import integrationJira from "../../utils/pages/integration-jira";
import workoutDetail from "../../utils/pages/workout-detail";
import contentService from "../../utils/services/content-service";
import jiraIntegrationService from "../../utils/services/jira-integration-service";

const testUser =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const testWorkout =
  Cypress.env("environment") === "PROD"
    ? workoutsProd["Update Microsoft Office"]
    : workoutsTest["Harden a database against error-based SQL injection"];

const jiraIntegrationNumber = 6;

before(() => {
  cy.loginUsingSession(testUser);
  jiraIntegrationService.removeJiraIntegrationCredentials(testUser);
});

beforeEach(() => {
  cy.openPageUsingSession(testUser, pages.Integrations);
});

describe("Integration - Jira", { tags: ["@daily"] }, () => {
  it("Add Jira credential", () => {
    integration.openIntegration(jiraIntegrationNumber, "Jira Software");
    integrationJira.configureJira(
      credential.cloudBasedIntegration.Jira.jiraServer,
      credential.cloudBasedIntegration.Jira.email,
      credential.cloudBasedIntegration.Jira.apiToken
    );

    integrationJira.backButton.click();
    cy.verifyIfOpen(pages["Integrations"]);

    integration
      .integrationStatus(jiraIntegrationNumber)
      .should("have.attr", "aria-checked", "true");
  });

  it("Should be able to see send to jira button on workout details", () => {
    sidebar.openMenu(pages.Dashboard);

    jiraIntegrationService.intercept("workoutDetails");
    contentService.intercept("workoutsContent", testWorkout);

    dashboard.openWorkout(testWorkout);

    jiraIntegrationService.verify("workoutDetails");
    contentService.verify("workoutsContent");
    workoutDetail.verifyPage(testWorkout);

    workoutDetail.shareButton.should("be.visible").click();
    workoutDetail.jiraButton.should("be.visible");
  });

  it("Remove Jira credential", () => {
    integration.openIntegration(jiraIntegrationNumber, "Jira Software");

    integrationJira.deleteConfiguration();
    integrationJira.backButton.click();

    cy.verifyIfOpen(pages["Integrations"]);
    cy.reload();
    integration
      .getEditButton(jiraIntegrationNumber)
      .should("contain.text", "Configure");
  });

  it("Should not be able to see send to jira button on workout details", () => {
    sidebar.openMenu(pages.Dashboard);

    jiraIntegrationService.intercept("workoutDetails");
    contentService.intercept("workoutsContent", testWorkout);

    dashboard.openWorkout(testWorkout);

    jiraIntegrationService.verify("workoutDetails");
    contentService.verify("workoutsContent");
    workoutDetail.verifyPage(testWorkout);

    workoutDetail.shareButton.click();
    workoutDetail.jiraButton.should("not.exist");
  });

  it("Should not be able to proceed using wrong credentials", () => {
    integration.openIntegration(jiraIntegrationNumber, "Jira Software");

    integrationJira.jiraServer.type(
      credential.cloudBasedIntegration.Jira.jiraServer
    );
    integrationJira.email.type(credential.cloudBasedIntegration.Jira.email);
    integrationJira.apiToken.type(
      credential.cloudBasedIntegration.Jira.wrongApiToken
    );
    jiraIntegrationService.interceptConfigJiraService(
      "POST",
      "Wrong creds Jira"
    );
    integrationJira.testConnection.click();
    jiraIntegrationService.verifyWrongCredential("Wrong creds Jira");
  });

  it("Should not be able to proceed if field is empty", () => {
    integration.openIntegration(jiraIntegrationNumber, "Jira Software");

    integrationJira.jiraServer.click();
    integrationJira.email.click();
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Please enter a valid Jira Server");
    integrationJira.jiraServer.type(
      credential.cloudBasedIntegration.Jira.jiraServer
    );

    integrationJira.email.click();
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Please enter a valid email address");
    integrationJira.email.type(credential.cloudBasedIntegration.Jira.email);

    integrationJira.apiToken.click();
    integrationJira.email.click();
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Please enter a valid API Token");
  });
});
