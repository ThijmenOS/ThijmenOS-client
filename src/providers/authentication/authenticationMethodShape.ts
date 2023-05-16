import { User } from "@thijmen-os/common";
import { SigninActionShape, UserClass } from "./user";

interface AuthenticationMethodShape {
  GetSignedInUser(): UserClass;
  FindUser(userId: string): UserClass | false;
  CheckAuthenticationState(): false | User;
  CheckForsingleUserAccount(): Promise<false | User>;
  ValidateLogin(singinAction: SigninActionShape): Promise<boolean>;
}

export default AuthenticationMethodShape;
