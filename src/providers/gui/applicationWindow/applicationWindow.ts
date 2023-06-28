//DI

//Interfaces
import ApplicationWindowMethodShape from "./interfaces/applicationWindowMethodShape";

//Types
import { window, WindowDataActions, windowSelectors } from "./defaults";
import { WindowOptions } from "./interfaces/window";
import { ClassOperation } from "@thijmen-os/common";

//Other
import { injectable } from "inversify";
import TerminateProcess from "@core/kernel/commands/processes/terminateProcess";
import { ThreadMessage } from "@core/processManager/types/threadMessage";
import {
  InitMovement,
  AddOrRemoveClass,
  CreateElementFromString,
  GetElementByClass,
} from "../helpers";

let lastWindowOnTop: ApplicationWindow;

@injectable()
class ApplicationWindow implements ApplicationWindowMethodShape {
  private _windowHeaderElement!: HTMLDivElement;
  private _windowContentElement!: HTMLDivElement;
  private _windowFrozenElement!: HTMLDivElement;
  public windowContainerElement!: HTMLDivElement;
  public windowContent!: HTMLIFrameElement;

  private _fullScreen = false;

  public windowOptions!: WindowOptions;

  constructor(windowOptions: WindowOptions) {
    this.windowOptions = windowOptions;
  }

  private OnclickCallback = (ev: Event) => this.Click(ev);
  private DblClickCallback = () => this.DblClick();
  private MouseDownCallback = () => this.MouseDown();
  private RegisterEventListeners() {
    this.windowContainerElement.addEventListener("click", this.OnclickCallback);
    this.windowContainerElement.addEventListener(
      "dblclick",
      this.DblClickCallback
    );
    this.windowContainerElement.addEventListener(
      "mousedown",
      this.MouseDownCallback
    );
  }
  private RemoveEventListeners() {
    this.windowContainerElement.removeEventListener(
      "click",
      this.OnclickCallback
    );
    this.windowContainerElement.removeEventListener(
      "dblclick",
      this.DblClickCallback
    );
    this.windowContainerElement.removeEventListener(
      "mousedown",
      this.MouseDownCallback
    );
  }
  private InitMovement(): void {
    InitMovement(this.windowOptions.windowIdentifier);
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

      if (action === WindowDataActions.Close)
        new TerminateProcess(
          Number(this.windowOptions.windowIdentifier)
        ).Handle();
      if (action === WindowDataActions.Maximize)
        this.MaxOrMin(ClassOperation.ADD);
      if (action === WindowDataActions.Minimize)
        this.MaxOrMin(ClassOperation.REMOVE);
    }
  }
  private DblClick() {
    !this._fullScreen
      ? this.MaxOrMin(ClassOperation.ADD)
      : this.MaxOrMin(ClassOperation.REMOVE);
  }
  private MouseDown() {
    if (!lastWindowOnTop) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      lastWindowOnTop = this;
      return;
    }
    const index: number = parseInt(
      getComputedStyle(lastWindowOnTop.windowContainerElement!).zIndex
    );
    lastWindowOnTop.windowContainerElement!.style.zIndex = (
      index - 10
    ).toString();
    this.windowContainerElement!.style.zIndex = index.toString();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastWindowOnTop = this;
  }
  private MaxOrMin(operation: ClassOperation) {
    operation === ClassOperation.ADD
      ? (this._fullScreen = true)
      : (this._fullScreen = false);

    AddOrRemoveClass(
      [this.windowContainerElement, this._windowHeaderElement],
      ["window-full-screen"],
      operation
    );
  }
  private UpdateStyle() {
    this.windowContainerElement!.style.height =
      this.windowOptions.windowHeight + "px";
    this.windowContainerElement!.style.width =
      this.windowOptions.windowWidth + "px";
  }

  public Destroy(): void {
    if (this.windowContainerElement) this.windowContainerElement.remove();
  }
  public Freese(): void {
    InitMovement(this.windowOptions.windowIdentifier);

    this.RemoveEventListeners();
    this._windowContentElement.before(this._windowFrozenElement);
  }
  public Unfreese(): void {
    InitMovement(this.windowOptions.windowIdentifier);

    this.RegisterEventListeners();
    this._windowFrozenElement.remove();
  }
  public InitTemplate(): ApplicationWindow {
    this.windowContainerElement = CreateElementFromString(window);

    this._windowHeaderElement = GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      windowSelectors.windowHeaderSelector
    );
    this._windowContentElement = GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      windowSelectors.windowContent
    );
    this._windowFrozenElement = CreateElementFromString(
      "<div style='height: 100%;width:100%;background-color:rgba(142,142,142,0.2);position:absolute;'></div>"
    );

    this.windowContainerElement.setAttribute(
      "data-id",
      this.windowOptions.windowIdentifier
    );

    this.UpdateStyle();

    return this;
  }
  public InitBehaviour(): void {
    this.RegisterEventListeners();
    this.InitMovement();
  }
  public Render(element: HTMLIFrameElement): void {
    this.windowContent = element;
    this._windowContentElement.appendChild(element);

    this.windowContainerElement.style.display = "none";

    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainerElement);
  }
  public Show(): void {
    this.windowContainerElement.style.display = "unset";
  }
  public SetWindowSize(winX: number, winY: number): void {
    this.windowContainerElement.style.width = winX + "px";
    this.windowContainerElement.style.height = winY + "px";
  }
  public Message(message: ThreadMessage): void {
    this.windowContent.contentWindow?.postMessage(message, "*");
  }
}

export default ApplicationWindow;
