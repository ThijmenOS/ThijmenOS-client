export interface ProcessArgs<T extends Worker | Window> {
  processIdentifier: string;
  origin: T;
}

export interface Process<T extends Worker | Window = any>
  extends ProcessArgs<T> {
  Terminate(): void;
  AddEventListener(): void;
}

export interface WorkerProcessMethods {
  AddChildProcess(process: Process): void;
}

export abstract class ApplicationInstance<T extends Worker | Window = any>
  implements Process<T>
{
  processIdentifier: string;
  origin: T;

  public _childProcesses?: Array<ApplicationInstance> = [];

  constructor(args: ProcessArgs<T>) {
    this.processIdentifier = args.processIdentifier;
    this.origin = args.origin;
  }

  public abstract Terminate(): void;
  // this.attachedProcesses.forEach((process, index) => {
  //   process.Terminate();
  //   this.attachedProcesses.splice(index, 1);
  // });

  public abstract AddEventListener(): void;

  public AddChildProcess(process: ApplicationInstance): void {
    this._childProcesses?.push(process);
  }

  // public AttachProcess(process: ChildProcess): void {
  //   this.attachedProcesses?.push(process);
  // }
}
