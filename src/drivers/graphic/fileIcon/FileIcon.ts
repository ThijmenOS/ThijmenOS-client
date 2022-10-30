/* <Class Documentation>

  <Class Description>
    The file icon holds does two main things. It knows how to display itself on the screen and in knows information about the file in order to excecute it.

  <Method Descriptions>
    ConstructFileIcon(): This method is the entry point to start the processes that are involved with the file icon.
    GetFileConfigurations(): If the file is an executable or a short to an executable, this method gathers information about where the executable actually is and what icon to display with it. If it is not an executable but an file, it gathes information about which default app to open this file with and which icon to show
    InitIcon(): This method does the nesecery dom things for the file icon to render and give behaviour
    InitBehaviour(): This method initialises for example movement of the icon or what happens when you click the icon.
    Render(): This method renders the icon to the actual DOM so it is visible on the desktop
    OpenFile(): Opens the file or executable
    Destroy(): Removes the file icon from the DOM

*/

//DI
import types from "@ostypes/types";
import { inject, injectable } from "inversify";

//Interfaces
import IFileIcon from "./IFileIcon";
import IAppManager from "@core/appManager/IAppManager";
import IUtils from "@utils/IUtils";
import IGraphicsUtils from "../utils/IGraphicUtils";

//Types
import fileIcons from "./fileIcons";
import { appIcon, fileIconSelectors } from "@utils/dom-defaults";
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { config } from "@config/javascriptOsConfig";
import { MimeTypes } from "@ostypes/SettingsTypes";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _appManager: IAppManager;
  private readonly _utils: IUtils;
  private readonly _graphicsUtils: IGraphicsUtils;

  public exeLocation = "";
  public iconLocation?: string;

  private iconContainerElement?: HTMLDivElement;
  private iconImageElement?: HTMLObjectElement;
  private iconTitleElement?: HTMLParagraphElement;

  private appHash?: string;
  private mimeType?: MimeTypes;

  public title = "";

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Utils) utils: IUtils,
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils
  ) {
    this._appManager = appManager;
    this._utils = utils;
    this._graphicsUtils = graphicsUtils;
  }

  public ConstructFileIcon(filePath: string) {
    this.exeLocation = filePath;
    this.GetFileConfigurations();
  }

  private async GetFileConfigurations() {
    const targetFile: string = this.exeLocation.split("/").at(-1)!;
    this.mimeType = targetFile.split(".").at(-1)! as MimeTypes;

    this.title = targetFile;
    //TODO: If it is a thijm, execute it directly else it should check which default app it has to excecute

    if (this.mimeType !== MimeTypes.thijm) {
      this.iconLocation =
        `${config.host}${config.fileIconsPath}/file_type_` +
        fileIcons[this.mimeType] +
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
    if (this.mimeType === MimeTypes.thijm)
      this._appManager.OpenExecutable(icon);
    else this._appManager.OpenFile(this.mimeType!, this.exeLocation);
  }
  public Destory() {
    this.iconContainerElement!.remove();
  }
}

export default FileIcon;
