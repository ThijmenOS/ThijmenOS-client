import {
  GrantApplicationPermission,
  RevokeAllApplicationPermissions,
  RevokeApplicationPermission,
} from "@providers/filesystemEndpoints/settings";
import { PermissionRequestDto } from "@thijmen-os/common";
import { injectable } from "inversify";
import ApplicationSettingsMethods from "./applicationsMethods";

@injectable()
class ApplicationSettings implements ApplicationSettingsMethods {
  public async GrantPermissionsToApplication(props: PermissionRequestDto) {
    await GrantApplicationPermission(props);
  }
  public async RevokeApplicationPermission(props: PermissionRequestDto) {
    await RevokeApplicationPermission(props);
  }
  public async RevokeAllApplicationPermissions(applicationId: string) {
    await RevokeAllApplicationPermissions(applicationId);
  }
}

export default ApplicationSettings;
