import { usersProd, usersTest } from "../fixtures/constants/user";
import { pages } from "../fixtures/constants/pages";
import { tables } from "../fixtures/constants/table";
import table from "../utils/components/table";
import individualIssues from "../pages/individualIssues";
import issueDetail from "../utils/pages/issue-detail";

describe("Issue count integration check", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["Integration Checker Prod"]
      : usersTest["Integration Checker Test"];

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages["Individual Issues"]);
    table.isLoaded(tables["Individual Issues"]);
  });

  it("Fetch issue total from individual issue table", () => {
    let issueTotalIndividualIssues;

    individualIssues.issueTotalIndividualIssues.then((text) => {
      issueTotalIndividualIssues = text as string;
      issueTotalIndividualIssues = text.replace(" issues in total", "");
      Cypress.env("issueTotalIndividualIssues", +issueTotalIndividualIssues);
    });
  });

  it("Fetch issue from individual issue tile", () => {
    let newIssueIndividualIssueTile;
    let activeIssueIndividualIssueTile;
    let resurfacedIssueIndividualIssueTile;
    let riskAcceptedIssueIndividualIssueTile;
    let remediatedIssueIndividualIssueTile;
    let falsePositiveIssueIndividualIssueTile;

    newIssueIndividualIssueTile = individualIssues.totalNewIssuesNumber.then(
      (text) => {
        newIssueIndividualIssueTile = text as string;
        Cypress.env(
          "newIssueIndividualIssueTile",
          +newIssueIndividualIssueTile
        );
      }
    );
    activeIssueIndividualIssueTile =
      individualIssues.totalActiveIssuesNumber.then((text) => {
        activeIssueIndividualIssueTile = text as string;
        Cypress.env(
          "activeIssueIndividualIssueTile",
          +activeIssueIndividualIssueTile
        );
      });
    resurfacedIssueIndividualIssueTile =
      individualIssues.totalResurfacedIssuesNumber.then((text) => {
        resurfacedIssueIndividualIssueTile = text as string;
        Cypress.env(
          "resurfacedIssueIndividualIssueTile",
          +resurfacedIssueIndividualIssueTile
        );
      });
    riskAcceptedIssueIndividualIssueTile =
      individualIssues.totalRiskAcceptedIssuesNumber.then((text) => {
        riskAcceptedIssueIndividualIssueTile = text as string;
        Cypress.env(
          "riskAcceptedIssueIndividualIssueTile",
          +riskAcceptedIssueIndividualIssueTile
        );
      });
    remediatedIssueIndividualIssueTile =
      individualIssues.totalRemediatedIssuesNumber.then((text) => {
        remediatedIssueIndividualIssueTile = text as string;
        Cypress.env(
          "remediatedIssueIndividualIssueTile",
          +remediatedIssueIndividualIssueTile
        );
      });
    falsePositiveIssueIndividualIssueTile =
      individualIssues.totalFalsePositiveIssuesNumber.then((text) => {
        falsePositiveIssueIndividualIssueTile = text as string;
        Cypress.env(
          "falsePositiveIssueIndividualIssueTile",
          +falsePositiveIssueIndividualIssueTile
        );
      });
  });

  it("Compare issue from individual issue page", () => {
    const issueTotalIndividualIssues = Cypress.env(
      "issueTotalIndividualIssues"
    );
    const newIssueIndividualIssueTile = Cypress.env(
      "newIssueIndividualIssueTile"
    );
    const activeIssueIndividualIssueTile = Cypress.env(
      "activeIssueIndividualIssueTile"
    );
    const resurfacedIssueIndividualIssueTile = Cypress.env(
      "resurfacedIssueIndividualIssueTile"
    );
    const riskAcceptedIssueIndividualIssueTile = Cypress.env(
      "riskAcceptedIssueIndividualIssueTile"
    );
    const remediatedIssueIndividualIssueTile = Cypress.env(
      "remediatedIssueIndividualIssueTile"
    );
    const falsePositiveIssueIndividualIssueTile = Cypress.env(
      "falsePositiveIssueIndividualIssueTile"
    );
    const totalTileIssue =
      newIssueIndividualIssueTile +
      activeIssueIndividualIssueTile +
      resurfacedIssueIndividualIssueTile +
      riskAcceptedIssueIndividualIssueTile +
      remediatedIssueIndividualIssueTile +
      falsePositiveIssueIndividualIssueTile;

    console.log("INDIVIDUAL ISSUE CHECKING :");
    console.log(
      "Total issue individual issue table = " + issueTotalIndividualIssues
    );
    console.log("New tile individual issue = " + newIssueIndividualIssueTile);
    console.log(
      "Active tile individual issue = " + activeIssueIndividualIssueTile
    );
    console.log(
      "Resurfaced tile individual issue = " + resurfacedIssueIndividualIssueTile
    );
    console.log(
      "Risk accepted individual issue = " + riskAcceptedIssueIndividualIssueTile
    );
    console.log(
      "Remediated tile individual issue = " + remediatedIssueIndividualIssueTile
    );
    console.log(
      "False positive tile individual issue = " +
        falsePositiveIssueIndividualIssueTile
    );
    console.log("Total tile summed individual issue = " + totalTileIssue);

    expect(issueTotalIndividualIssues).to.equal(totalTileIssue);
  });

  it("Fetch issue total from issue detail table", () => {
    let issueTotalIssueDetail;

    individualIssues.firstIssue.click();
    table.isLoaded(tables["Issue detail"]);

    issueDetail.issueTotalIssueDetail.then((text) => {
      issueTotalIssueDetail = text as string;
      issueTotalIssueDetail = text.replace(" issues in total", "");
      Cypress.env("issueTotalIssueDetail", +issueTotalIssueDetail);
    });
  });

  it("Fetch issue from issue detail tile", () => {
    let newIssueIssueDetailTile;
    let activeIssueIssueDetailTile;
    let resurfacedIssueDetailTile;
    let riskAcceptedIssueDetailTile;
    let remediatedIssueDetailTile;
    let falsePositiveIssueDetailTile;

    individualIssues.firstIssue.click();
    table.isLoaded(tables["Issue detail"]);

    newIssueIssueDetailTile = issueDetail.totalNewIssuesNumber.then((text) => {
      newIssueIssueDetailTile = text as string;
      Cypress.env("newIssueIssueDetailTile", +newIssueIssueDetailTile);
    });
    activeIssueIssueDetailTile = issueDetail.totalActiveIssuesNumber.then(
      (text) => {
        activeIssueIssueDetailTile = text as string;
        Cypress.env("activeIssueIssueDetailTile", +activeIssueIssueDetailTile);
      }
    );
    resurfacedIssueDetailTile = issueDetail.totalResurfacedIssuesNumber.then(
      (text) => {
        resurfacedIssueDetailTile = text as string;
        Cypress.env("resurfacedIssueDetailTile", +resurfacedIssueDetailTile);
      }
    );
    riskAcceptedIssueDetailTile =
      issueDetail.totalRiskAcceptedIssuesNumber.then((text) => {
        riskAcceptedIssueDetailTile = text as string;
        Cypress.env(
          "riskAcceptedIssueDetailTile",
          +riskAcceptedIssueDetailTile
        );
      });
    remediatedIssueDetailTile = issueDetail.totalRemediatedIssuesNumber.then(
      (text) => {
        remediatedIssueDetailTile = text as string;
        Cypress.env("remediatedIssueDetailTile", +remediatedIssueDetailTile);
      }
    );
    falsePositiveIssueDetailTile =
      issueDetail.totalFalsePositiveIssuesNumber.then((text) => {
        falsePositiveIssueDetailTile = text as string;
        Cypress.env(
          "falsePositiveIssueDetailTile",
          +falsePositiveIssueDetailTile
        );
      });
  });

  it("Compare issue from issue detail page", () => {
    const issueTotalIssueDetail = Cypress.env("issueTotalIssueDetail");
    const newIssueIssueDetailTile = Cypress.env("newIssueIssueDetailTile");
    const activeIssueIssueDetailTile = Cypress.env(
      "activeIssueIssueDetailTile"
    );
    const resurfacedIssueDetailTile = Cypress.env("resurfacedIssueDetailTile");
    const riskAcceptedIssueDetailTile = Cypress.env(
      "riskAcceptedIssueDetailTile"
    );
    const remediatedIssueDetailTile = Cypress.env("remediatedIssueDetailTile");
    const falsePositiveIssueDetailTile = Cypress.env(
      "falsePositiveIssueDetailTile"
    );
    const totalTileIssueDetail =
      newIssueIssueDetailTile +
      activeIssueIssueDetailTile +
      resurfacedIssueDetailTile +
      riskAcceptedIssueDetailTile +
      remediatedIssueDetailTile +
      falsePositiveIssueDetailTile;

    console.log("ISSUE DETAIL CHECKING :");
    console.log("Total issue issue detail table = " + issueTotalIssueDetail);
    console.log("New tile issue detail = " + newIssueIssueDetailTile);
    console.log("Active tile issue detail = " + activeIssueIssueDetailTile);
    console.log("Resurfaced tile issue detail = " + resurfacedIssueDetailTile);
    console.log("Risk accepted issue detail = " + riskAcceptedIssueDetailTile);
    console.log("Remediated tile issue detail = " + remediatedIssueDetailTile);
    console.log(
      "False positive tile issue detail = " + falsePositiveIssueDetailTile
    );
    console.log("Total tile summed issue detail = " + totalTileIssueDetail);

    expect(issueTotalIssueDetail).to.equal(totalTileIssueDetail);
  });
});
