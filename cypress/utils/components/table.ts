import { Table } from "../../fixtures/interfaces/table.interface";
import { recurse } from "cypress-recurse";
import analyticsService from "../services/analytics-service";
import { User } from "../../fixtures/interfaces/user.interface";

class Tables {
  /**
   * Getter methods for retrieving elements in the table and associated UI components.
   * We still use getter method because so we still chain Cypress.Chainable type methods on another file.
   */

  get filterInputSearch() {
    return cy.get('[data-testid="filter--input-search"]');
  }

  get filterInputDatepicker() {
    return cy.get('[placeholder="Select date"]');
  }

  get okButton() {
    return cy.get('[data-testid="filter--ok-button"]');
  }

  get resetFilterButton() {
    return cy.get('[data-testid="filter--reset-button"]');
  }

  get filterArea() {
    return cy
      .get("div.ant-dropdown") //could be changed
      .not(".ant-dropdown-hidden")
      .last();
  }

  get inputCheckbox() {
    return cy.get('input[type="checkbox"]');
  }

  get originLogo() {
    return cy.get("div.shrink-0");
  }

  get scanningOriginLogo() {
    return cy.get("[alt='logo']");
  }

  get originTooltip() {
    return cy.get("[role='tooltip']").not(".ant-tooltip-hidden");
  }

  get singleCheckboxBulkSelect() {
    return cy.get('input[type="checkbox"]');
  }

  get checkedCheckbox() {
    return cy.get("span.ant-checkbox-checked");
  }

  getPaginationOption(table: Table, value: string) {
    return cy.get(`${table.mainSelector} [title="${value} / page"]`);
  }

  getDestinationPage(table: Table, value: string) {
    return cy.get(`${table.mainSelector} [title="${value}"]`);
  }

  getFirstPage(table: Table) {
    return cy.get(`${table.mainSelector} [title="1"]`);
  }

  getNextPageButton(table: Table) {
    return cy.get(`${table.mainSelector} [title='Next Page']`);
  }

  getColumnHeader(table: Table, column: string) {
    if (!table.columns.includes(column)) {
      throw new Error(`${column} column is not part of the selected table!`);
    }
    cy.get(table.mainSelector).should("be.visible");
    return cy
      .get(`${table.mainSelector} thead`)
      .contains(column)
      .parents("th.ant-table-cell");
  }

  getAllTableRows(table: Table) {
    if (!table.isCached) {
      this.isLoaded(table);
    }
    cy.get(table.mainSelector, { timeout: 30000 }).should("exist");
    return cy.get(`${table.mainSelector} tbody tr.ant-table-row`);
  }

  /**
   * Get all the elements of a specific column in a table by its index.
   * The method calculates the column index, considering whether bulk actions are present.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Column value chosen by index
   */
  getListOfColumnValueElements(table: Table, column: string) {
    if (!table.columns.includes(column)) {
      throw new Error(`${column} column is not part of the selected table!`);
    }
    const renderedIndex = table.bulkActions ? 2 : 1;
    const columnIndex = table.columns.indexOf(column) + renderedIndex;
    if (!table.isCached && !table.addingTable) {
      this.isLoaded(table);
    }
    return cy.get(
      `${table.mainSelector} tr.ant-table-row td:nth-child(${columnIndex})`
    );
  }

  /**
   * Call `getListOfColumnValueElements` and map the result to an array of strings.
   * We also filter out \n on assignee fetch so result has no assignee nickname.
   * Values is wrapped so that we can return true Javascript array.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @returns {Cypress.Chainable<string[]>} An array of true javascript strings
   */
  getListOfColumnValues(table: Table, column: string) {
    return this.getListOfColumnValueElements(table, column).then(($els) => {
      const values = Cypress.$.makeArray($els).map((el) => {
        const text = el.innerText;
        if (text.includes("\n")) {
          return text.replace(/^[A-Z]{2}\n/, "").trim();
        }
        return text;
      });
      return cy.wrap(values);
    });
  }

