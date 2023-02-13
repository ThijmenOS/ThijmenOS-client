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
  public async GrantPermissionsToApplication(
    props: PermissionRequestDto
  ): Promise<boolean> {
    if (!props.applicationId || !props.permission) {
      return false;
    }

    const result = await GrantApplicationPermission(props);

    return result;
  }

  public async RevokeApplicationPermission(
    props: PermissionRequestDto
  ): Promise<boolean> {
    if (!props.applicationId || !props.permission) {
      return false;
    }

    const result = await RevokeApplicationPermission(props);

    return result;
  }

  public async RevokeAllApplicationPermissions(
    applicationId: string
  ): Promise<boolean> {
    if (!applicationId) return false;

    const result = await RevokeAllApplicationPermissions(applicationId);

    return result;
  }
}

export default ApplicationSettings;
