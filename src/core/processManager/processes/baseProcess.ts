import { ProcessState } from "../types/processState";
import { GenerateId } from "@utils/generatePid";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Thread from "./thread";
import ProcessesShape from "../interfaces/processesShape";
import { success } from "@core/kernel/commands/errors";

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
  openFiles?: Array<string>;
  state: ProcessState;
  exitCode: number;

  constructor(name: string, location: string, processType: string) {
    this.pid = GenerateId();
    this.state = ProcessState.New;
    this.exitCode = -1;

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

  public abstract Terminate(exitCode: number): void;
}
