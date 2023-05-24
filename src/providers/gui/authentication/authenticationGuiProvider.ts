import types from "@ostypes/types";
import AuthorizationMethodShape from "@providers/authentication/authenticationMethodShape";
import { SigninActionShape } from "@providers/authentication/user";
import { ClassOperation } from "@thijmen-os/common";
import { inject } from "inversify";
import { injectable } from "inversify/lib/annotation/injectable";
import { AuthenticationForm } from "./authenticationFromElement";
import { AddOrRemoveClass } from "../helpers";

@injectable()
class AuthenticationGui implements AuthenticationGuiShape {
  private readonly _authorization: AuthorizationMethodShape;

  private readonly _authenticationForm: AuthenticationForm;

  constructor(
    @inject(types.Authentication) authorization: AuthorizationMethodShape
  ) {
    this._authorization = authorization;
    this._authenticationForm = new AuthenticationForm();
  }

  public Authenticate() {
    this._authenticationForm.SwitchSigninMethod();
    this._authenticationForm.SubmitEvent((signInAction: SigninActionShape) =>
      this.SigninSubmitted(signInAction)
    );
    this.HideUsernameIfOneUser();

    const parentElement = document.getElementById("thijmen-os-login-page");

    if (!parentElement) throw new Error();

    this._authenticationForm.Render(parentElement);
  }

  private async HideUsernameIfOneUser() {
    const onlyOneUserRegisterd =
      await this._authorization.CheckForsingleUserAccount();

    if (!onlyOneUserRegisterd) {
      return;
    }

    this._authenticationForm.UserKnown(onlyOneUserRegisterd.username);
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
      this._authenticationForm.AuthenticationError();
    }

    if (userAuthenticated) {
      this.RemoveAuthorization();
    }
  }
}

export default AuthenticationGui;
