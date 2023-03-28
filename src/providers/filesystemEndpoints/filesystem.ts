import api from "./api";
import { Mkdir, Directory, Path, AccessMap } from "@thijmen-os/common";

export async function ShowFilesInDir(
  path?: string,
  errorHandler?: () => any
): Promise<Array<Directory>> {
  const { data } = await api
    .get(`/filesystem/showUserFiles?dir=${path}`)
    .catch((err) => errorHandler && errorHandler());
  return data;
}

export async function OpenFile(path: string) {
  const { data } = await api.get(`/filesystem/openUserFile?file=${path}`);
  return data;
}

export async function ChangeDirectory(path: Path): Promise<string> {
  const { data } = await api.get(`/root/changeDirectory?path=${path}`);
  return data;
}

export async function MakeDirectory(props: {
  props: Mkdir;
  userId: string;
  access: AccessMap;
}): Promise<string> {
  const { data } = await api.post("/filesystem/makeDirectory", props);
  return data;
}

export async function CreateFile(props: {
  props: Mkdir;
  userId: string;
  access: AccessMap;
}): Promise<string> {
  const { data } = await api.post("/filesystem/makeFile", props);
  return data;
}

export async function RemoveDirectory(props: Path): Promise<boolean> {
  const { data } = await api.post("/filesystem/removeDirectory", {
    Path: props,
  });
  return data;
}
