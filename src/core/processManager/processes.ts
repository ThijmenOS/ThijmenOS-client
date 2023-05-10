/* eslint-disable consistent-return */
import Memory from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { injectable } from "inversify";
import ProcessesShape from "./interfaces/processesShape";
import { ipcKey, processkey } from "@ostypes/memoryKeys";
import FatalError from "@providers/error/userErrors/fatalError";
import { GenerateId } from "@utils/generatePid";
import { BaseProcess } from "./processes/baseProcess";
import MessageBus from "./ipc/messageBus";
import { errors, success } from "@core/kernel/commands/errors";

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

  public RegisterProcess = (process: BaseProcess): number => {
    let processes = this.LoadProcesses();

    if (typeof processes === "number") return errors.UnkownError;

    processes ? processes.push(process) : (processes = new Array(process));

    this._memory.SaveToMemory<Array<BaseProcess>>(
      this._pid,
      processkey,
      processes
    );

    return success;
  };

  public FindProcess(pid: number): BaseProcess | number {
    const processes = this.LoadProcesses();

    if (typeof processes === "number") {
      throw new FatalError(
        "Processes could not be loaded from memory",
        processes
      );
    }

    const targetProcess = processes.find((process) => process.pid === pid);

    if (!targetProcess) return errors.ProcessNotFound;

    return targetProcess;
  }

  public RemoveProcess(pid: number): number {
    const processes = this.LoadProcesses();

    if (typeof processes === "number")
      throw new FatalError(
        "Processes could not be loaded from memory",
        processes
      );

    const result = processes.findIndex((process) => process.pid === pid);

    if (result < 0) return errors.UnkownError;

    processes.splice(result, 1);

    this._memory.SaveToMemory(this._pid, processkey, processes);

    return success;
  }

  public CreateMessageBus(
    ownerPid: number,
    receivingPid: number,
    bufferSize?: number
  ): number {
    let messageBusses = this.LoadMessageBusses();

    if (typeof messageBusses === "number") return messageBusses;

    if (messageBusses?.find((bus) => bus.receivingPid === receivingPid))
      return errors.UnkownError;

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
  ): MessageBus | number {
    const messageBusses = this.LoadMessageBusses();

    if (typeof messageBusses === "number") return errors.UnkownError;

    const messageBus = messageBusses.find(
      (bus) => bus.ownerPid === ownerPid && bus.receivingPid === receivingPid
    );
    if (!messageBus) return errors.MessageBusNotFound;

    return messageBus;
  }

  public GetAllProcesses(): BaseProcess[] {
    const processes = this.LoadProcesses();

    if (typeof processes === "number") return new Array<BaseProcess>();
    return processes;
  }

  private LoadMessageBusses(): Array<MessageBus> | number {
    const result = this._memory.LoadFromMemory<Array<MessageBus>>(
      this._pid,
      ipcKey
    );

    return result;
  }

  private LoadProcesses(): Array<BaseProcess> | number {
    const result = this._memory.LoadFromMemory<Array<BaseProcess>>(
      this._pid,
      processkey
    );

    return result;
  }
}

export default Processes;
