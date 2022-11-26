import "reflect-metadata";

import { Container } from "inversify";
import types from "@ostypes/types";
import IFileIcon from "@core/fileIcon/IFileIcon";
import FileIcon from "./src/core/fileIcon/FileIcon";
import IStartup from "@core/startup/IStartup";
import Startup from "@core/startup/Startup";
import IAppManager from "@core/appManager/IAppManager";
import AppManager from "@core/appManager/AppManager";
import IKernel from "@core/kernel/IKernel";
import Kernel from "@core/kernel/Kernel";
import Core from "@core/core/Core";
import ICore from "@core/core/ICore";
import ISettings from "@core/settings/ISettings";
import Settings from "@core/settings/Settings";
import { IBackgroundOptions } from "@core/settings/IBackgroundOptions";
import BackgroundOptions from "@core/settings/BackgroundOptions";
import ICache from "@core/cache/ICache";
import Cache from "@core/cache/Cache";

const javascriptOs = new Container();
javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon).inRequestScope();
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<IAppManager>(types.AppManager)
  .to(AppManager)
  .inSingletonScope();
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<ICore>(types.Core).to(Core);
javascriptOs.bind<ISettings>(types.Settings).to(Settings).inSingletonScope();
javascriptOs.bind<IBackgroundOptions>(BackgroundOptions).toSelf();
javascriptOs.bind<ICache>(types.Cache).to(Cache);

export default javascriptOs;
