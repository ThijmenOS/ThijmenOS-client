import { MimeTypes } from "@thijmen-os/common";
import { Class, ICommand } from "../../types/CommandTypes";

export type JsOsCommunicationMessage = {
  origin: string;
  method: string;
  params: any;
};

export enum ValidMethods {
  //File system
  filesInDir = "filesInDir",
  readFile = "readFile",
  changeDir = "changeDir",
  mkdir = "mkdir",
  rmdir = "rmdir",
  touch = "touch",

  //Window operations
  closeSelf = "closeSelf",
  openFile = "openFile",

  //Settings
  changeBackground = "changeBackground",
  askPermission = "askPermission",
}

export type KernelMethods = { [key in ValidMethods]: Class<ICommand> };

export type OpenFileType = { mimeType: MimeTypes; filePath: string };
