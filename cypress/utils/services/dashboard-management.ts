import { User } from "../../fixtures/interfaces/user.interface";
import { Dashboard } from "../../fixtures/interfaces/dashboard.interface";

class DashboardManagement {
  get baseServiceUrl() {
    return "api/dashboard-management/dashboards";
  }

  publicDashboard(authorizedUser: User, dashboard: Dashboard) {
    const dashboardId = dashboard.dashboardId;
    const filename = authorizedUser.tokenLink;

    cy.readFile(filename).then((json) => {
      if (!(json.email == authorizedUser.email)) {
        throw new Error(
          `Incorrect user selector to authorise. Expected: ${authorizedUser.email}, actual: ${json.email}`
        );
      }
      cy.request({
        method: "PUT",
        url: `${this.baseServiceUrl}/${dashboardId}/visibility`,
        auth: {
          bearer: json.token,
        },
        body: { status: "public" },
        failOnStatusCode: false,
      }).then((response) => {
        {
          if (response.status == 404) {
            cy.log("Dashboard is not found");
          } else if (response.status == 200) {
            cy.log("Dashboard update to public successfully");
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

export default new DashboardManagement();
