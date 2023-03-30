import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import ApplicationManager from "@core/applicationManager/applicationManagerMethods";
import { EventName } from "@ostypes/ProcessTypes";
import { OpenFileType } from "@core/kernel/models/fileMetadata";
import Settings from "@core/settings/settingsMethodShape";
import NoAppForFiletypeError from "@providers/error/errors/noApplicationForFiletypeError";
import StartProcess from "../processes/startProcess";
import SelectAppPrompt from "@providers/dialog/selectApp";
import Communication from "./communication";
import { ApplicationMetaData } from "@thijmen-os/common";

class OpenFileCommand implements ICommand {
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);
  private readonly _settings: Settings = javascriptOs.get<Settings>(
    types.Settings
  );

  private readonly props: OpenFileType;

  constructor(props: OpenFileType) {
    this.props = props;
  }

  async Handle(): Promise<CommandReturn<boolean>> {
    const DefaultAppToOpen = this._settings.DefaultApplication(
      this.props.mimeType
    );

    if (!DefaultAppToOpen) {
      this.OpenFileWithApplication(this.props);
    }

    const worker = new StartProcess(DefaultAppToOpen!.exeLocation).Handle();
    new Communication<string>({
      data: this.props.filePath,
      eventName: EventName.OpenFile,
      worker: worker.data,
    }).Handle();

    return new CommandReturn<boolean>(true, EventName.OpenFile);
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
      const worker = new StartProcess(application.exeLocation).Handle();
      new Communication<string>({
        data: file.filePath,
        eventName: EventName.OpenFile,
        worker: worker.data,
      }).Handle();
    });
  }
}

export default OpenFileCommand;
