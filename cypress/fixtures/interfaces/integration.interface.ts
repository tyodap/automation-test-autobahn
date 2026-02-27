export interface BaseCredentials {
  labelName?: string;
  tenantId?: string;
  appId?: string;
  appSecret?: string;
  apiKey?: string;
  apiEndpoint?: string;
  apiSecret?: string;
}

export type IntegrationName =
  | "MSDE"
  | "MSDE multiple"
  | "MSDC"
  | "CyCognito"
  | "Qualys"
  | "Cisco";
