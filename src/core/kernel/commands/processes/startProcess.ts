import { ApplicationInstance } from "@core/processManager/processes/baseProcess";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import WorkerProcess from "@core/processManager/processes/workerProcess";
import javascriptOs from "@inversify/inversify.config";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import ProcessConstructorMethods from "@providers/gui/applicationWindow/interfaces/createApplicationWindowMethodShape";
import GenerateUUID from "@utils/generateUUID";
import ProcessCrashed from "./errors/processCrashed";
import Exit from "@providers/error/systemErrors/Exit";

//TODO: Provide functionality to give process args list file open path and such
class StartProcess implements ICommand {
  private readonly _processConstructor =
    javascriptOs.get<ProcessConstructorMethods>(types.CreateWindow);
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private readonly _exePath: string;
  private readonly _args?: string;

  constructor(args: { exePath: string; args?: string }) {
    this._exePath = args.exePath;
    this._args = args.args;
  }

  public async Handle(
    process?: ApplicationInstance
  ): Promise<Exit<ApplicationInstance>> {
    //Op basis van exe pad  het process starten en runnen.
    const applicationInstance = await this.InitialiseProcess(this._exePath);

    const commandReturn = new CommandReturn(applicationInstance);

    if (process) {
      process.AddChildProcess(applicationInstance);

      return commandReturn;
    }

    this._processes.RegisterProcess(applicationInstance);

    return new Exit();
  }

  private async InitialiseProcess(
    executionLocation: string
  ): Promise<WorkerProcess> {
    const pid = GenerateUUID();
    const element = await this._processConstructor.Process(
      executionLocation,
      pid
    );
    document.getElementById("main-application-container")!.appendChild(element);

    if (!element.contentWindow) throw new ProcessCrashed();

    const process = new WorkerProcess({
      processIdentifier: pid,
      iframeElement: element,
      origin: element.contentWindow,
    });

    process.AddEventListener();

    process.Startup(this._args);

    return process;
  }
}

export default StartProcess;
