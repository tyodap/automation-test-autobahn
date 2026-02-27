import { usersProd } from "../../fixtures/constants/user";
import userMenu from "../../utils/components/user-menu";
import { pages } from "../../fixtures/constants/pages";
import sidebar from "../../utils/components/sidebar";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";

const user = usersProd["QC User"];

describe("GU page visibility", { tags: ["@daily"] }, () => {
  it("Should only be able to see GU allowed page", () => {
    /**
     * 1. Verify GU visibility
     * 2. Verify each table loaded
     */
    cy.login(user);
    userMenu.userRole.should("have.text", "General user");

    cy.verifyIfOpen(pages.Workouts);
    table.isLoaded(tables["To do workouts"]);
    table.getAllTableRows(tables["To do workouts"]);

    sidebar.openMenu(pages["Assets"]);
    table.isLoaded(tables["Assets"]);
    table.getAllTableRows(tables["Assets"]);

    sidebar.openMenu(pages["Issues"]);
    table.isLoaded(tables["Issues"]);
    table.getAllTableRows(tables["Issues"]);
  });
});
