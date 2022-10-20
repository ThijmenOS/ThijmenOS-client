import {
  ApplicationMetaData,
  ApplicationMetaDataFields,
  ApplicationMetaDataObject,
} from "@interface/application/applicationProperties";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import { Path } from "@interface/kernel/kernelTypes";
import types from "@interface/types";
import { ClassOperation, IUtils } from "@interface/utils/utils";
import { inject, injectable } from "inversify";

@injectable()
class Utils implements IUtils {
  private readonly _fileSystem: IFileSystem;

  constructor(@inject(types.FileSystem) fileSystem: IFileSystem) {
    this._fileSystem = fileSystem;
  }
  public MainAppContainer: HTMLElement = document.getElementById(
    "main-application-container"
  )!;
  public CreateElementFromHTML<T>(htmlString: string): T {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild as T;
  }
  public GetElement<T>(element: HTMLElement, selector: string): T {
    return element.querySelector(selector) as T;
  }
  public AddElement(targetElement: HTMLElement, element: HTMLElement): void {
    targetElement.append(element);
  }
  public AddOrRemoveClass(
    targetElement: Array<HTMLElement>,
    classes: Array<string>,
    operation: ClassOperation
  ): void {
    if (Array.isArray(targetElement)) {
      targetElement.forEach((el) =>
        operation === ClassOperation.ADD
          ? el.classList.add(...classes)
          : el.classList.remove(...classes)
      );
      return;
    }
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
    tmp.innerHTML = await this.ReadFile(appPath);

    const results: ApplicationMetaDataObject = {
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

  public WaitForElm<T>(selector: string): Promise<T> {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      if (document.getElementById(selector)) {
        return resolve(document.getElementById(selector) as T);
      }

      const observer = new MutationObserver(() => {
        if (document.getElementById(selector)) {
          resolve(document.getElementById(selector) as T);
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
