/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata";

import { Container } from "inversify";
import types from "@ostypes/types";
import IFileIcon from "@providers/gui/fileIcon/fileIconMethodShape";
import FileIcon from "@providers/gui/fileIcon/fileIcon";
import IStartup from "@core/startup/startupMethodShape";
import Startup from "@core/startup/startup";
import ApplicationManagerMethods from "@core/applicationManager/applicationManagerMethods";
import ApplicationManager from "@core/applicationManager/applicationManager";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import Processes from "@core/processManager/processes";
import IKernel from "@core/kernel/kernelMethodShape";
import Kernel from "@core/kernel/kernel";
import ISettings from "@core/settings/settingsMethodShape";
import Settings from "@core/settings/settings";
import MemoryMethods from "@core/memory/memoryMethodShape";
import Memory from "@core/memory/memory";
import Window from "@providers/gui/applicationWindow/applicationWindow";
import CreateWindow from "@providers/gui/applicationWindow/windowConstructor";
import IWindow from "@providers/gui/applicationWindow/interfaces/applicationWindowMethodShape";
import ICreateWindow from "@providers/gui/applicationWindow/interfaces/windowConstructorMethods";
import Mediator from "@core/kernel/commands/Mediator";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import Authentication from "@providers/authentication/authentication";
import AuthenticationGui from "@providers/gui/authentication/authenticationGuiProvider";
import AuthenticationMethodShapeGui from "@providers/gui/authentication/authenticationGuiProvider";
import DesktopMethods from "@providers/desktop/desktopMethods";
import Desktop from "@providers/desktop/desktop";
import ApplicationSettingsMethods from "@core/settings/individualSettings/applicationsMethods";
import ApplicationSettings from "@core/settings/individualSettings/applicationSettings";
import FileSystemMethods from "@core/fileSystem/interfaces/fileSystem";
import FileSystem from "@core/fileSystem";
import { IResolver, mediatorSettings } from "mediatr-ts";

const javascriptOs = new Container();

class InversifyResolver implements IResolver {
  resolve<T>(name: string): T {
    return javascriptOs.get<T>(name);
  }

  add<T>(name: string, instance: T): void {
    javascriptOs.bind(name).to(instance as any);
  }

  remove(name: string): void {
    javascriptOs.unbind(name);
  }

  clear(): void {
    javascriptOs.unbindAll();
  }
}

mediatorSettings.resolver = new InversifyResolver();

//Settings
javascriptOs.bind<ISettings>(types.Settings).to(Settings).inSingletonScope();
javascriptOs
  .bind<ApplicationSettingsMethods>(types.ApplicationSettings)
  .to(ApplicationSettings);

javascriptOs.bind<IFileIcon>(types.FileIcon).to(FileIcon).inRequestScope();
javascriptOs.bind<IStartup>(types.Startup).to(Startup);
javascriptOs
  .bind<ApplicationManagerMethods>(types.AppManager)
  .to(ApplicationManager)
  .inSingletonScope();
javascriptOs
  .bind<ProcessesShape>(types.ProcessManager)
  .to(Processes)
  .inSingletonScope();
javascriptOs.bind<IKernel>(types.Kernel).to(Kernel);
javascriptOs.bind<MemoryMethods>(types.Memory).to(Memory).inSingletonScope();
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
javascriptOs.bind<DesktopMethods>(types.Desktop).to(Desktop).inSingletonScope();
javascriptOs
  .bind<FileSystemMethods>(types.FileSystem)
  .to(FileSystem)
  .inSingletonScope();

export default javascriptOs;
