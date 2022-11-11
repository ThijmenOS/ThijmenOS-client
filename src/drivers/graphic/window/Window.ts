/* <Class Documentation>

  <Class Description>
    The window class manages everything that has to do with an application window

  <Method Descriptions>
    Destroy(): Destroys the window and removes it from the DOM
    Freese(): Makes the window unresponsible for everything
      |_ This method is used when this window is involved by a prompt or an error for example
    UnFreese(): Makes the window responsive again
    Onclick() - DblClick() - mouseDown(): These are behaviour methods. These methods are called when one of these actions occur. These methods then call their responsible handler
    RegisterEventListeners(): Registers the above actions as event listener
    RemoveEventListener(): Removes the event listeneners.
     |_ This method is used by the Freese() method to make the window unresponsive
     NewWindow(): sets the window settings on this class. It is used as an entry for other classes to make a new window
     InitTemplate(): This method initialises the DOM elements to prepare it for the DOM
     InitBehaviour(): This method class the other nessecery methods to add behaviour and responsiveness to the window
     InitMovement(): Initialises the movement of the window
     UpdateStyle(): Updates the classes necesery for displaying the window
     UpdateUI(): Updates the UI elements for displaying the window
     Render(): Renders the finished class to the DOM

*/

//DI
import { injectable } from "inversify";

//Interfaces
import IWindow from "./IWindow";

//Types
import { WindowOptions } from "@ostypes/WindowTypes";
import { ClassOperation } from "@ostypes/UtilsTypes";
import {
  window,
  windowDataActions,
  windowSelectors,
} from "@utils/dom-defaults";
import { host } from "@thijmenos/common";

//Other
import "jqueryui";
import {
  AddOrRemoveClass,
  CreateElementFromString,
  GetElementByClass,
  InitMovement,
} from "@thijmenos/graphics";

let windowCount = 0;
let lastWindowOnTop: Window;

@injectable()
class Window implements IWindow {
  private windowHeaderElement!: HTMLDivElement;
  private windowContentElement!: HTMLDivElement;
  private windowFrozenElement!: HTMLDivElement;
  public windowContainerElement!: HTMLDivElement;

  private fullScreen = false;

  public windowOptions!: WindowOptions;

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
  public NewWindow(windowOptions: WindowOptions): Window {
    windowCount++;
    this.windowOptions = windowOptions;

    return this;
  }
  public InitTemplate(): Window {
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

export default Window;
