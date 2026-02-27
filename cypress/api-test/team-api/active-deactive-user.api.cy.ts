import { usersProd, usersTest } from "../../fixtures/constants/user";

describe("Active and deactive user", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const userTest =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod general"]
      : usersTest["API test general"];

  const baseServiceUrl = "/api/access-management/users";

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it("Deactived user", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PATCH",
        url: `${baseServiceUrl}/${userTest.uid}/block`,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
        expect(response.body.data.status).to.eq("Successfully blocked user");
      });
    });
  });

  it("Activated user", () => {
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PATCH",
        url: `${baseServiceUrl}/${userTest.uid}/unblock`,
        auth: {
          bearer: json.token,
        },
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
        expect(response.body.data.status).to.eq("Successfully activated user");
      });
    });
  });
});
