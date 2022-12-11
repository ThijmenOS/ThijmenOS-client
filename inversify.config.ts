import "reflect-metadata";

import { Container } from "inversify";
import types from "@ostypes/types";
import IFileIcon from "@core/fileIcon/fileIconMethodShape";
import FileIcon from "./src/core/fileIcon/fileIcon";
import IStartup from "@core/startup/startupMethodShape";
import Startup from "@core/startup/startup";
import IAppManager from "@core/applicationManager/applicationManagerMethodShape";
import AppManager from "@core/applicationManager/applicationManager";
import IKernel from "@core/kernel/kernelMethodShape";
import Kernel from "@core/kernel/kernel";
import ISettings from "@core/settings/settingsMethodShape";
import Settings from "@core/settings/settings";
import IBackgroundOptions from "@core/settings/individualSettings/backgroundSettingsMethodShape";
import BackgroundOptions from "@core/settings/individualSettings/BackgroundOptions";
import ICache from "@core/memory/memoryMethodShape";
import Cache from "@core/memory/memory";
import Window from "@core/applicationWindow/applicationWindow";
import CreateWindow from "@core/applicationWindow/createApplicationWindow";
import IWindow from "@core/applicationWindow/interfaces/applicationWindowMethodShape";
import ICreateWindow from "@core/applicationWindow/interfaces/createApplicationWindowMethodShape";

const javascriptOs = new Container();
javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon).inRequestScope();
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<IAppManager>(types.AppManager)
  .to(AppManager)
  .inSingletonScope();
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<ISettings>(types.Settings).to(Settings).inSingletonScope();
javascriptOs.bind<IBackgroundOptions>(BackgroundOptions).toSelf();
javascriptOs.bind<ICache>(types.Cache).to(Cache);
javascriptOs.bind<IWindow>(types.window).to(Window);
javascriptOs.bind<ICreateWindow>(types.CreateWindow).to(CreateWindow);

export default javascriptOs;
