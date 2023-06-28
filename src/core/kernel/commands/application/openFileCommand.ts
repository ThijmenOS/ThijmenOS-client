import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import ApplicationManager from "@core/applicationManager/applicationManagerMethods";
import { OpenFileType } from "@core/kernel/models/fileMetadata";
import Settings from "@core/settings/settingsMethodShape";
import NoAppForFiletypeError from "@providers/error/userErrors/noApplicationForFiletypeError";
import StartProcess from "../processes/startProcess";
import SelectAppPrompt from "@providers/dialog/selectApp";
import { ApplicationMetaData } from "@thijmen-os/common";
import KernelMethodShape from "@core/kernel/kernelMethodShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

class OpenFileCommand implements ICommand {
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);
  private readonly _settings: Settings = javascriptOs.get<Settings>(
    types.Settings
  );
  private readonly _kernel: KernelMethodShape =
    javascriptOs.get<KernelMethodShape>(types.Kernel);

  private readonly _props: OpenFileType;

  constructor(props: OpenFileType) {
    this._props = props;
  }

  public async Handle(process: BaseProcess): Promise<void> {
    const defaultAppToOpen = this._settings.DefaultApplication(
      this._props.mimeType
    );
    if (!defaultAppToOpen) {
      this.OpenFileWithApplication(this._props);
      return;
    }

    this._kernel.ProcessCommand(
      new StartProcess({
        exePath: defaultAppToOpen.exeLocation,
        args: this._props.filePath,
      }),
      process
    );
  }

  private async OpenFileWithApplication(file: OpenFileType) {
    const installedAppsWithDesiredMimetype =
      this._applicationManager.FindInstalledAppsWithMimetype(file.mimeType);

    const resultTitles = installedAppsWithDesiredMimetype.map(
      (a: ApplicationMetaData) => a.name
    );

    if (!resultTitles.length) {
      new NoAppForFiletypeError(
        `No application found for filetype ${file.mimeType}`
      );
    }

    new SelectAppPrompt(resultTitles, async (selectedApp: string) => {
      const application = installedAppsWithDesiredMimetype.find(
        (app: ApplicationMetaData) => app.name === selectedApp
      )!;
      await new StartProcess({
        exePath: application.exeLocation,
        args: this._props.filePath,
      }).Handle();
    });
  }
}

export default OpenFileCommand;