  /**
   * Retrieves all values from a specified column in a table, including those across multiple paginated pages if necessary.
   *
   * Pagination Behavior:
   * - If pagination is present, the method changes the page size to 100, then retrieves the column values from each page.
   * - It navigates through pages by clicking the "Next Page" button, retrying up to 8 times, until it reaches the last page
   *   (determined by the "Next Page" button being disabled).
   *
   * If the table does not have pagination, it simply retrieves the column values from the current page.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @returns {Cypress.Chainable<any>} All of column values, including next page's value
   */
  getAllOfColumnValues(table: Table, column: string) {
    let allValues = [];

    if (table.hasPagination) {
      this.changePaginationTable(table, "100");

      return this.getListOfColumnValues(table, column).then((element) => {
        allValues = allValues.concat(element);

        const clickNextPage = (retryCount = 0) => {
          if (retryCount >= 8) {
            return cy.wrap(allValues);
          }
          return this.getNextPageButton(table).then(($tableHeader) => {
            if ($tableHeader.attr("aria-disabled") === "true") {
              return cy.wrap(allValues);
            } else {
              cy.get(`${table.mainSelector} [title='Next Page']`).click();
              cy.wait(250);

              return this.getListOfColumnValues(table, column).then(
                (element) => {
                  allValues = allValues.concat(element);

                  return clickNextPage(retryCount + 1);
                }
              );
            }
          });
        };
        return clickNextPage();
      });
    } else {
      return this.getListOfColumnValues(table, column);
    }
  }

  /**
   * Functions for interacting with the table.
   * These functions utilize the getter methods defined above.
   */

  isLoaded(table: Table) {
    if (!table.isCached && !table.addingTable) {
      cy.wait(1000);
      return cy
        .get(`${table.mainSelector} div.ant-spin-container`, {
          timeout: 150000,
        })
        .should("exist")
        .should("not.have.class", "ant-spin-blur");
    }
  }

  isTableEmpty(table: Table) {
    this.isLoaded(table);
    cy.get(`${table.mainSelector} .ant-empty-description`, {
      timeout: 90000,
    }).should("be.visible");
  }

  isTableHeadersVisible(table: Table) {
    cy.get(table.mainSelector)
      .should("exist")
      .within(() => {
        table.columns.forEach((column) => {
          cy.get("th.ant-table-cell:not(.ant-table-selection-column)")
            .eq(table.columns.indexOf(column))
            .should("exist")
            .and("have.text", column);
        });
      });
  }

  tableNotExist(table: Table) {
    cy.get(table.mainSelector).should("not.exist");
  }

  clicksPage(table: Table, value: string) {
    this.getDestinationPage(table, value).click({
      timeout: 60000,
    });
  }

  changePaginationTable(table: Table, paginationValue: string) {
    cy.get(`${table.mainSelector} div.ant-select-selector`).click();
    cy.get(`div[title="${paginationValue} / page"]`).click();
  }

  /**
   * Method runs pagination change and verify the paginated data whether or not the page changed.
   *
   * First step is verifying that the table's page is on page 1 and pagination option is correct (different per page).
   * Step after that is change pagination table to the highest (100) and table sorting.
   * Table sorting ascending is needed for the data to be verifiable.
   * There should be only one column to be sorted (any column that can be sorted) since we only compare data on that one column.
   *
   * Next step will be getting list of column values, and checking the length.
   * After getting the length, method will go through a series of switch cases to define `pageSize`.
   * `pageSize` is needed to know how many array should be split into 2 and also making sure that there is always page 2.
   *
   * After that, loop the column values to have 2 (or more) array that has total of index based on `pageSize`.
   * After splitting array,  change pagination option to `pageSize` so we can have 2 pages.
   *
   * Compare result of array 1 and page 1.
   * Go to the second page.
   * Compare result of array 2 and page 2.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} defaultPageValue - The default pagination value to verify
   * @throws Will throw an error if page has less than 5 items.
   */
  runChangePagination(table: Table, column: string, defaultPageValue: string) {
    this.getFirstPage(table).should("have.text", "1");
    this.getPaginationOption(table, defaultPageValue).should(
      "have.text",
      defaultPageValue + " / page"
    );

    this.sort(table, column, "ascending");

    this.getAllOfColumnValues(table, column).then((element) => {
      let pageSize = 10;

      if (table.name == "Workouts" || table.name == "To do workouts") {
        pageSize = 5;
      }

      const totalPage = Math.ceil(element.length / pageSize);

      if (totalPage < 2) {
        throw new Error(
          "Method cannot work on table that has less than 10 items"
        );
      }

      this.clicksPage(table, "1");
      this.changePaginationTable(table, pageSize.toString());

      const splittedPageArray = [];

      for (let index = 0; index < element.length; index += pageSize) {
        splittedPageArray.push(element.slice(index, index + pageSize));
      }

      this.getListOfColumnValues(table, column).then((currentPageValue) => {
        expect(currentPageValue).to.deep.equal(splittedPageArray[0]);
      });

      this.clicksPage(table, "2");

      this.getListOfColumnValues(table, column).then((currentPageValue) => {
        expect(currentPageValue).to.include.members(splittedPageArray[1]);
      });
    });
  }

