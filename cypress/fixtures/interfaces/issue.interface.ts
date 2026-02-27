export interface Issues {
  status:
    | "New"
    | "Active"
    | "Resurfaced"
    | "Risk Accepted"
    | "Remediated"
    | "False positive";
  statusValue: string;
  issue: string; //can be linked to issue
  asset: string; //can be linked to asset
  issueId: string;
  link: string;
  port: string;
  protocol: string;
  service: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  severityValue: "1" | "2" | "3" | "4";
  origin: "external" | "internal";
  originSource: string;
  network: string;
  networkValue: string;
  assetTag: string[];
  tag: string[];
  tagValue: string[];
  hostnames: string;
  banner: string;
  firstDetected: string;
  firstDetectedValue: string;
  lastDetected: string;
  lastDetectedValue: string;
  firstReported: string;
  firstReportedValue: string;
  scriptOutput: string;
  engine: string;
  vulnerabilityId: string;
  ipAddress: string;
  type: string;
}
