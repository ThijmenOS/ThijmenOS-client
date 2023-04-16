import MemoryMethodShape from "@core/memory/memoryMethodShape";
import types from "@ostypes/types";
import { GetAllUsers } from "@providers/filesystemEndpoints/authentication";
import { User } from "@thijmen-os/common";
import { inject, injectable } from "inversify";
import AuthenticationMethodShape from "./authenticationMethodShape";
import { AuthenticationMethods, SigninActionShape, UserClass } from "./user";
import { ErrorExit } from "@providers/error/systemErrors/systemError";
import GenerateUUID from "@utils/generateUUID";

@injectable()
class Authentication implements AuthenticationMethodShape {
  private readonly _memory: MemoryMethodShape;

  private _userAccounts: Array<User> = new Array<User>();

  private readonly _pid: string = GenerateUUID();
  private readonly _memoryKey: string = "user:authentication";

  constructor(@inject(types.Memory) memory: MemoryMethodShape) {
    this._memory = memory;

    this._memory.AllocateMemory(this._pid, this._memoryKey, []);
  }

  public CheckAuthenticationState(): false | User {
    const authenticatedUser = this._memory.LoadFromMemory<User>(
      this._pid,
      this._memoryKey
    );

    console.log(authenticatedUser);

    if (authenticatedUser instanceof ErrorExit) throw new Error();

    if (authenticatedUser) return authenticatedUser;

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

    this._memory.SaveToMemory<User>(this._pid, this._memoryKey, user, true);

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
