import Processes from "@core/processManager/processes";
import WindowProcess from "@core/processManager/processes/windowProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import CreateWindow from "@providers/gui/applicationWindow/createApplicationWindow";
import createApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/createApplicationWindowMethodShape";

class SpawnWindow extends Processes implements ICommand {
  private readonly _window: CreateWindow =
    javascriptOs.get<createApplicationWindowMethodShape>(types.CreateWindow);

  private guiPath: string;

  constructor(guiPath: string) {
    super();

    this.guiPath = guiPath;
  }

  public async Handle() {
    //Op basis van exe pad  het process starten en runnen.
    this.RegisterProcess(this.InitialiseProcess(this.guiPath));
  }

  private InitialiseProcess(executionLocation: string): WindowProcess {
    const applicationWindow = this._window.Application(executionLocation);

    //TODO: App crash
    if (!applicationWindow.windowContent.contentWindow) throw new Error();

    const process = new WindowProcess(
      {
        processIdentifier: applicationWindow.windowOptions.windowIdentifier,
        origin: applicationWindow.windowContent.contentWindow,
      },
      applicationWindow
    );

    process.AddEventListener();

    return process;
  }
}

export default SpawnWindow;
