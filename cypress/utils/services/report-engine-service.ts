import { Scan } from "../../fixtures/interfaces/scan.interface";

class ReportEngineService {
  get baseServiceUrl() {
    return "/api/report/";
  }

  interceptReportEngine(alias: string, scan: Scan) {
    const scanId = scan.scanId;
    cy.intercept({
      method: "GET",
      url: `${this.baseServiceUrl}/${scanId}/xlsx?enable_scan_revamp=true`,
    }).as(alias);
  }

  verifyReportEngine(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(200);
    });
  }
}

export default new ReportEngineService();
