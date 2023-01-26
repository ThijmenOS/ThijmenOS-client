import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import { Directory, User } from "@thijmen-os/common";
import { inject, injectable } from "inversify";
import DesktopMethods from "./desktopMethods";
import IFileIcon from "@core/fileIcon/fileIconMethodShape";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";

@injectable()
class Desktop implements DesktopMethods {
  private readonly _cache: MemoryMethodShape;
  private readonly _authentication: AuthenticationMethodShape;

  constructor(
    @inject(types.Cache) cache: MemoryMethodShape,
    @inject(types.Authentication) authentication: AuthenticationMethodShape
  ) {
    this._cache = cache;
    this._authentication = authentication;
  }

  public async LoadDesktop(): Promise<void> {
    const signedInUser = this._authentication.CheckAuthenticationState();
    //TODO: Implement propper error
    if (!signedInUser) throw new Error();

    const desktopFiles = await ShowFilesInDir(
      this.ConstructDesktopPath(signedInUser)
    );

    this._cache.saveToMemory<Array<Directory>>("desktopFiles", desktopFiles);

    this.RenderIcon(desktopFiles);
  }

  public async RefreshDesktop(): Promise<void> {
    const cacheFiles =
      this._cache.loadFromMemory<Array<Directory>>("desktopFiles");

    if (!cacheFiles) throw new Error();
    const loggedInUser = this._authentication.CheckAuthenticationState();

    //TODO: Implement propper error
    if (!loggedInUser) throw new Error();

    const allFiles = await ShowFilesInDir(
      this.ConstructDesktopPath(loggedInUser)
    );

    const newFiles = allFiles.filter(
      (x) => !cacheFiles.find((y) => x.filePath === y.filePath)
    );

    this.RenderIcon(newFiles);
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
    `C/Users/OS-${user.userId}~${user.username}/Desktop`;
}

export default Desktop;
