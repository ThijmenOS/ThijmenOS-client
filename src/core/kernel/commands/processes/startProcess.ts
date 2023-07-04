import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { ProcessV2 } from "@core/processManager/processes/process";
import { ICommand } from "@ostypes/CommandTypes";
import { ValidatePath } from "@providers/filesystemEndpoints/filesystem";

//TODO: Provide functionality to give process args list file open path and such
class StartProcess implements ICommand {
  private readonly _exePath: string;
  private readonly _args: string;
  private readonly _name?: string;

  constructor(args: { exePath: string; name?: string; args?: string }) {
    this._exePath = args.exePath;
    this._args = args.args ?? "";
    this._name = args.name;
  }

  public async Handle(process: BaseProcess): Promise<number> {
    const mimetype = this._exePath.split(".").at(-1);

    let name = this._name;

    if (!name) {
      name = this._exePath.split("/").at(-1)?.split(".")[0];
    }

    const pathExists = await ValidatePath(this._exePath);
    if (typeof pathExists === "number") {
      return 1;
    }

    //TODO: Make this another file format (.exe)
    if (mimetype !== "js") {
      return 2;
    }

    const newProcess = new ProcessV2(
      this._exePath,
      name!,
      this._args,
      process?.pid
    );

    // process.AddResource.childProcess(newProcess.pid);

    return newProcess.pid;
  }
}

export default StartProcess;
