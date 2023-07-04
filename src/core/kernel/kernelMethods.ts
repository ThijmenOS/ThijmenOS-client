export enum ValidMethods {
  ls = "ls",
  fread = "fread",
  cd = "cd",
  fwrite = "fwrite",
  fopen = "fopen",
  ffree = "ffree",
  flock = "flock",

  //File system
  mkdir = "mkdir",
  rm = "rm",
  touch = "touch",
  memAlloc = "memAlloc",
  memRead = "memRead",
  memWrite = "memWrite",
  openFile = "openFile",

  //Window operations

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
  createWindow = "createWindow",

  //User
  changeUserName = "changeUsername",
  changePwd = "changePwd",
  user = "user",
  auth = "auth",
}
