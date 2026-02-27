import jiraIntegrationService from "../services/jira-integration-service";

class JiraIntegrationPage {
  get jiraServer() {
    return cy.get(`[placeholder="yourjira.atlassian.net"]`);
  }

  get email() {
    return cy.get(`[placeholder="example@acme.com"]`);
  }

  get apiToken() {
    return cy.get(`[placeholder="API Token"]`);
  }

  get testConnection() {
    return cy.get(`div.justify-between button.ant-btn-primary`);
  }

  get backButton() {
    return cy.get('[data-testid="jira-integration"] [href="/integrations"]');
  }

  get resetButton() {
    return cy.get("div.justify-between button.ant-btn-default");
  }

  inputJiraCredentials(jiraServer: string, email: string, apiToken: string) {
    this.jiraServer.type(jiraServer);
    this.email.type(email);
    this.apiToken.type(apiToken);
  }

  configureJira(jiraServer: string, email: string, apiToken: string) {
    this.inputJiraCredentials(jiraServer, email, apiToken);

    jiraIntegrationService.interceptConfigJiraService("POST", "configureJira");

    this.testConnection.click();
    jiraIntegrationService.verifyConfigJiraService("configureJira", 201);
  }

  deleteConfiguration() {
    jiraIntegrationService.interceptRemoveConfigJiraService(
      "POST",
      "removeCreds"
    );
    this.resetButton.click();
    jiraIntegrationService.verifyConfigJiraService("removeCreds", 201);
  }
}

export default new JiraIntegrationPage();
