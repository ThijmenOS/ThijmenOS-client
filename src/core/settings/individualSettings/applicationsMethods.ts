import { PermissionRequestDto } from "@thijmen-os/common";

interface ApplicationSettingsMethods {
  GrantPermissionsToApplication(props: PermissionRequestDto): Promise<boolean>;
  RevokeApplicationPermission(props: PermissionRequestDto): Promise<boolean>;
  RevokeAllApplicationPermissions(applicationId: string): Promise<boolean>;
}

export default ApplicationSettingsMethods;
