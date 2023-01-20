import { injectable } from "inversify";
import AuthorizationMethodShape from "./authorizationMethodShape";
import { AuthenticationMethods, SigninActionShape, User } from "./user";

@injectable()
class Authorization implements AuthorizationMethodShape {
  private userAccounts: Array<User> = [
    new User({
      userId: "1",
      username: "testUser",
      email: "test@thijmenbrand.nl",
      password: "Welkom01",
    }),
    new User({
      userId: "2",
      username: "testUser2",
      email: "test@thijmenbrand.nl",
      password: "Welkom02",
    }),
  ];

  public checkForsingleUserAccount(): boolean | User {
    const moreThenOneUser = this.userAccounts.length > 1;
    if (moreThenOneUser) {
      return false;
    }

    return this.userAccounts[0];
  }

  public validateInputField(fieldValue: string): boolean {
    if (typeof fieldValue !== "string") return false;
    if (!fieldValue) return false;
    if (!fieldValue.length) return false;

    return true;
  }

  public lookupUser(username: string): boolean | User {
    if (!username) return false;

    const user = this.userAccounts.find((user) => user.username === username);

    if (!user) return false;
    return user;
  }

  validateLogin(singinAction: SigninActionShape): boolean {
    if (singinAction.username) {
      const user = this.lookupUser(singinAction.username);

      if (!user) return false;

      return this.validateCredentials(user as User, singinAction);
    }

    const user = this.checkForsingleUserAccount();

    if (!user) throw new Error();

    return this.validateCredentials(user as User, singinAction);
  }

  public validateCredentials(
    user: User,
    singinAction: SigninActionShape
  ): boolean {
    if (singinAction.method === AuthenticationMethods.Password)
      return user.ValidatePassword(singinAction.authenticationInput);

    return user.ValidatePincode(singinAction.authenticationInput);
  }
}

export default Authorization;
