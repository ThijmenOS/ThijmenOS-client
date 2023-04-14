import Memory from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { injectable } from "inversify";
import { ApplicationInstance } from "./interfaces/baseProcess";
import ProcessesShape from "./interfaces/processesShape";

@injectable()
class Processes implements ProcessesShape {
  private readonly _memory: Memory = javascriptOs.get<Memory>(types.Memory);

  private readonly _memoryProcessesKey = "Processes";

  public RegisterProcess = (newProcess: ApplicationInstance) => {
    let processes = this.LoadProcesses();

    processes
      ? processes.push(newProcess)
      : (processes = new Array(newProcess));

    this._memory.SaveToMemory<Array<ApplicationInstance>>(
      this._memoryProcessesKey,
      processes
    );
  };

  public FindProcess(processIdentifier: string): ApplicationInstance | null {
    const processes = this.LoadProcesses();

    if (!processes) return null;

    const targetProcess = processes.find(
      (x) => x.processIdentifier === processIdentifier
    );

    if (!targetProcess) return null;

    return targetProcess;
  }

  protected RemoveApplicationInstance = (processIdentifier: string) => {
    const processes = this.LoadProcesses();

    if (!processes) return;

    const targetIndex = processes.findIndex(
      (x) => x.processIdentifier === processIdentifier
    );

    processes.splice(targetIndex, 1);

    this._memory.SaveToMemory(this._memoryProcessesKey, processes);
  };

  private LoadProcesses(): Array<ApplicationInstance> | undefined {
    return this._memory.LoadFromMemory<Array<ApplicationInstance>>(
      this._memoryProcessesKey
    );
  }
}

export default Processes;
