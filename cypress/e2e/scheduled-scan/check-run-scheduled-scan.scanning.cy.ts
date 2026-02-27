import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import table from "../../utils/components/table";
import scanning from "../../utils/pages/scanning";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const scanName = "scheduled scan";
const startedOnDate = scanning.getDaysAgo(1) + "09:57 utc";
const nextScanDate = scanning.getDaysLater(6) + "09:57 utc";
const intervalDay = "Sunday";

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Scanning);
});

describe.skip("Check run scheduled scan", { tags: ["@weekly"] }, () => {
  it("Should be able to check scheduled scan run", () => {
    table.isTableHeadersVisible(tables["All Scans"]);

    table.filterSearch(tables["All Scans"], "Scan", scanName);
    table.isColumnValueMatch(tables["All Scans"], "Started on", [
      startedOnDate,
    ]);
    scanning.checkScanStatusState(tables["All Scans"], "Status", "Finished");
  });

  it("Should be able to check next scheduled scan date", () => {
    table.isTableHeadersVisible(tables["Scheduled scans"]);

    table.filterSearch(tables["Scheduled scans"], "Scan", scanName);
    table.isColumnValueMatch(tables["Scheduled scans"], "Next scan", [
      nextScanDate,
    ]);
    table.isColumnValueMatch(tables["Scheduled scans"], "Interval", [
      intervalDay,
    ]);
  });
});
