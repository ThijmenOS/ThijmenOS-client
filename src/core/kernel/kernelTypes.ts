import Thread from "@core/processManager/processes/thread";
import { Class, ICommand } from "../../types/CommandTypes";
import { ValidMethods } from "./kernelMethods";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";

export interface ProcessMessage {
  method: string;
  params: string | number | object;
  messageId: number;
}

export interface JsOsCommunicationMessage extends ProcessMessage {
  origin: BaseProcess<Thread | ApplicationWindow>;
  pid: number;
}

export type KernelMethods = { [key in ValidMethods]: Class<ICommand> };
