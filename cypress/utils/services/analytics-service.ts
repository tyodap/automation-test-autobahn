import { Query } from "../../fixtures/interfaces/query.interface";
import { Table } from "../../fixtures/interfaces/table.interface";
import { User } from "../../fixtures/interfaces/user.interface";

class AnalyticsService {
  get baseServiceUrl() {
    return "/api/info-service/v1/load?context=ScansList";
  }

  get baseServiceUrlIntercept() {
    return "/api/info-service/v1/load*";
  }

  interceptLoadRequestWithQueryDim(alias: string, query: Query) {
    const queryDimensions = query.dimentions.toString();
    cy.intercept(
      { method: "POST", url: this.baseServiceUrlIntercept },
      (req) => {
        if (req.body.query.dimensions.toString() == queryDimensions) {
          req.alias = alias.toString();
        }
      }
    );
  }

  interceptLoadRequestWithQueryMea(alias: string, query: Query) {
    const queryDimensions = JSON.stringify(query.dimentions);
    cy.intercept(
      { method: "POST", url: this.baseServiceUrlIntercept },
      (req) => {
        console.log(queryDimensions);
        if (JSON.stringify(req.body.query.measures) == queryDimensions) {
          console.log("it's a match");
          req.alias = alias.toString();
        }
      }
    );
  }

  verifyTableLoadRequest(table: Table) {
    this.interceptLoadRequestWithQueryDim(table.name, table.query);
  }

  verifyLoadResponseQueryParam(
    alias: string,
    expectedParamAndValue: Map<string, object[]>
  ) {
    cy.wait(`@${alias}`, { timeout: 60000 }).then((interception) => {
      expect(interception.response.statusCode).eq(200);

      expectedParamAndValue.forEach((value: object[], key: string) => {
        value.forEach((val: object) => {
          if (key === "data") {
            expect(interception.response.body.data).to.deep.own.include(val);
          } else if (key === "filters") {
            expect(
              interception.response.body.query.filters
            ).to.deep.own.include(val);
          } else {
            expect(interception.response.body.query).to.have.property(key, val);
          }
        });
      });
    });
  }

  interceptAnalyticsService(alias: string) {
    cy.intercept({
      method: "POST",
      url: this.baseServiceUrlIntercept,
    }).as(alias);
  }

  verifyAnalyticsService(alias: string) {
    cy.wait(`@${alias}`, { timeout: 30000 }).then((interceptions) => {
      expect(interceptions.response.statusCode).eq(200);
    });
  }

  fetchRunningScanId(
    authorizedUser: User,
    scanName: string,
    callback: (scanId: string) => void
  ): void {
    const filename = authorizedUser.tokenLink;
    cy.readFile(filename, { timeout: 60000 }).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          query: {
            dimensions: [
              "V3Scans.scanId",
              "V3Scans.scanName",
              "V3Scans.scanState",
            ],
            filters: [
              {
                member: "V3Scans.scanName",
                operator: "equals",
                values: [scanName],
              },
              {
                member: "V3Scans.scanState",
                operator: "equals",
                values: ["running", "queued", "extracting-v2"],
              },
            ],
          },
        },
        failOnStatusCode: true,
      }).then((response) => {
        if (response.body.data[0]?.["V3Scans.scanId"]) {
          const scanId = response.body.data[0]?.["V3Scans.scanId"];
          callback(scanId);
        } else {
          cy.log(`Cannot find running scan of "${scanName}"`);
        }
      });
    });
  }

  // to query the status of issue(s)
  verifyIssueStatus(
    authorizedUser: User,
    status: "Active" | "Remediated" | "False Positive" | "Risk Accepted",
    query: Query
  ) {
    const filename = authorizedUser.tokenLink;
    const queryDimensions = query.dimentions;
    const queryFilters = query.filter;
    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          query: {
            dimensions: queryDimensions,
            filters: queryFilters,
          },
        },
        failOnStatusCode: true,
      }).then((response) => {
        if (response.status == 200) {
          cy.log(`Issue(s) successfully requested`);
        } else {
          throw new Error(
            `Error: ${response.status}. Expected status codes is 200`
          );
        }
        expect(response.body.data[0]["V3IndividualIssues.status"]).eq(
          status.toUpperCase().replace(/ /g, "_")
        );
      });
    });
  }

  // to query total issues status on dashboard
  fetchTotalIssueDashboard(authorizedUser: User, status: string) {
    const filename = authorizedUser.tokenLink;
    switch (status.toUpperCase()) {
      case "RISK ACCEPTED":
        status = "RISK_ACCEPTED";
        break;
      case "FALSE POSITIVE":
        status = "FALSE_POSITIVE";
        break;
      default:
        status = status.toUpperCase();
        break;
    }
    console.log("status: " + status);
    return cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }

      cy.request({
        method: "POST",
        url: `${this.baseServiceUrl}`,
        auth: {
          bearer: json.token,
        },
        body: {
          query: {
            dimensions: [
              "V3DefaultDashboardIssueStatuses.status",
              "V3DefaultDashboardIssueStatuses.severity",
              "V3DefaultDashboardIssueStatuses.issueCount",
            ],
            filters: [
              {
                member: "V3DefaultDashboardIssueStatuses.status",
                operator: "equals",
                values: [`${status}`],
              },
            ],
            ungrouped: "true",
          },
        },
        failOnStatusCode: true,
      });
    });
  }
}

export default new AnalyticsService();
