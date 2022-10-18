import { IFileIcon, Location } from "@interface/fileIcon";
import fileIcons from "./fileIcons";
import { appIcon } from "@static/dom-defaults";

import "jqueryui";
import { PropertiesObject } from "@interface/applicationProperties";
import { inject, injectable } from "inversify";
import { IAppManager } from "@interface/appManager";
import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _appManager: IAppManager;
  private readonly _utils: IUtils;

  public fileLocation: string = "";
  public iconLocation?: string;
  public supportedMimeTypes: Array<string>;

  private iconContainerElement?: HTMLDivElement;
  private iconImageElement?: HTMLObjectElement;
  private iconTitleElement?: HTMLParagraphElement;

  private readonly appHash: string;
  private readonly initialIconLocation: Location;

  public title: string;

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Utils) utils: IUtils
  ) {
    this._appManager = appManager;
    this._utils = utils;

    this.title = "";
    this.supportedMimeTypes = [];

    this.appHash = this.title + "-" + this._utils.GenerateUUID();

    this.initialIconLocation = {
      left: 0,
      top: 0,
    };
  }

  public ConstructFileIcon(filePath: string) {
    this.fileLocation = filePath;
    this.getFileConfig();
  }

  private async getFileConfig() {
    let targetFile: string = this.fileLocation.split("/").at(-1)!;
    let targetFileExtention: string = targetFile.split(".").at(-1)!;

    if (targetFileExtention != "thijm") {
      this.iconLocation =
        "./userFiles/C/Operating system/Icons/file_type_" +
        fileIcons[targetFileExtention] +
        ".svg";

      this.title = targetFile;
    } else {
      let AppProperties: PropertiesObject = await this._utils.GetAppProperties(
        this.fileLocation
      );

      if (AppProperties.exeLocation)
        this.fileLocation = AppProperties.exeLocation;

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

    let dataId = this.iconContainerElement.getAttribute("data-id");

    jQuery(`[data-id="${dataId}"]`).draggable({
      containment: "parent",
    });
  }

  // #detectRaster(element) {
  //   let left = element.$element.getBoundingClientRect().left;
  //   let top = element.$element.getBoundingClientRect().top;

  //   this.leftBound = Math.round(left / 100) * 100;
  //   this.topBound = Math.round(top / 100) * 100;
  // }
  // #placeInRaster(element) {
  //   registerdFileIcons.forEach((icon) => {
  //     if (
  //       this.leftBound === icon.leftBound &&
  //       this.topBound === icon.topBound
  //     ) {
  //       element.style.left = this.initalLocation.left + "px";
  //       element.style.top = this.initalLocation.top + "px";
  //     }
  //   });

  //   element.$element.style.left = this.leftBound + "px";
  //   element.$element.style.top = this.topBound + "px";

  //   this.initalLocation.left = leftBound;
  //   this.initalLocation.top = topBound;
  // }

  private Render() {
    this.iconImageElement!.data =
      this.iconLocation ||
      "./userFiles/C/Operating system/Icons/default-app-icon.svg";
    this.iconTitleElement!.innerHTML = this.title;

    document!
      .getElementById("main-application-container")!
      .appendChild(this.iconContainerElement!);

    this.initialIconLocation.left =
      this.iconContainerElement!.getBoundingClientRect().left;
    this.initialIconLocation.top =
      this.iconContainerElement!.getBoundingClientRect().top;
  }

  private OpenFile(_ev: Event, icon: FileIcon) {
    this._appManager.openApplication(icon);
  }
  public Destory() {
    this.iconContainerElement!.remove();
  }
}

export default FileIcon;
