//DI
import { injectable } from "inversify";

//Interfaces
import IFileIcon from "./fileIconMethodShape";

//Types
import fileIcons from "./mimetypeFIleNameMap";
import { appIcon, fileIconSelectors } from "@utils/dom-defaults";
import {
  MimeTypes,
  host,
  fileIconsPath,
  IconMetadataShape,
} from "@thijmen-os/common";
import { OpenFile } from "@providers/filesystemEndpoints/filesystem";
import GenerateUUID from "@utils/generateUUID";
import StartProcess from "@core/kernel/commands/processes/startProcess";
import { AddElement, CreateElementFromString, InitMovement } from "../helpers";
import ApplicationNotFoundError from "@providers/error/userErrors/applicationNotFound";
import OpenFileCommand from "@core/kernel/commands/application/openFileCommand";

@injectable()
class FileIcon implements IFileIcon {
  private _iconContainerElement!: HTMLDivElement;
  private _iconImageElement!: HTMLObjectElement;
  private _iconTitleElement!: HTMLParagraphElement;

  private _iconHasError = false;

  public metaData: IconMetadataShape = {
    name: "",
    exeLocation: "",
    iconLocation: "",
    mimeType: MimeTypes.thijm,
  };

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
    if (typeof file === "number") {
      throw new Error("error");
    }
    const iconMetadata: IconMetadataShape = JSON.parse(file);

    return iconMetadata;
  }

  private async ApplicationIcon(
    location: string
  ): Promise<IconMetadataShape | null> {
    const applicationProperties = await this.GetShortcutProperties(location);

    if (!applicationProperties || !applicationProperties.exeLocation) {
      this._iconHasError = true;
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
    this._iconContainerElement = CreateElementFromString(appIcon);

    this._iconImageElement = this._iconContainerElement.querySelector(
      `.${fileIconSelectors.fileIconSelector}`
    )!;
    this._iconTitleElement =
      this._iconContainerElement.querySelector("#file-icon-title")!;

    const iconIdentifier = GenerateUUID();

    this._iconContainerElement.setAttribute("data-id", iconIdentifier);

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

    this._iconContainerElement.addEventListener("click", listenToClick);

    InitMovement(iconIdentifier);
  }

  private RenderIcon(iconName: string, iconImageSource?: string) {
    this._iconImageElement.data =
      iconImageSource || `${host}${fileIconsPath}/default-app-icon.svg`;
    this._iconTitleElement!.innerHTML = iconName;

    AddElement(this._iconContainerElement);
  }

  private OpenFile(metadata: IconMetadataShape) {
    if (this._iconHasError)
      throw new ApplicationNotFoundError("Application cloud not be found");

    if (metadata.mimeType === MimeTypes.thijm) {
      //Exe path mee geven op basis daar van exe laden.
      new StartProcess({
        exePath: metadata.exeLocation,
        name: metadata.name,
      }).Handle();
      return;
    }

    if (!metadata.mimeType) {
      //TODO: add mimetypeinvalid error
      throw new ApplicationNotFoundError("");
    }

    new OpenFileCommand({
      filePath: metadata.exeLocation,
      mimeType: metadata.mimeType,
    }).Handle();
  }

  public Destory() {
    this._iconContainerElement.remove();
  }

  public async ConstructFileIcon(filePath: string) {
    const iconMetaData = await this.GetFileConfigurations(filePath);

    if (!iconMetaData) {
      //TODO: implement Couldnt get config error
      this._iconHasError = true;
      return;
    }

    const iconIdentifier = this.InitialiseIconElements();
    this.RenderIcon(iconMetaData.name, iconMetaData.iconLocation);
    this.InitialiseIconBehaviour(iconIdentifier, iconMetaData);
  }
}

export default FileIcon;
