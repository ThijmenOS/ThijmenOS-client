import { Location, IFileIcon } from "@interface/fileIcon";
import fileIcons from "./fileIcons";
import Utils from "@utils/utils";
import { appIcon } from "@static/dom-defaults";

import CreateWindow from "@app/window/CreateWindow";

import "jqueryui";

const registerdFileIcons = [];

class FileIcon implements IFileIcon {
  public readonly fileLocation: string;
  public iconLocation?: string;
  private readonly supportedMimeTypes: Array<string>;

  private iconContainerElement?: HTMLDivElement;
  private iconImageElement?: HTMLObjectElement;
  private iconTitleElement?: HTMLParagraphElement;

  private readonly appHash: string;
  private readonly initialIconLocation: Location;

  public title: string;

  constructor(fileLocation: string) {
    this.fileLocation = fileLocation;
    this.title = "";
    this.supportedMimeTypes = [];

    this.appHash = this.title + "-" + Utils.generateUUID();

    this.initialIconLocation = {
      left: 0,
      top: 0,
    };

    this.getFileConfig();
  }

  private async getFileConfig() {
    let targetFile: string = this.fileLocation.split("/").at(-1)!;
    let targetFileExtention: string = targetFile.split(".").at(-1)!;

    if (targetFileExtention != "thijm") {
      this.iconLocation =
        "./public/icons/file_type_" + fileIcons[targetFileExtention] + ".svg";

      this.title = targetFile;
    } else {
      let [appTitle, appIcon] = await Utils.getAppProperties(this.fileLocation);

      this.title = appTitle;
      this.iconLocation = appIcon;
    }

    this.InitIcon();
  }

  private InitIcon() {
    this.iconContainerElement = Utils.createElementFromHTML(appIcon);

    this.iconImageElement = this.iconContainerElement.querySelector(
      ".javascript-os-file-icon"
    )!;
    this.iconTitleElement =
      this.iconContainerElement.querySelector("#file-icon-title")!;

    this.iconContainerElement.setAttribute("data-id", this.appHash);

    this.Render();
    this.InitBehaviour();
  }

  private InitBehaviour() {
    const openFile = (ev: Event) => this.OpenFile(ev, this);

    if (!this.iconContainerElement)
      throw new Error("Icon container element not found");

    this.iconContainerElement.addEventListener("dblclick", openFile);

    this.InitMovement();
  }
  private InitMovement() {
    if (!this.iconContainerElement)
      throw new Error("Icon container element not found");

    let dataId = this.iconContainerElement.getAttribute("data-id");

    jQuery(`[data-id="${dataId}"]`).draggable({
      containment: "parent",
    });
  }

  // #detectRaster(element) {
  //   let left = element.$element.getBoundingClientRect().left;
  //   let top = element.$element.getBoundingClientRect().top;

  //   this.leftBound = Math.round(left / 100) * 100;
  //   this.topBound = Math.round(top / 100) * 100;
  // }
  // #placeInRaster(element) {
  //   registerdFileIcons.forEach((icon) => {
  //     if (
  //       this.leftBound === icon.leftBound &&
  //       this.topBound === icon.topBound
  //     ) {
  //       element.style.left = this.initalLocation.left + "px";
  //       element.style.top = this.initalLocation.top + "px";
  //     }
  //   });

  //   element.$element.style.left = this.leftBound + "px";
  //   element.$element.style.top = this.topBound + "px";

  //   this.initalLocation.left = leftBound;
  //   this.initalLocation.top = topBound;
  // }

  private Render() {
    this.iconImageElement!.data =
      this.iconLocation || "./public/icons/default-app-icon.svg";
    this.iconTitleElement!.innerHTML = this.title;

    document!
      .getElementById("main-application-container")!
      .appendChild(this.iconContainerElement!);

    registerdFileIcons.push(this);
    this.initialIconLocation.left =
      this.iconContainerElement!.getBoundingClientRect().left;
    this.initialIconLocation.top =
      this.iconContainerElement!.getBoundingClientRect().top;
  }

  private OpenFile(_ev: Event, icon: FileIcon) {
    new CreateWindow().application(icon).then((e) => e.initWindow());
  }
  public Destory() {
    this.iconContainerElement!.remove();
  }
}

export default FileIcon;
