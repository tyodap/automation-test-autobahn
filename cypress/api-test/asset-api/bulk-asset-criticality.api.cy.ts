import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Bulk asset critcality", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const testAsset =
    Cypress.env("environment") === "PROD"
      ? assetProd["API - Change asset assignee"]
      : assetTest["API Test - Change asset assignee"];

  const baseServiceUrl = "api/asset-inventory/bulk/criticality/change";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Update asset criticality to 3 star", () => {
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
          asset_ids: [testAsset.assetId],
          criticality: 4,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });

  it("Update asset criticality to not set", () => {
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
          asset_ids: [testAsset.assetId],
          criticality: 0,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
      });
    });
  });
});
