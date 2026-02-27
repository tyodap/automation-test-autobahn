class LoginPage {
  get emailSelector() {
    return cy.get(`[data-testid="login-email"]`);
  }

  get passwordSelector() {
    return cy.get(`[data-testid="login-password"]`);
  }

  get loginSelector() {
    return cy.get("[type='submit']").contains("Next");
  }

  get resetPassword() {
    return cy.get(`[data-testid="reset-button"]`);
  }

  get resetPasswordEmail() {
    return cy.get(`[data-testid="user-email"]`);
  }

  get confirmPasswordReset() {
    return cy.get(`[data-testid="send-button"]`);
  }

  get alertMsg() {
    return cy.get("div.ant-alert-message");
  }

  get otpScreen() {
    return cy.get("#mfa-screen");
  }
  get otpIput() {
    return cy.get('#2fa-form [data-testid="form-item"] input');
  }

  get otpSubmit() {
    return cy.get('#2fa-form [data-testid="submit-button"]');
  }

  get loginLoading() {
    return cy.get(".ant-btn-loading");
  }
}

export default new LoginPage();
