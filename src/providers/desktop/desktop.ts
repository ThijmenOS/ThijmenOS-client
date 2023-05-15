import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import { Directory, host, User } from "@thijmen-os/common";
import { inject, injectable } from "inversify";
import DesktopMethods from "./desktopMethods";
import IFileIcon from "@providers/gui/fileIcon/fileIconMethodShape";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import { imagetypes } from "@ostypes/imageTypes";
import FatalError from "@providers/error/userErrors/fatalError";
import { OSErrors } from "@providers/error/defaults/errors";
import { GenerateId } from "@utils/generatePid";
import Exit from "@providers/error/systemErrors/Exit";

@injectable()
class Desktop implements DesktopMethods {
  private readonly _memory: MemoryMethodShape;
  private readonly _authentication: AuthenticationMethodShape;

  private readonly _pid: number = GenerateId();
  private readonly _memoryKey: string = "desktop:files";

  constructor(
    @inject(types.Memory) memory: MemoryMethodShape,
    @inject(types.Authentication) authentication: AuthenticationMethodShape
  ) {
    this._memory = memory;
    this._authentication = authentication;

    this._memory.AllocateMemory(this._pid, this._memoryKey, []);
  }

  public async LoadDesktop(): Promise<void> {
    const signedInUser = this._authentication.CheckAuthenticationState();
    //This error should never happen. Therefore implement kernel panic where os is rebooted;
    //TODO: Throw kernel panic
    if (!signedInUser) throw new Error();

    this.SetBackground(signedInUser.preferences.background);

    const desktopFiles = await ShowFilesInDir(
      this.ConstructDesktopPath(signedInUser),
      () =>
        new FatalError("Could not load desktop", OSErrors.couldNotLoadDesktop)
    );

    if (!desktopFiles) {
      new FatalError(
        "Desktop could not be loaded",
        OSErrors.couldNotLoadDesktop
      );
    }

    this._memory.SaveToMemory<Array<Directory>>(
      this._pid,
      this._memoryKey,
      desktopFiles
    );

    this.RenderIcon(desktopFiles);
  }

  public async RefreshDesktop(): Promise<void> {
    const result = this._memory.LoadFromMemory<Array<Directory>>(
      this._pid,
      this._memoryKey
    );

    if (result instanceof Exit) throw new Error(result.data);
    const loggedInUser = this._authentication.CheckAuthenticationState();

    //This error should never happen. Therefore implement kernel panic where os is rebooted;
    //TODO: Throw kernel panic
    if (!loggedInUser) throw new Error();

    const allFiles = await ShowFilesInDir(
      this.ConstructDesktopPath(loggedInUser)
    );

    const newFiles = allFiles.filter(
      (x) => !result.find((y) => x.filePath === y.filePath)
    );

    this.RenderIcon(newFiles);
  }

  public SetBackground(path: string): void {
    if (!path) throw new Error();

    const fileExtension = path.split(".").at(-1);
    if (!fileExtension || !imagetypes.includes(fileExtension)) {
      throw new Error();
    }

    const backgroundElement = document.querySelector("body")!;
    backgroundElement.style.backgroundImage = `url("${host}/static/${path}")`;
  }

  private RenderIcon(content: Array<Directory>) {
    content.forEach((file) =>
      javascriptOs
        .get<IFileIcon>(types.FileIcon)
        .ConstructFileIcon(file.filePath)
    );
  }

  private ConstructDesktopPath = (user: User) =>
    //TODO: Get this form env variables
    `C/Users/${user.username}/Desktop`;
}

export default Desktop;
