import FileIcon from "@app/file-icon/fileIcon";
import { BaseWindowOptions, WindowType } from "@interface/window";
import AppWindow from "./appWindow";
import WindowBehaviour from "./WindowBehaviour";

class CreateWindow {
  private windowContent: string;
  private readonly windowOptions: BaseWindowOptions;

  private windowFileLocation: string;
  private windowTitle: string;
  private windowIconLocation?: string;

  constructor() {
    this.windowFileLocation = "";
    this.windowTitle = "undef";
    this.windowContent = "";

    this.windowOptions = {
      windowHeight: 400,
      windowWidth: 700,
      windowType: WindowType.APPLICATION,
    };
  }

  async application(fileIcon: FileIcon) {
    this.windowFileLocation = fileIcon.fileLocation;
    this.windowTitle = fileIcon.title;
    this.windowIconLocation = fileIcon.iconLocation;

    this.windowContent = `<iframe id='${this.windowTitle}' class='app-iframe' style="height: ${this.windowOptions.windowHeight}px; width: ${this.windowOptions.windowWidth}px;" src='./userFiles/${this.windowFileLocation}'></iframe>`;

    return this;
  }

  async initWindow() {
    let window = new AppWindow({
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
  }
}

export default CreateWindow;
