import { Class, ICommand } from "../../types/CommandTypes";
import { ValidMethods } from "./kernelMethods";

export type JsOsCommunicationMessage = {
  origin: Worker | Window;
  processIdentifier: string;
  method: string;
  params: unknown;
};

export type ProcessMessage = {
  origin: string;
  method: string;
  params: unknown;
};

export type KernelMethods = { [key in ValidMethods]: Class<ICommand> };
