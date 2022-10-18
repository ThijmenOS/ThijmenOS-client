import $ from "jquery";

import Utils from "@utils/utils";
import Kernel from "@core/kernel";
import FileSystem from "@core/fileSystem";
import FileIcon from "@app/file-icon/fileIcon";

interface StartupOptions {}

class Startup {
  private readonly _fileSystem: FileSystem;
  constructor(options: StartupOptions) {
    this._fileSystem = new FileSystem();
  }

  InitialiseOperatingSystem() {
    new Kernel();
    Utils.updateTime();

    this.showFilesOnDesktop();

    onresize = () => {
      let pageWidth = window.innerWidth;
      $("#display-too-small").css(
        "display",
        pageWidth >= 1000 ? "none" : "block"
      );
    };
    setInterval(() => {
      Utils.updateTime();
    }, 1000);
  }

  private async showFilesOnDesktop() {
    this._fileSystem.showFilesInDir("C/Desktop").then((res: Array<string>) => {
      Array.from(res).forEach((file) => {
        new FileIcon(file);
      });
    });
  }
}

export default Startup;
