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

  //Window operations
  openFile = "openFile",

  //Settings
  askPermission = "askPermission",
  revokePermission = "revokePermission",
  revokeAllPermissions = "revokeAllPermissions",

  startProcess = "startProcess",
  terminateProcess = "terminateProcess",
  spawnWindow = "spawnWindow",
}
