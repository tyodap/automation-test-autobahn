class MsdcInventoryService {
  get baseServiceUrl() {
    return "/api/msdc-integration/config";
  }

  interceptMSDC(alias: string) {
    cy.intercept({
      method: "POST",
      url: this.baseServiceUrl,
    }).as(alias);
  }

  verifyWrongCredsMSDC(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(500);
      expect(interceptions.response.body.response.message).eq(
        "Credential is not valid"
      );
    });
  }
}

export default new MsdcInventoryService();
