class PuppeteerService {
  get downloadDashboardeUrl() {
    return "/api/puppeteer/pdf/dashboard/v2/";
  }

  get downloadWorkoutUrl() {
    return "/api/puppeteer/pdf/workout/v1";
  }

  interceptDownloadDashboard(alias: string) {
    cy.intercept({
      method: "POST",
      url: `${this.downloadDashboardeUrl}`,
    }).as(alias);
  }

  interceptDownloadWorkout(alias: string) {
    cy.intercept({
      method: "POST",
      url: `${this.downloadWorkoutUrl}`,
    }).as(alias);
  }

  verify(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 })
      .its("response.statusCode")
      .should("eq", 201);
  }
}

export default new PuppeteerService();
