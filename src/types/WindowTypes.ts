export enum WindowType {
  APPLICATION,
  DIALOG,
}

export interface BaseWindowOptions {
  windowHeight: number;
  windowWidth: number;
  windowType: WindowType;
}

export interface WindowOptions extends BaseWindowOptions {
  iconLocation?: string;
  windowTitle: string;
  windowIdentifier: string;
}
