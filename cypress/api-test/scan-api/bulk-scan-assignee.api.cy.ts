import { scansProd, scansTest } from "../../fixtures/constants/scan";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Add and remove scan assignee", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const testScan =
    Cypress.env("environment") === "PROD"
      ? scansProd["API scan assignee - Prod"]
      : scansTest["API scan assignee - Test"];

  const baseServiceUrl = "api/scan-config/configs/reassign/bulk";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Should be able to add assignee to scan", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: [
          {
            id: testScan.configId,
            assignees: [orgOwner.uid],
            auto_assign: true,
          },
        ],
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.status).to.eq("success");
      });
    });
  });

  it("Should be able to remove assignee from scan", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: [
          {
            id: testScan.configId,
            assignees: [],
            auto_assign: true,
          },
        ],
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.status).to.eq("success");
      });
    });
  });
});
