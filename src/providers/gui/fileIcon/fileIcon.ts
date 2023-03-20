//DI
import types from "@ostypes/types";
import { inject, injectable } from "inversify";

//Interfaces
import IFileIcon from "./fileIconMethodShape";
import ProcessManager from "@core/ApplicationManager/ApplicationManagerMethods";

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
import StartProcess from "@core/kernel/commands/processes/startProcess";

@injectable()
class FileIcon implements IFileIcon {
  private readonly _processManager: ProcessManager;

  private iconContainerElement!: HTMLDivElement;
  private iconImageElement!: HTMLObjectElement;
  private iconTitleElement!: HTMLParagraphElement;

  private iconHasError = false;

  public metaData: IconMetadataShape = {
    name: "",
    exeLocation: "",
    iconLocation: "",
    mimeType: MimeTypes.thijm,
  };

  constructor(@inject(types.AppManager) applicationManager: ProcessManager) {
    this._processManager = applicationManager;
  }

  private async GetFileConfigurations(
    location: string
  ): Promise<IconMetadataShape | null> {
    const fileName: string | undefined = location.split("/").at(-1);
    if (!fileName) {
      return null;
    }

    const fileArray = fileName.split(".");
    let fileExtension = fileArray.at(-1) as MimeTypes;

    if (fileArray.length === 1) {
      fileExtension = MimeTypes.dir;
    }

    if (fileExtension === MimeTypes.thijm) {
      return await this.ApplicationIcon(location);
    }

    return {
      name: fileName,
      exeLocation: location,
      iconLocation: this.FileIcon(fileExtension),
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
      iconLocation: `${host}/static/` + applicationProperties.iconLocation,
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
      new StartProcess();
      this._processManager.OpenExecutable(metadata);

      return;
    }

    if (!metadata.mimeType) {
      //TODO: add mimetypeinvalid error
      ErrorManager.applicationNotFoundError();
      return;
    }

    this._processManager.OpenFile({
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
    this.RenderIcon(iconMetaData.name, iconMetaData.iconLocation);
    this.InitialiseIconBehaviour(iconIdentifier, iconMetaData);
  }
}

export default FileIcon;
