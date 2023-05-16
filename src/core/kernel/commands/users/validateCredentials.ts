import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";

interface ValidateCredentialsArgs {
  userId: string;
  password: string;
}

class ValidateCredentials implements ICommand {
  private readonly _auth = javascriptOs.get<AuthenticationMethodShape>(
    types.Authentication
  );

  private _userId: string;
  private _password: string;

  constructor(args: ValidateCredentialsArgs) {
    this._userId = args.userId;
    this._password = args.password;
  }

  public Handle(): boolean {
    const user = this._auth.FindUser(this._userId);
    if (!user) return false;

    const passwordValidated = user.ValidatePassword(this._password);

    return passwordValidated;
  }
}

export default ValidateCredentials;
