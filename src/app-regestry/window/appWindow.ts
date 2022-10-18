import { IWindow } from "@interface/appWindow/window";
import {
  AppWindowArgs,
  WindowOptions,
  WindowType,
} from "@interface/appWindow/windowTypes";
import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";
import { appWindow } from "@static/dom-defaults";
import { inject, injectable } from "inversify";

export let windows: Array<AppWindow> = [];
export let windowCount = 0;

@injectable()
class AppWindow implements IWindow {
  private readonly _utils: IUtils;

  private windowContentElement?: HTMLDivElement;
  private windowIconElement?: HTMLDivElement;
  private windowTitleElement?: HTMLDivElement;

  public windowContainerElement?: HTMLDivElement;
  public windowOptions!: WindowOptions;
  public windowHeaderElement?: HTMLDivElement;

  constructor(@inject(types.Utils) utils: IUtils) {
    this._utils = utils;

    windowCount++;
  }

  public Destroy(): void {
    windows.splice(
      windows.findIndex((window: AppWindow): boolean => window === this),
      1
    );
    if (this.windowContainerElement) this.windowContainerElement.remove();
  }

  public NewWindow(windowOptions: AppWindowArgs): AppWindow {
    this.windowOptions = windowOptions;

    return this;
  }

  public InitTemplate(): AppWindow {
    this.windowContainerElement = this._utils.CreateElementFromHTML(appWindow);

    this.windowContentElement = this.windowContainerElement.querySelector(
      ".javascript-os-content"
    )!;
    this.windowHeaderElement = this.windowContainerElement.querySelector(
      ".javascript-os-header"
    )!;
    this.windowIconElement = this.windowContainerElement.querySelector(
      ".javascript-os-icon > div"
    )!;
    this.windowTitleElement = this.windowContainerElement.querySelector(
      ".javascript-os-title"
    )!;

    this.windowHeaderElement.setAttribute(
      "data-id",
      this.windowOptions.windowTitle + windowCount.toString()
    );
    this.windowContainerElement.setAttribute("data-id", windowCount.toString());

    this.UpdateStyle();
    this.UpdateUI();
    this.UpdateBarOptions();

    return this;
  }

  private UpdateStyle() {
    this.windowContainerElement!.style.height =
      this.windowOptions.windowHeight + "px";
    this.windowContainerElement!.style.width =
      this.windowOptions.windowWidth + "px";
  }
  private UpdateUI() {
    this.windowTitleElement!.innerHTML = this.windowOptions.windowTitle;
    this.windowIconElement!.style.backgroundImage = `url('${this.windowOptions.iconLocation}')`;
  }
  private UpdateBarOptions() {
    if (this.windowOptions.windowType == WindowType.DIALOG) {
      let smallerIcon = this.windowContainerElement!.querySelector(
        "#app-smaller"
      ) as HTMLElement;
      let biggerIcon = this.windowContainerElement!.querySelector(
        "#app-bigger"
      ) as HTMLElement;

      smallerIcon.style.display = "none";
      biggerIcon.style.display = "none";
    }
  }

  public Render(content: string): void {
    this.windowContentElement!.innerHTML = content;

    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainerElement!);
  }
}

export default AppWindow;
