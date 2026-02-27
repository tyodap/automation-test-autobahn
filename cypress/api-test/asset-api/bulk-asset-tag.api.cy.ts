import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Bulk asset tag", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["API - Update asset tag"]
      : assetTest["API Test - Update asset tag"];

  const baseServiceUrl = "api/asset-inventory/bulk/tags";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Add tag", () => {
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
          asset_ids: [testAsset.assetId],
          tags: testAsset.tag,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Remove tag", () => {
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
          asset_ids: [testAsset.assetId],
          tags: testAsset.tag,
        },
        failOnStatusCode: true,
      }).then((response) => {
        {
          expect(response.status).to.eq(201);
          expect(response.body.status_code).to.eq(200);
        }
      });
    });
  });

  it("Add tag with non exist asset", () => {
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
          asset_ids: ["caa2b666-64d6-4589-880b-1d54cfa2838a"],
          tags: testAsset.tag,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.status_code).to.eq(500);
      });
    });
  });
});
