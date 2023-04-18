import WindowProcess from "@core/processManager/processes/windowProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import createApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/createApplicationWindowMethodShape";
import { ApplicationInstance } from "@core/processManager/processes/baseProcess";
import ProcessCrashed from "./errors/processCrashed";
import Exit from "@providers/error/systemErrors/Exit";

class SpawnWindow implements ICommand {
  private readonly _window =
    javascriptOs.get<createApplicationWindowMethodShape>(types.CreateWindow);

  private _guiPath: string;
  private _args?: string;

  constructor(props: { guiPath: string; args?: string }) {
    this._guiPath = props.guiPath;
    this._args = props.args;
  }

  public async Handle(process?: ApplicationInstance): Promise<Exit> {
    //Op basis van exe pad  het process starten en runnen.
    const iframe = await this.InitialiseProcess(this._guiPath);

    if (process) {
      process.AddChildProcess(iframe);

      return new Exit();
    }

    return new Exit();
  }

  private async InitialiseProcess(
    executionLocation: string
  ): Promise<WindowProcess> {
    const applicationWindow = await this._window.Window(executionLocation);

    if (!applicationWindow.windowContent.contentWindow)
      throw new ProcessCrashed();

    const process = new WindowProcess({
      processIdentifier: applicationWindow.windowOptions.windowIdentifier,
      origin: applicationWindow.windowContent.contentWindow,
      applicationWindow: applicationWindow,
    });

    process.AddEventListener();

    process.Startup(this._args);

    return process;
  }
}

export default SpawnWindow;
