import { createScanEndpointRequest } from "../fixtures/data/scan-revamp-payload/create-scan-api-mock";
import { usersProd, usersTest } from "../fixtures/constants/user";
import { updateScanScopeEndpointRequest } from "../fixtures/data/scan-revamp-payload/update-scan-scope-payload";
import { updateSecondScanScopeEndpointRequest } from "../fixtures/data/scan-revamp-payload/update-scan-scope-payload";

describe("Create scan revamp", () => {
  const orgOwner =
    Cypress.env("environment") === "PROD"
      ? usersProd["API prod owner"]
      : usersTest["API test owner"];

  const configId =
    Cypress.env("environment") === "PROD"
      ? "f93353b3-20f3-4ae8-b4e7-e1829cfbf4fe"
      : "44bcd65a-3270-44fd-948c-292d5d8e9efe";

  const scanId =
    Cypress.env("environment") === "PROD"
      ? "0c9c8316-1cdc-423c-b948-b8254048f22f"
      : "dddfcdda-1942-40a9-a2c7-44e740f290cf";

  const createScanEndpoint = "/api/scan-management/configs"; //POST
  const scanReportTargetEndpoint = `/api/scan-management/scan/${scanId}/targets`; //GET
  const getScanScopeEndpoint = `/api/scan-management/configs/${configId}/scope/v2`; //GET
  const updateScanScopeEndpoint = `/api/scan-management/configs/${configId}/scope/v2`; //PUT

  const filename = orgOwner.tokenLink;

  beforeEach(() => {
    cy.loginUsingSession(orgOwner);
  });

  it.skip("Should be able to create new scan with new endpoint", () => {
    //Hit `createScanEndpoint` with target 10.10.16.0 and 10.10.16.0/28
    //Verify response code and scan name

    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "POST",
        url: createScanEndpoint,
        auth: {
          bearer: json.token,
        },
        body: createScanEndpointRequest,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.status_code).to.eq(200);
        expect(response.body.data.scan_name).to.eq(
          createScanEndpointRequest.scan_name
        );
      });
    });
  });

  it("Should be able to verify scan target on scan report", () => {
    //Intercept `scanReportTargetEndpoint`
    //Verify that target is 10.10.16.0 and 10.10.16.0/28 with no other breakdown

    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "GET",
        url: scanReportTargetEndpoint,
        auth: {
          bearer: json.token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
        const targets = response.body.data.map((item) => item.target);
        const createScanEndpointRequestTargets =
          createScanEndpointRequest.targets.map((item) => item.target);
        expect(targets).to.have.members(createScanEndpointRequestTargets);
      });
      // });
    });
  });

  it("Should be able to verify new scan scope endpoint", () => {
    //Hit `updateScanScopeEndpoint`
    //Verify payload, schedule keys exist
    //Hit endpoint multiple times to change schedule
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "PUT",
        url: updateScanScopeEndpoint,
        auth: {
          bearer: json.token,
        },
        body: updateScanScopeEndpointRequest,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
        if (updateScanScopeEndpointRequest.schedule != null) {
          expect(updateScanScopeEndpointRequest.schedule).to.exist;
          expect(updateScanScopeEndpointRequest.schedule.start_date).to.exist;
          expect(updateScanScopeEndpointRequest.schedule.schedule_interval).to
            .exist;
          expect(updateScanScopeEndpointRequest.schedule.end_date).to.exist;
          expect(updateScanScopeEndpointRequest.schedule.schedule_type).to
            .exist;
        }

        cy.request({
          method: "PUT",
          url: updateScanScopeEndpoint,
          auth: {
            bearer: json.token,
          },
          body: updateSecondScanScopeEndpointRequest,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.status_code).to.eq(200);
          expect(updateSecondScanScopeEndpointRequest.schedule).to.be.null;
        });

        cy.request({
          method: "PUT",
          url: updateScanScopeEndpoint,
          auth: {
            bearer: json.token,
          },
          body: updateScanScopeEndpointRequest,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.status_code).to.eq(200);
        });
      });
    });
  });

  it("Should be able to verify previous target on new scan endpoint", () => {
    //Hit `updateScanScopeEndpoint`
    //Get target
    //Hit `getScanScopeEndpoint`
    //Verify target
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "PUT",
        url: updateScanScopeEndpoint,
        auth: {
          bearer: json.token,
        },
        body: updateScanScopeEndpointRequest,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
        const updateScanScopeEndpointRequestTargets =
          updateScanScopeEndpointRequest.targets.map((item) => item.target);

        cy.request({
          method: "GET",
          url: getScanScopeEndpoint,
          auth: {
            bearer: json.token,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.status_code).to.eq(200);
          const targets = response.body.data.targets.map((item) => item.target);
          expect(targets).to.have.members(
            updateScanScopeEndpointRequestTargets
          );
        });
      });
    });
  });

  it("Should be able to verify config id on new get scan scope endpoint", () => {
    //Hit `getScanScopeEndpoint`
    //Verify config_id to be the same as called config_id
    cy.readFile(filename).then((json) => {
      if (!(json.email == orgOwner.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${orgOwner.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "GET",
        url: getScanScopeEndpoint,
        auth: {
          bearer: json.token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status_code).to.eq(200);
        expect(response.body.data.config_id).to.eq(configId);
      });
    });
  });
});
