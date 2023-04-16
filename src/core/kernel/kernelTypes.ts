import { ApplicationInstance } from "@core/processManager/interfaces/baseProcess";
import { Class, ICommand } from "../../types/CommandTypes";
import { ValidMethods } from "./kernelMethods";

export type ProcessMessage = {
  origin: string;
  method: string;
  params: string | number | object;
};

export type JsOsCommunicationMessage = {
  origin: ApplicationInstance;
  processIdentifier: string;
  method: string;
  params: string | number | object;
};

export type KernelMethods = { [key in ValidMethods]: Class<ICommand> };
