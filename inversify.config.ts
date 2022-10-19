import { Container } from "inversify";
import types from "./src/interfaces/types";
import { IFileIcon } from "./src/interfaces/fileIcon";
import FileIcon from "./src/app-regestry/file-icon/fileIcon";
import { IStartup } from "@interface/startup";
import Startup from "@core/startup";
import { IAppManager } from "@interface/appManager";
import AppManager from "@core/appManager";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import FileSystem from "@core/fileSystem";
import { IKernel } from "@interface/kernel/kernel";
import Kernel from "@core/kernel";
import { IUtils } from "@interface/utils/utils";
import Utils from "@utils/utils";
import { IWindow } from "@interface/appWindow/window";
import AppWindow from "@app/window/appWindow";
import { ICreateWindow } from "@interface/appWindow/createWindow";
import CreateWindow from "@app/window/CreateWindow";
import Core from "@core/core";
import { ICore } from "@interface/core/core";

const javascriptOs = new Container();
javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon);
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<IAppManager>(types.AppManager)
  .to(AppManager)
  .inSingletonScope();
javascriptOs.bind<IFileSystem>(types.FileSystem).to(FileSystem);
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<IUtils>(types.Utils).to(Utils);
javascriptOs.bind<IWindow>(types.AppWindow).to(AppWindow);
javascriptOs.bind<ICreateWindow>(types.CreateWindow).to(CreateWindow);
javascriptOs.bind<ICore>(types.Core).to(Core);

export default javascriptOs;
