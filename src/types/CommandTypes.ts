import { Permissions } from "@thijmen-os/common";
import { EventName } from "./AppManagerTypes";

export interface ICommand {
  requiredPermission?: Permissions;
  Handle():
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
