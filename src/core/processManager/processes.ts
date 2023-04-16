/* eslint-disable consistent-return */
import Memory from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { injectable } from "inversify";
import { ApplicationInstance } from "./interfaces/baseProcess";
import ProcessesShape from "./interfaces/processesShape";
import WorkerProcess from "./processes/workerProcess";
import GenerateUUID from "@utils/generateUUID";
import { processkey } from "@ostypes/memoryKeys";
import { ErrorExit } from "@providers/error/systemErrors/systemError";

@injectable()
class Processes implements ProcessesShape {
  private readonly _memory: Memory = javascriptOs.get<Memory>(types.Memory);

  private readonly _pid: string = GenerateUUID();

  constructor() {
    this._memory.AllocateMemory(this._pid, processkey, []);
  }

  public RegisterProcess = (newProcess: ApplicationInstance) => {
    let processes = this.LoadProcesses();

    processes
      ? processes.push(newProcess)
      : (processes = new Array(newProcess));

    this._memory.SaveToMemory<Array<ApplicationInstance>>(
      this._pid,
      processkey,
      processes
    );
  };

  public FindProcess(processIdentifier: string): ApplicationInstance | null {
    const processes = this.LoadProcesses();

    if (!processes) return null;

    const targetProcess = this.RecursiveFindProcess(
      processes,
      processIdentifier
    );

    if (!targetProcess) return null;

    return targetProcess;
  }

  private RecursiveFindProcess(
    processes: Array<ApplicationInstance>,
    pid: string
  ): ApplicationInstance | undefined {
    if (!processes) return;

    for (let i = 0; i < processes.length; i++) {
      if (processes[i].processIdentifier === pid) {
        return processes[i];
      }

      const childs = processes[i]._childProcesses;
      if (childs) {
        const found = this.RecursiveFindProcess(childs, pid);
        if (found) return found;
      }
    }

    return;
  }

  protected RemoveApplicationInstance = (processIdentifier: string) => {
    const processes = this.LoadProcesses();

    if (!processes) return;

    const targetIndex = processes.findIndex(
      (x) => x.processIdentifier === processIdentifier
    );

    processes.splice(targetIndex, 1);

    this._memory.SaveToMemory(this._pid, processkey, processes);
  };

  private LoadProcesses(): Array<ApplicationInstance> | null {
    const processes = this._memory.LoadFromMemory<Array<WorkerProcess>>(
      this._pid,
      processkey
    );

    if (processes instanceof ErrorExit) throw new Error();

    return processes;
  }
}

export default Processes;
