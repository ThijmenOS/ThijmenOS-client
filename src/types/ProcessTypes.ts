export type Event<T> = { eventName: string; eventSender: string; eventData: T };

export enum EventName {
  ChangeDir = "changeDir",
  MkDir = "mkDir",
  ReadFile = "readFile",
  RmDir = "rmDir",
  ListFiles = "listFiles",
  Touch = "touch",
  ReadMemory = "ReadMemory",
  WriteMemory = "WriteMemory",

  TestCommand = "testCommand",
  SelfInvoked = "selfInvoked",

  OpenFile = "openFile",
  StartedApplication = "startedApplication",

  DirectoryCreated = "directoryCreated",
  DirectoryRemoved = "directoryRemoved",
  DirectoryDoesNotExist = "DirectoryDoesNotExist",

  Error = "error",
  NoAccess = "No access",

  PermissionGranted = "permissionGranted",
  PermissionNotGranted = "permissionNotGranted",
  PermissionRevoked = "permissionRevoked",

  OpenedExternalApplication = "OpenedExternalApplication",
  WindowLaunched = "WindowLaunched",

  ListedProcesses = "listedProcesses",

  ParameterError = "ParameterError",
}

export const system = "system";
