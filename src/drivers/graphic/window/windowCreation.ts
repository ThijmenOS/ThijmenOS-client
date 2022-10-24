import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import ICreateWindow from "./IWindowCreation";
import IWindow from "./IWindow";
import { BaseWindowOptions, WindowType } from "@ostypes/WindowTypes";
import types from "@ostypes/types";
import { inject, injectable } from "inversify";
import window from "./Window";
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { config } from "@config/javascriptOsConfig";

@injectable()
class CreateWindow implements ICreateWindow {
  private readonly _window: IWindow;

  private windowContent = "";
  private readonly windowOptions: BaseWindowOptions = {
    windowHeight: 400,
    windowWidth: 700,
    windowType: WindowType.APPLICATION,
  };

  private windowFileLocation = "";
  private windowTitle = "";
  private windowIconLocation?: string;

  constructor(@inject(types.window) window: IWindow) {
    this._window = window;
  }

  public Application(fileIcon: FileIcon | ApplicationMetaData) {
    this.windowFileLocation = fileIcon.exeLocation;
    this.windowTitle = fileIcon.title;
    this.windowIconLocation = fileIcon.iconLocation;

    this.windowContent = `<iframe id='${this.windowTitle}' class='app-iframe' style="height: ${this.windowOptions.windowHeight}px; width: ${this.windowOptions.windowWidth}px;" src='${config.host}/static/${this.windowFileLocation}'></iframe>`;

    return this.InitWindow();
  }

  public InitWindow(): window {
    const window = this._window.NewWindow({
      windowTitle: this.windowTitle,
      iconLocation: this.windowIconLocation,
      windowHeight: this.windowOptions.windowHeight,
      windowWidth: this.windowOptions.windowWidth,
      windowType: this.windowOptions.windowType,
    });
    window.InitTemplate();
    window.Render(this.windowContent);
    window.InitBehaviour();

    return window;
  }
}

export default CreateWindow;
