import FileIcon from "@app/file-icon/fileIcon";
import { ICreateWindow } from "@interface/appWindow/createWindow";
import { IWindow } from "@interface/appWindow/window";
import {
  BaseWindowOptions,
  WindowType,
} from "@interface/appWindow/windowTypes";
import types from "@interface/types";
import { inject, injectable } from "inversify";
import AppWindow from "./appWindow";
import WindowBehaviour from "./WindowBehaviour";

@injectable()
class CreateWindow implements ICreateWindow {
  private readonly _window: IWindow;

  private windowContent: string = "";
  private readonly windowOptions: BaseWindowOptions = {
    windowHeight: 400,
    windowWidth: 700,
    windowType: WindowType.APPLICATION,
  };

  private windowFileLocation: string = "";
  private windowTitle: string = "";
  private windowIconLocation?: string;

  constructor(@inject(types.AppWindow) window: IWindow) {
    this._window = window;
  }

  public Application(fileIcon: FileIcon) {
    this.windowFileLocation = fileIcon.fileLocation;
    this.windowTitle = fileIcon.title;
    this.windowIconLocation = fileIcon.iconLocation;

    this.windowContent = `<iframe id='${this.windowTitle}' class='app-iframe' style="height: ${this.windowOptions.windowHeight}px; width: ${this.windowOptions.windowWidth}px;" src='./userFiles/${this.windowFileLocation}'></iframe>`;

    return this.InitWindow();
  }

  public InitWindow(): AppWindow {
    let window = this._window.NewWindow({
      windowTitle: this.windowTitle,
      iconLocation: this.windowIconLocation,
      windowHeight: this.windowOptions.windowHeight,
      windowWidth: this.windowOptions.windowWidth,
      windowType: this.windowOptions.windowType,
    });
    window.InitTemplate();
    window.Render(this.windowContent);

    let windowBehaviour = new WindowBehaviour();
    windowBehaviour.init(window);

    return window;
  }
}

export default CreateWindow;
