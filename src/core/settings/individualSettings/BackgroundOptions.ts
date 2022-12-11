import { Path, host } from "@thijmen-os/common";
import backgroundSettingsMethodShape from "./backgroundSettingsMethodShape";
import { injectable } from "inversify";
import {
  ChangeBackground,
  GetBackground,
} from "@providers/filesystemEndpoints/settings";

@injectable()
class BackgroundSettings implements backgroundSettingsMethodShape {
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

export default BackgroundSettings;
