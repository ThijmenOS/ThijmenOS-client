import { ApplicationMetaData } from "@thijmen-os/common";

export interface GlobalProcessArgs {
  processMetadata: ApplicationMetaData;
  applicationIdentifier: string;
  processIdentifier: string;
}

export interface GlobalProcess extends GlobalProcessArgs {
  Terminate(): void;
}

export interface ApplicationInstanceShape extends GlobalProcess {
  applicationIdentifier: string;
  attachedProcesses: Array<ChildProcess>;
  singleton?: boolean;

  AttachProcess(process: ChildProcess): void;
}

export abstract class ApplicationInstance implements ApplicationInstance {
  processMetadata: ApplicationMetaData;
  processIdentifier: string;
  applicationIdentifier: string;
  attachedProcesses: Array<ChildProcess> = new Array<ChildProcess>();
  singleton?: boolean;

  constructor(args: ApplicationInstanceShape) {
    this.processIdentifier = args.processIdentifier;
    this.applicationIdentifier = args.applicationIdentifier;
    this.processMetadata = args.processMetadata;
    this.singleton = args.singleton;
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
  applicationIdentifier: string;
  processMetadata: ApplicationMetaData;

  constructor(args: GlobalProcessArgs) {
    this.processIdentifier = args.processIdentifier;
    this.applicationIdentifier = args.applicationIdentifier;
    this.processMetadata = args.processMetadata;
  }

  abstract Terminate(): void;
}
