import { Scan } from "../interfaces/scan.interface";
import { usersProd } from "./user";
import { usersTest } from "./user";

export const scansProd = {
  "Initial Scan Prod": {
    scanName: "Initial Scan",
    scanId: "f06cf6d7-4c9d-45bb-b96f-4c4d6b52bf98",
    revision: "1",
    assignee: [usersProd["Owner Smoke Prod"]],
    originValue: ["autobahn-qualys_external"],
    startedOnValue: "05 Feb, 2024",
    startedOn: "5 Feb, 2024",
    Assets: "1",
    companyName: "Autobahn Security",
    assetDomain: "atb-playground.link",
    assetDescription: "AB2 Platform",
    criticalSeverity: "5",
    highSeverity: "2",
    mediumSeverity: "151",
    finishedStatusValue: ["done"],
    finishedStatus: ["Finished"],
    canceledStatusValue: ["canceled"],
    canceledStatus: ["Canceled"],
    runningStatusValue: ["running"],
  } as Scan,
  "Scheduled Scan Prod": {
    scanName: "scheduled dummy",
    interval: ["monthly"],
    intervalStart: "11 Dec, 2029",
    intervalEnd: "11 Dec, 2030",
    nextScan: "11 Dec, 2029",
    assignee: [usersProd["Owner Smoke Prod"]],
    originValue: ["autobahn-qualys_external"],
  } as Scan,
  "Scan for update issue in scan report - prod": {
    scanName: "Init scan",
    scanId: "40b0cc4b-794a-45a1-8c24-72633b3371a8",
  } as Scan,
  "API scan assignee - Prod": {
    scanName: "init scan",
    scanId: "89fc9fac-bd01-4db2-abe2-18f54aa5267b",
    configId: "4e2259fd-b22c-4026-b471-a43cab9ac0d3",
  } as Scan,
  "Rescan Prod": {
    scanName: "New Rescan",
    configId: "22c73951-31c9-4aa3-9411-5d7fd43bd70b",
  } as Scan,
  "Scan Custom Dashboard Prod": {
    scanName: "third scan",
    scanId: "af74a7ab-6a66-4d17-8d26-1be1883d6869",
  } as Scan,
  "Custom Dashboard By Scan - Prod": {
    scanName: "scheduled scan",
    scanId: "af74a7ab-6a66-4d17-8d26-1be1883d6869",
    originValue: ["autobahn-qualys_external"],
    startedOnValue: "20 May, 2025",
    startedOn: "20 May, 2025",
    Assets: "1",
    assignee: [usersProd["QC Prod One"]],
  } as Scan,
  "Update Scan Name": {
    scanName: "Before edit scan name",
    configId: "a386859e-db64-4d81-abb5-97128c7256ee",
  } as Scan,
};

export const scansTest = {
  "Initial Scan Test": {
    scanName: "ATB-Playground",
    scanId: "8c8c0e57-e5ea-4c45-afae-f8ab527f7a69",
    revision: "1",
    assignee: [usersTest["Owner Smoke Test"]],
    originValue: ["autobahn-qualys_external"],
    startedOnValue: "13 Mar, 2024",
    startedOn: "13 Mar, 2024",
    Assets: "1",
    companyName: "Autobahn Security",
    assetDomain: "autobahn-security.com	",
    assetDescription: "None",
    criticalSeverity: "1",
    highSeverity: "1",
    mediumSeverity: "18",
    finishedStatusValue: ["done"],
    finishedStatus: ["Finished"],
    canceledStatusValue: ["canceled"],
    canceledStatus: ["Canceled"],
    runningStatusValue: ["running"],
  } as Scan,
  "New scan": {
    scanName: "new scan",
    scanId: "458ca667-e26d-4161-aa3f-9e968d6dc5d8",
  } as Scan,
  "Scheduled Scan Test": {
    scanName: "scheduled dummy",
    interval: ["monthly"],
    intervalStart: "18 Dec, 2029",
    intervalEnd: "18 Dec, 2030",
    nextScan: "18 Dec, 2029",
    assignee: [usersTest["Owner Smoke Test"]],
    originValue: ["autobahn-qualys_external"],
  } as Scan,
  "Scan for update issue in scan report - test": {
    scanName: "initial scans",
    scanId: "b6fc8ffd-bf19-4c8c-b96b-c34715222506",
  } as Scan,
  "API scan assignee - Test": {
    scanName: "init scan",
    scanId: "6d5dfd93-6214-4e2c-95d6-e40bea3c36ad",
    configId: "37b47adf-3f6c-43e4-949d-5880ef1994c4",
  } as Scan,
  "Rescan Test": {
    scanName: "new scan",
    configId: "72928ca2-799c-4f50-b5a6-263b3cb39d07",
  } as Scan,
  "Scan Custom Dashboard Test": {
    scanName: "first scan",
    scanId: "4fc77ab5-89f6-4836-a2ac-924e81568440",
  } as Scan,
};
