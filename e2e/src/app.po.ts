import { browser, by, element } from "protractor";

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getLoginButton() {
    return element(by.css(".mat-button-wrapper")).getText() as Promise<string>;
  }
}
