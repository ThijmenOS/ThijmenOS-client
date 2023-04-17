import {
  ApplicationInstance,
  Process,
} from "@core/processManager/interfaces/baseProcess";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import WorkerProcess from "@core/processManager/processes/workerProcess";
import javascriptOs from "@inversify/inversify.config";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import types from "@ostypes/types";
import { host } from "@thijmen-os/common";
import GenerateUUID from "@utils/generateUUID";

class StartProcess implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private readonly _exePath: string;

  constructor(exePath: string) {
    this._exePath = exePath;
  }

  public Handle(process?: Process): CommandReturn<ApplicationInstance<Worker>> {
    //Op basis van exe pad  het process starten en runnen.
    const applicationInstance = this.InitialiseProcess(this._exePath);

    if (process && process instanceof WorkerProcess) {
      process.AddChildProcess(applicationInstance);

      return new CommandReturn<ApplicationInstance<Worker>>(
        applicationInstance,
        EventName.StartedApplication
      );
    }

    this._processes.RegisterProcess(applicationInstance);

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
