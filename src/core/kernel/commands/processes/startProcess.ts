import { ApplicationInstance } from "@core/processManager/interfaces/baseProcess";
import Processes from "@core/processManager/processes";
import WorkerProcess from "@core/processManager/processes/workerProcess";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import { host } from "@thijmen-os/common";
import GenerateUUID from "@utils/generateUUID";

class StartProcess extends Processes implements ICommand {
  private readonly _exePath: string;

  constructor(exePath: string) {
    super();

    this._exePath = exePath;
  }

  public Handle(): CommandReturn<ApplicationInstance<Worker>> {
    //Op basis van exe pad  het process starten en runnen.
    const applicationInstance = this.InitialiseProcess(this._exePath);
    this.RegisterProcess(applicationInstance);

    return new CommandReturn<ApplicationInstance<Worker>>(
      applicationInstance,
      EventName.StartedApplication
    );
  }

  private InitialiseProcess(
    executionLocation: string
  ): ApplicationInstance<Worker> {
    const blob = new Blob(
      [`importScripts('${host}/static/${executionLocation}');`],
      {
        type: "application/javascript",
      }
    );
    const url = URL.createObjectURL(blob);

    const process = new WorkerProcess({
      processIdentifier: GenerateUUID(),
      origin: new Worker(url),
    });

    process.AddEventListener();

    return process;
  }
}

export default StartProcess;
