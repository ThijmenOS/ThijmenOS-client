import { UserMethodShape } from "./userMethodShape";

export enum AuthenticationMethods {
  Password,
  Pincode,
}

export interface SigninActionShape {
  username?: string;
  authenticationInput: string;
  method: AuthenticationMethods;
}

export class singinAction implements SigninActionShape {
  username?: string | undefined;
  authenticationInput: string;
  method: AuthenticationMethods;

  constructor(props: SigninActionShape) {
    this.username = props.username;
    this.authenticationInput = props.authenticationInput;
    this.method = props.method;
  }
}

export interface UserShape {
  userId: string;
  username: string;
  email: string;
  password: string;
  pincode?: string;
}

export class UserClass implements UserShape, UserMethodShape {
  userId: string;
  username: string;
  email: string;
  password: string;
  pincode?: string;

  constructor(props: UserShape) {
    this.userId = props.userId;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.pincode = props.pincode;
  }

  ChangeUserName(newUsername: string): boolean | string {
    if (!newUsername) return false;
    if (this.username === newUsername) return false;

    this.username = newUsername;
    return this.username;
  }

  ChangePassword(newPassword: string): boolean {
    if (!newPassword) return false;
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
}
