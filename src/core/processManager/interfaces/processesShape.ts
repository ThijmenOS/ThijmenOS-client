import MessageBus from "../ipc/messageBus";
import { BaseProcess } from "../processes/baseProcess";

interface ProcessesShape {
  RegisterProcess(process: BaseProcess): void;
  FindProcess(pid: number): BaseProcess | number;
  RemoveProcess(pid: number): number;
  CreateMessageBus(
    ownerPid: number,
    receivingPid: number,
    bufferSize?: number
  ): number;
  FindMessageBus(ownerPid: number, receivingPid: number): MessageBus | number;
  GetAllProcesses(): Array<BaseProcess>;
}

export default ProcessesShape;
