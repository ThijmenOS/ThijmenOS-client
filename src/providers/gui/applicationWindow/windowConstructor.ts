/* <Class Documentation>

  <Class Description>
    This class handles everyting that has to happen before a window can be created, such as getting the application executable that has to go in the window

  <Method Description>
    Application(): Gather information about the application it has to render
    InitWindow(): Takes this gathered information and content and makes a new window out of it.

*/

import WindowConstructorMethods from "./interfaces/windowConstructorMethods";
import { host } from "@thijmen-os/common";
import ApplicationWindow from "./applicationWindow";
import { windowOptions } from "./defaults";
import { injectable } from "inversify";
import ExectutionLocationNotFound from "@providers/error/userErrors/executionLocationNotFound";

@injectable()
class WindowConstructor implements WindowConstructorMethods {
  public async Window(
    executionLocation: string,
    pid: number
  ): Promise<ApplicationWindow> {
    await this.CheckExecutionPath(executionLocation);

    const windowId = pid.toString();

    const window = new ApplicationWindow({
      windowHeight: windowOptions.windowHeight,
      windowWidth: windowOptions.windowWidth,
      windowType: windowOptions.windowType,
      windowIdentifier: windowId,
    });

    const applicationContent = this.ConstructElement(
      windowId,
      executionLocation
    ).window(windowOptions.windowHeight, windowOptions.windowWidth);

    window.InitTemplate();
    window.Render(applicationContent);
    window.InitBehaviour();

    return window;
  }

  private async CheckExecutionPath(executionLocation: string): Promise<void> {
    await fetch(this.PathBuilder(executionLocation)).then((result) => {
      if (!result.ok) {
        new ExectutionLocationNotFound(
          `The target execution location could not be started: ${executionLocation}`
        );
      }
    });
  }

  private ConstructElement(windowId: string, src: string) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("id", windowId);
    iframe.setAttribute("name", windowId);
    iframe.src = this.PathBuilder(src);

    const window = (height: number, width: number) => {
      iframe.classList.add("app-iframe");
      iframe.setAttribute("style", `height: ${height}px; width: ${width}px`);

      return iframe;
    };

    const process = () => {
      iframe.style.display = "none";

      return iframe;
    };

    return { window, process };
  }

  private PathBuilder = (executionLocation: string) =>
    `${host}/static/${executionLocation}`;
}

export default WindowConstructor;
