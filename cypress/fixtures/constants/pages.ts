import { Page } from "../interfaces/page.interface";

export const pages = {
  Dashboard: {
    name: "Dashboard",
    url: "/dashboard",
    menu: "Dashboard",
  } as Page,
  "Create Custom Dashboard by Scans": {
    name: "Create new dashboard using scans",
    url: "/dashboard/new/scans",
  } as Page,
  "Create Custom Dashboard By Assets": {
    name: "Create new dashboard using assets",
    url: "/dashboard/new/assets",
  } as Page,
  "Create Custom Dashboard By Asset Tags": {
    name: "Create new dashboard using asset tags",
    url: "/dashboard/new/assetTags",
  } as Page,
  Workouts: {
    menu: "Workouts",
    name: "Workouts",
    url: "/cyberfitness-workouts",
  } as Page,
  WorkoutDetails: {} as Page,
  Scanning: {
    menu: "Scanning",
    name: "Scanning",
    url: "/scans",
  } as Page,
  Team: {
    name: "Team",
    menu: "Team",
    url: "/team",
  } as Page,
  Settings: {
    name: "Settings",
    url: "/settings",
  } as Page,
  "Create Scan": {
    name: "Create a scan",
    url: "scans/new",
  } as Page,
  "Scan Status": {
    name: "Scan status",
    url: "/status",
  } as Page,
  Assets: {
    name: "Assets",
    menu: "Assets",
    url: "/assets",
  } as Page,
  Issues: {
    menu: "Issues",
    name: "Issues",
    url: "/issues/list",
  } as Page,
  "Issue detail": {
    name: "Issue Detail",
    url: "/issues",
  } as Page,
  "Asset Details": {
    url: "/assets",
  } as Page,
  Integrations: {
    name: "Integrations",
    menu: "Integrations",
    url: "/integrations",
  } as Page,
  AWS: {
    name: "Configure an integration",
    url: "/integrations/aws",
  } as Page,
  Azure: {
    name: "Configure an integration",
    url: "/integrations/azure",
  } as Page,
  "Jira Software": {
    name: "Configure an integration",
    url: "/integrations/jira",
  } as Page,
  MSDE: {
    name: "Configure an integration",
    url: "/integrations/ms-defender/endpoint",
  } as Page,
  Cisco: {
    name: "Configure an integration",
    url: "/integrations/cisco",
  } as Page,
  MSDC: {
    name: "Configure an integration",
    url: "/integrations/ms-defender/cloud",
  } as Page,
  ImportFile: {
    name: "Import file",
    url: "/scans/import",
  } as Page,
  UploadAsset: {
    name: "Upload asset",
    url: "/assets/import/manual",
  } as Page,
  DiscoverAsset: {
    name: "Discover asset",
    url: "/assets/import/discover",
  } as Page,
};
