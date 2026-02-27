import { User } from "../../fixtures/interfaces/user.interface";
import modal from "../components/modal";
import accessManagementService from "../services/access-management-service";
import { tables } from "../../fixtures/constants/table";
import mailosaur from "../services/mailosaur";
import table from "../components/table";

class TeamPage {
  get statusBadge() {
    return cy.get(".status-badge");
  }

  get inviteUser() {
    return cy.get('button[data-testid="btn-invite-member"]');
  }

  get inviteMemberDrawer() {
    return cy.get('[data-testid="invite-member-drawer"]');
  }

  get inputEmail() {
    return cy.get("input#email");
  }

  get inputFirstName() {
    return cy.get("input#firstName");
  }

  get inputLastName() {
    return cy.get("input#lastName");
  }

  get inputRole() {
    return cy.get("input#role");
  }

  get checkButton() {
    return cy.get("button.check-button");
  }

  get clearFormButton() {
    return cy.get('button[data-testid="form-btn-clear"]');
  }

  get inviteButton() {
    return cy.get('button[data-testid="form-btn-invite"]');
  }

  get actionButton() {
    return cy.get('[data-testid="button-dropdown-action"]');
  }
  get statusButton() {
    return cy.get('[data-testid="button-account-status"]');
  }

  get resendInvite() {
    return cy.get('[data-testid="button-resend-invitation"]');
  }

  get deleteUserButton() {
    return cy.get('[data-testid="button-delete"]');
  }

  private manageUser(action: string) {
    this.actionButton.click();
    this.statusButton.contains(action).click();
    modal.approveActionButton.contains(action).click();
  }

  blockUser(user: User) {
    const alias = `block-${user.name}`;
    accessManagementService.interceptBlockUser(user, alias);
    this.manageUser("Deactivate");
    table.isOnlyValueInColumn(tables.Team, "Status", "Deactivated");
    accessManagementService.verifyBlockUser(alias);
    mailosaur.checkDeactivationEmail(user);
  }

  activateUser(user: User) {
    const alias = `unblock-${user.name}`;
    accessManagementService.interceptUnblockUser(user, alias);
    this.manageUser("Activate");
    table.isOnlyValueInColumn(tables.Team, "Status", "Active");
    accessManagementService.verifyUnblockUser(alias);
    mailosaur.checkUserReactivation(user);
  }

  resendInvitation(user: User) {
    const alias = `resend-${user.name}`;
    accessManagementService.interceptInvitationEmail(user, alias);

    this.actionButton.click();
    this.resendInvite.contains("Resend Invitation").click();
    modal.approveActionButton.contains("Resend Invitation").click();

    table.isOnlyValueInColumn(tables.Team, "Status", "Pending");
    accessManagementService.verifyResendInvitation(alias);
    mailosaur.checkInvitationEmail(user);
  }

  deleteUser(user: User) {
    const alias = `delete-${user.name}`;
    accessManagementService.interceptDeleteRequest(user, alias);

    this.actionButton.click();
    this.deleteUserButton.contains("Delete").click();
    modal.approveActionButton.contains("Delete").click();
    accessManagementService.verifyDeletUser(alias);
  }

  changeRole(user: User, requestRole: "General user" | "Admin") {
    const roleId =
      requestRole === "General user" ? "general-user" : "org-admin";

    const changeRoleSelector = `li[data-menu-id*="${roleId}"]`;
    const alias = `changerole-${roleId}-${user.name}`;
    accessManagementService.interceptChangeRole(alias);
    table.clickOnColumnValueOrLink(tables.Team, "Role");
    cy.get(changeRoleSelector).contains(requestRole).click();
    modal.modalTitle("Confirm role change").should("be.visible");
    modal.approveActionButton.contains("Confirm").click();
    accessManagementService.verifyChangeRole(alias);
  }

  setRole(setRole: "Admin" | "General user") {
    this.inputRole.click();
    cy.get("div.rc-virtual-list").contains(setRole).click();
  }
}

export default new TeamPage();
