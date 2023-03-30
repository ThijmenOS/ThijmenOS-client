import { ApplicationInstance } from "@core/processManager/interfaces/baseProcess";
import { Class, ICommand } from "../../types/CommandTypes";
import { ValidMethods } from "./kernelMethods";

export type JsOsCommunicationMessage = {
  origin: ApplicationInstance;
  processIdentifier: string;
  method: string;
  params: any;
};

export type ProcessMessage = {
  origin: string;
  method: string;
  params: any;
};

export type KernelMethods = { [key in ValidMethods]: Class<ICommand> };
