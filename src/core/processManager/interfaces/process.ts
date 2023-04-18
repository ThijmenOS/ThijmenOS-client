import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";

export interface ProcessArgs {
  processIdentifier: string;
  origin: Window;
}

export interface WindowArgs extends ProcessArgs {
  applicationWindow: ApplicationWindow;
}

export interface BackgroundArgs extends ProcessArgs {
  iframeElement: HTMLIFrameElement;
}

export interface Process extends ProcessArgs {
  Terminate(): void;
  AddEventListener(): void;
  Startup(args: string): void;
}

export interface BackgroundMethods {
  AddChildProcess(process: Process): void;
}
