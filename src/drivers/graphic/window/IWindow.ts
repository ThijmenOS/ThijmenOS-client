import window from "@drivers/graphic/window/Window";
import { WindowOptions } from "@ostypes/WindowTypes";

export default interface IWindow {
  NewWindow(windowOptions: WindowOptions): window;
  Destroy(): void;
  InitBehaviour(): void;
  Freese(): void;
  Unfreese(): void;
  Render(content: string): void;
}
