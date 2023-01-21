import { SigninActionShape, User } from "./user";

interface AuthenticationMethodShape {
  CheckForsingleUserAccount(): boolean | User;
  ValidateLogin(singinAction: SigninActionShape): boolean;
}

export default AuthenticationMethodShape;
