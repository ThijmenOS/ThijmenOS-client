import api from "./api";
import {
  ApplicationMetaDataObject,
  OSSettings,
  PermissionRequestDto,
} from "@thijmen-os/common";

export async function FetchInstalledApplications(): Promise<
  Array<ApplicationMetaDataObject>
> {
  const { data } = await api.get("/root/readRegisteredApplications");
  return data;
}

export async function FetchSettings(): Promise<OSSettings> {
  const { data } = await api.get("/root/readSettings");
  return data;
}

export async function GrantApplicationPermission(props: PermissionRequestDto) {
  const { data } = await api.post("/settings/grantPermission", props);
  return data;
}

export async function RevokeApplicationPermission(props: PermissionRequestDto) {
  const { data } = await api.delete("/settings/grantPermission", props);
  return data;
}

export async function RevokeAllApplicationPermissions(applicationId: string) {
  const { data } = await api.delete("/settings/allPermissions", {
    applicationId: applicationId,
  });
  return data;
}
