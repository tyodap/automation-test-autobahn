import { pages } from "../../fixtures/constants/pages";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import sidebar from "../../utils/components/sidebar";
import table from "../../utils/components/table";
import setting from "../../utils/pages/setting";
import orgManagementService from "../../utils/services/org-management-service";

describe("Edis personal settings", () => {
  const testUser =
    Cypress.env("environment") === "PROD"
      ? usersProd["Update Identity - Prod"]
      : usersTest["Update Identity - Test"];

  beforeEach(() => {
    cy.openPageUsingSession(testUser, pages.Settings);
  });

  it("Should not be able to use special character for first and last name", () => {
    /**
     * 1. Input first name with special character
     * 2. Verify first name can't use special character
     * 3. Input last name with special character
     * 4. Verify last name can't use special character
     * 5. Verify update button is disable if there's an error message
     */
    const invalidName = "!@#$%&";

    orgManagementService.interceptUpdateName("Failed update");

    setting.firstNameInput.clear().type(invalidName).blur();
    setting.firstNameInput
      .parent()
      .should("have.class", "ant-input-affix-wrapper-status-error");
    setting.inputFieldError.should(
      "contain",
      "Name must not contain special characters"
    );
    orgManagementService.verifyFailedUpdateName("Failed update");

    setting.lastNameInput.clear().type(invalidName).blur();
    setting.lastNameInput
      .parent()
      .should("have.class", "ant-input-affix-wrapper-status-error");
    setting.inputFieldError.should(
      "contain",
      "Name must not contain special characters"
    );
    orgManagementService.verifyFailedUpdateName("Failed update");

    setting.updateUserButton.should("be.disabled");
  });

  it("Should be able to update first and last name", () => {
    /**
     * 1. Update first name with random name
     * 2. Update last name with random name
     * 3. Update job with random name
     * 4. Verify in the team page name and job updated
     */
    const randomFirstName = `${
      testUser.name.split(" ")[0]
    }-${setting.generateName()}`;
    const randomLastName = `${
      testUser.name.split(" ")[1]
    }-${setting.generateName()}`;
    const randomJob = `Tester-${setting.generateName()}`;
    const fullRandomName = `${randomFirstName} ${randomLastName}`;

    orgManagementService.interceptUpdateName("Succeeded update");

    setting.firstNameInput.clear().type(randomFirstName).blur();
    setting.firstNameInput
      .parent()
      .should("have.class", "ant-input-affix-wrapper-status-success");
    orgManagementService.verifySuccessUpdateName("Succeeded update");

    setting.lastNameInput.clear().type(randomLastName).blur();
    setting.lastNameInput
      .parent()
      .should("have.class", "ant-input-affix-wrapper-status-success");
    orgManagementService.verifySuccessUpdateName("Succeeded update");

    setting.inputJobTitle.clear().type(randomJob).blur();

    setting.updateUserButton.should("be.enabled").click();

    sidebar.openMenu(pages.Team);
    table.filterSearch(tables.Team, "Member", fullRandomName);
    table.isColumnValueMatch(tables.Team, "Member", [fullRandomName]);
    table.isColumnValueMatch(tables.Team, "Job", [randomJob]);
  });
});
