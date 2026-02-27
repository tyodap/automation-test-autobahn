class OrgManagementService {
  get baseServiceUrl() {
    return "api/org-management/organizations";
  }

  interceptUpdateName(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/validations`,
    }).as(alias);
  }

  verifySuccessUpdateName(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 201);
  }

  verifyFailedUpdateName(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 400);
  }
}

export default new OrgManagementService();
