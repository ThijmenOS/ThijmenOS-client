import { User } from "@thijmen-os/common";
import { SigninActionShape } from "./user";

interface AuthenticationMethodShape {
  CheckAuthenticationState(): false | User;
  CheckForsingleUserAccount(): Promise<false | User>;
  ValidateLogin(singinAction: SigninActionShape): Promise<boolean>;
}

export default AuthenticationMethodShape;