  clickTableFilter(table: Table, column: string) {
    this.getColumnHeader(table, column).within(() => {
      cy.get(".ant-table-filter-trigger").click({
        waitForAnimations: true,
        timeout: 60000,
        force: true,
      });
    });
  }

  /**
   * Run filter search from filtering to resetting the filter.
   *
   * Call `filterSearch` to search the column.
   * Verify that the column value match what is filtered.
   * Then last step would be resetting the filter.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value to be asserted
   */
  runFilterSearch(table: Table, column: string, value: string) {
    this.filterSearch(table, column, value);
    this.isColumnValueMatch(table, column, [value]);
    this.resetFilter(table, column);
    this.getAllTableRows(table).should("be.visible");
  }

  /**
   * Run filter checkbox from filtering to resetting the filter.
   *
   * Call `filterCheckbox` to search the column.
   * If there is origin, then call `verifyOrigin`.
   * We can put null on 5th param `expectedValues` for origin.
   * If not, then verify that the column value match what is filtered by calling `isColumnValueMatch`.
   * Then last step would be resetting the filter.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value from `value` checkbox element
   * @param {string[]} expectedValues Optional asserted value that is on the column. Optional in case value not equal expectedValues.
   * @param {string} origin Optional origin input for origin checkbox
   */
  runFilterCheckbox(
    table: Table,
    column: string,
    values: string[],
    expectedValues?: string[],
    origin?: string
  ) {
    this.filterCheckbox(table, column, values);
    if (origin) {
      if (
        table.name == "All Scans" ||
        table.name == "Scheduled scans" ||
        table.name == "Create Custom Dashboard by Scans"
      ) {
        this.hoverOriginValue(table);
        this.originTooltip.should("have.text", origin);
      } else {
        this.verifyOrigin(table, origin);
      }
    } else {
      this.isColumnValueMatch(table, column, values, expectedValues);
    }
    this.resetFilter(table, column);
    this.getAllTableRows(table).should("be.visible");
  }

  /**
   * Run filter checkbox from filtering to resetting the filter.
   *
   * Call `filterCheckbox` to search the column.
   * Verify that the column value match what is filtered.
   * Then last step would be resetting the filter.
   *
   * @WorkInProgress Don't use this method yet, not tested!
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value from `value` checkbox element
   * @param {string[]} expectedValues Optional asserted value that is on the column. Optional in case value not equal expectedValues.
   */
  runFilterInputCheckbox(
    table: Table,
    column: string,
    name?: string,
    value?: string,
    user?: User
  ) {
    this.filterInputCheckbox(table, column, name, value, user);
    this.isColumnValueMatch(table, column, [name]);
    this.resetFilter(table, column);
    this.getAllTableRows(table).should("be.visible");
  }

  /**
   * Run filter date from filtering to resetting the filter.
   *
   * Call `filterDate` to search the column.
   * Verify that the column value match what is filtered by calling `isColumnValueMatch`.
   * Then last step would be resetting the filter.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value from `value` checkbox element
   * @param {string} expectedValues Optional asserted value that is on the column. Optional in case value not equal expectedValues.
   */
  runFilterDate(
    table: Table,
    column: string,
    value: string,
    expectedValue?: string
  ) {
    this.filterDate(table, column, value);
    this.isColumnValueMatch(table, column, [value], [expectedValue]);
    this.resetFilter(table, column);
    this.getAllTableRows(table).should("be.visible");
  }

