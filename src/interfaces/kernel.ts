export enum ValidMethods {
  testCommand = "testCommand",
  filesInDir = "filesInDir",
}

export type KernelMethods = { [key in ValidMethods]: Function };

export interface SendDataToApp {
  targetApp: string;
  data: any;
  messageSender: string;
}

export interface FileInDir {
  targetPath: string;
}
