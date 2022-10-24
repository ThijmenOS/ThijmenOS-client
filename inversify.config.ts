import "reflect-metadata";

import { Container } from "inversify";
import types from "@ostypes/types";
import IFileIcon from "@drivers/graphic/fileIcon/IFileIcon";
import FileIcon from "./src/drivers/graphic/fileIcon/FileIcon";
import IStartup from "@core/startup/IStartup";
import Startup from "@core/startup/Startup";
import IAppManager from "@core/appManager/IAppManager";
import AppManager from "@core/appManager/AppManager";
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import FileSystem from "@drivers/fileSystem/FileSystem";
import IKernel from "@core/kernel/IKernel";
import Kernel from "@core/kernel/Kernel";
import IUtils from "@utils/IUtils";
import Utils from "@utils/Utils";
import IWindow from "@drivers/graphic/window/IWindow";
import Window from "@drivers/graphic/window/Window";
import ICreateWindow from "@drivers/graphic/window/IWindowCreation";
import CreateWindow from "@drivers/graphic/window/windowCreation";
import Core from "@core/core/Core";
import ICore from "@core/core/ICore";
import IPrompt from "@drivers/graphic/prompt/IPrompt";
import Prompt from "@drivers/graphic/prompt/Prompt";
import IGraphicsUtils from "@drivers/graphic/utils/IGraphicUtils";
import GraphicsUtils from "@drivers/graphic/utils/GraphicsUtils";

const javascriptOs = new Container();
javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon).inRequestScope();
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<IAppManager>(types.AppManager)
  .to(AppManager)
  .inSingletonScope();
javascriptOs.bind<IFileSystem>(types.FileSystem).to(FileSystem);
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<IUtils>(types.Utils).to(Utils);
javascriptOs.bind<IGraphicsUtils>(types.GraphicsUtils).to(GraphicsUtils);
javascriptOs.bind<IWindow>(types.window).to(Window);
javascriptOs.bind<ICreateWindow>(types.CreateWindow).to(CreateWindow);
javascriptOs.bind<ICore>(types.Core).to(Core);
javascriptOs.bind<IPrompt>(types.Prompt).to(Prompt);

export default javascriptOs;
