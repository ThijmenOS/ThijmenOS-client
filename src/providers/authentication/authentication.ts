import MemoryMethodShape from "@core/memory/memoryMethodShape";
import types from "@ostypes/types";
import { GetAllUsers } from "@providers/filesystemEndpoints/authentication";
import { User } from "@thijmen-os/common";
import { inject, injectable } from "inversify";
import AuthenticationMethodShape from "./authenticationMethodShape";
import { AuthenticationMethods, SigninActionShape, UserClass } from "./user";

@injectable()
class Authentication implements AuthenticationMethodShape {
  private readonly _memory: MemoryMethodShape;

  private userAuthenticated: boolean | User = false;
  private userAccounts: Array<User> = new Array<User>();

  constructor(@inject(types.Cache) memory: MemoryMethodShape) {
    this._memory = memory;
  }

  public UserLoggedIn(): boolean {
    const authenticatedUser =
      this._memory.loadFromMemory<User>("authenticatedUser");

    if (authenticatedUser) return true;

    return false;
  }

  public async CheckForsingleUserAccount(): Promise<boolean | User> {
    this.userAccounts = await GetAllUsers();

    const moreThenOneUser = this.userAccounts.length > 1;
    if (moreThenOneUser) {
      return false;
    }

    return this.userAccounts[0];
  }

  private ValidateInputField(fieldValue: string): boolean {
    if (typeof fieldValue !== "string") return false;
    if (!fieldValue) return false;
    if (!fieldValue.length) return false;

    return true;
  }

  private LookupUser(username: string): boolean | User {
    if (!username) return false;

    const user = this.userAccounts.find(
      (user) =>
        user.username.toLocaleLowerCase() === username.toLocaleLowerCase()
    );

    if (!user) return false;
    return user;
  }

  public async ValidateLogin(
    singinAction: SigninActionShape
  ): Promise<boolean> {
    if (singinAction.username) {
      const user = this.LookupUser(singinAction.username);

      if (!user) return false;

      return this.ValidateCredentials(
        new UserClass(user as User),
        singinAction
      );
    }

    const user = await this.CheckForsingleUserAccount();

    if (!user) throw new Error();

    return this.ValidateCredentials(new UserClass(user as User), singinAction);
  }

  private UserValidated(user: User) {
    this.userAuthenticated = user;
    const userAuthenticated = new CustomEvent("authenticated", {
      bubbles: true,
      cancelable: true,
      composed: false,
      detail: user,
    });

    document
      .querySelector("#thijmen-os-login-page")
      ?.dispatchEvent(userAuthenticated);

    this._memory.saveToMemory<User>("authenticatedUser", user, true);
  }

  private ValidateCredentials(
    user: UserClass,
    singinAction: SigninActionShape
  ): boolean {
    let userAuthenticated = false;

    if (singinAction.method === AuthenticationMethods.Password) {
      userAuthenticated = user.ValidatePassword(
        singinAction.authenticationInput
      );
    } else {
      userAuthenticated = user.ValidatePincode(
        singinAction.authenticationInput
      );
    }

    if (userAuthenticated) {
      this.UserValidated(user);
    }

    return userAuthenticated;
  }
}

export default Authentication;
