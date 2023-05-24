import {
  AuthenticationMethods,
  SigninActionShape,
  SinginAction,
} from "@providers/authentication/user";
import template from "./defaults/htmlTemplate";
import { AddElement, CreateElementFromString } from "../helpers";

export class AuthenticationForm {
  private readonly _rootElement: HTMLElement;
  private readonly _defaultProfilePicture =
    "http://localhost:8080/static/C/OperatingSystem/Icons/default_profile_picture.svg";
  private _authenticationMethod = AuthenticationMethods.Password;

  constructor() {
    this._rootElement = CreateElementFromString<HTMLDivElement>(
      template(this._defaultProfilePicture)
    );
  }

  public SwitchSigninMethod() {
    const methodSelectorElement =
      this._rootElement.querySelector<HTMLParagraphElement>(
        ".authentication-method-selector"
      );

    if (!methodSelectorElement) throw new Error();

    const handleMethodChange = () => {
      const methodElement = this._rootElement.querySelector(
        ".authentication-method-selector"
      );
      const passwordElement = this._rootElement.querySelector<HTMLInputElement>(
        ".authorization-password-field"
      );

      if (!methodElement || !passwordElement) throw new Error();

      if (this._authenticationMethod === AuthenticationMethods.Password) {
        methodElement.innerHTML = "Sign in with password";
        passwordElement.placeholder = "pincode";

        this._authenticationMethod = AuthenticationMethods.Pincode;
      } else {
        methodElement.innerHTML = "Sign in with pincode";
        passwordElement.placeholder = "password";

        this._authenticationMethod = AuthenticationMethods.Password;
      }
    };

    methodSelectorElement.addEventListener("click", handleMethodChange);
  }

  public UserKnown(username: string) {
    const usernameInputElement =
      this._rootElement.querySelector<HTMLInputElement>(
        ".authorization-username-field"
      );
    const usernameElement = this._rootElement.querySelector(
      ".authorization-form-username"
    );

    if (!usernameInputElement || !usernameElement) throw new Error();

    usernameInputElement.style.display = "none";
    usernameElement.innerHTML = username;
  }

  public SubmitEvent(callback: (singinAction: SigninActionShape) => void) {
    const formElement = this._rootElement.querySelector<HTMLFormElement>(
      ".authorization-form"
    );

    if (!formElement) throw new Error();

    const handleSubmitEvent = (event: SubmitEvent) => {
      event.preventDefault();

      const usernameField = formElement.querySelector<HTMLInputElement>(
        ".authorization-username-field"
      );
      const passwordField = formElement.querySelector<HTMLInputElement>(
        ".authorization-password-field"
      );

      if (!passwordField || !usernameField) throw new Error();

      const signInAction = new SinginAction({
        method: this._authenticationMethod,
        authenticationInput: passwordField.value,
        username: usernameField.value,
      });

      callback(signInAction);
    };

    formElement.addEventListener("submit", handleSubmitEvent);
  }

  public AuthenticationError() {
    const authenticationErrorElement =
      this._rootElement.querySelector<HTMLParagraphElement>(
        ".authorization-failed"
      );

    if (!authenticationErrorElement) throw new Error();

    authenticationErrorElement.style.visibility = "visible";
  }

  public Render(parentElement: HTMLElement) {
    AddElement(this._rootElement, parentElement);
  }
}

export default template;
