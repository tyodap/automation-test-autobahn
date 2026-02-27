import { usersProd } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import setting from "../../utils/pages/setting";

const orgAdmin = usersProd["QC Prod One"];

beforeEach(() => {
  cy.openPageUsingSession(orgAdmin, pages.Settings);
  setting.openTab("Feature");
});

describe("Feature tab settings", { tags: ["@daily"] }, () => {
  it("Should be able to see month config after navigating to different page", () => {
    /**
     * 1. Set automatic delete asset
     * 2. Use back button from browser
     * 3. Verify that month option is fully available
     */
    setting.deleteAssetOlderThanRadio.click().should("be.checked");
    setting.updateButton.should("be.disabled");
    setting.assetUnitDropdown.click();

    setting.assetUnitSelection("Month(s)").click();
    setting.assetMonthDropDown.click();
    setting.assetMonthSelection("6").click();

    setting.updateButton.click();
    setting.successNotification.should("be.visible");

    cy.go("back");
    cy.openPageUsingSession(orgAdmin, pages.Settings);
    setting.openTab("Feature");

    setting.assetMonthDropDown.click({ force: true });
    setting.verifyAllMonthSelectionExist();

    setting.resetRule.click();
    setting.updateButton.click();
    setting.successNotification.should("be.visible");
  });

  it("Should be able to verify tooltip text", () => {
    setting.hoverAutomatedRulesTooltip();
    setting.automatedRulesTooltip
      .should("be.visible")
      .and(
        "have.text",
        "Please note that the changes take place on the next day"
      );
  });
});
