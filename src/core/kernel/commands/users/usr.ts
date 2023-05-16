import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";

class GetCurrentUser implements ICommand {
  private readonly _auth = javascriptOs.get<AuthenticationMethodShape>(
    types.Authentication
  );

  public Handle() {
    const currentUser = this._auth.GetSignedInUser();

    if (!currentUser) {
      return -1;
    }

    return {
      id: currentUser.userId,
      username: currentUser.username,
      email: currentUser.email,
    };
  }
}

export default GetCurrentUser;
