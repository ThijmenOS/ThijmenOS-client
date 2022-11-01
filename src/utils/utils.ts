/* <Class Documentation>

  <Class Description>
    These are general utilities that can be used by every class

  <Method Descriptions>
    UpdateTime(): Get the current time and formats it.
    GenerateUUID(): Generates a UUID
    ReadFile(): This method calls the file system to read a specific file
    CheckShortcut(): This method checks if a .thijm file is a shortcut or an actual executable
    GetAppProperties(): This method extract the properties of an application. For example icon location or mimetypes

*/

//DI
import { inject, injectable } from "inversify";

//Interfaces
import IUtils from "./IUtils";
import IFileSystem from "@drivers/fileSystem/IFileSystem";

//Types
import {
  ApplicationMetaData,
  ApplicationMetaDataFields,
  ApplicationMetaDataObject,
} from "@ostypes/ApplicationTypes";
import types from "@ostypes/types";
import { Path } from "@common/FileSystem";

@injectable()
class Utils implements IUtils {
  private readonly _fileSystem: IFileSystem;

  constructor(@inject(types.FileSystem) fileSystem: IFileSystem) {
    this._fileSystem = fileSystem;
  }

  public UpdateTime(): void {
    const currentDate = new Date();
    const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
    $("#current-date-time").text(
      currentDate.toDateString() + " " + currentTime
    );
  }

  public GenerateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random % 4) + 8;
      return value.toString(16);
    });
  }

  private async ReadFile(path: string): Promise<string> {
    return await this._fileSystem.OpenFile(path);
  }

  private async CheckShortCut(path: string): Promise<Path | boolean> {
    const tmp = document.createElement("html") as HTMLElement;
    tmp.innerHTML = await this.ReadFile(path);

    const isShortCut = tmp
      .querySelector("meta[name='exeLocation']")
      ?.getAttribute("content") as string;

    if (isShortCut) return isShortCut;

    return false;
  }

  public async GetAppProperties(
    appLocation: string
  ): Promise<ApplicationMetaData> {
    let appPath: string = appLocation;
    const isShortCut = await this.CheckShortCut(appLocation);
    if (isShortCut) appPath = isShortCut as string;

    const tmp = document.createElement("html") as HTMLElement;
    const fileContent = await this.ReadFile(appPath);
    tmp.innerHTML = fileContent.substring(0, fileContent.indexOf("</head>"));

    const results: ApplicationMetaDataObject = {
      applicationIdentifier: "",
      exeLocation: "",
      iconLocation: "",
      mimeTypes: [],
      title: "",
    };

    for (const value in ApplicationMetaDataFields) {
      if (isNaN(Number(value))) {
        results[value as ApplicationMetaDataFields] = tmp
          .querySelector(`meta[name='${value}']`)
          ?.getAttribute("content") as string;
      }
    }

    results.exeLocation = appPath;

    return results;
  }
}

export default Utils;
