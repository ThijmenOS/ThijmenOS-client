import { EventName } from "@ostypes/ProcessTypes";
import { Process, ProcessArgs } from "../interfaces/process";

export abstract class ApplicationInstance implements Process {
  processIdentifier: string;
  origin: Window;

  public _childProcesses?: Array<ApplicationInstance> = [];

  constructor(args: ProcessArgs) {
    this.processIdentifier = args.processIdentifier;
    this.origin = args.origin;
  }

  public abstract Terminate(): void;

  public abstract AddEventListener(): void;

  public AddChildProcess(process: ApplicationInstance): void {
    this._childProcesses?.push(process);
  }

  public Startup(args?: string): void {
    setTimeout(() => {
      this.origin.postMessage(
        {
          event: EventName.StartupArgs,
          args: args || "",
        },
        "*"
      );
    }, 100);
  }
}
