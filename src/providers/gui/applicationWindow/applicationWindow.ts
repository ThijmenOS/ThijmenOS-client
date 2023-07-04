//DI

//Interfaces

//Types
import { WindowDataActions, windowSelectors } from "./defaults";

//Other
import { ThreadMessage } from "@core/processManager/types/threadMessage";
import { InitMovement } from "../helpers";
import WindowOptions from "@ostypes/WindowTypes";
import WindowElement from "./windowElement";

class ApplicationWindow {
  private windowElement: WindowElement;
  private windowContent: HTMLIFrameElement;

  constructor(
    windowId: number,
    windowOptions: WindowOptions,
    windowContent: HTMLIFrameElement
  ) {
    this.windowElement = new WindowElement(
      windowOptions.windowHeight,
      windowOptions.windowWidth,
      windowOptions.windowTitle,
      windowId
    );

    this.windowContent = windowContent;

    this.Render(windowContent);

    setTimeout(() => {
      InitMovement(windowId);
    }, 100);
  }

  private Click(ev: Event) {
    const target: HTMLDivElement = ev.target as HTMLDivElement;
    const hitButton: boolean = target.classList.contains(
      windowSelectors.windowOption
    );

    if (hitButton) {
      const action: WindowDataActions = target.getAttribute(
        "data-action"
      ) as WindowDataActions;

      if (action === WindowDataActions.Maximize)
        this.windowElement.FullSreen().yes();
      if (action === WindowDataActions.Minimize)
        this.windowElement.FullSreen().no();
    }
  }

  private Render(windowContent: HTMLIFrameElement): void {
    this.windowElement.SetWindowContent(windowContent);
    this.windowElement.Render();
  }

  public Destroy() {
    this.windowElement.Destroy();
  }

  public OnLoad(action: any) {
    this.windowContent.addEventListener("load", action);
  }

  public Message(message: ThreadMessage): void {
    this.windowContent.contentWindow?.postMessage(message, "*");
  }
}

export default ApplicationWindow;
