import step2 from "../../utils/pages/step2";
import step2Scanning from "../../utils/pages/step2";
import table from "../../utils/components/table";
import { tables } from "../../fixtures/constants/table";
import { usersProd, usersTest } from "../../fixtures/constants/user";
import { pages } from "../../fixtures/constants/pages";
import modal from "../../utils/components/modal";
import { assetProd, assetTest } from "../../fixtures/constants/asset";
import { AssetFromInventory } from "../../fixtures/interfaces/asset.interface";

const orgAdmin =
  Cypress.env("environment") === "PROD"
    ? usersProd["QC Prod One"]
    : usersTest["Owner Smoke Test"];

const filterData: AssetFromInventory =
  Cypress.env("environment") === "PROD"
    ? assetProd["Asset from inventory filter"]
    : assetTest["Scheduled Scan Test"];

const randomDomain = "randomdomain.com";
const randomIP = "192.168.1.1";
const randomTag = "randomtag";
const invalidDomain = "invaliddomain";
const invalidIP = "invalidip";
const random65Tag =
  "xZ4mL9qP1wE7sVaRk2Tn8BdCy5oGHU3MeiZfJXtAQgNvLuKbWcYhD0rIjFzXlV";
const defaultPageValue = "10";

beforeEach(() => {
  cy.loginUsingSession(orgAdmin);
  cy.visit(pages["Create Scan"]);
  step2Scanning.scanName.type("dummy scan name to go to the next page");
  cy.wait(2500); //Can be deleted if already fixed
  step2Scanning.nextButton.click();
  table.isLoaded(tables["Asset from inventory"]);
});

describe("Asset from inventory table", { tags: ["@daily"] }, () => {
  it("Should be able to filter", () => {
    //Filter by Asset
    table.runFilterSearch(
      tables["Asset from inventory"],
      "Asset",
      filterData.asset
    );

    //Filter by IPs
    table.runFilterSearch(
      tables["Asset from inventory"],
      "IPs",
      filterData.IPs
    );

    //Filter by Hostnames
    table.runFilterSearch(
      tables["Asset from inventory"],
      "Hostnames",
      filterData.hostnames
    );

    //Filter by Source
    table.runFilterCheckbox(
      tables["Asset from inventory"],
      "Source",
      filterData.source,
      null,
      "Autobahn"
    );

    //Filter by Last scanned
    table.runFilterDate(
      tables["Asset from inventory"],
      "Last scanned",
      filterData.lastScanned
    );

    //Filter by Criticality
    table.filterCheckbox(
      tables["Asset from inventory"],
      "Criticality",
      filterData.criticality
    );
    step2Scanning.criticalCriticalityTable.should("be.visible");

    //Filter by Assignees
    table.filterInputCheckbox(
      tables["Asset from inventory"],
      "Assignees",
      null,
      null,
      filterData.assignee[0]
    );
    table.isColumnValueMatch(tables["Asset from inventory"], "Assignees", [
      "QO",
    ]);
    table.resetFilter(tables["Asset from inventory"], "Assignees");
    table.getAllTableRows(tables["Asset from inventory"]).should("be.visible");

    // //Filter by Tag
    // table.runFilterCheckbox(
    //   tables["Asset from inventory"],
    //   "Tag",
    //   filterData.tag
    // );

    //Filter by Max. Severity
    table.runFilterCheckbox(
      tables["Asset from inventory"],
      "Max. Severity",
      filterData.maxSeverity,
      ["High"]
    );
  });

  it("Should be able to sort", () => {
    /**
     * Ascending IP, criticality and assignee is not included
     */
    //Sort by Asset
    table.runSort(
      tables["Asset from inventory"],
      "Asset",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset from inventory"],
      "Asset",
      "descending",
      defaultPageValue
    );

    //Sort by IPs
    table.runSort(
      tables["Asset from inventory"],
      "IPs",
      "descending",
      defaultPageValue
    );

    //Sort by Hostnames
    table.runSort(
      tables["Asset from inventory"],
      "Hostnames",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset from inventory"],
      "Hostnames",
      "descending",
      defaultPageValue
    );

    //Sort by Last scanned
    table.runDateSort(
      tables["Asset from inventory"],
      "Last scanned",
      "ascending",
      defaultPageValue
    );
    table.runDateSort(
      tables["Asset from inventory"],
      "Last scanned",
      "descending",
      defaultPageValue
    );

    //Sort by Tag
    table.runSort(
      tables["Asset from inventory"],
      "Tag",
      "ascending",
      defaultPageValue
    );
    table.runSort(
      tables["Asset from inventory"],
      "Tag",
      "descending",
      defaultPageValue
    );

    //Sort by Max. Severity
    table.runCustomSort(
      tables["Asset from inventory"],
      "Max. Severity",
      "ascending",
      defaultPageValue
    );
    table.runCustomSort(
      tables["Asset from inventory"],
      "Max. Severity",
      "descending",
      defaultPageValue
    );
  });

  it("Should be able to change pagination", () => {
    table.runChangePagination(
      tables["Asset from inventory"],
      "Asset",
      defaultPageValue
    );
  });

  it("Should be able to perform bulk action", () => {
    table.verifyBulkActionFunctionality(tables["Asset from inventory"]);
  });
});

