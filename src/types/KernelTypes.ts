import { MimeTypes } from "@thijmenos/common";

export type JsOsCommunicationMessage = {
  origin: string;
  method: string;
  params: any;
};

export enum ValidMethods {
  kernelMethodNotFound = "kernelMethodNotFound",
  testCommand = "testCommand",

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
}

export type kernelMethodNoParams = () => void;
export type kernelMethodOneParam = (args: any) => void;

export type KernelMethods = {
  [key in ValidMethods]: kernelMethodNoParams | kernelMethodOneParam;
};

export type OpenFileType = { mimeType: MimeTypes; filePath: string };
