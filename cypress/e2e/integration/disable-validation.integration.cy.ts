import { usersProd } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import integration from "../../utils/pages/integration";

const orgAdmin = usersProd["Verify disable integration"];
const ciscoIntegrationNumber = 2;
const msdcIntegrationNumber = 7;
const msdeIntegrationNumber = 8;
const qualysIntegrationNumber = 11;

describe("Verify integration disabler", { tags: ["@weekly"] }, () => {
  it("Should not have any scan", () => {
    cy.openPageUsingSession(orgAdmin, pages.Scanning);
    table.isTableEmpty(tables["All Scans"]);
  });

  it("Should be able to see that toggle button is off on selected integration", () => {
    cy.openPageUsingSession(orgAdmin, pages.Integrations);

    // MSDC
    integration
      .isIntegrationDisabled(msdcIntegrationNumber)
      .then((isDisabled) => {
        if (isDisabled) {
          cy.log(`✅ MSDC integration is correctly disabled`);
        } else {
          throw new Error(`❌ MSDC integration is not disabled`);
        }
      });

    // MSDE
    integration
      .isIntegrationDisabled(msdeIntegrationNumber)
      .then((isDisabled) => {
        if (isDisabled) {
          cy.log(`✅ MSDE integration is correctly disabled`);
        } else {
          throw new Error(`❌ MSDE integration is not disabled`);
        }
      });

    // Qualys
    integration
      .isIntegrationDisabled(qualysIntegrationNumber)
      .then((isDisabled) => {
        if (isDisabled) {
          cy.log(`✅ Qualys integration is correctly disabled`);
        } else {
          throw new Error(`❌ Qualys integration is not disabled`);
        }
      });

    // Cisco
    integration.openIntegration(ciscoIntegrationNumber, "Cisco");
    integration.toggleButton.should("have.attr", "aria-checked", "false");
  });
});
