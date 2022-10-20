import { IFileIcon } from "@interface/fileIcon";
import fileIcons from "./fileIcons";
import { appIcon } from "@static/dom-defaults";

import "jqueryui";
import { ApplicationMetaData } from "@interface/application/applicationProperties";
import { inject, injectable } from "inversify";
import { IAppManager } from "@interface/appManager";
import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _appManager: IAppManager;
  private readonly _utils: IUtils;

  public exeLocation = "";
  public iconLocation?: string;
  public supportedMimeTypes: Array<string>;

  private iconContainerElement?: HTMLDivElement;
  private iconImageElement?: HTMLObjectElement;
  private iconTitleElement?: HTMLParagraphElement;

  private readonly appHash: string;

  public title = "";

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Utils) utils: IUtils
  ) {
    this._appManager = appManager;
    this._utils = utils;

    this.supportedMimeTypes = [];

    this.appHash = this.title + "-" + this._utils.GenerateUUID();
  }

  public ConstructFileIcon(filePath: string) {
    this.exeLocation = filePath;
    this.GetFileConfigurations();
  }

  private async GetFileConfigurations() {
    const targetFile: string = this.exeLocation.split("/").at(-1)!;
    const targetFileExtention: string = targetFile.split(".").at(-1)!;

    this.title = targetFile;

    if (targetFileExtention !== "thijm") {
      this.iconLocation =
        "./userFiles/C/Operating system/Icons/file_type_" +
        fileIcons[targetFileExtention] +
        ".svg";
    } else {
      const AppProperties: ApplicationMetaData =
        await this._utils.GetAppProperties(this.exeLocation);

      if (AppProperties.exeLocation)
        this.exeLocation = AppProperties.exeLocation;

      this.title = AppProperties.title;
      if (AppProperties.iconLocation === undefined)
        AppProperties.iconLocation =
          "C/Operating system/Icons/default-app-icon.svg";
      this.iconLocation = "./userFiles/" + AppProperties.iconLocation;
    }

    this.InitIcon();
  }

  private InitIcon() {
    this.iconContainerElement = this._utils.CreateElementFromHTML(appIcon);

    this.iconImageElement = this.iconContainerElement.querySelector(
      ".javascript-os-file-icon"
    )!;
    this.iconTitleElement =
      this.iconContainerElement.querySelector("#file-icon-title")!;

    this.iconContainerElement.setAttribute("data-id", this.appHash);

    this.Render();
    this.InitBehaviour();
  }

  private InitBehaviour() {
    const openFile = (ev: Event) => this.OpenFile(ev, this);

    if (!this.iconContainerElement)
      throw new Error("Icon container element not found");

    this.iconContainerElement.addEventListener("dblclick", openFile);

    this.InitMovement();
  }
  private InitMovement() {
    if (!this.iconContainerElement)
      throw new Error("Icon container element not found");

    const dataId = this.iconContainerElement.getAttribute("data-id");

    jQuery(`[data-id="${dataId}"]`).draggable({
      containment: "parent",
    });
  }

  private Render() {
    this.iconImageElement!.data =
      this.iconLocation ||
      "./userFiles/C/Operating system/Icons/default-app-icon.svg";
    this.iconTitleElement!.innerHTML = this.title;

    document!
      .getElementById("main-application-container")!
      .appendChild(this.iconContainerElement!);
  }

  private OpenFile(_ev: Event, icon: FileIcon) {
    this._appManager.OpenApplication(icon);
  }
  public Destory() {
    this.iconContainerElement!.remove();
  }
}

export default FileIcon;
