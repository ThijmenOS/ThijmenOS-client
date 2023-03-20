import { ApplicationMetaData } from "@thijmen-os/common";

export interface GlobalProcessArgs {
  processIdentifier: string;
}

export interface GlobalProcess extends GlobalProcessArgs {
  Terminate(): void;
}

export interface ApplicationInstanceShape extends GlobalProcess {
  attachedProcesses: Array<ChildProcess>;

  AttachProcess(process: ChildProcess): void;
}

export abstract class ApplicationInstance implements ApplicationInstanceShape {
  processIdentifier: string;
  attachedProcesses: Array<ChildProcess> = new Array<ChildProcess>();

  constructor(args: GlobalProcessArgs) {
    this.processIdentifier = args.processIdentifier;
  }

  public Terminate() {
    this.attachedProcesses.forEach((process, index) => {
      process.Terminate();
      this.attachedProcesses.splice(index, 1);
    });
  }

  public AttachProcess(process: ChildProcess): void {
    this.attachedProcesses?.push(process);
  }
}

export abstract class ChildProcess implements GlobalProcess {
  processIdentifier: string;

  constructor(args: GlobalProcessArgs) {
    this.processIdentifier = args.processIdentifier;
  }

  abstract Terminate(): void;
}
