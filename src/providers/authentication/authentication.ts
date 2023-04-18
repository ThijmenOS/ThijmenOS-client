import MemoryMethodShape from "@core/memory/memoryMethodShape";
import types from "@ostypes/types";
import { GetAllUsers } from "@providers/filesystemEndpoints/authentication";
import { Access, User } from "@thijmen-os/common";
import { inject, injectable } from "inversify";
import AuthenticationMethodShape from "./authenticationMethodShape";
import { AuthenticationMethods, SigninActionShape, UserClass } from "./user";
import Exit from "@providers/error/systemErrors/Exit";
import GenerateUUID from "@utils/generateUUID";
import { userKey } from "@ostypes/memoryKeys";
import MemoryAccess from "@core/memory/models/memoryAccess";

@injectable()
class Authentication implements AuthenticationMethodShape {
  private readonly _memory: MemoryMethodShape;

  private _userAccounts: Array<User> = new Array<User>();

  private readonly _pid: string = GenerateUUID();

  constructor(@inject(types.Memory) memory: MemoryMethodShape) {
    this._memory = memory;

    this._memory.AllocateMemory(this._pid, userKey, [MemoryAccess.MEM_READ]);
  }

  public CheckAuthenticationState(): false | User {
    const result = this._memory.LoadFromMemory<User>(this._pid, userKey);

    if (result instanceof Exit) throw new Error(result.event);

    if (result) return result;

    return false;
  }

  public async CheckForsingleUserAccount(): Promise<false | User> {
    this._userAccounts = await GetAllUsers();

    const moreThenOneUser = this._userAccounts.length > 1;
    if (moreThenOneUser) {
      return false;
    }

    return this._userAccounts[0];
  }

  public LookupUser(username: string): boolean | User {
    if (!username) return false;

    const user = this._userAccounts.find(
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

    this._memory.SaveToMemory<User>(this._pid, userKey, user);

    document
      .querySelector("#thijmen-os-login-page")
      ?.dispatchEvent(userAuthenticated);
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
