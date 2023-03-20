//DI

//Interfaces
import ApplicationWindowMethodShape from "./interfaces/applicationWindowMethodShape";
import ApplicationManager from "@core/ApplicationManager/ApplicationManagerMethods";

//Types
import { window, windowDataActions, windowSelectors } from "./defaults";
import { ClassOperation, host, WindowOptions } from "@thijmen-os/common";

//Other
import {
  AddOrRemoveClass,
  CreateElementFromString,
  GetElementByClass,
  InitMovement,
} from "@thijmen-os/graphics";
import { injectable } from "inversify";
import types from "@ostypes/types";
import javascriptOs from "@inversify/inversify.config";

let windowCount = 0;
let lastWindowOnTop: ApplicationWindow;

@injectable()
class ApplicationWindow implements ApplicationWindowMethodShape {
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);

  private windowHeaderElement!: HTMLDivElement;
  private windowContentElement!: HTMLDivElement;
  private windowFrozenElement!: HTMLDivElement;
  public windowContainerElement!: HTMLDivElement;

  private fullScreen = false;

  public windowOptions!: WindowOptions;

  constructor(windowOptions: WindowOptions) {
    this.windowOptions = windowOptions;

    windowCount++;
  }

  private onclick = (ev: Event) => this.Click(ev);
  private dblClick = () => this.DblClick();
  private mouseDown = () => this.MouseDown();
  private RegisterEventListeners() {
    this.windowContainerElement.addEventListener("click", this.onclick);
    this.windowContainerElement.addEventListener("dblclick", this.dblClick);
    this.windowContainerElement.addEventListener("mousedown", this.mouseDown);
  }
  private RemoveEventListeners() {
    this.windowContainerElement.removeEventListener("click", this.onclick);
    this.windowContainerElement.removeEventListener("dblclick", this.dblClick);
    this.windowContainerElement.removeEventListener(
      "mousedown",
      this.mouseDown
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
      const action: windowDataActions = target.getAttribute(
        "data-action"
      ) as windowDataActions;

      if (action === windowDataActions.Close)
        this._applicationManager.CloseExecutable(
          this.windowOptions.windowIdentifier
        );
      if (action === windowDataActions.Maximize)
        this.MaxOrMin(ClassOperation.ADD);
      if (action === windowDataActions.Minimize)
        this.MaxOrMin(ClassOperation.REMOVE);
    }
  }
  private DblClick() {
    !this.fullScreen
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
      ? (this.fullScreen = true)
      : (this.fullScreen = false);

    AddOrRemoveClass(
      [this.windowContainerElement, this.windowHeaderElement],
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
  private UpdateUI() {
    const staticURL = host + "/static/";
    GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      windowSelectors.windowTitle
    ).innerHTML = this.windowOptions.windowTitle;
    GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      `${windowSelectors.windowIcon} > div`
    ).style.backgroundImage = `url('${
      this.windowOptions.iconLocation?.includes(staticURL)
        ? this.windowOptions.iconLocation
        : staticURL + this.windowOptions.iconLocation
    }')`;
  }

  public Destroy(): void {
    if (this.windowContainerElement) this.windowContainerElement.remove();
  }
  public Freese(): void {
    InitMovement(this.windowOptions.windowIdentifier, { disabled: true });

    this.RemoveEventListeners();
    this.windowContentElement.before(this.windowFrozenElement);
  }
  public Unfreese(): void {
    InitMovement(this.windowOptions.windowIdentifier, { disabled: false });

    this.RegisterEventListeners();
    this.windowFrozenElement.remove();
  }
  public InitTemplate(): ApplicationWindow {
    this.windowContainerElement = CreateElementFromString(window);

    this.windowHeaderElement = GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      windowSelectors.windowHeaderSelector
    );
    this.windowContentElement = GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      windowSelectors.windowContent
    );
    this.windowFrozenElement = CreateElementFromString(
      "<div style='height: 100%;width:100%;background-color:rgba(142,142,142,0.2);position:absolute;'></div>"
    );

    this.windowHeaderElement.setAttribute(
      "data-id",
      this.windowOptions.windowTitle + windowCount.toString()
    );

    this.windowContainerElement.setAttribute(
      "data-id",
      this.windowOptions.windowIdentifier
    );

    this.UpdateStyle();
    this.UpdateUI();

    return this;
  }
  public InitBehaviour(): void {
    this.RegisterEventListeners();
    this.InitMovement();
  }
  public Render(content: string): void {
    this.windowContentElement.innerHTML = content;

    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainerElement!);
  }
}

export default ApplicationWindow;
