import { Properties, PropertiesObject } from "@interface/applicationProperties";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import { Path } from "@interface/kernel/kernelTypes";
import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";
import { inject, injectable } from "inversify";

@injectable()
class Utils implements IUtils {
  private readonly _fileSystem: IFileSystem;

  constructor(@inject(types.FileSystem) fileSystem: IFileSystem) {
    this._fileSystem = fileSystem;
  }
  public CreateElementFromHTML(htmlString: string): HTMLDivElement {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild as HTMLDivElement;
  }

  public UpdateTime(): void {
    let currentDate = new Date();
    let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
    $("#current-date-time").text(
      currentDate.toDateString() + " " + currentTime
    );
  }

  public GenerateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      let random = (Math.random() * 16) | 0;
      let value = char === "x" ? random : (random % 4) + 8;
      return value.toString(16);
    });
  }

  private async ReadFile(path: string): Promise<string> {
    return await this._fileSystem.OpenFile(path);
  }

  private async CheckShortCut(path: string): Promise<Path | boolean> {
    let tmp = document.createElement("html") as HTMLElement;
    tmp.innerHTML = await this.ReadFile(path);

    let isShortCut = tmp
      .querySelector(`meta[name='exeLocation']`)
      ?.getAttribute("content") as string;

    if (isShortCut) return isShortCut;

    return false;
  }

  public async GetAppProperties(
    appLocation: string
  ): Promise<PropertiesObject> {
    let appPath: string = appLocation;
    let isShortCut = await this.CheckShortCut(appLocation);
    if (isShortCut) appPath = isShortCut as string;

    let tmp = document.createElement("html") as HTMLElement;
    tmp.innerHTML = await this.ReadFile(appPath);

    let results: PropertiesObject = {
      exeLocation: "",
      iconLocation: "",
      mimeTypes: [],
      title: "",
    };

    for (const value in Properties) {
      if (isNaN(Number(value))) {
        results[value as Properties] = tmp
          .querySelector(`meta[name='${value}']`)
          ?.getAttribute("content") as string;
      }
    }

    results.exeLocation = appPath;

    return results;
  }

  public WaitForElm(selector: string): Promise<HTMLElement> {
    return new Promise((resolve) => {
      if (document.getElementById(selector)) {
        return resolve(document.getElementById(selector) as HTMLElement);
      }

      const observer = new MutationObserver(() => {
        if (document.getElementById(selector)) {
          resolve(document.getElementById(selector) as HTMLElement);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
}

export default Utils;