  /**
   * Filter for filter with search bar.
   *
   * If table has `loadOnFilter` attribute, then intercept Analytics service since that means we can have extra step to assert server side pagination call.
   * Second if, table doesn't have `isCached` attribute, then call `isLoaded` method since that means the table is loading.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value to be asserted
   */
  filterSearch(table: Table, column: string, value: string) {
    // const requestAlias = table.name;
    // if (table.loadOnFilter) {
    //   analyticsService.interceptAnalyticsService(requestAlias);
    // }

    if (!table.isCached) {
      this.isLoaded(table);
    }
    this.clickTableFilter(table, column);
    cy.wait(1000);
    this.filterArea.should("exist");
    this.filterArea.should("be.visible").within(() => {
      this.filterInputSearch.clear();
      this.filterInputSearch.should("have.value", "");
      this.filterInputSearch.should("not.be.disabled");
      this.filterInputSearch.type(`${value}`);
      this.filterInputSearch.should("have.value", `${value}`);

      this.filterInputSearch.blur();
      this.okButton.click({ timeout: 60000 });
    });
    cy.wait(1000);
    // if (table.loadOnFilter) {
    //   analyticsService.verifyAnalyticsService(table.name);
    //   this.isLoaded(table);
    // }
    this.isLoaded(table);
  }

  /**
   * Filter for filter with checkbox.
   *
   * If table has `loadOnFilter` attribute, then intercept Analytics service since that means we can have extra step to assert server side pagination call.
   * Second if, table doesn't have `isCached` attribute, then call `isLoaded` method since that means the table is loading.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value to be asserted
   */
  filterCheckbox(table: Table, column: string, values: string[]) {
    // const requestAlias = table.name;
    // if (table.loadOnFilter) {
    //   analyticsService.interceptAnalyticsService(requestAlias);
    // }

    this.clickTableFilter(table, column);
    cy.wait(1000);
    this.filterArea.should("exist").within(() => {
      this.inputCheckbox.check(values);
      this.okButton.click({ timeout: 60000 });
    });
    cy.wait(1000);
    // if (table.loadOnFilter) {
    //   analyticsService.verifyAnalyticsService(table.name);
    // }
    this.isLoaded(table);
  }

  /**
   * Filter for filter with search bar and input checkbox.
   *
   * If table has `loadOnFilter` attribute, then intercept Analytics service since that means we can have extra step to assert server side pagination call.
   *
   * Method have optional `user` param that can be used if needed for assignee filter.
   * If `user` param is used, method will type name and uid based on `User`.
   * Name and value param is not needed if `user` param is used, therefore need to pass `null` on call.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} name Name of value we want to assert
   * @param {string} value Value to be asserted
   * @param {User} user Optional value for user checkbox
   */
  filterInputCheckbox(
    table: Table,
    column: string,
    name?: string,
    value?: string,
    user?: User
  ) {
    // const requestAlias = table.name;
    // if (table.loadOnFilter) {
    //   analyticsService.interceptAnalyticsService(requestAlias);
    // }
    this.isLoaded(table);
    this.clickTableFilter(table, column);
    this.filterArea.should("exist").within(() => {
      this.filterInputSearch.should("not.be.disabled");
      if (user) {
        this.filterInputSearch.type(`${user.name}`);
        this.inputCheckbox.check(user.uid);
      } else {
        this.filterInputSearch.type(`${name}`);
        this.inputCheckbox.check(value);
      }
      this.okButton.click({ timeout: 60000 });
    });
    cy.wait(1000);
    // if (table.loadOnFilter) {
    //   analyticsService.verifyAnalyticsService(table.name);
    //   this.isLoaded(table);
    // }
    this.isLoaded(table);
  }

  /**
   * Filter for filter date.
   *
   * Filter will type date and click enter.
   * By clicking enter, we close date panel so that `okButton` is accessible.
   *
   * If table has `loadOnFilter` attribute, then intercept Analytics service since that means we can have extra step to assert server side pagination call.
   *
   * Value template is "date, month (only first 3 alphabet) and year".
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} value Value to be asserted
   * @example "17 Sep 2024, 20 May 2009, 01 Dec 1999"
   */
  filterDate(table: Table, column: string, value: string) {
    // const requestAlias = table.name;
    // if (table.loadOnFilter) {
    //   analyticsService.interceptAnalyticsService(requestAlias);
    // }
    this.clickTableFilter(table, column);
    this.filterArea.should("exist").within(() => {
      this.filterInputDatepicker.should("not.be.disabled");
      this.filterInputDatepicker.click();
      this.filterInputDatepicker.type(`${value}`, { force: true });
      this.filterInputDatepicker.type("{enter}", { force: true });
      this.okButton.click({ timeout: 30000 });
    });
    cy.wait(1000);
    // if (table.loadOnFilter) {
    //   analyticsService.verifyAnalyticsService(table.name);
    // }
    this.isLoaded(table);
  }

