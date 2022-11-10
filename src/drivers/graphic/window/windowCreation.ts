/* <Class Documentation>

  <Class Description>
    This class handles everyting that has to happen before a window can be created, such as getting the application executable that has to go in the window

  <Method Description>
    Application(): Gather information about the application it has to render
    InitWindow(): Takes this gathered information and content and makes a new window out of it.

*/

//DI
import types from "@ostypes/types";
import { inject, injectable } from "inversify";

//Interfaces
import ICreateWindow from "./IWindowCreation";
import { GenerateUUID } from "@thijmenos/utils";
import IWindow from "./IWindow";

//Types
import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "./Window";
import { BaseWindowOptions, WindowType } from "@ostypes/WindowTypes";
import { ApplicationMetaData, host } from "@thijmenos/common";

@injectable()
class CreateWindow implements ICreateWindow {
  private readonly _window: IWindow;

  private readonly windowOptions: BaseWindowOptions = {
    windowHeight: 400,
    windowWidth: 700,
    windowType: WindowType.APPLICATION,
  };

  private windowContent = "";
  private windowFileLocation = "";
  private windowTitle = "";
  private windowIconLocation?: string;
  private windowId?: string;

  constructor(@inject(types.window) window: IWindow) {
    this._window = window;
  }

  public Application(fileIcon: FileIcon | ApplicationMetaData) {
    this.windowFileLocation = fileIcon.exeLocation;
    this.windowTitle = fileIcon.title;
    this.windowIconLocation = fileIcon.iconLocation;

    this.windowId = GenerateUUID();

    this.windowContent = `<iframe id='${this.windowId}' name='${this.windowId}' class='app-iframe' style="height: ${this.windowOptions.windowHeight}px; width: ${this.windowOptions.windowWidth}px;" src='${host}/static/${this.windowFileLocation}'></iframe>`;

    return this.InitWindow();
  }

  public InitWindow(): Window {
    const window = this._window.NewWindow({
      windowTitle: this.windowTitle,
      iconLocation: this.windowIconLocation,
      windowHeight: this.windowOptions.windowHeight,
      windowWidth: this.windowOptions.windowWidth,
      windowType: this.windowOptions.windowType,
      windowIdentifier: this.windowId!,
    });
    window.InitTemplate();
    window.Render(this.windowContent);
    window.InitBehaviour();

    return window;
  }
}

export default CreateWindow;
