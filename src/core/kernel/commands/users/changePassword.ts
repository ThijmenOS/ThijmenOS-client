import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import { UpdateUser } from "@providers/filesystemEndpoints/user";

interface ChangePasswordArgs {
  oldPassword: string;
  newPassword: string;
}

class ChangePassword implements ICommand {
  private readonly _auth = javascriptOs.get<AuthenticationMethodShape>(
    types.Authentication
  );

  private _oldPassword: string;
  private _newPassword: string;

  constructor(args: ChangePasswordArgs) {
    this._oldPassword = args.oldPassword;
    this._newPassword = args.newPassword;
  }

  public Handle(): number {
    const user = this._auth.GetSignedInUser();

    if (!user) return -1;

    const passwordUpdated = user.ChangePassword(
      this._oldPassword,
      this._newPassword
    );
    if (!passwordUpdated) return -1;

    UpdateUser(user);

    return 0;
  }
}

export default ChangePassword;
