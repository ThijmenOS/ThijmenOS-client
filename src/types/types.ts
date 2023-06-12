const types = {
  Startup: Symbol.for("Startup"),
  AppManager: Symbol.for("AppManager"),
  ProcessManager: Symbol.for("Processes"),
  FileIcon: Symbol.for("FileIcon"),
  Kernel: Symbol.for("Kernel"),
  window: Symbol.for("window"),
  CreateWindow: Symbol.for("CreateWindow"),
  Core: Symbol.for("Core"),
  Prompt: Symbol.for("Prompt"),
  ErrorPrompt: Symbol.for("ErrorPrompt"),
  Settings: Symbol.for("Settings"),
  ApplicationSettings: Symbol.for("ApplicationSettings"),
  ErrorManager: Symbol.for("ErrorManager"),
  Memory: Symbol.for("Cache"),
  Mediator: Symbol.for("Mediator"),
  Authentication: Symbol.for("Authentication"),
  AuthenticationGui: Symbol.for("AuthenticationGui"),
  Desktop: Symbol.for("Desktop"),
  FileSystem: Symbol.for("FileSystem"),
};

export default types;
