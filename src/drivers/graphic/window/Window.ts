//TODO: Document this class

import IWindow from "./IWindow";
import { WindowOptions } from "@ostypes/WindowTypes";
import types from "@ostypes/types";
import { ClassOperation } from "@ostypes/UtilsTypes";
import {
  window,
  windowDataActions,
  windowSelectors,
} from "@utils/dom-defaults";
import { inject, injectable } from "inversify";
import IGraphicsUtils from "../utils/IGraphicUtils";
import GraphicsUtils from "../utils/GraphicsUtils";
import { config } from "@config/javascriptOsConfig";
import "jqueryui";

export let windowCount = 0;
let lastWindowOnTop: Window;

@injectable()
class Window implements IWindow {
  private readonly _graphicsUtils: IGraphicsUtils;

  public windowContainerElement!: HTMLDivElement;
  private windowHeaderElement!: HTMLDivElement;
  private windowContentElement!: HTMLDivElement;
  private windowFrozenElement!: HTMLDivElement;
  private fullScreen = false;

  public windowOptions!: WindowOptions;

  constructor(@inject(types.GraphicsUtils) graphicsUtils: GraphicsUtils) {
    this._graphicsUtils = graphicsUtils;
  }

  public Destroy(): void {
    if (this.windowContainerElement) this.windowContainerElement.remove();
  }

  public Freese(): void {
    jQuery(`[data-id="${this.windowOptions.windowIdentifier}"]`).draggable(
      "disable"
    );
    this.RemoveEventListeners();
    this.windowContentElement.before(this.windowFrozenElement);
  }

  public Unfreese(): void {
    jQuery(`[data-id="${this.windowOptions.windowIdentifier}"]`).draggable(
      "enable"
    );
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
    this.windowContainerElement =
      this._graphicsUtils.CreateElementFromHTML(window);

    this.windowHeaderElement =
      this._graphicsUtils.GetElementByClass<HTMLDivElement>(
        this.windowContainerElement,
        windowSelectors.windowHeaderSelector
      );
    this.windowContentElement =
      this._graphicsUtils.GetElementByClass<HTMLDivElement>(
        this.windowContainerElement,
        windowSelectors.windowContent
      );
    this.windowFrozenElement = this._graphicsUtils.CreateElementFromHTML(
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

  private InitMovement(): void {
    this._graphicsUtils.InitMovement(this.windowOptions.windowIdentifier);
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

      if (action === windowDataActions.Close) this.Destroy();
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

    this._graphicsUtils.AddOrRemoveClass(
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
    const staticURL = config.host + "/static/";
    this._graphicsUtils.GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      windowSelectors.windowTitle
    ).innerHTML = this.windowOptions.windowTitle;
    this._graphicsUtils.GetElementByClass<HTMLDivElement>(
      this.windowContainerElement,
      `${windowSelectors.windowIcon} > div`
    ).style.backgroundImage = `url('${
      this.windowOptions.iconLocation?.includes(staticURL)
        ? this.windowOptions.iconLocation
        : staticURL + this.windowOptions.iconLocation
    }')`;
  }

  public Render(content: string): void {
    this.windowContentElement.innerHTML = content;

    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainerElement!);
  }
}

export default Window;
