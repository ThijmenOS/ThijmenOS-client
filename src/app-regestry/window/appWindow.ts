import { WindowOptions, WindowType } from "@interface/window";
import { appWindow } from "@static/dom-defaults";
import Utils from "@utils/utils";

export let windows: Array<AppWindow> = [];
export let windowCount = 0;

interface AppWindowArgs extends WindowOptions {}

class AppWindow {
  private windowContentElement?: HTMLDivElement;
  private windowIconElement?: HTMLDivElement;
  private windowTitleElement?: HTMLDivElement;

  public windowContainerElement?: HTMLDivElement;
  public windowOptions: WindowOptions;
  public windowHeaderElement?: HTMLDivElement;

  constructor(args: AppWindowArgs) {
    this.windowOptions = args;

    windowCount++;
  }

  public Destroy() {
    if (this.windowContainerElement) this.windowContainerElement.remove();
  }

  InitTemplate() {
    this.windowContainerElement = Utils.createElementFromHTML(appWindow);

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

  Render(content: string) {
    this.windowContentElement!.innerHTML = content;

    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainerElement!);

    windows.push(this);
  }
}

export default AppWindow;
