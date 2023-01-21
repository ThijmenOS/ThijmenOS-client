import types from "@ostypes/types";
import AuthorizationMethodShape from "@providers/authentication/authenticationMethodShape";
import { SigninActionShape } from "@providers/authentication/user";
import { ClassOperation } from "@thijmen-os/common";
import { AddOrRemoveClass } from "@thijmen-os/graphics";
import { inject } from "inversify";
import { injectable } from "inversify/lib/annotation/injectable";
import { AuthenticationForm } from "./authenticationFromElement";

@injectable()
class AuthenticationGui implements AuthenticationGuiShape {
  private readonly _authorization: AuthorizationMethodShape;

  private readonly authenticationForm: AuthenticationForm;

  constructor(
    @inject(types.Authentication) authorization: AuthorizationMethodShape
  ) {
    this._authorization = authorization;
    this.authenticationForm = new AuthenticationForm();
  }

  public Authenticate() {
    this.authenticationForm.SwitchSigninMethod();
    this.authenticationForm.SubmitEvent((signInAction: SigninActionShape) =>
      this.SigninSubmitted(signInAction)
    );
    this.HideUsernameIfOneUser();

    const parentElement = document.getElementById("thijmen-os-login-page");

    if (!parentElement) throw new Error();

    this.authenticationForm.Render(parentElement);
  }

  private async HideUsernameIfOneUser() {
    const onlyOneUserRegisterd =
      await this._authorization.CheckForsingleUserAccount();

    if (!onlyOneUserRegisterd) {
      return;
    }

    this.authenticationForm.UserKnown(onlyOneUserRegisterd.username);
  }

  public RemoveAuthorization(): void {
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

  private async SigninSubmitted(signinAction: SigninActionShape) {
    const userAuthenticated = await this._authorization.ValidateLogin(
      signinAction
    );

    if (!userAuthenticated) {
      this.authenticationForm.AuthenticationError();
    }

    if (userAuthenticated) {
      this.RemoveAuthorization();
    }
  }
}

export default AuthenticationGui;
