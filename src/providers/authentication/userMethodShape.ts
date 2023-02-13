export interface UserMethodShape {
  ChangeUserName(newUsername: string): boolean | string;
  ChangePassword(newPassword: string): boolean;
  ValidatePassword(inputPassword: string): boolean;
  ValidatePincode(inputPincode: string): boolean;
  ChangeBackground(backgroundPath: string): boolean;
  GetBackground(): string;
}
