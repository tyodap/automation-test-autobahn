import asset from "../../utils/pages/asset";
import { pages } from "../../fixtures/constants/pages";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import toast from "../../utils/components/toast";

describe.skip("Asset page E2E test", () => {
  const orgAdmin =
    Cypress.env("environment") === "PROD"
      ? usersProd["QC Prod One"]
      : usersTest["QC Test One"];

  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const pMonth = month.toString().padStart(2, "0");
  const pDay = day.toString().padStart(2, "0");
  const newPaddedDate = `${year}_${pMonth}_${pDay}`;

  beforeEach(() => {
    cy.openPageUsingSession(orgAdmin, pages.Assets);
  });

  it("Should be able to download asset CSV", () => {
    /**
     * Test case
     * 1. Verify there is “Download“ button on asset page
     * 2. Verify that clicking “Download“ button will download all asset
     * 3. Verify that downloaded file is on csv format
     * 4. Verify file name format should be <<org_name>>_Autobahn_Security_<<Assets>>_YYYYMMDD
     * 5. Verify that there is download notification
     * 6. Verify if data is downloading, user cannot click “Download“ button
     * 7. Verify download notification message “The file download has started. It will continue in the background. You can keep using the app.”
     */
    asset.downloadButton.should("be.visible");
    asset.downloadButton.click();
    asset.downloadButton.should("be.disabled");
    toast
      .getSuccessNotification(
        "The file download has started. It will continue in the background. You can keep using the app."
      )
      .should("be.visible");
  });
  cy.readFile(`cypress/downloads/QC_Autobahn_Security_Assets_${newPaddedDate}`);
});
