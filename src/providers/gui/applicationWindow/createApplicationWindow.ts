/* <Class Documentation>

  <Class Description>
    This class handles everyting that has to happen before a window can be created, such as getting the application executable that has to go in the window

  <Method Description>
    Application(): Gather information about the application it has to render
    InitWindow(): Takes this gathered information and content and makes a new window out of it.

*/

import CreateApplicationWindowMethodShape from "./interfaces/createApplicationWindowMethodShape";
import { host } from "@thijmen-os/common";
import ApplicationWindow from "./applicationWindow";
import { windowOptions } from "./defaults";
import { injectable } from "inversify";
import GenerateUUID from "@utils/generateUUID";
import ErrorManager from "@thijmen-os/errormanager";

@injectable()
class CreateWindow implements CreateApplicationWindowMethodShape {
  public Application(executionLocation: string): ApplicationWindow {
    const windowId = GenerateUUID();

    const window = new ApplicationWindow({
      windowHeight: windowOptions.windowHeight,
      windowWidth: windowOptions.windowWidth,
      windowType: windowOptions.windowType,
      windowIdentifier: windowId,
    });

    fetch(`${host}/static/${executionLocation}`).then((result) => {
      if (!result.ok) {
        window.Destroy();
        ErrorManager.applicationNotFoundError();
        throw new Error();
      }
    });

    const applicationContent = `<iframe id='${windowId}' name='${windowId}' class='app-iframe' style="height: ${windowOptions.windowHeight}px; width: ${windowOptions.windowWidth}px;" src='${host}/static/${executionLocation}'></iframe>`;

    window.InitTemplate();
    window.Render(applicationContent);
    window.InitBehaviour();

    return window;
  }
}

export default CreateWindow;
