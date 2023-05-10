/* eslint-disable consistent-return */
import Memory from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { injectable } from "inversify";
import ProcessesShape from "./interfaces/processesShape";
import { ipcKey, processkey } from "@ostypes/memoryKeys";
import Exit from "@providers/error/systemErrors/Exit";
import ProcessNotFound from "./errors/ProcessNotFound";
import FatalError from "@providers/error/userErrors/fatalError";
import { OSErrors } from "@providers/error/defaults/errors";
import { GenerateId } from "@utils/generatePid";
import { BaseProcess } from "./processes/baseProcess";
import MessageBus from "./ipc/messageBus";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import Thread from "./processes/thread";

/**
 * Do not store the child object in the process object but save a reference to the parent on the child.
 * Then then the child exits you can just kill it and send a message to the parent
 * And then the parent exits you can also just kull it and send a message to the child.
 * Then it is up to them what to do with the exit
 */

@injectable()
class Processes implements ProcessesShape {
  private readonly _memory: Memory = javascriptOs.get<Memory>(types.Memory);

  private readonly _pid: number;

  constructor() {
    this._pid = GenerateId();
    this._memory.AllocateMemory(this._pid, processkey, []);
    this._memory.AllocateMemory(this._pid, ipcKey, []);
  }

  public RegisterProcess = (process: BaseProcess) => {
    let processes = this.LoadProcesses();

    processes ? processes.push(process) : (processes = new Array(process));

    this._memory.SaveToMemory<Array<BaseProcess>>(
      this._pid,
      processkey,
      processes
    );
  };

  public FindProcess(pid: number): BaseProcess | Exit {
    const processes = this.LoadProcesses();

    if (!processes)
      throw new FatalError(
        "Processes could not be loaded from memory",
        OSErrors.couldNotLoadProcesses
      );

    const targetProcess = processes.find((process) => process.pid === pid);

    if (!targetProcess) return new ProcessNotFound();

    return targetProcess;
  }

  public RemoveProcess(pid: number): Exit {
    const processes = this.LoadProcesses();

    if (!processes)
      throw new FatalError(
        "Processes could not be loaded from memory",
        OSErrors.couldNotLoadProcesses
      );

    const result = processes.findIndex((process) => process.pid === pid);

    if (result < 0) return new Exit(-1);

    processes.splice(result, 1);

    this._memory.SaveToMemory(this._pid, processkey, processes);

    return new Exit();
  }

  public CreateMessageBus(
    ownerPid: number,
    receivingPid: number,
    bufferSize?: number
  ): Exit {
    let messageBusses = this.LoadMessageBusses();

    if (messageBusses?.find((bus) => bus.receivingPid === receivingPid))
      return new Exit(-1);

    const messageBus = new MessageBus(ownerPid, receivingPid, bufferSize);

    messageBusses
      ? messageBusses.push(messageBus)
      : (messageBusses = new Array<MessageBus>(messageBus));

    const saved = this._memory.SaveToMemory(this._pid, ipcKey, messageBusses);

    return saved;
  }

  public FindMessageBus(
    ownerPid: number,
    receivingPid: number
  ): MessageBus | Exit {
    const messageBusses = this.LoadMessageBusses();

    if (!messageBusses) return new Exit(-1);

    const messageBus = messageBusses.find(
      (bus) => bus.ownerPid === ownerPid && bus.receivingPid === receivingPid
    );
    if (!messageBus) return new Exit(-1);

    return messageBus;
  }

  public GetAllProcesses(): BaseProcess[] {
    const processes = this.LoadProcesses();

    if (!processes) return new Array<BaseProcess>();
    return processes;
  }

  private LoadMessageBusses(): Array<MessageBus> | null {
    const result = this._memory.LoadFromMemory<Array<MessageBus>>(
      this._pid,
      ipcKey
    );

    if (result instanceof Exit) throw new Error(result.data);

    return result;
  }

  private LoadProcesses(): Array<BaseProcess> | null {
    const result = this._memory.LoadFromMemory<Array<BaseProcess>>(
      this._pid,
      processkey
    );

    if (result instanceof Exit) throw new Error(result.data);

    return result;
  }
}

export default Processes;
