import api from "./api";
import { Mkdir, Directory, Path, AccessMap } from "@thijmen-os/common";

export async function ShowFilesInDir(
  path?: string,
  errorHandler?: () => any
): Promise<Array<Directory>> {
  const { data } = await api
    .Get(`/filesystem/showUserFiles?dir=${path}`)
    .catch(() => errorHandler && errorHandler());
  return data;
}

export async function Open(path: string): Promise<string | false> {
  const { data } = await api.Get<string | false>(
    `/filesystem/open?file=${path}`
  );
  return data;
}

export async function OpenFile(path: string): Promise<string | number> {
  const { data } = await api.Get<string | number>(
    `/filesystem/openUserFile?file=${path}`
  );
  return data;
}

export async function ChangeDirectory(path: Path): Promise<string> {
  const { data } = await api.Get<string>(
    `/filesystem/changeDirectory?path=${path}`
  );
  return data;
}

export async function ValidatePath(path: Path): Promise<string> {
  const { data } = await api.Get<string>(
    `/filesystem/validateFileExistance?path=${path}`
  );

  return data;
}

export async function MakeDirectory(props: {
  props: Mkdir;
  userId: string;
  access: AccessMap;
}): Promise<string> {
  const { data } = await api.Post("/filesystem/makeDirectory", props);
  return data;
}

export async function CreateFile(props: {
  props: Mkdir;
  userId: string;
  access: AccessMap;
}): Promise<string> {
  const { data } = await api.Post("/filesystem/makeFile", props);
  return data;
}

export async function RemoveDirectory(props: Path): Promise<boolean> {
  const { data } = await api.Delete("/filesystem/removeDirectory", {
    Path: props,
  });
  return data;
}

export async function RemoveFile(props: Path): Promise<boolean> {
  const { data } = await api.Delete("/filesystem/removeFile", {
    Path: props,
  });
  return data;
}

export async function WriteFile(props: {
  path: Path;
  content: string;
}): Promise<boolean> {
  const { data } = await api.Post("/filesystem/writeFile", props);
  return data;
}
