import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Issues review request and approval API", () => {
  const userRequest =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const userApproval =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod admin"]
      : usersTest["API test admin"];

  const testIssue1 =
    Cypress.env("environment") === "PROD"
      ? issuesProd["API - Change assignee"]
      : issuesTest["API Test - Change assignee"];

  const testIssue2 =
    Cypress.env("environment") === "PROD"
      ? issuesProd["API - Change tag"]
      : issuesTest["API Test - Change tag"];

  const requestChanges = "api/vulnerability-management/issue-status-review";
  const approvalChanges =
    "/api/vulnerability-management/issue-status-review/approval";

  it.skip("Request change issue status", () => {
    cy.loginUsingSession(userRequest);

    const filename = userRequest.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == userRequest.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${userRequest.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${requestChanges}`,
        auth: {
          bearer: json.token,
        },
        body: {
          status: "REMEDIATED",
          issue_ids: [testIssue1.issueId, testIssue2.issueId],
          value: "Request",
          reviewed_by: userApproval.uid,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
    cy.wait(5000);
  });

  it.skip("Accept change issue status", () => {
    cy.loginUsingSession(userApproval);

    const filename = userApproval.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == userApproval.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${userApproval.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${approvalChanges}`,
        auth: {
          bearer: json.token,
        },
        body: {
          comment: "ACCEPTED",
          ids: [testIssue1.issueId],
          review_status: "ACCEPTED",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
    cy.wait(5000);
  });

  it.skip("Reject change issue status", () => {
    const filename = userApproval.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == userApproval.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${userApproval.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${approvalChanges}`,
        auth: {
          bearer: json.token,
        },
        body: {
          comment: "REJECTED",
          ids: [testIssue2.issueId],
          review_status: "REJECTED",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
    cy.wait(5000);
  });
});
