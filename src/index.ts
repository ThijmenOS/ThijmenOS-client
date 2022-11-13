//TODO: create NPX tool to generate new thijmenos package - all the config files will be made for me - https://blog.shahednasser.com/how-to-create-a-npx-tool/
//TODO: create NPX tool to start developing an thijmenos application - it creates config file and index files.
//TODO: change to using a config file

import "reflect-metadata";
import javascriptOs from "../inversify.config";
import types from "@ostypes/types";
import IStartup from "@core/startup/IStartup";

const startup = javascriptOs.get<IStartup>(types.Startup);
startup.InitialiseOperatingSystem();
