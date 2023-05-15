import { ThreadMessage } from "@core/processManager/types/threadMessage";

export default interface ApplicationWindowMethodShape {
  InitBehaviour(): void;
  Freese(): void;
  Destroy(): void;
  Unfreese(): void;
  Render(element: HTMLIFrameElement): void;
  Message(message: ThreadMessage): void;
}
