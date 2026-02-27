import { Page } from "../fixtures/interfaces/page.interface";
import { User } from "../fixtures/interfaces/user.interface";

declare global {
  namespace Cypress {
    interface Chainable {
      login(user: User): void;
      loginOTP(user: User): void;
      loginUsingSession(user: User): void;
      openPageUsingSession(user: User, page: Page): void;
      verifyIfOpen(page: Page): void;
      deleteDownloadsFolder(): Chainable<void>;
    }

    interface SuiteConfigOverrides {
      tags?: string | string[];
    }

    interface Cypress {
      grep?: (grep?: string, tags?: string, burn?: string) => void;
    }
  }
}
