import { injectable } from "inversify";
import { userInfo } from "os";
import AuthenticationMethodShape from "./authenticationMethodShape";
import { AuthenticationMethods, SigninActionShape, User } from "./user";

@injectable()
class Authentication implements AuthenticationMethodShape {
  private userAuthenticated: boolean | User = false;

  private userAccounts: Array<User> = [
    new User({
      userId: "1",
      username: "testUser",
      email: "test@thijmenbrand.nl",
      password: "Welkom01",
      pincode: "12345",
    }),
  ];

  public CheckForsingleUserAccount(): boolean | User {
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

    const user = this.userAccounts.find((user) => user.username === username);

    if (!user) return false;
    return user;
  }

  public ValidateLogin(singinAction: SigninActionShape): boolean {
    if (singinAction.username) {
      const user = this.LookupUser(singinAction.username);

      if (!user) return false;

      return this.ValidateCredentials(user as User, singinAction);
    }

    const user = this.CheckForsingleUserAccount();

    if (!user) throw new Error();

    const userValidated = this.ValidateCredentials(user as User, singinAction);

    if (userValidated) {
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
    }

    return userValidated;
  }

  private ValidateCredentials(
    user: User,
    singinAction: SigninActionShape
  ): boolean {
    if (singinAction.method === AuthenticationMethods.Password)
      return user.ValidatePassword(singinAction.authenticationInput);

    return user.ValidatePincode(singinAction.authenticationInput);
  }
}

export default Authentication;
