export enum ValidMethods {
  //File system
  listFiles = "listFiles",
  readFile = "readFile",
  changeDir = "changeDir",
  mkdir = "mkdir",
  rmdir = "rmdir",
  rm = "rm",
  touch = "touch",
  memAlloc = "memAlloc",
  memRead = "memRead",
  memWrite = "memWrite",
  selectFile = "selectFile",
  writeFile = "writeFile",

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
  OpenMessageQueue = "mqOpen",
  sendMsg = "sendMsg",
  readMsg = "readMsg",
  killMq = "killMq",
  getProcesses = "getProcesses",
  kill = "kill",

  //User
  changeUserName = "changeUsername",
  changePwd = "changePwd",
  user = "user",
  auth = "auth",
}
