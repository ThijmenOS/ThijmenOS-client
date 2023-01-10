import ApplicationWindow from "@core/applicationWindow/applicationWindow";

export type Event<T> = { eventName: string; eventSender: string; eventData: T };

export enum EventName {
  TestCommand = "testCommand",
  SelfInvoked = "selfInvoked",
  OpenFile = "openFile",
  DirectoryCreated = "directoryCreated",
  Error = "error",

  PermissionGranted = "permissionGranted",
  PermissionNotGranted = "permissionNotGranted",

  PermissionRevoked = "permissionRevoked",
}

export interface ApplicationInstance {
  instanceId: string;
  applicationId: string;
  applicationWindows: Array<ApplicationWindow>;
}

export const system = "system";