  resetFilter(table: Table, column: string) {
    this.clickTableFilter(table, column);
    cy.wait(1000);
    this.filterArea.should("exist").within(() => {
      this.resetFilterButton.should("be.visible").click();
    });
    this.isLoaded(table);
  }

  /**
   * Sorts a specified column in the table by simulating a click on the column header and verifying the sorting behavior.
   *
   *
   * This method performs the following steps:
   * 1. Repeatedly checks the column header's `aria-sort` attribute to determine whether the table is sorted as expected.
   * 2. If the column is not sorted in the desired order, it clicks the column header to trigger sorting.
   * 3. Retries the check up to 5 times with a 250ms delay between attempts, and a maximum timeout of 5000ms.
   * 4. Once sorted, it asserts that the column's `aria-sort` attribute matches the specified `method`.
   *
   * The method uses the `recurse` function to repeatedly verify and trigger sorting until it succeeds or hits the retry limit.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} method Available sorting method: ascending, descending.
   */
  sort(table: Table, column: string, method: "ascending" | "descending") {
    recurse(
      () => this.getColumnHeader(table, column),
      ($tableHeader) => $tableHeader.attr("aria-sort") === method,
      {
        limit: 5,
        timeout: 15000,
        delay: 500,
        post() {
          cy.get(`${table.mainSelector} thead`)
            .contains(column)
            .click({ timeout: 60000 });
        },
      }
    ).then(() => {
      this.getColumnHeader(table, column)
        .should("have.attr", "aria-sort")
        .and("equal", method);
    });
  }

  verifySort(table: Table, column: string, method: "ascending" | "descending") {
    this.getColumnHeader(table, column).should(
      "have.attr",
      "aria-sort",
      method
    );
  }

