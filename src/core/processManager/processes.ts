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
import Exit from "@providers/error/systemErrors/Exit";

@injectable()
class Processes implements ProcessesShape {
  private readonly _memory: Memory = javascriptOs.get<Memory>(types.Memory);

  private readonly _pid: string;

  constructor() {
    this._pid = GenerateUUID();
    this._memory.AllocateMemory(this._pid, processkey, []);
  }

  public RegisterProcess = (process: ApplicationInstance) => {
    let processes = this.LoadProcesses();

    processes ? processes.push(process) : (processes = new Array(process));

    this._memory.SaveToMemory<Array<ApplicationInstance>>(
      this._pid,
      processkey,
      processes
    );
  };

  public FindProcess(pid: string): ApplicationInstance | null {
    const processes = this.LoadProcesses();

    if (!processes) return null;

    const targetProcess = this.RecursiveFindProcess(processes, pid);

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

  public RemoveProcess(pid: string): void {
    const processes = this.LoadProcesses();

    if (!processes) return;

    const targetIndex = processes.findIndex((x) => x.processIdentifier === pid);

    processes.splice(targetIndex, 1);

    this._memory.SaveToMemory(this._pid, processkey, processes);
  }

  private LoadProcesses(): Array<ApplicationInstance> | null {
    const result = this._memory.LoadFromMemory<Array<WorkerProcess>>(
      this._pid,
      processkey
    );

    if (result instanceof Exit) throw new Error(result.event);

    return result;
  }
}

export default Processes;
