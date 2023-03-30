import Processes from "@core/processManager/processes";
import WindowProcess from "@core/processManager/processes/windowProcess";
import javascriptOs from "@inversify/inversify.config";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import types from "@ostypes/types";
import CreateWindow from "@providers/gui/applicationWindow/createApplicationWindow";
import createApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/createApplicationWindowMethodShape";
import Communication from "../application/communication";

class SpawnWindow extends Processes implements ICommand {
  private readonly _window: CreateWindow =
    javascriptOs.get<createApplicationWindowMethodShape>(types.CreateWindow);

  private guiPath: string;
  private args?: string;

  constructor(props: { guiPath: string; args?: string }) {
    super();

    this.guiPath = props.guiPath;
    this.args = props.args;
  }

  public Handle(): CommandReturn<string> {
    //Op basis van exe pad  het process starten en runnen.
    const iframe = this.InitialiseProcess(this.guiPath);
    this.RegisterProcess(iframe);

    if (this.args) {
      new Communication({
        data: this.args,
        eventName: EventName.StartedApplication,
        worker: iframe,
      }).Handle();
    }

    return new CommandReturn(
      iframe.processIdentifier,
      EventName.WindowLaunched
    );
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
