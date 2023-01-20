import { SigninActionShape, User } from "./user";

interface AuthorizationMethodShape {
  checkForsingleUserAccount(): boolean | User;
  validateInputField(fieldValue: string): boolean;
  lookupUser(username: string): boolean | User;
  validateLogin(singinAction: SigninActionShape): boolean;
  validateCredentials(user: User, credentials: SigninActionShape): boolean;
}

export default AuthorizationMethodShape;
