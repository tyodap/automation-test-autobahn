import { usersProd, usersTest } from "../../fixtures/constants/user";
import integration from "../../utils/pages/integration";
import awsIntegrationService from "../../utils/services/aws-integration-service";
import integrationAws from "../../utils/pages/integration-aws";
import { credential } from "../../fixtures/constants/integration-credential";
import { pages } from "../../fixtures/constants/pages";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const awsIntegrationNumber = 1;
const labelName = integrationAws.generateRandomLabelName("AWS Label");
const specialChar = "@#!*()撾部غانتنع";

before(() => {
  cy.loginUsingSession(orgAdmin);
  awsIntegrationService.removeAwsCredentials(orgAdmin);
});

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Integrations);
});

describe("Integration - AWS", { tags: ["@daily"] }, () => {
  it("Add AWS credential", () => {
    integration.openIntegration(awsIntegrationNumber, "AWS");

    integrationAws.configureAWS(
      labelName,
      credential.cloudBasedIntegration.AWS.accessKey,
      credential.cloudBasedIntegration.AWS.secretKey
    );

    cy.verifyIfOpen(pages["Integrations"]);
    integration
      .integrationStatus(awsIntegrationNumber)
      .should("have.attr", "aria-checked", "true");
  });

  it("Remove AWS credential", () => {
    integration.openIntegration(awsIntegrationNumber, "AWS");
    integrationAws.deleteConfiguration();
    integrationAws.backButton.click();

    cy.verifyIfOpen(pages["Integrations"]);
    cy.reload();
    integration
      .getEditButton(awsIntegrationNumber)
      .should("contain.text", "Configure");
  });

  it("Should not be able to proceed using wrong credentials", () => {
    integration.openIntegration(awsIntegrationNumber, "AWS");

    integrationAws.labelForm.type(labelName);
    integrationAws.accessKeyId.type(
      credential.cloudBasedIntegration.AWS.accessKey
    );
    integrationAws.secretKey.type(
      credential.cloudBasedIntegration.AWS.wrongSecretKey
    );
    awsIntegrationService.interceptAwsIntegrationService(
      "POST",
      "Wrong creds AWS"
    );
    integrationAws.saveButton.click();
    awsIntegrationService.verifyWrongCredsAWS("Wrong creds AWS");
  });

  it("Should not be able to proceed if field is empty", () => {
    integration.openIntegration(awsIntegrationNumber, "AWS");

    integrationAws.labelForm.click();
    integrationAws.accessKeyId.click();
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Label is required");
    integrationAws.labelForm.type(labelName);

    integrationAws.accessKeyId.click();
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Access key ID is required");
    integrationAws.accessKeyId.type(
      credential.cloudBasedIntegration.AWS.accessKey
    );

    integrationAws.secretKey.click();
    integrationAws.accessKeyId.click();
    integration.errorMessage
      .should("be.visible")
      .and("have.text", "Secret access Key is required");
  });

  it("Should not be able to proceed if label uses special char", () => {
    integration.openIntegration(awsIntegrationNumber, "AWS");

    integrationAws.labelForm.type(specialChar);
    integrationAws.accessKeyId.type(
      credential.cloudBasedIntegration.AWS.accessKey
    );
    integrationAws.secretKey.type(
      credential.cloudBasedIntegration.AWS.secretKey
    );

    integration.specialCharNotAllowedErrorMessage.should("be.visible");
  });
});
