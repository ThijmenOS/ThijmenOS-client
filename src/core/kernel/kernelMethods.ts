export enum ValidMethods {
  //File system
  listFiles = "listFiles",
  readFile = "readFile",
  changeDir = "changeDir",
  mkdir = "mkdir",
  rmdir = "rmdir",
  touch = "touch",
  memAlloc = "memAlloc",
  memRead = "memRead",
  memWrite = "memWrite",
  selectFile = "selectFile",

  //Window operations
  openFile = "openFile",

  //Settings
  // askPermission = "askPermission",
  // revokePermission = "revokePermission",
  // revokeAllPermissions = "revokeAllPermissions",

  startProcess = "startProcess",
  terminateProcess = "terminateProcess",
  exit = "exit",
  waitpid = "waitpid",
  createMessageBus = "crtmsgbus",
  sendMsg = "sendMsg",
  readMsg = "readMsg",
  getProcesses = "getProcesses",
  kill = "kill",
}
