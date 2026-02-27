class FileUploadService {
  get baseServiceUrl() {
    return "api/file-upload/upload";
  }

  interceptFileUpload(alias: string) {
    cy.intercept({
      method: "POST",
      url: `${this.baseServiceUrl}/**`,
    }).as(alias);
  }

  interceptFileIntegration(alias: string) {
    cy.intercept({
      method: "POST",
      url: "api/file-integration/**",
    }).as(alias);
  }

  verifyFileUpload(alias: string) {
    cy.wait(`@${alias}`, { timeout: 15000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }
}

export default new FileUploadService();
