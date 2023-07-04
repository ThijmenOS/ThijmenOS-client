import { CreateElementFromString } from "../helpers";
import { window, windowSelectors } from "./defaults";

class WindowElement {
  private windowContainer: HTMLDivElement;

  private dimentions: { height: number; width: number };

  constructor(
    height: number,
    width: number,
    windowTitle: string,
    windowId: number
  ) {
    this.windowContainer = CreateElementFromString(window);
    this.windowContainer.setAttribute("data-id", windowId.toString());

    this.dimentions = { height: height, width: width };

    this.SetWindowDimentions();
    this.SetWindowTitle(windowTitle);
  }

  private SetWindowTitle(title: string) {
    const titleElement = this.windowContainer.getElementsByClassName(
      windowSelectors.windowTitle
    )[0];

    titleElement.innerHTML = title;
  }

  public SetWindowDimentions(width?: number, height?: number) {
    const formatInPx = (size: number) => size + "px";

    if (width && height) {
      this.dimentions = { width: width, height: height };
    }

    this.windowContainer.style.width = formatInPx(this.dimentions.width);
    this.windowContainer.style.height = formatInPx(this.dimentions.height);
  }

  public FullSreen() {
    let fullScreen = false;

    const yes = () => {
      fullScreen = true;
      this.windowContainer.classList.add("window-full-screen");
    };

    const no = () => {
      fullScreen = false;
      this.SetWindowDimentions();
      this.windowContainer.classList.remove("window-full-screen");
    };

    fullScreen ? no() : yes();

    return { yes, no };
  }

  public Destroy() {
    this.windowContainer.remove();
  }

  public Action(event: keyof HTMLElementEventMap, action: any) {
    const register = () => {
      this.windowContainer.addEventListener(event, action);

      return this;
    };

    const remove = () => {
      this.windowContainer.removeEventListener(event, action);

      return this;
    };

    return { register, remove };
  }

  public SetWindowContent(content: HTMLIFrameElement) {
    const contentContainer = this.windowContainer.getElementsByClassName(
      windowSelectors.windowContent
    )[0];

    contentContainer?.appendChild(content);
  }

  public Render() {
    document
      .getElementById("main-application-container")!
      .appendChild(this.windowContainer);
  }
}

export default WindowElement;
