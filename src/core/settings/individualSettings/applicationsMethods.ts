import { PermissionRequestDto } from "@thijmen-os/common";

interface ApplicationSettingsMethods {
  GrantPermissionsToApplication(props: PermissionRequestDto): void;
  RevokeApplicationPermission(props: PermissionRequestDto): void;
  RevokeAllApplicationPermissions(applicationId: string): void;
}

export default ApplicationSettingsMethods;
