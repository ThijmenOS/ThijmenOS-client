import types from "@ostypes/types";
import AuthorizationMethodShape from "@providers/authentication/authenticationMethodShape";
import {
  AuthenticationMethods,
  singinAction,
  User,
} from "@providers/authentication/user";
import { ClassOperation } from "@thijmen-os/common";
import {
  AddElement,
  AddOrRemoveClass,
  CreateElementFromString,
  GetElementByClass,
} from "@thijmen-os/graphics";
import { inject } from "inversify";
import { injectable } from "inversify/lib/annotation/injectable";
import formTemplate from "./template";
import ErrorManager from "@thijmen-os/errormanager";

@injectable()
class AuthenticationGui implements AuthenticationGuiShape {
  private readonly _authorization: AuthorizationMethodShape;
  private authorizationFormContainerElement?: HTMLDivElement;
  private authorizationFormElement?: HTMLFormElement;
  private usernameField?: HTMLInputElement;
  private passwordField?: HTMLInputElement;
  private usernametextField?: HTMLParagraphElement;
  private authentciationSelectorElement?: HTMLParagraphElement;
  private authenticationStateMessage?: HTMLParagraphElement;

  private authenticationMethod: AuthenticationMethods =
    AuthenticationMethods.Password;

  constructor(
    @inject(types.Authentication) authorization: AuthorizationMethodShape
  ) {
    this._authorization = authorization;
  }

  public Authenticate() {
    this.InitialiseElements();

    this.HideUsernameIfOneUser();
    this.InitialiseSubmitBehaviour();
    this.InitialiseAuthenticationMethodBehaviour();

    this.AddElementToDom();
  }

  private InitialiseElements() {
    this.authorizationFormContainerElement =
      CreateElementFromString<HTMLDivElement>(formTemplate);

    this.authorizationFormElement = GetElementByClass<HTMLFormElement>(
      this.authorizationFormContainerElement,
      "authorization-form"
    );

    this.usernameField = GetElementByClass<HTMLInputElement>(
      this.authorizationFormContainerElement,
      "authorization-username-field"
    );

    this.passwordField = GetElementByClass<HTMLInputElement>(
      this.authorizationFormElement,
      "authorization-password-field"
    );

    this.usernametextField = GetElementByClass<HTMLInputElement>(
      this.authorizationFormContainerElement,
      "authorization-form-username"
    );

    this.authentciationSelectorElement =
      GetElementByClass<HTMLParagraphElement>(
        this.authorizationFormElement,
        "authentication-method-selector"
      );

    this.authenticationStateMessage = GetElementByClass<HTMLParagraphElement>(
      this.authorizationFormContainerElement,
      "authorization-failed"
    );
  }

  private AddElementToDom() {
    const parentElement = document.getElementById("thijmen-os-login-page");

    if (!parentElement) throw new Error();

    AddElement(this.authorizationFormContainerElement!, parentElement);
  }

  private InitialiseSubmitBehaviour() {
    if (!this.authorizationFormElement) {
      ErrorManager.fatalError();
      return;
    }

    this.authorizationFormElement.addEventListener(
      "submit",
      (event: SubmitEvent) => this.SigninSubmitted(event)
    );
  }

  private InitialiseAuthenticationMethodBehaviour() {
    if (!this.authentciationSelectorElement) {
      return;
    }

    this.authentciationSelectorElement.addEventListener("click", () =>
      this.SwitchAuthenticationMethod()
    );
  }

  private SwitchAuthenticationMethod() {
    this.authenticationMethod =
      this.authenticationMethod === AuthenticationMethods.Password
        ? AuthenticationMethods.Pincode
        : AuthenticationMethods.Password;

    if (!this.authentciationSelectorElement || !this.passwordField) {
      return;
    }

    let displayText;
    let placeholder;

    if (this.authenticationMethod === AuthenticationMethods.Password) {
      displayText = "Sigin with pincode";
      placeholder = "password";
    } else {
      displayText = "Signin with password";
      placeholder = "pincode";
    }

    this.authentciationSelectorElement.innerHTML = displayText;
    this.passwordField.placeholder = placeholder;
  }

  private HideUsernameIfOneUser() {
    const onlyOneUserRegisterd =
      this._authorization.CheckForsingleUserAccount();

    if (!onlyOneUserRegisterd) return;
    if (!this.usernameField) return;

    AddOrRemoveClass(
      [this.usernameField],
      ["username-field-hidden"],
      ClassOperation.ADD
    );

    const user = onlyOneUserRegisterd as User;

    this.usernametextField!.innerHTML = user.username;
    return;
  }

  private SigninSubmitted(event: SubmitEvent) {
    event.preventDefault();

    if (!this.usernameField || !this.passwordField) return;

    const loginInformation = new singinAction({
      username: this.usernameField.value,
      authenticationInput: this.passwordField.value,
      method: this.authenticationMethod,
    });

    const userAuthenticated =
      this._authorization.ValidateLogin(loginInformation);

    if (!userAuthenticated) {
      this.authenticationStateMessage!.style.visibility = "visible";
    }

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
