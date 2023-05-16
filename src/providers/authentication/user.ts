import { User } from "@thijmen-os/common";
import { UserMethodShape } from "./userMethodShape";
import { imagetypes } from "@ostypes/imageTypes";

export enum AuthenticationMethods {
  Password,
  Pincode,
}

export interface SigninActionShape {
  username?: string;
  authenticationInput: string;
  method: AuthenticationMethods;
}

export class SinginAction implements SigninActionShape {
  username?: string | undefined;
  authenticationInput: string;
  method: AuthenticationMethods;

  constructor(props: SigninActionShape) {
    this.username = props.username;
    this.authenticationInput = props.authenticationInput;
    this.method = props.method;
  }
}

export class UserClass implements User, UserMethodShape {
  userId: string;
  username: string;
  email: string;
  password: string;
  pincode?: string;
  preferences: {
    background: string;
    colors: unknown;
    themes: unknown;
    lockscreen: unknown;
    startMenu: unknown;
    fonts: unknown;
  };

  constructor(props: User) {
    this.userId = props.userId;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.pincode = props.pincode;
    this.preferences = props.preferences;
  }

  ChangeUserName(newUsername: string): boolean | string {
    if (!newUsername) return false;
    if (this.username === newUsername) return false;

    this.username = newUsername;
    return this.username;
  }

  ChangePassword(oldPassword: string, newPassword: string): boolean {
    if (!oldPassword) return false;
    if (!newPassword) return false;
    if (oldPassword !== this.password) return false;
    if (newPassword === this.password) return false;

    this.password = newPassword;
    return true;
  }

  ValidatePassword(inputPassword: string): boolean {
    if (!inputPassword) return false;
    if (inputPassword !== this.password) return false;

    return true;
  }

  ValidatePincode(inputPincode: string): boolean {
    if (!inputPincode) return false;
    if (inputPincode !== this.pincode) return false;

    return true;
  }

  ChangeBackground(backgroundPath: string): boolean {
    if (!backgroundPath) return false;

    const fileExt = backgroundPath.split(".").at(-1);
    if (!fileExt || imagetypes.includes(fileExt)) {
      return false;
    }

    this.preferences.background = backgroundPath;
    return true;
  }

  GetBackground(): string {
    return this.preferences.background;
  }
}
