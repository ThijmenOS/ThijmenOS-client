/* eslint-disable consistent-return */
import Memory from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { injectable } from "inversify";
import { ApplicationInstance } from "./processes/baseProcess";
import ProcessesShape from "./interfaces/processesShape";
import WorkerProcess from "./processes/workerProcess";
import GenerateUUID from "@utils/generateUUID";
import { processkey } from "@ostypes/memoryKeys";
import Exit from "@providers/error/systemErrors/Exit";
import ProcessNotFound from "./errors/ProcessNotFound";
import FatalError from "@providers/error/userErrors/fatalError";
import { OSErrors } from "@providers/error/defaults/errors";

/**
 * Do not store the child object in the process object but save a reference to the parent on the child.
 * Then then the child exits you can just kill it and send a message to the parent
 * And then the parent exits you can also just kull it and send a message to the child.
 * Then it is up to them what to do with the exit
 */

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

  public FindProcess(pid: string): ApplicationInstance | Exit {
    const processes = this.LoadProcesses();

    if (!processes)
      throw new FatalError(
        "Processes could not be loaded from memory",
        OSErrors.couldNotLoadProcesses
      );

    const targetProcess = this.RecursiveFindProcess(processes, pid);

    if (!targetProcess) return new ProcessNotFound();

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

  private RecursiveFindParentProcess(
    processes: Array<ApplicationInstance>,
    pid: string,
    depth: number
  ): { process: ApplicationInstance; depth: number } | undefined {
    if (!processes) return;

    for (let i = 0; i < processes.length; i++) {
      const childs = processes[i]._childProcesses;
      if (!childs) return;

      const childFound = childs.some(
        (child) => child.processIdentifier === pid
      );
      if (childFound)
        return {
          process: processes[i],
          depth: depth,
        };
      else this.RecursiveFindParentProcess(childs, pid, depth++);
    }

    return;
  }

  public RemoveProcess(pid: string): Exit {
    const processes = this.LoadProcesses();

    if (!processes)
      throw new FatalError(
        "Processes could not be loaded from memory",
        OSErrors.couldNotLoadProcesses
      );

    const result = this.RecursiveFindParentProcess(processes, pid, 0);

    if (!result) return new Exit(-1);

    if (result.depth === 0) {
      const targetIndex = processes.findIndex(
        (process) => process.processIdentifier === pid
      );
      if (targetIndex < 0) return new Exit(-1);
      processes.splice(targetIndex, 1);
    } else {
      const targetIndex = result.process._childProcesses?.findIndex(
        (process) => process.processIdentifier === pid
      );

      if (targetIndex === undefined || targetIndex < 0) return new Exit(-1);
      result.process._childProcesses?.splice(targetIndex, 1);
    }

    console.log(processes);

    this._memory.SaveToMemory(this._pid, processkey, processes);

    return new Exit();
  }

  private LoadProcesses(): Array<ApplicationInstance> | null {
    const result = this._memory.LoadFromMemory<Array<WorkerProcess>>(
      this._pid,
      processkey
    );

    if (result instanceof Exit) throw new Error(result.data);

    return result;
  }
}

export default Processes;
