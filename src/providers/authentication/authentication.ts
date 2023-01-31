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

  private userAccounts: Array<User> = new Array<User>();

  constructor(@inject(types.Cache) memory: MemoryMethodShape) {
    this._memory = memory;
  }

  public CheckAuthenticationState(): false | User {
    const authenticatedUser =
      this._memory.loadFromMemory<User>("authenticatedUser");

    if (authenticatedUser) return authenticatedUser;

    return false;
  }

  public async CheckForsingleUserAccount(): Promise<false | User> {
    this.userAccounts = await GetAllUsers();

    const moreThenOneUser = this.userAccounts.length > 1;
    if (moreThenOneUser) {
      return false;
    }

    return this.userAccounts[0];
  }

  public LookupUser(username: string): boolean | User {
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

  public UserValidated(user: User) {
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

  public ValidateCredentials(
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
