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
import { GetShortcutProperties, GenerateUUID } from "@thijmen-os/utils";

//Types
import fileIcons from "./fileIcons";
import { appIcon, fileIconSelectors } from "@utils/dom-defaults";
import {
  MimeTypes,
  host,
  fileIconsPath,
  IconMetadataShape,
} from "@thijmen-os/common";
import {
  CreateElementFromString,
  InitMovement,
  AddElement,
} from "@thijmen-os/graphics";
import ErrorManager from "@thijmen-os/errormanager";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _appManager: IAppManager;

  private iconContainerElement!: HTMLDivElement;
  private iconImageElement!: HTMLObjectElement;
  private iconTitleElement!: HTMLParagraphElement;

  private iconHasError?: boolean;

  private mimeType?: MimeTypes;

  public exeLocation = "";
  public icon?: string;
  public name = "";

  constructor(@inject(types.AppManager) appManager: IAppManager) {
    this._appManager = appManager;
  }

  private async GetFileConfigurations() {
    const fileName: string = this.exeLocation.split("/").at(-1)!;
    this.mimeType = fileName.split(".").at(-1)! as MimeTypes;

    this.name = fileName;

    if (this.mimeType !== MimeTypes.thijm) {
      this.FileIcon(this.mimeType);
    } else {
      await this.ApplicationIcon();
    }

    this.InitIcon();
  }

  private FileIcon(mimeType: MimeTypes) {
    this.icon = `${host}${fileIconsPath}/file_type_${fileIcons[mimeType]}.svg`;
  }

  private async ApplicationIcon() {
    const AppProperties: IconMetadataShape = await GetShortcutProperties(
      this.exeLocation
    );

    if (!AppProperties.exeLocation) this.iconHasError = true;

    this.exeLocation = AppProperties.exeLocation;
    this.name = AppProperties.name;
    this.icon = `${host}/static/` + AppProperties.icon;
  }

  private InitIcon() {
    this.iconContainerElement = CreateElementFromString(appIcon);

    this.iconImageElement = this.iconContainerElement.querySelector(
      `.${fileIconSelectors.fileIconSelector}`
    )!;
    this.iconTitleElement =
      this.iconContainerElement.querySelector("#file-icon-title")!;

    const appHash = this.name + "-" + GenerateUUID();

    this.iconContainerElement.setAttribute("data-id", appHash);

    this.Render();
    this.InitBehaviour();
  }

  private InitBehaviour() {
    const openFile = (ev: Event) => this.OpenFile();

    this.iconContainerElement.addEventListener("dblclick", openFile);

    const dataId = this.iconContainerElement.getAttribute("data-id")!;

    InitMovement(dataId);
  }

  private Render() {
    this.iconImageElement!.data =
      this.icon || `${host}${fileIconsPath}/default-app-icon.svg`;
    this.iconTitleElement!.innerHTML = this.name;

    AddElement(this.iconContainerElement);
  }

  private OpenFile() {
    if (this.iconHasError) ErrorManager.applicationNotFoundError();

    if (this.mimeType === MimeTypes.thijm)
      this._appManager.OpenExecutable({
        exeLocation: this.exeLocation,
        name: this.name,
        icon: this.icon,
      });
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
