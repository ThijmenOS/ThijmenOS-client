import { Permissions } from "@thijmen-os/common";
import { EventName } from "./ProcessTypes";

export interface ICommand {
  requiredPermission?: Permissions;

  Handle(
    applicationId?: string
  ):
    | CommandReturn<unknown>
    | Promise<CommandReturn<unknown>>
    | Promise<void>
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
