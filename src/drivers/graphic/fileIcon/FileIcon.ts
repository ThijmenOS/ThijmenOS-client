import IFileIcon from "./IFileIcon";
import fileIcons from "./fileIcons";
import { appIcon, fileIconSelectors } from "@utils/dom-defaults";

import "jqueryui";
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { inject, injectable } from "inversify";
import IAppManager from "@core/appManager/IAppManager";
import types from "@ostypes/types";
import IUtils from "@utils/IUtils";
import { config } from "@config/javascriptOsConfig";
import IGraphicsUtils from "../utils/IGraphicUtils";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _appManager: IAppManager;
  private readonly _utils: IUtils;
  private readonly _graphicsUtils: IGraphicsUtils;

  public exeLocation = "";
  public iconLocation?: string;
  public supportedMimeTypes: Array<string>;

  private iconContainerElement?: HTMLDivElement;
  private iconImageElement?: HTMLObjectElement;
  private iconTitleElement?: HTMLParagraphElement;

  private appHash?: string;

  public title = "";

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Utils) utils: IUtils,
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils
  ) {
    this._appManager = appManager;
    this._utils = utils;
    this._graphicsUtils = graphicsUtils;

    this.supportedMimeTypes = [];
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
        `${config.host}${config.fileIconsPath}/file_type_` +
        fileIcons[targetFileExtention] +
        ".svg";
    } else {
      const AppProperties: ApplicationMetaData =
        await this._utils.GetAppProperties(this.exeLocation);

      if (AppProperties.exeLocation)
        this.exeLocation = AppProperties.exeLocation;

      this.title = AppProperties.title;
      if (AppProperties.iconLocation === undefined)
        AppProperties.iconLocation = `${config.host}${config.fileIconsPath}/default-app-icon.svg`;
      this.iconLocation = `${config.host}/static/` + AppProperties.iconLocation;
    }

    this.InitIcon();
  }

  private InitIcon() {
    this.iconContainerElement =
      this._graphicsUtils.CreateElementFromHTML(appIcon);

    this.iconImageElement = this.iconContainerElement.querySelector(
      `.${fileIconSelectors.fileIconSelector}`
    )!;
    this.iconTitleElement =
      this.iconContainerElement.querySelector("#file-icon-title")!;

    this.appHash = this.title + "-" + this._utils.GenerateUUID();

    this.iconContainerElement.setAttribute("data-id", this.appHash);

    this.Render();
    this.InitBehaviour();
  }

  private InitBehaviour() {
    const openFile = (ev: Event) => this.OpenFile(ev, this);

    if (!this.iconContainerElement)
      throw new Error("Icon container element not found");

    this.iconContainerElement.addEventListener("dblclick", openFile);

    const dataId = this.iconContainerElement.getAttribute("data-id")!;

    this._graphicsUtils.InitMovement(dataId);
  }
  private Render() {
    this.iconImageElement!.data =
      this.iconLocation ||
      `${config.host}${config.fileIconsPath}/default-app-icon.svg`;
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
