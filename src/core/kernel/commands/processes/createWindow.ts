import { BaseProcess } from "@core/processManager/processes/baseProcess";
import Thread from "@core/processManager/processes/thread";
import { WindowProcessV2 } from "@core/processManager/processes/windowProcess";
import { ICommand } from "@ostypes/CommandTypes";
import { WindowOptions } from "@ostypes/WindowTypes";

interface CreateWindowCommand {
  path: string;
  args: string;
  windowOptions: WindowOptions;
}

class CreateWindow implements ICommand {
  private readonly _command: CreateWindowCommand;

  constructor(command: CreateWindowCommand) {
    this._command = command;
  }

  async Handle(process: BaseProcess<Thread>): Promise<number> {
    const name = this._command.path.split("/").at(-1)?.split(".")[0];

    const windowProcess = new WindowProcessV2(
      this._command.path,
      name ?? "window",
      this._command.windowOptions,
      this._command.args
    );

    process.AddResource.childProcess(windowProcess.pid);

    return windowProcess.pid;
  }
}

export default CreateWindow;
