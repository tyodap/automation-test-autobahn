import {
  createScanEndpointRequest,
  createScanEndpointResponse,
  getScanScopeForUpdateScope,
  updateScanEndpointResponse,
} from "../fixtures/data/scan-revamp-payload/create-scan-api-mock";
import { updateScanScopeEndpointRequest } from "../fixtures/data/scan-revamp-payload/update-scan-scope-payload";
import { getScanScopeEndpointResponse } from "../fixtures/data/scan-revamp-payload/update-scan-scope-payload";

describe("Create scan revamp", () => {
  it("Mock 1", () => {
    const createScanEndpointRequesta = Cypress.Promise.resolve({
      body: createScanEndpointRequest,
    });

    createScanEndpointRequesta.then((response) => {
      const targets = response.body.targets.map((item) => item.target);
      console.log(targets);
    });
  });

  it("Mock 2", () => {
    const createScanEndpointRequesta = Cypress.Promise.resolve({
      body: createScanEndpointResponse,
    });

    createScanEndpointRequesta.then((response) => {
      expect(response.body.status_code).to.eq("ga");
    });
  });

  it("UpdateScanEndpoint", () => {
    const updateScopeScanEndpointRequest = Cypress.Promise.resolve({
      body: updateScanEndpointResponse,
    });

    updateScopeScanEndpointRequest.then((response) => {
      expect(response.body.status_code).to.eq(200);
      expect(response.body.data.status).to.eq("success");
    });
  });

  it.only("Mock 3", () => {
    const updateScopeScanEndpointRequesta = Cypress.Promise.resolve({
      body: getScanScopeEndpointResponse,
    });

    updateScopeScanEndpointRequesta.then((response) => {
      const updateScanScopeEndpointRequestTargets = response.body.data.map(
        (item) => item.target
      );
      console.log(updateScanScopeEndpointRequestTargets);
    });
  });

  it("get scan scope endpoint for update scope", () => {
    const getScanScopeEndpointRequest = Cypress.Promise.resolve({
      body: getScanScopeForUpdateScope,
    });

    getScanScopeEndpointRequest.then((response) => {
      expect(response.body.status_code).to.eq(200);
      const targets = response.body.data.targets.map((item) => item.target);
      console.log(targets);
    });
  });
});
