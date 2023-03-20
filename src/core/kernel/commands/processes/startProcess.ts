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

  public async Handle() {
    //Op basis van exe pad  het process starten en runnen.
    // this.RegisterProcess(this.InitialiseProcess(this.exePath));

    const blob = new Blob(
      [
        "importScripts('" +
          "http://localhost:8080/static/C/ProgramFiles/testProgram/test23.js" +
          "');",
      ],
      { type: "application/javascript" }
    );
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    worker.postMessage("hello worker!");

    worker.addEventListener(
      "message",
      function (e) {
        console.log("Worker said: ", e.data);
      },
      false
    );
  }

  private InitialiseProcess(executionLocation: string): WindowProcess {
    const applicationWindow = this._window.Application(executionLocation);

    return new WindowProcess(
      {
        processIdentifier: applicationWindow.windowOptions.windowIdentifier,
      },
      applicationWindow
    );
  }
}

export default StartProcess;
