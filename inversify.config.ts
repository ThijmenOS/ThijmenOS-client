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
import ICache from "@core/memory/memoryMethodShape";
import Cache from "@core/memory/memory";
import Window from "@core/applicationWindow/applicationWindow";
import CreateWindow from "@core/applicationWindow/createApplicationWindow";
import IWindow from "@core/applicationWindow/interfaces/applicationWindowMethodShape";
import ICreateWindow from "@core/applicationWindow/interfaces/createApplicationWindowMethodShape";
import Mediator from "@core/kernel/commands/Mediator";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import Authentication from "@providers/authentication/authentication";
import AuthenticationGui from "@providers/gui/authentication/authenticationGuiProvider";
import AuthenticationMethodShapeGui from "@providers/gui/authentication/authenticationGuiProvider";
import DesktopMethods from "@providers/desktop/desktopMethods";
import Desktop from "@providers/desktop/desktop";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import CommandAccessValidation from "@core/kernel/accessValidation";
import ApplicationSettingsMethods from "@core/settings/individualSettings/applicationsMethods";
import ApplicationSettings from "@core/settings/individualSettings/applicationSettings";

const javascriptOs = new Container();

//Settings
javascriptOs.bind<ISettings>(types.Settings).to(Settings).inSingletonScope();
javascriptOs
  .bind<ApplicationSettingsMethods>(types.ApplicationSettings)
  .to(ApplicationSettings);

javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon).inRequestScope();
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<IAppManager>(types.AppManager)
  .to(AppManager)
  .inSingletonScope();
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<ICache>(types.Cache).to(Cache).inSingletonScope();
javascriptOs.bind<IWindow>(types.window).to(Window);
javascriptOs.bind<ICreateWindow>(types.CreateWindow).to(CreateWindow);
javascriptOs.bind<Mediator>(types.Mediator).to(Mediator);
javascriptOs
  .bind<AuthenticationMethodShape>(types.Authentication)
  .to(Authentication)
  .inSingletonScope();
javascriptOs
  .bind<AuthenticationMethodShapeGui>(types.AuthenticationGui)
  .to(AuthenticationGui);
javascriptOs.bind<DesktopMethods>(types.Desktop).to(Desktop);
javascriptOs
  .bind<AccessValidationMethods>(types.CommandAccessValidation)
  .to(CommandAccessValidation)
  .inSingletonScope();

export default javascriptOs;
