import { ApplicationInstance } from "@core/processManager/interfaces/baseProcess";
import Processes from "@core/processManager/processes";
import WorkerProcess from "@core/processManager/processes/workerProcess";
import { ICommand } from "@ostypes/CommandTypes";
import { host } from "@thijmen-os/common";
import GenerateUUID from "@utils/generateUUID";

class StartProcess extends Processes implements ICommand {
  private exePath: string;

  constructor(exePath: string) {
    super();

    this.exePath = exePath;
  }

  public async Handle() {
    //Op basis van exe pad  het process starten en runnen.
    this.RegisterProcess(this.InitialiseProcess(this.exePath));
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
