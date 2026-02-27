import "cypress-mailosaur";
import { User } from "../../fixtures/interfaces/user.interface";

class MailosaurExternalService {
  clearUserMailbox(user: User) {
    const userEmail = user.email;
    if (!user.mailosaur_server) {
      throw new Error(`${user.name} mailosaur server is not set.`);
    }

    cy.mailosaurGetMessagesBySentTo(user.mailosaur_server, userEmail).then(
      (result) => {
        const emails = result.items;

        if (emails.length) {
          cy.log(`Cleaning ${userEmail}'s mailbox`);
          emails.forEach(function (email) {
            cy.mailosaurDeleteMessage(email.id);
          });
        } else {
          cy.log(`${userEmail} mailbox is empty`);
        }
      }
    );
  }

  //Example of user object as an entry to the function
  checkDeactivationEmail(user: User) {
    cy.mailosaurGetMessage(user.mailosaur_server, {
      sentTo: user.email,
      subject: `Account deactivated at ${user.orgs[0].name}`,
    }).then((message) => {
      const email = message.html.body;
      expect(email).to.contain(user.name);
      expect(email).to.contain("support@autobahn-security.com");
      cy.mailosaurDeleteMessage(message.id);
    });
  }

  checkInvitationEmail(user: User) {
    cy.mailosaurGetMessage(
      user.mailosaur_server,
      {
        sentTo: user.email,
        subject: `Invitation to Autobahn Security`,
      },
      { timeout: 60000 }
    ).then((message) => {
      const email = message.html.body;
      expect(email).to.contain(user.name);
      expect(email).to.contain(user.orgs[0].name); //requires rework
      expect(message.html.links[0].href).to.contain(
        `${Cypress.env("loginUrl")}/password/change/`
      );
      cy.mailosaurDeleteMessage(message.id);
    });
  }

  checkUserReactivation(user: User) {
    cy.mailosaurGetMessage(
      user.mailosaur_server,
      {
        sentTo: user.email,
        subject: `Account reactivated at ${user.orgs[0].name}`,
      },
      { timeout: 60000 }
    ).then((message) => {
      const email = message.html.body;
      expect(email).to.contain(user.name);
      expect(email).to.contain(user.orgs[0].name); //requires rework
      cy.mailosaurDeleteMessage(message.id);
    });
  }

  checkResetPasswordEmail(user: User) {
    cy.mailosaurGetMessage(
      user.mailosaur_server,
      {
        sentTo: user.email,
        subject: `Password Reset - Autobahn Security`,
      },
      { timeout: 30000 }
    ).then((message) => {
      // const email = message.html.body;
      // expect(email).to.contain(user.name);
      expect(message.html.links[0].href).to.contain(
        `${Cypress.env("loginUrl")}/password/change/`
      );
      cy.mailosaurDeleteMessage(message.id);
    });
  }

  checkResetSetupEmail(user: User) {
    cy.mailosaurGetMessage(
      user.mailosaur_server,
      {
        sentTo: user.email,
        subject: `Password Setup - Autobahn Security`,
      },
      { timeout: 30000 }
    ).then((message) => {
      const email = message.html.body;
      expect(email).to.contain(user.name);
      expect(message.html.links[0].href).to.contain(
        `${Cypress.env("loginUrl")}/lo/reset?ticket`
      );
      cy.mailosaurDeleteMessage(message.id);
    });
  }

  checkCancelScanEmail(user: User, scanName: string) {
    cy.wait(10000);
    cy.mailosaurGetMessage(
      user.mailosaur_server,
      {
        sentTo: user.email,
        subject: `Autobahn scan ${scanName} cancelled`,
      },
      { timeout: 30000 }
    ).then((message) => {
      const email = message.html.body;
      expect(email).to.contain(user.name);
      expect(email).to.contain("cancelled");
      expect(email).to.contain("support@autobahn-security.com");
      cy.mailosaurDeleteMessage(message.id);
    });
  }
}

export default new MailosaurExternalService();
