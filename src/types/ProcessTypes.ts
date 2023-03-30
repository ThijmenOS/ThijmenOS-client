export type Event<T> = { eventName: string; eventSender: string; eventData: T };

export enum EventName {
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
}

export const system = "system";
