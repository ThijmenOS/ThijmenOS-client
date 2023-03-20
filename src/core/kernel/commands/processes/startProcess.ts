import Processes from "@core/processManager/processes";
import WindowProcess from "@core/processManager/processes/windowProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import CreateWindow from "@providers/gui/applicationWindow/createApplicationWindow";
import createApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/createApplicationWindowMethodShape";

class StartProcess extends Processes implements ICommand {
  private readonly _window: CreateWindow =
    javascriptOs.get<createApplicationWindowMethodShape>(types.CreateWindow);

  private exePath: string;

  constructor(exePath: string) {
    super();

    this.exePath = exePath;
  }

  public Handle() {
    //Op basis van exe pad  het process starten en runnen.
    this.RegisterProcess(this.InitialiseProcess(this.exePath));
  }

  private InitialiseProcess(executionLocation: string): WindowProcess {
    const applicationWindow = this._window.Application(executionLocation);

    console.log(applicationWindow.windowOptions.windowIdentifier);

    return new WindowProcess(
      {
        processIdentifier: applicationWindow.windowOptions.windowIdentifier,
      },
      applicationWindow
    );
    //TODO: Application has to spawn its own window and its configurations
  }
}

export default StartProcess;
