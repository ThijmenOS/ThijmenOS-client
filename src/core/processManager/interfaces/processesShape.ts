import Exit from "@providers/error/systemErrors/Exit";
import MessageBus from "../ipc/messageBus";
import { BaseProcess } from "../processes/baseProcess";
import MqFlag from "../types/messageQueueFlags";

interface ProcessesShape {
  RegisterProcess(process: BaseProcess): void;
  FindProcess(pid: number): BaseProcess | Exit;
  RemoveProcess(pid: number): number;
  OpenMessageQueue(
    pid: number,
    name: string,
    args: MqFlag[],
    bufferSize?: number
  ): Exit | MessageBus;
  FindMessageBus(msgBusId: number): MessageBus | Exit;
  GetAllProcesses(): Array<BaseProcess>;
}

export default ProcessesShape;
