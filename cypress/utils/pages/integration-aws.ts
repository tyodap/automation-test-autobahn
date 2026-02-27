import awsIntegrationService from "../services/aws-integration-service";

class AwsPage {
  get labelForm() {
    return cy.get(`[data-testid="aws—frm"] #label`);
  }

  get accessKeyId() {
    return cy.get(`[data-testid="form-item"] #aws_id`);
  }

  get secretKey() {
    return cy.get(`[data-testid="form-item"] #aws_secret`);
  }

  get saveButton() {
    return cy.get(`[data-testid="aws—btn—test-and-save—1"]`);
  }

  get backButton() {
    return cy.get('[data-testid="aws—btn--back-to-integrations—1"]');
  }

  get resetButton() {
    return cy.get('[data-testid="aws—btn—reset—1"]');
  }

  inputAwsCredentials(
    labelName: string,
    accessKeyId: string,
    secretKey: string
  ) {
    this.labelForm.type(labelName);
    this.accessKeyId.type(accessKeyId);
    this.secretKey.type(secretKey);
  }

  generateRandomLabelName(prefix: string) {
    return `${prefix}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-")}`;
  }

  configureAWS(labelName: string, accessKeyId: string, secretKey: string) {
    this.inputAwsCredentials(labelName, accessKeyId, secretKey);

    awsIntegrationService.interceptAwsIntegrationService("POST", "saveCreds");

    this.saveButton.click();
    awsIntegrationService.verifyAwsIntegrationService("saveCreds", 201);
  }

  deleteConfiguration() {
    awsIntegrationService.interceptAwsIntegrationService(
      "DELETE",
      "removeCreds"
    );
    this.resetButton.click();
    awsIntegrationService.verifyAwsIntegrationService("removeCreds", 200);
  }
}

export default new AwsPage();