  /**
   * Sorts a column in a table and verifies that the UI sorting matches the expected JavaScript sorting.
   *
   * This method performs the following steps:
   * 1. Call `sort` method.
   * 2. Retrieves all values from the specified column using `getAllOfColumnValues`.
   * 3. Make sure that `jsSortedValues` is case insensitive.
   * 4. Compares the first `defaultPageValue` rows of JavaScript sorted values with the UI-sorted values.
   * 5. Filters out "None" values from both the JavaScript and UI sorted values before comparison.
   *
   * Sorting Behavior:
   * - In "ascending" mode, values are sorted alphabetically (case-insensitive).
   * - In "descending" mode, the ascending sort result is reversed, but still case insensitive.
   * - Filters "None" text to avoid accidental sorting.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} method Available sorting method: ascending, descending.
   * @param {string} defaultPageValue Default pagination value of a page.
   * @throws Will throw an error if cannot find method attribute on `aria-sort`.
   * @warning Method won't always work since there is some sorting on the app that rely not on alphabet, but priority (team's page Role column for example).
   */
  runSort(
    table: Table,
    column: string,
    method: "ascending" | "descending",
    defaultPageValue: string
  ) {
    let jsSortedValues: string[];
    let uiSortedValues: string[];

    this.sort(table, column, method);

    this.getAllOfColumnValues(table, column).then((element) => {
      if (method === "ascending") {
        jsSortedValues = element.sort(
          (comparatorA: string, comparatorB: string) =>
            comparatorA
              .toLowerCase()
              .localeCompare(comparatorB.toLowerCase(), undefined, {
                ignorePunctuation: true,
              })
        );
      } else {
        jsSortedValues = element
          .sort((comparatorA: string, comparatorB: string) =>
            comparatorA
              .toLowerCase()
              .localeCompare(comparatorB.toLowerCase(), undefined, {
                ignorePunctuation: true,
              })
          )
          .reverse();
      }

      if (table.caseSensitiveSorting) {
        method === "ascending"
          ? jsSortedValues.sort()
          : jsSortedValues.sort().reverse();
      }

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }

      this.getListOfColumnValues(table, column).then((element) => {
        uiSortedValues = element;

        jsSortedValues = jsSortedValues.filter(
          (item) =>
            item !== "None" &&
            item !== "Not set" &&
            item !== "Unassigned" &&
            item !== ""
        );
        uiSortedValues = uiSortedValues.filter(
          (item) =>
            item !== "None" &&
            item !== "Not set" &&
            item !== "Unassigned" &&
            item !== ""
        );

        expect(
          uiSortedValues.slice(0, +defaultPageValue),
          `${method.toUpperCase()} sorting on ${column} column`
        ).to.deep.equal(jsSortedValues.slice(0, +defaultPageValue));
      });

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }
    });
  }

  /**
   * Sorts a column in a table and verifies that the UI sorting matches the expected JavaScript sorting.
   *
   * This method performs the following steps:
   * 1. Call `sort` method.
   * 2. Retrieves all values from the specified column using `getAllOfColumnValues`.
   * 3. Perform numerical sort.
   * 4. Compares the first `defaultPageValue` rows of JavaScript sorted values with the UI-sorted values.
   * 5. Filters out "None" values from both the JavaScript and UI sorted values before comparison.
   *
   * Sorting Behavior:
   * - In "ascending" mode, values are sorted alphabetically (case-insensitive).
   * - In "descending" mode, the ascending sort result is reversed, but still case insensitive.
   * - Filters "None" text to avoid accidental sorting.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} method Available sorting method: ascending, descending.
   * @param {string} defaultPageValue Default pagination value of a page.
   * @throws Will throw an error if cannot find method attribute on `aria-sort`.
   */
  runNumberSort(
    table: Table,
    column: string,
    method: "ascending" | "descending",
    defaultPageValue: string
  ) {
    let jsSortedValues: string[];
    let uiSortedValues: string[];

    this.sort(table, column, method);

    this.getAllOfColumnValues(table, column).then((element) => {
      if (method === "ascending") {
        jsSortedValues = element.sort(
          (comparatorA: number, comparatorB: number) => {
            return comparatorA - comparatorB;
          }
        );
      } else {
        jsSortedValues = element
          .sort((comparatorA: number, comparatorB: number) => {
            return comparatorA - comparatorB;
          })
          .reverse();
      }

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }

      this.getListOfColumnValues(table, column).then((element) => {
        uiSortedValues = element;

        jsSortedValues = jsSortedValues.filter((item) => item !== "None");
        uiSortedValues = uiSortedValues.filter((item) => item !== "None");

        expect(
          uiSortedValues.slice(0, +defaultPageValue),
          `${method.toUpperCase()} sorting on ${column} column`
        ).to.deep.equal(jsSortedValues.slice(0, +defaultPageValue));
      });

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }
    });
  }

  /**
   * Sorts a specified column in the provided table based on a predefined date order.
   *
   * This method performs the following steps:
   * 1. Retrieves all values from the specified column using `getListOfColumnValues`.
   * 2. Transforms date strings into JavaScript `Date` objects, adjusting the format as needed.
   * 3. Sorts the dates based on the provided method (either "ascending" or "descending").
   * 4. Applies the sorting order to the table using the `sort` method.
   * 5. Retrieves the UI-sorted column values and compares them with the expected JavaScript-sorted values.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose custom column
   * @param {string} method Available sorting method: ascending, descending
   * @param {string} defaultPageValue Default pagination value of a page.
   * @throws Will throw an error if cannot find method attribute on `aria-sort`.
   */
  runDateSort(
    table: Table,
    column: string,
    method: "ascending" | "descending",
    defaultPageValue: string
  ) {
    let transformedDates: Date[];
    let uiSortedValues: Date[];
    this.getAllOfColumnValues(table, column).then((element) => {
      const wrapDate = element.filter((item) => item !== "None");

      transformedDates = wrapDate.map((dateString) => {
        const formattedDate = dateString.replace("\n", " ").replace(" WIB", "");
        return new Date(formattedDate);
      });

      if (method === "ascending") {
        transformedDates
          .sort((comparatorA: Date, comparatorB: Date) => {
            return comparatorB.getTime() - comparatorA.getTime();
          })
          .reverse();
      } else {
        transformedDates.sort((comparatorA: Date, comparatorB: Date) => {
          return comparatorB.getTime() - comparatorA.getTime();
        });
      }

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }

      this.sort(table, column, method);

      this.getListOfColumnValues(table, column).then((element) => {
        const wrapDate = element.filter((item) => item !== "None");

        uiSortedValues = wrapDate.map((dateString) => {
          const formattedDate = dateString
            .replace("\n", " ")
            .replace(" WIB", "");
          return new Date(formattedDate);
        });

        expect(
          uiSortedValues.slice(0, +defaultPageValue),
          `${method.toUpperCase()} sorting on ${column} column`
        ).to.deep.equal(transformedDates.slice(0, +defaultPageValue));

        if (table.hasPagination) {
          this.clicksPage(table, "1");
        }
      });
    });
  }

  /**
   * Sorts the specified column of a given table according to a predefined order.
   *
   * This method performs the following steps:
   * 1. Define `correctSortOrder` based on column.
   * 2. Call `sort` method.
   * 3. Retrieves all values from the specified column using `getAllOfColumnValues`.
   * 4. Perform custom sort based on `correctSortOrder`.
   * 5. Compares the first `defaultPageValue` rows of JavaScript sorted values with the UI-sorted values.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose custom column
   * @param {string} method Available sorting method: ascending, descending
   * @param {string} defaultPageValue Default pagination value of a page
   * @throws Will throw an error if column is not included on custom column.
   */
  runCustomSort(
    table: Table,
    column:
      | "Effort"
      | "Hack. reduction"
      | "Interval"
      | "Max Severity"
      | "Max. Severity"
      | "Role"
      | "Status"
      | "Severity",
    method: "ascending" | "descending",
    defaultPageValue: string
  ) {
    let correctSortOrder: string[] = [];
    let jsSortedValues: string[];
    let uiSortedValues: string[];

    switch (column) {
      case "Effort":
        correctSortOrder = ["Small", "Medium", "High"];
        break;
      case "Hack. reduction":
        correctSortOrder = ["Very low", "Low", "Medium", "High", "Very high"];
        break;
      case "Interval":
        correctSortOrder = ["Weekly", "Monthly", "Quarterly"];
        break;
      case "Max Severity":
        correctSortOrder = ["None", "Low", "Medium", "High", "Critical"];
        break;
      case "Max. Severity":
        correctSortOrder = ["N/A", "Low", "Medium", "High", "Critical"];
        break;
      case "Role":
        correctSortOrder = ["General user", "Admin", "Owner"];
        break;
      case "Severity":
      case "Status":
        correctSortOrder = ["Low", "Medium", "High", "Critical"];
        if (table.name.includes("All Scans")) {
          correctSortOrder = ["Canceled", "Finished", "Error", "Running"];
        }
        break;
      default:
        throw new Error(
          `${column} column is not included in custom sorting, please use other sort method instead`
        );
    }

    this.sort(table, column, method);

    this.getAllOfColumnValues(table, column).then((element) => {
      jsSortedValues = element.sort(
        (comparatorA: string, comparatorB: string) => {
          const indexA = correctSortOrder.indexOf(comparatorA);
          const indexB = correctSortOrder.indexOf(comparatorB);
          return method === "ascending" ? indexA - indexB : indexB - indexA;
        }
      );

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }

      this.getListOfColumnValues(table, column).then((element) => {
        uiSortedValues = element;

        expect(
          uiSortedValues.slice(0, +defaultPageValue),
          `${method.toUpperCase()} sorting on ${column} column`
        ).to.deep.equal(jsSortedValues.slice(0, +defaultPageValue));
      });

      if (table.hasPagination) {
        this.clicksPage(table, "1");
      }
    });
  }

  /**
   * Click the only column value.
   * If link exists, can put the optional link param to get link to click.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {boolean} link Optional param to differentiate between clicking link element and no link element
   */
  clickOnColumnValueOrLink(table: Table, column: string, link?: boolean) {
    this.getListOfColumnValueElements(table, column)
      .should("have.length", 1)
      .within(() => {
        if (link) {
          cy.get("a").invoke("removeAttr", "target").click({ timeout: 60000 });
        } else {
          cy.root().click({ timeout: 60000 });
        }
      });
  }

  /**
   * Check that column has only one value and assert expected value.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} expectedValue Any string that needs to be asserted
   */
  isOnlyValueInColumn(table: Table, column: string, expectedValue: string) {
    this.getListOfColumnValueElements(table, column)
      .should("have.length", 1)
      .and("contain.text", expectedValue);
  }

  /**
   * Same as `isOnlyValueInColumn`, only difference is this method checks the first value.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string} expectedValue Any string that needs to be asserted
   */
  isFirstValueInColumn(table: Table, column: string, expectedValue: string) {
    this.getListOfColumnValueElements(table, column).then(($els) => {
      cy.wrap($els[0]).should("contain.text", expectedValue);
    });
  }

  /**
   * This method asserts all column value to have asserted value.
   *
   * Method works by getting value of each column element.
   * After getting value of each column element, there is 2 ifs.
   * If there is an `optionalAssertedValue`, then assert the text.
   * If there is no `optionalAssertedValue`, assert `expectedValues` in lower case.
   *
   * @param {Table} table Choose table
   * @param {string} column Choose column
   * @param {string[]} expectedValues Expected values to assert
   * @param {string[]} optionalAssertedValue Optional asserted value that is on the column. Optional in case value not equal expectedValues.
   */
  isColumnValueMatch(
    table: Table,
    column: string,
    expectedValues: string[],
    optionalAssertedValue?: string[]
  ) {
    this.getListOfColumnValueElements(table, column).each(($el, index) => {
      const loweredCasedExpectedValues = expectedValues.map((expectedValue) =>
        expectedValue.toLowerCase()
      );
      cy.wrap($el)
        .invoke("text")
        .then((text) => {
          if (optionalAssertedValue) {
            expect(
              text,
              `Check value nr ${index + 1} of ${
                table.name
              } table column ${column} to be within expected values`
            ).includes(optionalAssertedValue);
          } else {
            expect(
              text.toLowerCase(),
              `Check value nr ${index + 1} of ${
                table.name
              } table column ${column} to be within expected values`
            ).includes(loweredCasedExpectedValues);
          }
        });
    });
  }

  selectOnlyDataRowBulkActions(table: Table) {
    if (!table.bulkActions) {
      throw new Error(`${table.name} can't perform bulk actions`);
    }
    this.getAllTableRows(table).then(($els) => {
      cy.wrap($els[0]).within(() => {
        this.singleCheckboxBulkSelect.click();
        this.checkedCheckbox.should("exist");
      });
    });
  }

  /**
   * Check total record of bulk action by fetching bulk action description.
   *
   * @param {Table} table Choose table
   * @param {number} expectedNumber Number to assert on bulk action description
   */
  verifyBulkActionRecordCount(table: Table, expectedNumber: number) {
    if (!table.bulkActions) {
      throw new Error(`Method can't be used on ${table.name} table`);
    }

    const selector = `${table.mainSelector} span.font-semibold`;
    this.isLoaded(table);
    cy.get(selector).should("contain.text", expectedNumber, {
      setTimeout: 20000,
    });
  }

  selectAllBulkAction(table: Table) {
    cy.get(table.mainSelector).should("be.visible");
    cy.get(`${table.mainSelector} thead`).within(() => {
      this.inputCheckbox.click();
      this.checkedCheckbox.should("exist");
    });
    this.getAllTableRows(table).each((row) => {
      cy.wrap(row).within(() => {
        this.checkedCheckbox.should("exist");
      });
    });
  }

  verifyBulkActionFunctionality(table: Table) {
    this.selectOnlyDataRowBulkActions(table);
    this.selectAllBulkAction(table);
  }

  /**
   * Verify origin on a table by verifying tooltip text.
   *
   * @param {Table} table Choose table
   * @param {Table} origin Origin text to assert
   */
  verifyOrigin(table: Table, origin: string) {
    this.hoverOriginValue(table);
    this.originTooltip.should("have.text", origin);
    if (table.name == "All Scans" || table.name == "Scheduled scans") {
      this.scanningOriginLogo.first().trigger("mouseout");
    } else {
      this.originLogo.first().trigger("mouseout");
    }
  }

  hoverOriginValue(table: Table) {
    cy.get(table.mainSelector).within(() => {
      if (
        table.name == "All Scans" ||
        table.name == "Scheduled scans" ||
        table.name == "Create Custom Dashboard by Scans"
      ) {
        this.scanningOriginLogo.first().trigger("mouseover");
      } else {
        this.originLogo.first().trigger("mouseover");
      }
    });
  }

  verifyRevisionIsIncremented(table: Table, column: string, revision) {
    return revision.then((revisionBeforeScan) => {
      this.getListOfColumnValues(table, column).then((revisionAfterScan) => {
        expect(+revisionBeforeScan[0] + 1).to.equal(+revisionAfterScan[0]);
      });
    });
  }
}

export default new Tables();
