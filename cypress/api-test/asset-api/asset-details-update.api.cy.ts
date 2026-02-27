import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Update asset details", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["API - Update asset tag"]
      : assetTest["API Test - Update asset tag"];

  const baseServiceUrl = "api/asset-inventory/ui/asset";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Asset details API - add criticality, tag and assignee", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${baseServiceUrl}/${testAsset.assetId}/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          criticality: 3,
          added_tags: testAsset.tag,
          removed_tags: [],
          added_assignees: [orgOwner.uid],
          removed_assignees: [],
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Asset details API - remove criticality, tag and assignee", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${baseServiceUrl}/${testAsset.assetId}/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          criticality: 0,
          added_tags: [],
          removed_tags: testAsset.tag,
          added_assignees: [],
          removed_assignees: [orgOwner.uid],
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Asset details API - add criticality, tag and assignee with non exist asset", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${baseServiceUrl}/2364aa39-77bd-4cf3-818d-d612199a93d2/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          criticality: 3,
          added_tags: testAsset.tag,
          removed_tags: [],
          added_assignees: [orgOwner.uid],
          removed_assignees: [],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.status_code).to.eq(500);
      });
    });
  });
});
