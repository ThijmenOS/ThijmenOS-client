import { Permissions } from "@thijmen-os/common";
import { EventName } from "./ProcessTypes";
import { Process } from "@core/processManager/interfaces/baseProcess";
import { ErrorExit } from "@providers/error/systemErrors/systemError";

export interface ICommand {
  requiredPermission?: Permissions;

  Handle(
    Process?: Process
  ):
    | CommandReturn<unknown>
    | Promise<CommandReturn<unknown>>
    | Promise<void>
    | ErrorExit
    | void;
}

export class CommandReturn<T> {
  public data: T;
  public event: EventName;

  constructor(data: T, event: EventName) {
    this.data = data;
    this.event = event;
  }
}

export type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;
