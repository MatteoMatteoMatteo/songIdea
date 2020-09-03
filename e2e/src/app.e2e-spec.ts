import { AppPage } from "./app.po";
import { browser, logging } from "protractor";

describe("workspace-project App", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("getLoginButton", () => {
    page.navigateTo();
    expect(page.getLoginButton()).toEqual("Login");
  });
});
