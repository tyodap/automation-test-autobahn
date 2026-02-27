import { User } from "./user.interface";

export interface Scan {
  scanName: string;
  configId: string;
  scanId: string;
  revision: string;
  startedOnValue: string;
  startedOn: string;
  completedOn: string;
  assignee: User[];
  originValue: string[];
  originName: string[];
  status: string;
  Assets: string;
  companyName: string;
  assetDomain: string;
  assetDescription: string;
  criticalSeverity: string;
  highSeverity: string;
  mediumSeverity: string;
  lowSeverity: string;
  finishedStatusValue: string[];
  finishedStatus: string[];
  canceledStatusValue: string[];
  canceledStatus: string[];
  runningStatusValue: string[];
  interval: string[];
  intervalStartValue: string;
  intervalEndValue: string;
  nextScanValue: string;
  intervalStart: string;
  intervalEnd: string;
  nextScan: string;
}
