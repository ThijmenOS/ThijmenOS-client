import { Access, AccessMap, Path } from "@thijmen-os/common";

interface AccessValidationMethods {
  tempDefaultAccess: AccessMap;
  get UserId(): string;

  LoadAccessFile(): void;
  ValidateAccess(object: Path, accesslevel: Access): boolean;
}

export default AccessValidationMethods;
