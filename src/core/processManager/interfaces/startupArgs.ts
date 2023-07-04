interface PriviligedStartupArgs {
  fullScreen: boolean;
  topBar: boolean;
}

interface StartupArgs extends PriviligedStartupArgs {
  winX: number;
  winY: number;
}

export { StartupArgs, PriviligedStartupArgs };
