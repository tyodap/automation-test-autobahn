class Toast {
  getSuccessNotification(message: string) {
    return cy.get('div[aria-modal="true"]', {
      timeout: 30000,
    });
  }
}

export default new Toast();