describe("Upload asset", { tags: ["@daily"] }, () => {
  it("Should be able to upload asset with correct format", () => {
    step2Scanning.uploadFile(
      "cypress/fixtures/data/autobahn_manual_import_assets.csv"
    );
    step2Scanning.uploadedFile.should("be.visible");

    table
      .getListOfColumnValues(tables["Added Assets"], "Assets")
      .then((columnList) => {
        expect(columnList).to.include("autobahn.security");
      });
  });

  it("Should not be able to upload asset with wrong format", () => {
    step2Scanning.uploadFile("cypress/fixtures/data/maf.xlsx");
    step2Scanning.errorFileDrawer.should("be.visible");
  });

  it("Should be able to download template file", () => {
    cy.deleteDownloadsFolder();
    step2Scanning.downloadTemplateFile.click();
    cy.readFile("cypress/downloads/autobahn_manual_import_assets.csv");
  });
});

describe("Manual upload asset", { tags: ["@daily"] }, () => {
  it("Should be able to manually upload asset using valid domain", () => {
    step2Scanning.assetInput.type(randomDomain);
    step2Scanning.addAsset.click();

    table
      .getListOfColumnValues(tables["Added Assets"], "Assets")
      .then((columnList) => {
        expect(columnList).to.include(randomDomain);
      });
  });

  it("Should be able to manually upload asset using valid IP", () => {
    step2Scanning.assetInput.type(randomIP);
    step2Scanning.addAsset.click();

    table
      .getListOfColumnValues(tables["Added Assets"], "Assets")
      .then((columnList) => {
        expect(columnList).to.include(randomIP);
      });
  });

  it("Should not be able to manually upload asset using invalid domain", () => {
    step2Scanning.assetInput.type(invalidDomain);
    step2Scanning.assetInputErrorMessage.should("be.visible");
    step2Scanning.addAsset.click();

    step2Scanning.emptyAddedAssetTable.should("be.visible");
  });

  it("Should not be able to manually upload asset using invalid IP", () => {
    step2Scanning.assetInput.type(invalidIP);
    step2Scanning.assetInputErrorMessage.should("be.visible");
    step2Scanning.addAsset.click();

    step2Scanning.emptyAddedAssetTable.should("be.visible");
  });

  it("Should not be able to manually upload asset when assets is empty", () => {
    step2Scanning.addAsset.click();
    step2Scanning.assetInputEmptyErrorMessage.should("be.visible");
  });

  it("Should not be able to manually upload asset using already added asset", () => {
    step2Scanning.assetInput.type(randomDomain);
    step2Scanning.addAsset.click();
    step2Scanning.assetInput.type(randomDomain);
    step2Scanning.assetInputDuplicatedErrorMessage.should("be.visible");
  });

  it("Should be able to input criticality ", () => {
    step2Scanning.assetInput.type(randomDomain);

    step2Scanning.criticalityInput.click();
    step2.criticalityDropdown.should("be.visible");
    step2Scanning.criticalCriticality.click();
    step2Scanning.addAsset.click();

    step2Scanning.criticalCriticalityTable.should("be.visible");
  });

  it("Should be able to input tag", () => {
    step2Scanning.assetInput.type(randomDomain);
    step2Scanning.tagInput.type(`${randomTag}{enter}`);
    step2Scanning.addAsset.click({ force: true });

    table
      .getListOfColumnValues(tables["Added Assets"], "Tags")
      .then((columnList) => {
        expect(columnList).to.include(randomTag);
      });
  });

  it("Should not be able to input tag with more than 64 character", () => {
    step2Scanning.assetInput.type(randomDomain);
    step2Scanning.tagInput.type(`${random65Tag}{enter}`);
    step2Scanning.addAsset.click({ force: true });

    step2Scanning.tooManyTagsErrorMessage.should("be.visible");
  });
});

describe.skip("Added asset table", { tags: ["@daily"] }, () => {
  it("Should be able to filter", () => {
    step2Scanning.assetInput.type(randomDomain);
    step2Scanning.criticalityInput.click();
    step2.criticalityDropdown.should("be.visible");
    step2Scanning.criticalCriticality.click();
    step2Scanning.tagInput.type(`${randomTag}{enter}`);
    step2Scanning.addAsset.click({ force: true });

    //Filter by Assets
    table.runFilterSearch(tables["Added Assets"], "Assets", randomDomain);

    //Filter by Criticality
    table.filterCheckbox(
      tables["Added Assets"],
      "Criticality",
      filterData.criticality
    );
    step2Scanning.criticalCriticalityTable.should("be.visible");

    // //Filter by Tags
    // table.runFilterSearch(tables["Added Assets"], "Tags", filterData.hostnames);
  });

  it("Should be able to sort", () => {});

  it("Should be able to change pagination", () => {});

  it("Should be able to delete asset", () => {});

  it("Should be able to perform bulk action", () => {});
});

describe("Go to next step", { tags: ["@daily"] }, () => {
  it("Should be able to click next page when asset is added", () => {
    step2Scanning.uploadFile(
      "cypress/fixtures/data/autobahn_manual_import_assets.csv"
    );
    step2Scanning.nextButton.click();
    modal.confirmAssetOwnership();

    step2Scanning.scanSettingsPage3.should("be.visible");
  });

  it("Should be able to get warning when next button is clicked and no asset is added", () => {
    step2Scanning.nextButton.click();
    modal.modalTitle("No targets selected").should("be.visible");
  });

  it("Should not be able to proceed if EULA confirmation is not checked", () => {
    step2Scanning.uploadFile(
      "cypress/fixtures/data/autobahn_manual_import_assets.csv"
    );
    step2Scanning.nextButton.click();
    modal.approveScanCreateButton.should("have.attr", "disabled");
  });
});
