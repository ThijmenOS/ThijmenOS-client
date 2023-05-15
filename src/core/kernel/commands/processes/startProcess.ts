import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { ProcessV2 } from "@core/processManager/processes/process";
import { WindowProcessV2 } from "@core/processManager/processes/windowProcess";
import { ICommand } from "@ostypes/CommandTypes";
import { errors } from "../errors";

//TODO: Provide functionality to give process args list file open path and such
class StartProcess implements ICommand {
  private readonly _exePath: string;
  private readonly _args?: string;
  private readonly _name?: string;

  constructor(args: { exePath: string; name?: string; args?: string }) {
    this._exePath = args.exePath;
    this._args = args.args;
    this._name = args.name;
  }

  public async Handle(process?: BaseProcess): Promise<number> {
    const mimetype = this._exePath.split(".").at(-1);

    let name = this._name;

    if (!name) {
      name = this._exePath.split("/").at(-1)?.split(".")[0];
    }

    if (mimetype === "html") {
      const newProcess = new WindowProcessV2(
        this._exePath,
        name!,
        this._args,
        process?.pid
      );

      if (process) return newProcess.pid;

      return errors.UnkownError;
    }
    if (mimetype === "js") {
      const newProcess = new ProcessV2(
        this._exePath,
        name!,
        this._args,
        process?.pid
      );

      if (process) return newProcess.pid;

      return errors.UnkownError;
    }

    return errors.FiletypeNotExecutable;
  }
}

export default StartProcess;
