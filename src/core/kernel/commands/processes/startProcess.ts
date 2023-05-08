import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { ProcessV2 } from "@core/processManager/processes/process";
import { WindowProcessV2 } from "@core/processManager/processes/windowProcess";
import { ICommand } from "@ostypes/CommandTypes";
import Exit from "@providers/error/systemErrors/Exit";

//TODO: Provide functionality to give process args list file open path and such
class StartProcess implements ICommand {
  private readonly _exePath: string;
  private readonly _args?: string;

  constructor(args: { exePath: string; args?: string }) {
    this._exePath = args.exePath;
    this._args = args.args;
  }

  public async Handle(process?: BaseProcess): Promise<Exit | number> {
    const mimetype = this._exePath.split(".").at(-1);
    if (mimetype === "html") {
      const newProcess = await new WindowProcessV2().Initialise(
        this._exePath,
        this._args,
        process?.pid
      );

      if (process) return newProcess.pid;

      return new Exit(0);
    }
    if (mimetype === "js") {
      const newProcess = new ProcessV2(this._exePath, this._args, process?.pid);

      if (process) return newProcess.pid;

      return new Exit(0);
    }

    return new Exit(-1, "FILE_TYPE_NOT_EXECUTABLE");
  }
}

export default StartProcess;
