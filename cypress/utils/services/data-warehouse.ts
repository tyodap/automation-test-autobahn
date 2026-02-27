class dataWareHouse {
  get baseServiceUrl() {
    return "api/data-warehouse/individual-issue/issues";
  }

  interceptIssueTags(alias: string) {
    cy.intercept({
      method: "POST",
      url: this.baseServiceUrl,
    }).as(alias);
  }

  verifyIssueTags(alias: string) {
    cy.wait(`@${alias}`).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }
}

export default new dataWareHouse();
