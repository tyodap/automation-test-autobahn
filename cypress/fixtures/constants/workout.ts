import { Workout } from "../interfaces/workout.interface";
import { assetProd, assetTest } from "./asset";
import { usersProd, usersTest } from "./user";

export const workoutsProd = {
  "Update JQuery": {
    name: "Update JQuery",
    effort: ["Medium"],
    workoutStatus: ["ToDo"],
    instanceId: "ac60912db092c71db734ddcf03eccc5f",
  } as Workout,
  "Harden FTP: Disable FTP service": {
    name: "Harden FTP: Disable FTP service",
    effort: ["Small"],
    assetTag: ["testTag"],
    issueTag: ["smoke-tag"],
    issueAssignee: [usersProd["Owner Smoke Prod"]],
  } as Workout,
  "Update Apache Log4j": {
    name: "Update Apache Log4j",
    effort: ["Medium"],
    impact: "2",
    assetTag: ["testTag"],
    issueTag: ["smoke-tag"],
    issueAssignee: [usersProd["Owner Smoke Prod"]],
    workoutId: "7c3fc6ab-f77d-4512-b253-7e132e7ccdc9",
    instanceId: "b7ec3a6d7a611ce6b1633cc5a425cec3",
  } as Workout,
  "Update SAP NetWeaver Application Server Java": {
    name: "Update SAP NetWeaver Application Server Java",
    issueAssignee: [usersProd["QC Prod One"]],
    instanceId: "01962824a7f204fe08011c604b8e411f",
  } as Workout,
  "Update OpenSSH": {
    name: "Update OpenSSH",
    instanceId: "7323b28e329f3c3179f8e4e94d828ca0",
    workoutId: "b74748d9-58e0-487c-98d1-11f146549941",
    asset: [assetProd["Smoke Workout Details Prod"]],
  } as Workout,
  "Invalid workout prod": {
    name: "Update Apache Log4j",
    instanceId: "ff0aa6a3489fca972c6ba694fa720fd4",
  } as Workout,
  "Update Apache HTTP Server": {
    name: "Update Apache HTTP Server",
    instanceId: "d9c46db702217f00d9b518101817247a",
    workoutId: "5995eba3-0fc4-445a-a4d6-0f183d050d2d",
  } as Workout,
  "Update Microsoft Office": {
    name: "Update Microsoft Office",
    instanceId: "7579227e31f0bf62d461f16f433634ec",
    workoutId: "d0213657-b67f-43f4-bdde-132e98a9e909",
  } as Workout,
  "Update Microsoft .NET": {
    name: "Update Microsoft .NET",
    instanceId: "b714acb64643c62a5800cce58ac4e012",
  } as Workout,
  "Harden a database against SQL injection": {
    name: "Harden a database against SQL injection",
    instanceId: "e0ae10e183429d49470b00a70f8366d8",
  } as Workout,
};

export const workoutsTest = {
  "Secure SSH": {
    name: "Secure SSH",
    instanceId: "7a4435f50ecc7ad0f88d94ac9ebe3ac9",
    workoutId: "72139500-6494-47f9-8e66-3e68161cfbee",
    effort: ["Medium"],
    workoutStatus: ["ToDo"],
    asset: [assetTest["Smoke Workout Details Test"]],
  } as Workout,
  "Patching Cisco ASA and FTD": {
    name: "Patching Cisco ASA and FTD",
    effort: ["Medium"],
    impact: "2",
    assetTag: ["tagAsset"],
    issueTag: ["tagIssue"],
    issueAssignee: [usersTest["Owner Smoke Test"]],
  } as Workout,
  "Invalid workout test": {
    instanceId: "4e4a1c41cf1f075eab905c58030c7025",
    name: "Harden a database against error-based SQL injection",
  } as Workout,
  "Patching SSL/TLS": {
    name: "Patching SSL/TLS",
    instanceId: "f8f5b0df52a203db3ec716ac3e05237b",
    workoutId: "f15d1453-f2f8-46b2-a88f-a9d6cb2c42b2",
  } as Workout,
  "Harden a database against error-based SQL injection": {
    name: "Harden a database against error-based SQL injection",
    instanceId: "73eb3c63485a6db3e09bde40d95c2f1a",
    workoutId: "8efcf6df-b4ee-4bcd-b066-bed38112c1a9",
  } as Workout,
  "Disable SMB null sessions": {
    name: "Disable SMB null sessions",
    effort: ["Small"],
    assetTag: ["tagAsset"],
    issueTag: ["tagIssue"],
    issueAssignee: [usersTest["Owner Smoke Test"]],
  } as Workout,
};
