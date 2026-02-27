import { User } from "../interfaces/user.interface";

export interface Asset {
  status: string[];
  networkName: string;
  networkValue: string;
  originValue: string[];
  ipAddress: string;
  assetId: string;
  domainName: string[];
  assetCriticality: string;
  assignee: User[];
  lastScanned: string;
  lastScannedValue: string;
  tag: string[];
  hackabilityReduction: string;
  serviceName: string;
  bannerName: string;
  portNumber: string;
  openPortStatus: string[];
  maxSeverity: string[];
  maxSeverityValue: string[];
  issueName: string;
  familyName: string;
  protocolName: string;
  numberOfIssues: string;
  cve: string;
  assetDomain: string;
  hostnames: string;
}

export interface AssetFromInventory {
  asset: string;
  IPs: string;
  hostnames: string;
  source: string[];
  lastScanned: string;
  criticality: string[];
  assignee: User[];
  tag: string[];
  maxSeverity: string[];
}
