export interface BaseWindowOptions {
  windowHeight: number;
  windowWidth: number;
  windowType: WindowType;
}

export interface WindowOptions extends BaseWindowOptions {
  windowIdentifier: string;
}

export enum WindowType {
  APPLICATION = 0,
  DIALOG = 1,
}
