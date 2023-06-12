/* eslint-disable no-debugger */
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
import MqFlag from "./types/messageQueueFlags";
import Exit from "@providers/error/systemErrors/Exit";
import MessageBusNotFOund from "./errors/MessageBusNotFound";
import MsgBusAlreadyExists from "./errors/messageBusAlreadyExists";
import ProcessNotFound from "./errors/ProcessNotFound";
import CantDeleteMessageBus from "./errors/cantDeleteMessageBus";

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

  public RegisterProcess = (process: BaseProcess): Exit => {
    const processes = this.LoadProcesses();

    if (processes instanceof Exit) return processes;

    processes.push(process);
    this.SaveProcessesToMemory(processes);

    return new Exit();
  };

  public FindProcess(pid: number): BaseProcess | Exit {
    const processes = this.LoadProcesses();

    if (processes instanceof Exit) {
      throw new FatalError(processes.data, processes.code);
    }

    const targetProcess = processes.find((process) => process.pid === pid);

    if (!targetProcess) return new ProcessNotFound();

    return targetProcess;
  }

  public RemoveProcess(pid: number): Exit {
    const processes = this.LoadProcesses();

    if (processes instanceof Exit)
      throw new FatalError(processes.data, processes.code);

    const result = processes.findIndex((process) => process.pid === pid);

    if (result < 0) return new Exit();

    processes.splice(result, 1);

    this.SaveProcessesToMemory(processes);

    return new Exit();
  }

  public OpenMessageQueue(
    pid: number,
    name: string,
    flags: MqFlag[],
    bufferSize?: number
  ): Exit | MessageBus {
    const messageBusses = this.LoadMessageBusses();
    if (messageBusses instanceof Exit) {
      return messageBusses;
    }

    if (!flags.includes(MqFlag.CREATE)) {
      const messageBus = messageBusses.find((bus) => bus.name === name);
      if (!messageBus) return new MessageBusNotFOund();

      messageBus.OpenSession(pid, flags);

      return messageBus;
    }

    const messageBus = this.CreateMessageBus(
      messageBusses,
      pid,
      name,
      flags,
      bufferSize
    );

    if (messageBus instanceof Exit) return messageBus;

    const ownerProcess = this.FindProcess(pid);
    if (ownerProcess instanceof Exit) return ownerProcess;

    ownerProcess.AddResource.messageBus(messageBus.messageBusId);

    messageBusses.push(messageBus);
    this.SaveMessageBusToMemory(messageBusses);

    return messageBus;
  }

  private CreateMessageBus(
    messageBusses: Array<MessageBus>,
    pid: number,
    name: string,
    flags: MqFlag[],
    bufferSize?: number
  ): Exit | MessageBus {
    if (messageBusses.find((bus) => bus.name === name)) {
      return new MsgBusAlreadyExists();
    }

    const messageBus = new MessageBus(pid, name, flags, bufferSize);
    messageBus.OpenSession(pid, flags);

    return messageBus;
  }

  private SaveMessageBusToMemory(messageBusses: Array<MessageBus>) {
    this._memory.SaveToMemory<Array<MessageBus>>(
      this._pid,
      ipcKey,
      messageBusses
    );
  }

  public FreeMessageBus(id: number, pid: number): Exit {
    const messageBusses = this.LoadMessageBusses();

    if (messageBusses instanceof Exit) return messageBusses;

    const busIndex = messageBusses.findIndex(
      (messageBus) => messageBus.messageBusId === id
    );
    if (busIndex === -1) return new MessageBusNotFOund();

    if (messageBusses[busIndex].ownerPid !== pid)
      return new CantDeleteMessageBus();

    messageBusses.splice(busIndex, 1);
    this.SaveMessageBusToMemory(messageBusses);

    return new Exit();
  }

  public FindMessageBus(msgBusId: number): MessageBus | Exit {
    const messageBusses = this.LoadMessageBusses();

    if (messageBusses instanceof Exit) return messageBusses;

    const messageBus = messageBusses.find(
      (bus) => bus.messageBusId === msgBusId
    );
    if (!messageBus) return new MessageBusNotFOund();

    return messageBus;
  }

  public GetAllProcesses(): BaseProcess[] {
    const processes = this.LoadProcesses();

    if (processes instanceof Exit) return new Array<BaseProcess>();
    return processes;
  }

  private LoadMessageBusses(): Array<MessageBus> | Exit {
    const result = this._memory.LoadFromMemory<Array<MessageBus>>(
      this._pid,
      ipcKey
    );

    return result ?? [];
  }

  private LoadProcesses(): Array<BaseProcess> | Exit {
    const result = this._memory.LoadFromMemory<Array<BaseProcess>>(
      this._pid,
      processkey
    );

    return result ?? [];
  }

  private SaveProcessesToMemory(processes: Array<BaseProcess>) {
    this._memory.SaveToMemory<Array<BaseProcess>>(
      this._pid,
      processkey,
      processes
    );
  }
}

export default Processes;
