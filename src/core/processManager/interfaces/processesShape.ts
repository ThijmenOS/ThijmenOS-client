import Exit from "@providers/error/systemErrors/Exit";
import MessageBus from "../ipc/messageBus";
import { BaseProcess } from "../processes/baseProcess";

interface ProcessesShape {
  RegisterProcess(process: BaseProcess): void;
  FindProcess(pid: number): BaseProcess | Exit;
  RemoveProcess(pid: number): Exit;
  CreateMessageBus(
    ownerPid: number,
    receivingPid: number,
    bufferSize?: number
  ): Exit;
  FindMessageBus(ownerPid: number, receivingPid: number): MessageBus | Exit;
  GetAllProcesses(): Array<BaseProcess>;
}

export default ProcessesShape;
