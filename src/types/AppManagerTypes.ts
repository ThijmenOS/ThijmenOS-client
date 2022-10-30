export type Event<T> = { eventName: string; eventSender: string; eventData: T };

export enum EventName {
  TestCommand = "testCommand",
  SelfInvoked = "selfInvoked",
  OpenFile = "openFile",
  DirectoryCreated = "directoryCreated",
  Error = "error",
}

export const system = "system";
