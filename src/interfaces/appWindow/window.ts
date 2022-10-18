import AppWindow from "@app/window/appWindow";
import { AppWindowArgs } from "./windowTypes";

export interface IWindow {
  Destroy(): void;
  InitTemplate(): AppWindow;
  NewWindow(windowOptions: AppWindowArgs): AppWindow;
  Render(content: string): void;
}
