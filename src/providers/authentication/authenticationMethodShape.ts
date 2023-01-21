import { User } from "@thijmen-os/common";
import { SigninActionShape } from "./user";

interface AuthenticationMethodShape {
  UserLoggedIn(): boolean;
  CheckForsingleUserAccount(): Promise<boolean | User>;
  ValidateLogin(singinAction: SigninActionShape): Promise<boolean>;
}

export default AuthenticationMethodShape;
