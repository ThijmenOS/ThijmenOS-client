import { ProcessState } from "../types/processState";
import { GenerateId } from "@utils/generatePid";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Thread from "./thread";
import ProcessesShape from "../interfaces/processesShape";
import { success } from "@core/kernel/commands/errors";
import File from "../../fileSystem/models/file";

export abstract class BaseProcess<
  T extends Thread | ApplicationWindow = Thread | ApplicationWindow
> {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  pid: number;
  name: string;
  location: string;
  processType: string;

  parentPid?: number;
  childPids?: Array<number>;
  code?: T;
  state: ProcessState;
  exitCode: number;

  messageBusses: Array<number>;
  fileHandles: Array<File>;

  constructor(name: string, location: string, processType: string) {
    this.pid = GenerateId();
    this.state = ProcessState.New;
    this.exitCode = -1;
    this.messageBusses = [];
    this.fileHandles = [];

    this.name = name;
    this.location = location;
    this.processType = processType;
  }

  protected Startup(args?: string): number {
    const code = this.code as Thread | ApplicationWindow;

    code.Message({
      id: "startup",
      data: args,
    });

    return success;
  }

  protected RegisterProcess() {
    if (!this.code) {
      return;
    }

    this._processes.RegisterProcess(this);
  }

  public get AddResource() {
    const messageBus = (id: number) => {
      this.messageBusses.push(id);
    };

    const file = (file: File) => {
      this.fileHandles.push(file);
    };

    return { messageBus, file };
  }

  public FreeResources() {
    this.messageBusses.forEach((messageBus) =>
      this._processes.FreeMessageBus(messageBus, this.pid)
    );
    this.messageBusses = [];

    this.fileHandles.forEach((file) => file.Free());
    this.fileHandles = [];
  }

  public abstract Terminate(exitCode: number): void;
}
