export enum ValidMethods {
  kernelMethodNotFound = "kernelMethodNotFound",
  testCommand = "testCommand",

  //File system
  filesInDir = "filesInDir",
  readFile = "readFile",

  //window operations
  closeSelf = "closeSelf",
}

export type KernelMethods = { [key in ValidMethods]: Function };

export interface SendDataToApp {
  targetApp: string;
  data: any;
  messageSender: string;
}

export type Path = string;
