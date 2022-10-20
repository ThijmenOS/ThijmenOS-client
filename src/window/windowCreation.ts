import FileIcon from "fileIcon/fileIcon";
import { ICreateWindow } from "@interface/window/createWindow";
import { IWindow } from "@interface/window/window";
import { BaseWindowOptions, WindowType } from "@interface/window/windowTypes";
import types from "@interface/types";
import { inject, injectable } from "inversify";
import window from "./window";
import { ApplicationMetaData } from "@interface/application/applicationProperties";

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

    this.windowContent = `<iframe id='${this.windowTitle}' class='app-iframe' style="height: ${this.windowOptions.windowHeight}px; width: ${this.windowOptions.windowWidth}px;" src='./userFiles/${this.windowFileLocation}'></iframe>`;

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
