export type Event<T> = { eventName: string; eventSender: string; eventData: T };

export enum EventName {
  ChangeDir = "Change_Dir",
  MkDir = "Mk_Dir",
  ReadFile = "Read_File",
  RmDir = "Rm_Dir",
  ListFiles = "List_Files",
  Touch = "Touch",
  ReadMemory = "Read_Mem",
  WriteMemory = "Write_Mem",

  OpenFile = "Open_File",
  ProcessStarted = "Process_Started",
  StartupArgs = "Startup_Args",
  Ipc = "Process_Communication",

  DirectoryCreated = "Dir_Created",
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
