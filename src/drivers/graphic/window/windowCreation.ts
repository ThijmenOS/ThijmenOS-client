//TODO: Document this class

import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import ICreateWindow from "./IWindowCreation";
import IWindow from "./IWindow";
import { BaseWindowOptions, WindowType } from "@ostypes/WindowTypes";
import types from "@ostypes/types";
import { inject, injectable } from "inversify";
import window from "./Window";
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { config } from "@config/javascriptOsConfig";
import IUtils from "@utils/IUtils";

@injectable()
class CreateWindow implements ICreateWindow {
  private readonly _window: IWindow;
  private readonly _utils: IUtils;

  private windowContent = "";
  private readonly windowOptions: BaseWindowOptions = {
    windowHeight: 400,
    windowWidth: 700,
    windowType: WindowType.APPLICATION,
  };

  private windowFileLocation = "";
  private windowTitle = "";
  private windowIconLocation?: string;
  private windowId?: string;

  constructor(
    @inject(types.window) window: IWindow,
    @inject(types.Utils) utils: IUtils
  ) {
    this._window = window;
    this._utils = utils;
  }

  public Application(fileIcon: FileIcon | ApplicationMetaData) {
    this.windowFileLocation = fileIcon.exeLocation;
    this.windowTitle = fileIcon.title;
    this.windowIconLocation = fileIcon.iconLocation;

    this.windowId = this._utils.GenerateUUID();

    this.windowContent = `<iframe id='${this.windowId}' name='${this.windowId}' class='app-iframe' style="height: ${this.windowOptions.windowHeight}px; width: ${this.windowOptions.windowWidth}px;" src='${config.host}/static/${this.windowFileLocation}'></iframe>`;

    return this.InitWindow();
  }

  public InitWindow(): window {
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
