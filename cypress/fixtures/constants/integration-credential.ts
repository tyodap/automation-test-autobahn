import { IntegrationCredential } from "../interfaces/creds.interface";

export const credential = {
  cloudBasedIntegration: {
    AWS: {
      accessKey: "AKIAR75W5T5YQMLXLJ76",
      secretKey: `${Cypress.env("AWS_SECRET_KEY")}`,
      region: "eu-central-1",
      wrongSecretKey: "Xe7U38YFIXq7D/oyDG+kN0n2UIovKhNGHAFroqoW",
    },
    Azure: {
      tenanId: "52e93f35-2bf5-4079-a3b7-c9025596d0ae",
      clientId: "c80791ff-8296-4ecb-8e17-99716989e6ed",
      clientSecret: `${Cypress.env("AZURE_SECRET_KEY")}`,
    },
    Jira: {
      jiraServer: "autobahn-security.atlassian.net",
      email: "playground-user@autobahn-security.com",
      apiToken: `${Cypress.env("JIRA_API_TOKEN")}`,
      wrongApiToken: "TKGXYABpx4jwuJeFTF8u1FjJy2r",
    },
  } as IntegrationCredential,

  assessmentBasedIntegration: {
    MSDE: {
      tenantId: "52e93f35-2bf5-4079-a3b7-c9025596d0ae",
      appId: "c8e96eb7-1617-4a53-8647-fe33ab39f052",
      appSecret: `${Cypress.env("MSDE_SECRET_KEY")}`,
      wrongTenantId: "52e93f35-2bf5-4079-a3b7-c9025596d0aa",
      noPermissionAppId: "6fdaeb13-d030-4ec1-8cbc-d8530513551c",
      noPermissionAppSecret: "VWF8Q~yFLGzOre9yds90H2r2e5P7OGYVAQPygcjh",
    },
    MSDC: {
      tenantId: "52e93f35-2bf5-4079-a3b7-c9025596d0ae",
      appId: "5573fd71-bda8-45db-9c80-cb6f473fca6e",
      appSecret: `${Cypress.env("MSDC_SECRET_KEY")}`,
      noPermissionAppId: "82b6ac74-e2d5-4b60-88e7-b28cbc423d0d",
      noPermissionAppSecret: "MCz8Q~npRlvG8kbrcu4OtiNa_siLf4ItMtPQKc.j",
    },
  } as IntegrationCredential,
};
