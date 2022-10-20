import window from "window/window";
import { WindowOptions } from "./windowTypes";

export interface IWindow {
  NewWindow(windowOptions: WindowOptions): window;
  Destroy(): void;
  InitBehaviour(): void;
  Freese(): void;
  Unfreese(): void;
  Render(content: string): void;
}
