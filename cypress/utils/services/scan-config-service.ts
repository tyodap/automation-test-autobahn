import { Scan } from "../../fixtures/interfaces/scan.interface";

class ScanConfigService {
  get baseServiceUrl() {
    return "api/scan-management";
  }

  interceptValidation(alias: string) {
    cy.intercept({
      method: "POST",
      url: `${this.baseServiceUrl}/configs/validation`,
    }).as(alias);
  }

  interceptScanCreate(alias: string) {
    cy.intercept({
      method: "POST",
      url: `${this.baseServiceUrl}/configs`,
    }).as(alias);
  }

  interceptRescanRequest(scan: Scan) {
    cy.intercept({
      method: "POST",
      url: `${this.baseServiceUrl}/configs/${scan.configId}/rescan`,
    }).as(scan.scanName);
  }

  verifyValidation(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
      expect(interceptions.response.body.status_code).eq(200);
      expect(interceptions.response.body.error_detail.server_message).eq(null);
    });
  }

  verifyExistingName(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(409);
      expect(interceptions.response.body.status_code).eq(409);
      expect(interceptions.response.body.error_detail.server_message).eq(
        "Scan name already exist"
      );
    });
  }

  verifyScanCreate(alias: string) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 201);
  }

  verifyScanRestarted(scan: Scan) {
    cy.wait(`@${scan.scanName}`).its("response.statusCode").should("eq", 201);
  }
}

export default new ScanConfigService();
