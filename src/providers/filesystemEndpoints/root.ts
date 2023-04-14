import { AccessObjectMap } from "@ostypes/FileSystemTypes";
import api from "./api";

export async function readAccessFile(): Promise<AccessObjectMap> {
  const { data } = await api.Get("/root/access");
  return data;
}
