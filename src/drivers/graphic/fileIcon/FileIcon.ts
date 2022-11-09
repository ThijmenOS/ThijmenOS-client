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
import { ApplicationMetaData, MimeTypes } from "@thijmenos/common/types";
import { config } from "@thijmenos/common/config";
import ErrorManager from "@core/errorManager/ErrorManager";
import IErrorManager from "@core/errorManager/IErrorManager";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _appManager: IAppManager;
  private readonly _utils: IUtils;
  private readonly _graphicsUtils: IGraphicsUtils;
  private readonly _errorManager: IErrorManager;

  private iconContainerElement!: HTMLDivElement;
  private iconImageElement!: HTMLObjectElement;
  private iconTitleElement!: HTMLParagraphElement;

  private iconHasError?: ErrorManager;

  private mimeType?: MimeTypes;

  public exeLocation = "";
  public iconLocation?: string;
  public title = "";

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Utils) utils: IUtils,
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils,
    @inject(types.ErrorManager) errorManager: IErrorManager
  ) {
    this._appManager = appManager;
    this._utils = utils;
    this._graphicsUtils = graphicsUtils;
    this._errorManager = errorManager;
  }

  private async GetFileConfigurations() {
    const fileName: string = this.exeLocation.split("/").at(-1)!;
    this.mimeType = fileName.split(".").at(-1)! as MimeTypes;

    this.title = fileName;

    if (this.mimeType !== MimeTypes.thijm) {
      this.FileIcon(this.mimeType);
    } else {
      await this.ApplicationIcon();
    }

    this.InitIcon();
  }

  private FileIcon(mimeType: MimeTypes) {
    this.iconLocation = `${config.host}${config.fileIconsPath}/file_type_${fileIcons[mimeType]}.svg`;
  }

  private async ApplicationIcon() {
    const AppProperties: ApplicationMetaData =
      await this._utils.GetAppProperties(this.exeLocation);

    if (!AppProperties.exeLocation)
      this.iconHasError = this._errorManager.RaiseError();

    this.exeLocation = AppProperties.exeLocation;
    this.title = AppProperties.title;
    this.iconLocation = `${config.host}/static/` + AppProperties.iconLocation;
  }

  private InitIcon() {
    this.iconContainerElement =
      this._graphicsUtils.CreateElementFromString(appIcon);

    this.iconImageElement = this.iconContainerElement.querySelector(
      `.${fileIconSelectors.fileIconSelector}`
    )!;
    this.iconTitleElement =
      this.iconContainerElement.querySelector("#file-icon-title")!;

    const appHash = this.title + "-" + this._utils.GenerateUUID();

    this.iconContainerElement.setAttribute("data-id", appHash);

    this.Render();
    this.InitBehaviour();
  }

  private InitBehaviour() {
    const openFile = (ev: Event) => this.OpenFile(ev, this);

    this.iconContainerElement.addEventListener("dblclick", openFile);

    const dataId = this.iconContainerElement.getAttribute("data-id")!;

    this._graphicsUtils.InitMovement(dataId);
  }

  private Render() {
    this.iconImageElement!.data =
      this.iconLocation ||
      `${config.host}${config.fileIconsPath}/default-app-icon.svg`;
    this.iconTitleElement!.innerHTML = this.title;

    this._graphicsUtils.AddElement(this.iconContainerElement);
  }

  private OpenFile(_ev: Event, icon: FileIcon) {
    if (this.iconHasError) this.iconHasError.ApplicationNotFound();

    if (this.mimeType === MimeTypes.thijm)
      this._appManager.OpenExecutable(icon);
    else
      this._appManager.OpenFile({
        filePath: this.exeLocation,
        mimeType: this.mimeType!,
      });
  }

  public Destory() {
    this.iconContainerElement.remove();
  }

  public ConstructFileIcon(filePath: string) {
    this.exeLocation = filePath;
    this.GetFileConfigurations();
  }
}

export default FileIcon;
