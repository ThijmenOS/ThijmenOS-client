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
import IFileIcon from "./fileIconMethodShape";
import ApplicationManager from "@core/applicationManager/applicationManagerMethodShape";

//Types
import fileIcons from "./mimetypeFIleNameMap";
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
import { OpenFile } from "@providers/filesystemEndpoints/filesystem";
import GenerateUUID from "@utils/generateUUID";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _applicationManager: ApplicationManager;

  private iconContainerElement!: HTMLDivElement;
  private iconImageElement!: HTMLObjectElement;
  private iconTitleElement!: HTMLParagraphElement;

  private iconHasError = false;

  public metaData: IconMetadataShape = {
    name: "",
    exeLocation: "",
    icon: "",
    mimeType: MimeTypes.thijm,
  };

  constructor(
    @inject(types.AppManager) applicationManager: ApplicationManager
  ) {
    this._applicationManager = applicationManager;
  }

  private async GetFileConfigurations(
    location: string
  ): Promise<IconMetadataShape | null> {
    const fileName: string | undefined = location.split("/").at(-1);
    if (!fileName) {
      return null;
    }

    const fileExtension = fileName.split(".").at(-1) as MimeTypes;

    if (!fileExtension) {
      return null;
    }

    if (fileExtension === MimeTypes.thijm) {
      return await this.ApplicationIcon(location);
    }

    return {
      name: fileName,
      exeLocation: location,
      icon: this.FileIcon(fileExtension),
      mimeType: fileExtension,
    };
  }

  private FileIcon(mimeType: MimeTypes): string {
    return `${host}${fileIconsPath}/file_type_${fileIcons[mimeType]}.svg`;
  }

  private async GetShortcutProperties(
    path: string
  ): Promise<IconMetadataShape | null> {
    if (!path || !path.length) {
      return null;
    }

    const file = await OpenFile(path);
    const iconMetadata: IconMetadataShape = JSON.parse(file);

    return iconMetadata;
  }

  private async ApplicationIcon(
    location: string
  ): Promise<IconMetadataShape | null> {
    const applicationProperties = await this.GetShortcutProperties(location);

    if (!applicationProperties || !applicationProperties.exeLocation) {
      this.iconHasError = true;
      return null;
    }

    return {
      name: applicationProperties.name,
      exeLocation: applicationProperties.exeLocation,
      icon: `${host}/static/` + applicationProperties.icon,
      mimeType: MimeTypes.thijm,
    };
  }

  private InitialiseIconElements(): string {
    this.iconContainerElement = CreateElementFromString(appIcon);

    this.iconImageElement = this.iconContainerElement.querySelector(
      `.${fileIconSelectors.fileIconSelector}`
    )!;
    this.iconTitleElement =
      this.iconContainerElement.querySelector("#file-icon-title")!;

    const iconIdentifier = GenerateUUID();

    this.iconContainerElement.setAttribute("data-id", iconIdentifier);

    return iconIdentifier;
  }

  private InitialiseIconBehaviour(
    iconIdentifier: string,
    iconMetadata: IconMetadataShape
  ) {
    let clickCount = 0;
    const listenToClick = () => {
      clickCount++;
      if (clickCount === 2) {
        this.OpenFile(iconMetadata);
        clickCount = 0;
      }
    };

    this.iconContainerElement.addEventListener("click", listenToClick);

    InitMovement(iconIdentifier);
  }

  private RenderIcon(iconName: string, iconImageSource?: string) {
    this.iconImageElement.data =
      iconImageSource || `${host}${fileIconsPath}/default-app-icon.svg`;
    this.iconTitleElement!.innerHTML = iconName;

    AddElement(this.iconContainerElement);
  }

  private OpenFile(metadata: IconMetadataShape) {
    if (this.iconHasError) ErrorManager.applicationNotFoundError();

    if (metadata.mimeType === MimeTypes.thijm) {
      this._applicationManager.OpenExecutable(metadata);

      return;
    }

    if (!metadata.mimeType) {
      //TODO: add mimetypeinvalid error
      ErrorManager.applicationNotFoundError();
      return;
    }

    this._applicationManager.OpenFile({
      filePath: metadata.exeLocation,
      mimeType: metadata.mimeType,
    });
  }

  public Destory() {
    this.iconContainerElement.remove();
  }

  public async ConstructFileIcon(filePath: string) {
    const iconMetaData = await this.GetFileConfigurations(filePath);

    if (!iconMetaData) {
      //TODO: implement Couldnt get config error
      this.iconHasError = true;
      return;
    }

    const iconIdentifier = this.InitialiseIconElements();
    this.RenderIcon(iconMetaData.name, iconMetaData.icon);
    this.InitialiseIconBehaviour(iconIdentifier, iconMetaData);
  }
}

export default FileIcon;
