import { IWindow } from "@interface/window/window";
import { WindowOptions, WindowType } from "@interface/window/windowTypes";
import types from "@interface/types";
import { ClassOperation, IUtils } from "@interface/utils/utils";
import { window } from "@static/dom-defaults";
import { inject, injectable } from "inversify";

export let windowCount = 0;
let lastWindowOnTop: Window;

@injectable()
class Window implements IWindow {
  private readonly _utils: IUtils;

  private windowContainerElement!: HTMLDivElement;
  private windowHeaderElement!: HTMLDivElement;
  private windowContentElement!: HTMLDivElement;
  private windowFrozenElement!: HTMLDivElement;
  private fullScreen = false;
  private windowId!: string;

  public windowOptions!: WindowOptions;

  constructor(@inject(types.Utils) utils: IUtils) {
    this._utils = utils;
  }

  public Destroy(): void {
    if (this.windowContainerElement) this.windowContainerElement.remove();
  }
  public Freese(): void {
    $(`[data-id="${this.windowId}"]`).draggable("disable");
    this.RemoveEventListeners();
    this.windowContentElement.before(this.windowFrozenElement);
  }
  public Unfreese(): void {
    $(`[data-id="${this.windowId}"]`).draggable("enable");
    this.RegisterEventListeners();
    this.windowFrozenElement.remove();
  }
  private onclick = (ev: Event) => this.Click(ev);
  private dblClick = () => this.DblClick();
  private mouseDown = () => this.MouseDown();

  private RegisterEventListeners() {
    this.windowContainerElement!.addEventListener("click", this.onclick);
    this.windowContainerElement!.addEventListener("dblclick", this.dblClick);
    this.windowContainerElement!.addEventListener("mousedown", this.mouseDown);
  }
  private RemoveEventListeners() {
    this.windowContainerElement!.removeEventListener("click", this.onclick);
    this.windowContainerElement!.removeEventListener("dblclick", this.dblClick);
    this.windowContainerElement!.removeEventListener(
      "mousedown",
      this.mouseDown
    );
  }

  public NewWindow(windowOptions: WindowOptions): Window {
    windowCount++;
    this.windowOptions = windowOptions;

    return this;
  }

  public InitTemplate(): Window {
    this.windowContainerElement = this._utils.CreateElementFromHTML(window);

    this.windowHeaderElement = this._utils.GetElement<HTMLDivElement>(
      this.windowContainerElement,
      ".javascript-os-header"
    );
    this.windowContentElement = this._utils.GetElement<HTMLDivElement>(
      this.windowContainerElement,
      ".javascript-os-content"
    );
    this.windowFrozenElement = this._utils.CreateElementFromHTML(
      "<div style='height: 100%;width:100%;background-color:rgba(142,142,142,0.2);position:absolute;'></div>"
    );

    this.windowHeaderElement.setAttribute(
      "data-id",
      this.windowOptions.windowTitle + windowCount.toString()
    );

    this.windowId = windowCount.toString();

    this.windowContainerElement.setAttribute("data-id", this.windowId);

    this.UpdateStyle();
    this.UpdateUI();
    this.UpdateBarOptions();

    return this;
  }

  public InitBehaviour(): void {
    this.RegisterEventListeners();
    this.InitMovement();
  }

  private InitMovement() {
    $(`[data-id="${this.windowId}"]`).draggable({
      containment: "document",
      handle: $(
        `[data-id="${this.windowOptions.windowTitle + this.windowId}"]`
      ),
    });
  }

  private Click(ev: Event) {
    const target: HTMLDivElement = ev.target as HTMLDivElement;
    const hitButton: boolean = target.classList.contains("js-os-app-option");

    if (hitButton) {
      const action = target.getAttribute("data-action");

      if (action === "close") this.Destroy();
      if (action === "maximize") this.MaxOrMin(ClassOperation.ADD);
      if (action === "minimize") this.MaxOrMin(ClassOperation.REMOVE);
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

    this._utils.AddOrRemoveClass(
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
    this._utils.GetElement<HTMLDivElement>(
      this.windowContainerElement,
      ".javascript-os-title"
    ).innerHTML = this.windowOptions.windowTitle;
    this._utils.GetElement<HTMLDivElement>(
      this.windowContainerElement,
      ".javascript-os-icon > div"
    ).style.backgroundImage = `url('${this.windowOptions.iconLocation}')`;
  }
  private UpdateBarOptions() {
    if (this.windowOptions.windowType === WindowType.DIALOG) {
      const smallerIcon = this.windowContainerElement!.querySelector(
        "#app-smaller"
      ) as HTMLElement;
      const biggerIcon = this.windowContainerElement!.querySelector(
        "#app-bigger"
      ) as HTMLElement;

      smallerIcon.style.display = "none";
      biggerIcon.style.display = "none";
    }
  }

  public Render(content: string): void {
    this.windowContentElement.innerHTML = content;

    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainerElement!);
  }
}

export default Window;
