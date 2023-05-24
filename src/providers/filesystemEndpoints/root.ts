import { AccessObjectMap } from "@ostypes/FileSystemTypes";
import api from "./api";

export async function readAccessFile() {
  const { data } = await api.Get<AccessObjectMap>("/root/access");
  return data;
}
