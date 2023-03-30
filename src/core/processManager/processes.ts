import Memory from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { injectable } from "inversify";
import { ApplicationInstance } from "./interfaces/baseProcess";
import ProcessesShape from "./interfaces/processesShape";

@injectable()
class Processes implements ProcessesShape {
  private readonly _memory: Memory = javascriptOs.get<Memory>(types.Memory);

  private readonly MemoryProcessesKey = "Processes";

  public RegisterProcess = (newProcess: ApplicationInstance) => {
    let processes = this.loadProcesses();

    processes
      ? processes.push(newProcess)
      : (processes = new Array(newProcess));

    this._memory.SaveToMemory<Array<ApplicationInstance>>(
      this.MemoryProcessesKey,
      processes
    );
  };

  public FindProcess(processIdentifier: string): ApplicationInstance | null {
    const processes = this.loadProcesses();

    if (!processes) return null;

    const targetProcess = processes.find(
      (x) => x.processIdentifier === processIdentifier
    );

    if (!targetProcess) return null;

    return targetProcess;
  }

  protected RemoveApplicationInstance = (processIdentifier: string) => {
    const processes = this.loadProcesses();

    if (!processes) return;

    const targetIndex = processes.findIndex(
      (x) => x.processIdentifier === processIdentifier
    );

    processes.splice(targetIndex, 1);

    this._memory.SaveToMemory(this.MemoryProcessesKey, processes);
  };

  private loadProcesses(): Array<ApplicationInstance> | null {
    return this._memory.LoadFromMemory<Array<ApplicationInstance>>(
      this.MemoryProcessesKey
    );
  }
}

export default Processes;
