import { User } from "../../fixtures/interfaces/user.interface";
import modal from "../components/modal";
import fileUploadService from "../services/file-upload-service";

class ImportFilePage {
  get selectOrigin() {
    return cy.get("input[type='search']");
  }

  get originDropdown() {
    return cy.get("div.ant-select-dropdown");
  }

  get scanType() {
    return cy.get("[id='scan_type']");
  }

  get scanTypeDropdown() {
    return cy.get("div.ant-select-dropdown").first();
  }

  get scanName() {
    return cy.get("[id='scan_name']");
  }

  get assigneePlaceholder() {
    return cy
      .get("span.ant-select-selection-placeholder")
      .contains("Select an assignee");
  }

  get uploadFileButton() {
    return cy.get("[type='file']");
  }

  get fileSnapshot() {
    return cy.get("[data-testid='sci--issue-card']", { timeout: 20000 });
  }

  get importButton() {
    return cy.get("[class='ant-btn ant-btn-primary']");
  }

  get internalType() {
    return cy.get("[title='Internal']");
  }

  get confirmUploadButton() {
    return cy.get("[class='ant-btn ant-btn-primary']");
  }

  private confirmUpload(confirm: string) {
    this.importButton.click();
    modal.modalTitle("Data is processed");
    this.confirmUploadButton.contains(confirm).click();
  }

  get scanNameSelection() {
    return cy.get("[id='scan-selection']");
  }

  get existingScan() {
    return cy.get("[class='ant-select-item-option-content']");
  }

  get scanDescription() {
    return cy.get("[id='scan_description']");
  }

  get specialCharErrorMessage() {
    return cy
      .get("div.ant-form-item-explain-error")
      .contains(
        `Invalid format. Please use only A-Z, a-z, 0-9, space or special characters like "_-.+".`
      );
  }

  get longCharErrorMessage() {
    return cy
      .get("div.ant-form-item-explain-error")
      .contains("Scan name must be 64 characters or fewer.");
  }

  get emptyScanNameErrorMessage() {
    return cy.get('[role="alert"]').contains("Scan name is required!");
  }

  get network() {
    return cy.get("[id='network_id']");
  }

  get networkDropdown() {
    return cy.get("div.ant-select-dropdown").last();
  }

  get origin() {
    return cy.get("div.text-md");
  }

  get backButton() {
    return cy.get("[type='button']").contains("Back");
  }

  get downloadMAFtemplate() {
    return cy.get('[download="template_manual-assurance.xlsx"]');
  }

  get emptyScanNameAlert() {
    return cy
      .get("div.ant-alert-description")
      .contains("scan_name must be a string");
  }

  get cancelButton() {
    return cy.get("button.ant-btn.ant-btn-default").last().contains("Cancel");
  }

  getOriginFromDropdown(origin: string) {
    return cy.get("div.ant-select-item").contains(origin);
  }

  getImportTypeButton(type: string) {
    return cy.get("label.ant-radio-button-wrapper").contains(type);
  }

  getScanTypeDropdown(scanType: string) {
    return cy.get("div.ant-select-item").contains(scanType);
  }

  generateUploadFileName(prefix: string) {
    return `${prefix}-${new Date()
      .toISOString()
      .slice(0, 15)
      .replaceAll(":", "-")}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadFile(file: any) {
    cy.get("input[type='file']").selectFile(file, {
      force: true,
    });
  }

  selectOriginAndType(
    importType: "New" | "Existing",
    origin:
      | "Invicti"
      | "Manual Assurance Findings"
      | "MS Defender for Cloud"
      | "Nessus Professional"
      | "Qualys"
      | "Qualys Cloud Agents"
  ) {
    this.selectOrigin.click();
    this.originDropdown
      .should("be.visible")
      .and("not.have.class", "ant-dropdown-hidden")
      .within(() => {
        this.getOriginFromDropdown(origin).click();
      });
    this.originDropdown.should("not.be.visible");
    this.getImportTypeButton(importType).click();
  }

  importFile(
    origin:
      | "Invicti"
      | "Manual Assurance Findings"
      | "MS Defender for Cloud"
      | "Nessus Professional"
      | "Qualys"
      | "Qualys Cloud Agents"
  ) {
    if (
      origin === "MS Defender for Cloud" ||
      origin === "Qualys Cloud Agents" ||
      origin === "Qualys"
    ) {
      fileUploadService.interceptFileIntegration("File Upload");
    } else {
      fileUploadService.interceptFileUpload("File Upload");
    }
    this.confirmUpload("Okay");
    fileUploadService.verifyFileUpload("File Upload");
  }

  getNetworkDropdown(network: string) {
    return cy.get("div.ant-select-item").contains(network);
  }

  getAssigneeDropdown(assignee: User) {
    return cy.get("div.text-ellipsis").contains(assignee.name);
  }

  selectedAssignee(assignee: User) {
    return cy
      .get("[data-testid='label-option-select-user']")
      .contains(assignee.name);
  }

  selectAssignee(assignee: User) {
    this.assigneePlaceholder.click({ force: true });
    this.getAssigneeDropdown(assignee).click();
    this.selectedAssignee(assignee);
  }

  searchUploadFileName(prefix: string): string {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract 1 day
    const formattedDate = today.toISOString().slice(0, 10).replaceAll(":", "-");
    return `${prefix}-${formattedDate}T18-3`;
  }
}
export default new ImportFilePage();
