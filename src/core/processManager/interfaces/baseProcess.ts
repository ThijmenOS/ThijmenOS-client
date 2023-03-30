export interface GlobalProcessArgs<T extends Worker | Window> {
  processIdentifier: string;
  origin: T;
}

export interface GlobalProcess {
  Terminate(): void;
  AddEventListener(): void;
}

export abstract class ApplicationInstance<T extends Worker | Window = any>
  implements GlobalProcess, GlobalProcessArgs<T>
{
  processIdentifier: string;
  origin: T;

  constructor(args: GlobalProcessArgs<T>) {
    this.processIdentifier = args.processIdentifier;
    this.origin = args.origin;
  }

  public abstract Terminate(): void;
  // this.attachedProcesses.forEach((process, index) => {
  //   process.Terminate();
  //   this.attachedProcesses.splice(index, 1);
  // });

  public abstract AddEventListener(): void;

  // public AttachProcess(process: ChildProcess): void {
  //   this.attachedProcesses?.push(process);
  // }
}

export abstract class ChildProcess<T extends Worker | Window>
  implements GlobalProcess
{
  processIdentifier: string;
  origin: T;

  constructor(args: GlobalProcessArgs<T>) {
    this.processIdentifier = args.processIdentifier;
    this.origin = args.origin;
  }

  abstract Terminate(): void;
  abstract AddEventListener(): void;
}
