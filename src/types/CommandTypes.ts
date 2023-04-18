import { Permissions } from "@thijmen-os/common";
import { Process } from "@core/processManager/processes/baseProcess";
import Exit from "@providers/error/systemErrors/Exit";

export interface ICommand {
  requiredPermission?: Permissions;

  Handle(
    Process?: Process
  ):
    | Promise<void>
    | void
    | Promise<Exit>
    | Promise<Exit | Exit<unknown>>
    | Exit
    | Exit<unknown>;
}

export class CommandReturn<T> extends Exit<T> {
  constructor(data: T) {
    super(0, data);
    this.data = data;
  }
}

export type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;
