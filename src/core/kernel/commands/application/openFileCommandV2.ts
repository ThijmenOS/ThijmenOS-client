/* eslint-disable @typescript-eslint/ban-types */
import types from "@ostypes/types";
import ApplicationManager from "@core/applicationManager/applicationManagerMethods";
import { OpenFileType } from "@core/kernel/models/fileMetadata";
import Settings from "@core/settings/settingsMethodShape";
import NoAppForFiletypeError from "@providers/error/userErrors/noApplicationForFiletypeError";
import StartProcess from "../processes/startProcess";
import SelectAppPrompt from "@providers/dialog/selectApp";
import { ApplicationMetaData, MimeTypes } from "@thijmen-os/common";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { inject, injectable } from "inversify";
import { IRequest, IRequestHandler, requestHandler } from "mediatr-ts";

class ICommand {
  process: BaseProcess;

  constructor(process: BaseProcess) {
    this.process = process;
  }
}

class OpenFileCommand extends ICommand implements IRequest<void> {
  mimeType: MimeTypes;
  filePath: string;

  constructor(mimeType: MimeTypes, filePath: string, baseProcess: BaseProcess) {
    super(baseProcess);

    this.mimeType = mimeType;
    this.filePath = filePath;
  }
}

@requestHandler(OpenFileCommand)
@injectable()
class OpenFileCommandHandler implements IRequestHandler<OpenFileCommand, void> {
  private readonly _applicationManager: ApplicationManager;
  private readonly _settings: Settings;

  constructor(
    @inject(types.AppManager) applicationManager: ApplicationManager,
    @inject(types.Settings) settings: Settings
  ) {
    if (!applicationManager || !settings) throw new Error();

    this._applicationManager = applicationManager;
    this._settings = settings;
  }

  async handle(command: OpenFileCommand): Promise<void> {
    console.log("handling!!");
    const defaultAppToOpen = this._settings.DefaultApplication(
      command.mimeType
    );
    if (!defaultAppToOpen) {
      this.OpenFileWithApplication({
        filePath: command.filePath,
        mimeType: command.mimeType,
      });
      return;
    }

    await new StartProcess({
      exePath: defaultAppToOpen.exeLocation,
      args: command.filePath,
    }).Handle();
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
        args: file.filePath,
      }).Handle();
    });
  }
}

export { OpenFileCommandHandler, OpenFileCommand };
