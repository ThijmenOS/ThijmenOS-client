import types from "@ostypes/types";
import AuthorizationMethodShape from "@providers/authorization/authorizationMethodShape";
import {
  AuthenticationMethods,
  singinAction,
} from "@providers/authorization/user";
import { ClassOperation } from "@thijmen-os/common";
import {
  AddElement,
  AddOrRemoveClass,
  CreateElementFromString,
  GetElementByClass,
} from "@thijmen-os/graphics";
import { inject } from "inversify";
import { injectable } from "inversify/lib/annotation/injectable";
import { formTemplate } from "./template";

@injectable()
class AuthenticationGui implements AuthenticationGuiShape {
  private readonly _authorization: AuthorizationMethodShape;
  private signInFormElement?: HTMLFormElement;
  private usernameField?: HTMLInputElement;
  private passwordField?: HTMLInputElement;

  constructor(
    @inject(types.Authorization) authorization: AuthorizationMethodShape
  ) {
    this._authorization = authorization;
  }

  public InitialiseHtml() {
    this.signInFormElement =
      CreateElementFromString<HTMLFormElement>(formTemplate);
    this.usernameField = GetElementByClass<HTMLInputElement>(
      this.signInFormElement,
      "authorization-username-field"
    );
    this.passwordField = GetElementByClass<HTMLInputElement>(
      this.signInFormElement,
      "authorization-password-field"
    );

    this.hideUsernameIfOneUser();

    const parentElement = document.getElementById("thijmen-os-login-page");

    if (!parentElement) throw new Error();

    AddElement(this.signInFormElement, parentElement);

    this.signInFormElement.addEventListener("submit", (event: SubmitEvent) =>
      this.SigninSubmitted(event)
    );
  }

  private hideUsernameIfOneUser() {
    const onlyOneUserRegisterd =
      this._authorization.checkForsingleUserAccount();

    if (onlyOneUserRegisterd) {
      AddOrRemoveClass(
        [this.usernameField!],
        ["username-field-hidden"],
        ClassOperation.ADD
      );
    }
  }

  private SigninSubmitted(event: SubmitEvent) {
    event.preventDefault();

    if (!this.usernameField || !this.passwordField) return;

    const loginInformation = new singinAction({
      username: this.usernameField.value,
      authenticationInput: this.passwordField.value,
      method: AuthenticationMethods.Password,
    });

    const userAuthenticated =
      this._authorization.validateLogin(loginInformation);

    if (userAuthenticated) {
      const loginWrapperElement = document.getElementById(
        "thijmen-os-login-page"
      );

      AddOrRemoveClass(
        [loginWrapperElement!],
        ["user-authenticated"],
        ClassOperation.ADD
      );

      loginWrapperElement!.addEventListener("animationend", () =>
        loginWrapperElement?.remove()
      );
    }
  }
}

export default AuthenticationGui;
