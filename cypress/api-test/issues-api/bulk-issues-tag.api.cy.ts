import { issuesProd, issuesTest } from "../../fixtures/constants/issue";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Bulk issues assignee API", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const testIssue =
    Cypress.env("environment") === "PROD"
      ? issuesProd["API Prod - Update issues"]
      : issuesTest["API Test - Update issues"];

  const baseServiceUrl = "/api/vulnerability-management/bulk/tags";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Add issue tag", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}/add`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          tags: testIssue.tag,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Remove issue tag", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}/remove`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: [testIssue.issueId],
          tags: testIssue.tag,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Add issue tag with non exist issue", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${baseServiceUrl}/add`,
        auth: {
          bearer: json.token,
        },
        body: {
          issue_ids: ["7e83df9d-f206-4959-9c22-546d487f6699"],
          tags: testIssue.tag,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.status_code).to.eq(500);
      });
    });
  });
});
