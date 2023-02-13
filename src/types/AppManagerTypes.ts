import ApplicationWindow from "@core/applicationWindow/applicationWindow";

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
}

interface ApplicationInstanceShape {
  instanceId: string;
  applicationId: string;
  applicationWindows: Array<ApplicationWindow>;
}

export class ApplicationInstance implements ApplicationInstanceShape {
  instanceId: string;
  applicationId: string;
  applicationWindows: Array<ApplicationWindow>;

  constructor(props: ApplicationInstance) {
    this.applicationId = props.applicationId;
    this.instanceId = props.instanceId;
    this.applicationWindows = props.applicationWindows;
  }
}

export const system = "system";
