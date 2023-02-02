import { AccessObject } from "@thijmen-os/common";

export type File = {
  fileContent: string;
  mimeType: string;
};

export type AccessObjectMap = { [key in string]: AccessObject };
