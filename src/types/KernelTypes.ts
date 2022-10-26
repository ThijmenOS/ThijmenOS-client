export type JsOsCommunicationMessage = {
  origin: string;
  method: ValidMethods;
  params: any;
};

export enum ValidMethods {
  kernelMethodNotFound = "kernelMethodNotFound",
  testCommand = "testCommand",

  //File system
  filesInDir = "filesInDir",
  readFile = "readFile",
  changeDir = "changeDir",

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
export type OpenFile = { mimeType: string; filePath: string };
