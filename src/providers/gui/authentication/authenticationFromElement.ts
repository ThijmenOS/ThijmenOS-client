import {
  AuthenticationMethods,
  SigninActionShape,
  singinAction,
} from "@providers/authentication/user";
import { AddElement, CreateElementFromString } from "@thijmen-os/graphics";

const template = (profilePicture: string) =>
  `
  <div id="authorization-form-container" class="authorization-form-container">
    <div id="profile-image" class="profile-image">
      <img
        id="user-profile-picture"
        class="user-profile-picture"
        src="${profilePicture}"
      />
      <p id="authorization-form-username" class="authorization-form-username"></p>
      <p id="authorization-failed" class="authorization-failed">Incorrect credentials</p>
    </div>
    <form id="authorization-form" class="authorization-form">
      <input
        type="text"
        id="username"
        class="authorization-username-field"
        name="username"
        placeholder="username"
      />
      <input
        type="password"
        class="authorization-password-field"
        name="password"
        placeholder="password"
      />
      <p id="authentication-method-selector" class="authentication-method-selector">Sign in with pincode</p>
      <input id="submit" type="submit" value="signin" />
    </form>
  </div>
 `;

export class AuthenticationForm {
  private readonly rootElement: HTMLElement;
  private readonly defaultProfilePicture =
    "http://localhost:8080/static/C/OperatingSystem/Icons/default_profile_picture.svg";
  private authenticationMethod = AuthenticationMethods.Password;

  constructor() {
    this.rootElement = CreateElementFromString<HTMLDivElement>(
      template(this.defaultProfilePicture)
    );
  }

  public SwitchSigninMethod() {
    const methodSelectorElement =
      this.rootElement.querySelector<HTMLParagraphElement>(
        ".authentication-method-selector"
      );

    if (!methodSelectorElement) throw new Error();

    const handleMethodChange = () => {
      const methodElement = this.rootElement.querySelector(
        ".authentication-method-selector"
      );
      const passwordElement = this.rootElement.querySelector<HTMLInputElement>(
        ".authorization-password-field"
      );

      if (!methodElement || !passwordElement) throw new Error();

      if (this.authenticationMethod === AuthenticationMethods.Password) {
        methodElement.innerHTML = "Sign in with password";
        passwordElement.placeholder = "pincode";

        this.authenticationMethod = AuthenticationMethods.Pincode;
      } else {
        methodElement.innerHTML = "Sign in with pincode";
        passwordElement.placeholder = "password";

        this.authenticationMethod = AuthenticationMethods.Password;
      }
    };

    methodSelectorElement.addEventListener("click", handleMethodChange);
  }

  public UserKnown(username: string) {
    const usernameInputElement =
      this.rootElement.querySelector<HTMLInputElement>(
        ".authorization-username-field"
      );
    const usernameElement = this.rootElement.querySelector(
      ".authorization-form-username"
    );

    if (!usernameInputElement || !usernameElement) throw new Error();

    usernameInputElement.style.display = "none";
    usernameElement.innerHTML = username;
  }

  public SubmitEvent(callback: (singinAction: SigninActionShape) => void) {
    const formElement = this.rootElement.querySelector<HTMLFormElement>(
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

      const signInAction = new singinAction({
        method: this.authenticationMethod,
        authenticationInput: passwordField.value,
        username: usernameField.value,
      });

      callback(signInAction);
    };

    formElement.addEventListener("submit", handleSubmitEvent);
  }

  public AuthenticationError() {
    const authenticationErrorElement =
      this.rootElement.querySelector<HTMLParagraphElement>(
        ".authorization-failed"
      );

    if (!authenticationErrorElement) throw new Error();

    authenticationErrorElement.style.visibility = "visible";
  }

  public Render(parentElement: HTMLElement) {
    AddElement(this.rootElement, parentElement);
  }
}

export default template;
