import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import { UpdateUser } from "@providers/filesystemEndpoints/user";

class ChangeUserName implements ICommand {
  private readonly _auth = javascriptOs.get<AuthenticationMethodShape>(
    types.Authentication
  );

  private _newUserName: string;

  constructor(newUserName: string) {
    this._newUserName = newUserName;
  }

  public Handle(): number {
    const user = this._auth.GetSignedInUser();

    if (!user) return -1;

    const usernameChanged = user.ChangeUserName(this._newUserName);
    if (!usernameChanged) return -1;

    UpdateUser(user);

    return 0;
  }
}

export default ChangeUserName;
