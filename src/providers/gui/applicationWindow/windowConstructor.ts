/* <Class Documentation>

  <Class Description>
    This class handles everyting that has to happen before a window can be created, such as getting the application executable that has to go in the window

  <Method Description>
    Application(): Gather information about the application it has to render
    InitWindow(): Takes this gathered information and content and makes a new window out of it.

*/

import { host } from "@thijmen-os/common";
import ApplicationWindow from "./applicationWindow";
import { injectable } from "inversify";
import ExectutionLocationNotFound from "@providers/error/userErrors/executionLocationNotFound";
import { WindowOptions } from "@ostypes/WindowTypes";

@injectable()
class WindowBuilder {
  public executionLocation: string;
  public winId: number;
  public windowOptions: WindowOptions;

  constructor(
    executionLocation: string,
    winId: number,
    windowOptions: WindowOptions
  ) {
    this.executionLocation = executionLocation;
    this.winId = winId;
    this.windowOptions = windowOptions;
  }

  public async Construct() {
    await this.CheckExecutionPath();

    const applicationContent = this.ConstructElement(
      this.winId.toString(),
      this.executionLocation
    );

    const window = new ApplicationWindow(
      this.winId,
      {
        windowHeight: this.windowOptions.windowHeight ?? 400,
        windowWidth: this.windowOptions.windowWidth ?? 700,
        windowTitle: this.windowOptions.windowTitle ?? "",
      },
      applicationContent
    );

    return window;
  }

  private async CheckExecutionPath(): Promise<void> {
    await fetch(this.PathBuilder(this.executionLocation)).then((result) => {
      if (!result.ok) {
        new ExectutionLocationNotFound(
          `The target execution location could not be started: ${this.executionLocation}`
        );
      }
    });
  }

  private ConstructElement(windowId: string, src: string) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("id", windowId);
    iframe.setAttribute("name", windowId);
    iframe.src = this.PathBuilder(src);

    iframe.classList.add("app-iframe");

    return iframe;
  }

  private PathBuilder = (executionLocation: string) =>
    `${host}/static/${executionLocation}`;
}

export default WindowBuilder;
