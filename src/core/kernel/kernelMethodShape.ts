import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { JsOsCommunicationMessage } from "./kernelTypes";
import { ICommand } from "@ostypes/CommandTypes";

export default interface KernelMethodShape {
  LoadKernel(): void;
  ProcessCommand(command: ICommand, process: BaseProcess): unknown;
  ProcessMethod(props: JsOsCommunicationMessage): void;
}
