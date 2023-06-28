import { UserInfo } from "@core/kernel/models/userInfo";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";

class GetCurrentUser implements ICommand {
  private readonly _auth = javascriptOs.get<AuthenticationMethodShape>(
    types.Authentication
  );

  public Handle(): UserInfo | number {
    const currentUser = this._auth.GetSignedInUser();

    if (!currentUser) {
      return 1;
    }

    const homeDirectory = `C/Users/${currentUser.username}/Desktop`;

    return {
      id: currentUser.userId,
      username: currentUser.username,
      email: currentUser.email,
      homeDir: homeDirectory,
    };
  }
}

export default GetCurrentUser;
