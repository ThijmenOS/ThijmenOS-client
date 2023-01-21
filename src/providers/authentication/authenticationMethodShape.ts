import { User } from "@thijmen-os/common";
import { SigninActionShape } from "./user";

interface AuthenticationMethodShape {
  CheckAuthenticationState(): boolean;
  CheckForsingleUserAccount(): Promise<false | User>;
  ValidateLogin(singinAction: SigninActionShape): Promise<boolean>;
}

export default AuthenticationMethodShape;
