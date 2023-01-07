import api from "./api";
import { ApplicationMetaDataObject, OSSettings } from "@thijmen-os/common";

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

export async function ChangeBackground(props: string): Promise<string> {
  const { data } = await api.post("/settings/setBackground", {
    Path: props,
  });
  return data;
}

export async function GetBackground(): Promise<string> {
  const { data } = await api.get("/settings/getBackground");
  return data;
}
