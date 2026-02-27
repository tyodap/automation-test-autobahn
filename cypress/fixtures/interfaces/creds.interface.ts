export interface IntegrationCredential {
  AWS: {
    accessKey: string;
    secretKey: string;
    region: string;
    wrongSecretKey;
  };
  Azure: {
    tenanId: string;
    clientId: string;
    clientSecret: string;
  };
  Jira: {
    jiraServer: string;
    email: string;
    apiToken: string;
    wrongApiToken;
  };
  MSDE: {
    tenantId: string;
    appId: string;
    appSecret: string;
    wrongTenantId;
    noPermissionAppId: string;
    noPermissionAppSecret: string;
  };
  MSDC: {
    tenantId: string;
    appId: string;
    appSecret: string;
    noPermissionAppId: string;
    noPermissionAppSecret: string;
  };
}
