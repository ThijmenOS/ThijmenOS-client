import { ProcessState } from "../types/processState";
import { GenerateId } from "@utils/generatePid";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Thread from "./thread";
import ProcessesShape from "../interfaces/processesShape";
import { success } from "@core/kernel/commands/errors";
import File from "../../fileSystem/models/file";
import Metadata from "../types/processMetadata";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import Window from "@providers/gui/applicationWindow/applicationWindow";

export abstract class BaseProcess<
  T extends Thread | ApplicationWindow = Thread | ApplicationWindow
> {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  pid: number;
  name: string;
  location: string;
  processType: string;

  parentPid?: number;
  childPids: Array<number>;
  code?: T;
  state: ProcessState;
  exitCode: number;

  messageBusses: Array<number>;
  fileHandles: Array<File>;
  memoryAllocations: Array<string>;
  windows: Array<Window>;

  constructor(name: string, location: string, processType: string) {
    this.pid = GenerateId();
    this.state = ProcessState.New;
    this.exitCode = -1;

    this.childPids = [];
    this.messageBusses = [];
    this.fileHandles = [];
    this.memoryAllocations = [];
    this.windows = [];

    this.name = name;
    this.location = location;
    this.processType = processType;
  }

  protected Startup(metadata: Metadata, args?: string): number {
    const code = this.code as Thread | ApplicationWindow;

    console.log("a");

    code.Message({
      id: "startup",
      data: {
        metadata: metadata,
        args: args,
      },
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
    const childProcess = (pid: number) => {
      this.childPids.push(pid);
    };

    const window = (window: Window) => {
      this.windows.push(window);
    };

    const messageBus = (id: number) => {
      this.messageBusses.push(id);
    };

    const file = (file: File) => {
      this.fileHandles.push(file);
    };

    const memoryAllocation = (key: string) => {
      this.memoryAllocations.push(key);
    };

    return { childProcess, window, messageBus, file, memoryAllocation };
  }

  public FreeResources() {
    this.messageBusses.forEach((messageBus) =>
      this._processes.FreeMessageBus(messageBus, this.pid)
    );
    this.messageBusses = [];

    this.fileHandles.forEach((file) => file.Free());
    this.fileHandles = [];

    this.memoryAllocations.forEach((key) => this._memory.DeAllocateMemory(key));
    this.memoryAllocations = [];
  }

  public abstract Terminate(exitCode: number): void;
}
