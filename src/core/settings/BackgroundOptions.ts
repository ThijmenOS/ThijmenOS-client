import { Path, host } from "@thijmenos/common";
import { ChangeBackground, GetBackground } from "@thijmenos/filesystem";
import { IBackgroundOptions } from "./IBackgroundOptions";
import { injectable } from "inversify";

@injectable()
class BackgroundOptions implements IBackgroundOptions {
  private backgroundPath?: Path;

  public async Change(filePath: string): Promise<void> {
    this.backgroundPath = await ChangeBackground(filePath);

    this.Set();
  }
  public async Get(): Promise<void> {
    this.backgroundPath = await GetBackground();

    this.Set();
  }
  private async Set(): Promise<void> {
    const backgroundElement = document.querySelector("body")!;
    backgroundElement.style.backgroundImage = `url("${host}/static/${this.backgroundPath}")`;
  }
}

export default BackgroundOptions;
