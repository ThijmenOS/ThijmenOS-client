import "reflect-metadata";

import { Container } from "inversify";
import types from "@ostypes/types";
import IFileIcon from "@drivers/graphic/fileIcon/IFileIcon";
import FileIcon from "./src/drivers/graphic/fileIcon/FileIcon";
import IStartup from "@core/startup/IStartup";
import Startup from "@core/startup/Startup";
import IAppManager from "@core/appManager/IAppManager";
import AppManager from "@core/appManager/AppManager";
import IKernel from "@core/kernel/IKernel";
import Kernel from "@core/kernel/Kernel";
import Core from "@core/core/Core";
import ICore from "@core/core/ICore";
import IPrompt from "@drivers/graphic/prompt/IPrompt";
import Prompt from "@drivers/graphic/prompt/Prompt";
import ISettings from "@core/settings/ISettings";
import Settings from "@core/settings/Settings";
import IErrorManager from "@core/errorManager/IErrorManager";
import ErrorManager from "@core/errorManager/ErrorManager";
import { IBackgroundOptions } from "@ostypes/Settings";
import BackgroundOptions from "@core/settings/BackgroundOptions";

const javascriptOs = new Container();
javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon).inRequestScope();
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<IAppManager>(types.AppManager)
  .to(AppManager)
  .inSingletonScope();
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<ICore>(types.Core).to(Core);
javascriptOs.bind<IPrompt>(types.Prompt).to(Prompt);
javascriptOs.bind<ISettings>(types.Settings).to(Settings).inSingletonScope();
javascriptOs.bind<IBackgroundOptions>(BackgroundOptions).toSelf();
javascriptOs.bind<IErrorManager>(types.ErrorManager).to(ErrorManager);

export default javascriptOs;
