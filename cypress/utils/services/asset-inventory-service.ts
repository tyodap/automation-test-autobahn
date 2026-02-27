import { Asset } from "../../fixtures/interfaces/asset.interface";
import { User } from "../../fixtures/interfaces/user.interface";

class AssetInventoryService {
  get baseServiceUrl() {
    return "api/asset-inventory";
  }

  interceptAssigneeUser(assetId: string, alias: string) {
    cy.intercept({
      method: "PUT",
      url: `**/${this.baseServiceUrl}/ui/asset/${assetId}/update`,
    }).as(alias);
  }

  verifyAssigneeUser(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(200);
    });
  }

  interceptAddOverviewAssigneeUser(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/bulk/assignees/add`,
    }).as(alias);
  }

  interceptRemoveOverviewAssigneeUser(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/bulk/assignees/remove`,
    }).as(alias);
  }

  verifyBulkAssignee(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }

  interceptDeletionAsset(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/bulk/assets/delete`,
    }).as(alias);
  }

  verifyDeletionAsset(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }

  interceptAddTags(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/bulk/tags/add`,
    }).as(alias);
  }

  verifyAddTags(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }

  interceptRemoveTags(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/bulk/tags/remove`,
    }).as(alias);
  }

  verifyRemoveTags(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }

  interceptAssetDetailsTags(assetId: string, alias: string) {
    cy.intercept({
      method: "PUT",
      url: `**/${this.baseServiceUrl}/ui/asset/${assetId}/update`,
    }).as(alias);
  }

  verifyAssetDetialsTags(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(200);
    });
  }

  interceptRetrieveTag(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/ui/tags/retrieve`,
    }).as(alias);
  }

  verifyRetrieveTag(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }

  interceptUpdateCriticality(alias: string) {
    cy.intercept({
      method: "POST",
      url: `**/${this.baseServiceUrl}/bulk/criticality/change`,
    }).as(alias);
  }

  verifyUpdateCriticality(alias: string) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(201);
    });
  }

  removeAssetAssigneeAssetDetail(
    authorizedUser: User,
    asset: Asset,
    assignUser: string[]
  ) {
    const assetId = asset.assetId;

    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/ui/asset/${assetId}/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          //it will remove tags and criticality
          criticality: 0,
          added_tags: [],
          removed_tags: [],
          added_assignees: [],
          removed_assignees: assignUser,
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already unassigned");
          } else if (response.status == 200) {
            cy.log("Successfully update assignee");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  addAssetAssigneeAssetDetail(
    authorizedUser: User,
    asset: Asset,
    assignUser: string[]
  ) {
    const assetId = asset.assetId;

    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/ui/asset/${assetId}/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          criticality: 0,
          added_tags: [],
          removed_tags: [],
          added_assignees: assignUser,
          removed_assignees: [],
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already unassigned");
          } else if (response.status == 200) {
            cy.log("Successfully update assignee");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  removeAssetAssigneeAssetOverview(
    authorizedUser: User,
    asset: string,
    assignUser: string
  ) {
    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}/bulk/assignees/remove`,
        auth: {
          bearer: json.token,
        },
        body: {
          asset_ids: [asset],
          assignees: [assignUser],
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already unassigned");
          } else if (response.status == 201) {
            cy.log("Successfully update assignee");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  addTagsAssetOverview(authorizedUser: User, asset: string, tag: string) {
    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}/bulk/tags/add`,
        auth: {
          bearer: json.token,
        },
        body: {
          asset_ids: [asset],
          tags: [tag],
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already tagged");
          } else if (response.status == 201) {
            cy.log("Successfully update tag");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  removeTagsAssetOverview(authorizedUser: User, asset: string, tag: string) {
    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}/bulk/tags/remove`,
        auth: {
          bearer: json.token,
        },
        body: {
          asset_ids: [asset],
          tags: [tag],
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already have tag");
          } else if (response.status == 201) {
            cy.log("Successfully update tag");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  addTagAssetDetail(authorizedUser: User, asset: Asset, tag: string[]) {
    const assetId = asset.assetId;

    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/ui/asset/${assetId}/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          criticality: 0,
          added_tags: tag,
          removed_tags: [],
          added_assignees: [],
          removed_assignees: [],
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already don't have tag");
          } else if (response.status == 200) {
            cy.log("Successfully update tag");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  removeTagAssetDetail(authorizedUser: User, asset: Asset, tag: string[]) {
    const assetId = asset.assetId;

    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/ui/asset/${assetId}/update`,
        auth: {
          bearer: json.token,
        },
        body: {
          criticality: 0,
          added_tags: [],
          removed_tags: tag,
          added_assignees: [],
          removed_assignees: [],
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already don't have tag");
          } else if (response.status == 200) {
            cy.log("Successfully update tag");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }

  updateAssetCriticality(
    authorizedUser: User,
    asset: string,
    criticality: number
  ) {
    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}/bulk/criticality/change`,
        auth: {
          bearer: json.token,
        },
        body: {
          asset_ids: [asset],
          criticality: criticality,
        },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 409) {
            cy.log("Asset already have criticality");
          } else if (response.status == 201) {
            cy.log("Successfully update criticality");
          } else {
            throw new Error(
              `Error: ${response.status} - invalid token. Expected status codes are 409 or 200`
            );
          }
        }
      });
    });
  }
}

export default new AssetInventoryService();
