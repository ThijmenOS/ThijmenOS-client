import api from "./api";
import {
  ApplicationMetaDataObject,
  OSSettings,
  PermissionRequestDto,
} from "@thijmen-os/common";

export async function FetchInstalledApplications(): Promise<
  Array<ApplicationMetaDataObject>
> {
  const { data } = await api.Get<Array<ApplicationMetaDataObject>>(
    "/root/readRegisteredApplications"
  );
  return data;
}

export async function FetchSettings(): Promise<OSSettings> {
  const { data } = await api.Get<OSSettings>("/root/readSettings");
  return data;
}

export async function GrantApplicationPermission(
  props: PermissionRequestDto
): Promise<boolean> {
  const { data } = await api.Post("/settings/grantPermission", props);
  return data;
}

export async function RevokeApplicationPermission(
  props: PermissionRequestDto
): Promise<boolean> {
  const { data } = await api.Delete("/settings/grantPermission", props);
  return data;
}

export async function RevokeAllApplicationPermissions(
  applicationId: string
): Promise<boolean> {
  const { data } = await api.Delete("/settings/allPermissions", {
    applicationId: applicationId,
  });
  return data;
}
