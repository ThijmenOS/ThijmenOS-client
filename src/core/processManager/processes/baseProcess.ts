import Exit from "@providers/error/systemErrors/Exit";
import { ProcessState } from "../types/processState";
import { GenerateId } from "@utils/generatePid";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import { ProcessMessage } from "@core/kernel/kernelTypes";
import javascriptOs from "@inversify/inversify.config";
import KernelMethodShape from "@core/kernel/kernelMethodShape";
import types from "@ostypes/types";
import Thread from "./thread";
import ProcessesShape from "../interfaces/processesShape";

export abstract class BaseProcess<
  T extends Thread | ApplicationWindow = Thread | ApplicationWindow
> {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  pid: number;
  parentPid?: number;
  childPids?: Array<number>;
  code?: T;
  openFiles?: Array<string>;
  state: ProcessState;

  constructor() {
    this.pid = GenerateId();
    this.state = ProcessState.New;
  }

  protected Startup(args?: string): Exit {
    const code = this.code as Thread | ApplicationWindow;
    code.Message({
      id: "startup",
      data: args,
    });

    return new Exit(0);
  }

  protected RegisterProcess() {
    if (!this.code) {
      return;
    }

    this._processes.RegisterProcess(this);
  }

  public abstract Terminate(): void;
}
