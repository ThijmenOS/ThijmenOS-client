import { Permissions } from "@thijmen-os/common";
import Exit from "@providers/error/systemErrors/Exit";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

export interface ICommand<T = unknown> {
  requiredPermission?: Permissions;

  Handle(
    process?: BaseProcess
  ):
    | Promise<Exit>
    | Promise<Exit | T>
    | Promise<Exit | Exit<unknown>>
    | Exit
    | T
    | Exit<unknown>;
}

export type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;
