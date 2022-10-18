import AppWindow from "@app/window/appWindow";
import { Location } from "@interface/fileIcon";

let lastWindowOnTop: AppWindow;

class WindowBehaviour {
  fullScreen = false;
  location: Location = {
    left: 0,
    top: 0,
  };

  init(win: AppWindow) {
    const onclick = (ev: Event) => this.Click(ev, win);
    const dblClick = () => this.DblClick(win);
    const mouseDown = () => this.MouseDown(win);
    win.windowContainerElement!.addEventListener("click", onclick);
    win.windowContainerElement!.addEventListener("dblclick", dblClick);
    win.windowContainerElement!.addEventListener("mousedown", mouseDown);

    this.InitMovement(win);
  }

  private InitMovement(win: AppWindow) {
    let dataId = win.windowContainerElement!.getAttribute("data-id");
    let windowTitle = win.windowOptions.windowTitle;

    $(`[data-id="${dataId}"]`).draggable({
      containment: "document",
      handle: $(`[data-id="${windowTitle + dataId}"]`),
    });
  }

  private Click(ev: Event, win: AppWindow) {
    const target: HTMLDivElement = ev.target as HTMLDivElement;
    const hitButton: boolean = target.classList.contains("js-os-app-option");

    if (hitButton) {
      const action = target.getAttribute("data-action");

      if (action == "close") this.Close(win);
      if (action == "maximize") this.Maximize(win);
      if (action == "minimize") this.Minimize(win);
    }
  }

  private Close(win: AppWindow) {
    win.windowContainerElement!.remove();
  }
  private DblClick(win: AppWindow) {
    !this.fullScreen ? this.Maximize(win) : this.Minimize(win);
  }
  private MouseDown(win: AppWindow) {
    if (!lastWindowOnTop) {
      lastWindowOnTop = win;
      return;
    }
    let index: number = parseInt(
      getComputedStyle(lastWindowOnTop.windowContainerElement!).zIndex
    );
    lastWindowOnTop.windowContainerElement!.style.zIndex = (
      index - 10
    ).toString();
    win.windowContainerElement!.style.zIndex = index.toString();

    lastWindowOnTop = win;
  }
  private Maximize(win: AppWindow) {
    this.location = {
      left: win.windowContainerElement!.getBoundingClientRect().left,
      top: win.windowContainerElement!.getBoundingClientRect().top,
    };
    this.fullScreen = true;

    win.windowContainerElement!.classList.add("window-full-screen");
    win.windowHeaderElement!.classList.add("window-full-screen");
  }
  private Minimize(win: AppWindow) {
    win.windowContainerElement!.classList.remove("window-full-screen");
    win.windowHeaderElement!.classList.remove("window-full-screen");

    win.windowContainerElement!.style.left = this.location.left.toString();
    win.windowContainerElement!.style.top = this.location.top.toString();
    this.fullScreen = false;
  }
}

export default WindowBehaviour;
