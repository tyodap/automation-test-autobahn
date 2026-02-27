import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Changes issues status API", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["API Prod - Update issues"]
      : issuesTest["API Test - Update issues"];

  const baseServiceUrl = "api/vulnerability-management/bulk/status/update";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Change issues to ACTIVE", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          status: "ACTIVE",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
    cy.wait(2000);
  });

  it("Change issues to RISK ACCEPTED", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          status: "RISK_ACCEPTED",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
    cy.wait(2000);
  });

  it("Change issues to REMEDIATED", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          status: "REMEDIATED",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Change issues to REMEDIATED", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          status: "REMEDIATED",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Change issues to FALSE POSITIVE", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          status: "FALSE_POSITIVE",
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
    cy.wait(2000);
  });
});
