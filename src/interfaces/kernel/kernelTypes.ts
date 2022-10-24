export interface JsOsCommunicationMessage {
  origin: string;
  method: ValidMethods;
  params: any;
}

export enum ValidMethods {
  kernelMethodNotFound = "kernelMethodNotFound",
  testCommand = "testCommand",

  //File system
  filesInDir = "filesInDir",
  readFile = "readFile",

  //Window operations
  closeSelf = "closeSelf",
  openFile = "openFile",
}

export type kernelMethodNoParams = () => void;
export type kernelMethodOnePatam = (args: any) => void;

export type KernelMethods = {
  [key in ValidMethods]: kernelMethodNoParams | kernelMethodOnePatam;
};

export type Path = string;
