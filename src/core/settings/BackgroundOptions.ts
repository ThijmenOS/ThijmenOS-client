import { Path } from "javascriptOS-common/types";
import { config } from "javascriptos-common/config";
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import { IBackgroundOptions } from "@ostypes/Settings";
import types from "@ostypes/types";
import { inject, injectable } from "inversify";

@injectable()
class BackgroundOptions implements IBackgroundOptions {
  private readonly _filesystem: IFileSystem;
  private backgroundPath?: Path;

  constructor(@inject(types.FileSystem) filesystem: IFileSystem) {
    this._filesystem = filesystem;
  }

  public async Change(filePath: string): Promise<void> {
    this.backgroundPath = await this._filesystem.ChangeBackground(filePath);

    this.Set();
  }
  public async Get(): Promise<void> {
    this.backgroundPath = await this._filesystem.GetBackground();

    this.Set();
  }
  private async Set(): Promise<void> {
    const backgroundElement = document.querySelector("body")!;
    backgroundElement.style.backgroundImage = `url("${config.host}/static/${this.backgroundPath}")`;
  }
}

export default BackgroundOptions;
