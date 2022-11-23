//TODO: create NPX tool to start developing an thijmenos application - it creates config file and index files.

import "reflect-metadata";
import javascriptOs from "../inversify.config";
import types from "@ostypes/types";
import IStartup from "@core/startup/IStartup";

const startup = javascriptOs.get<IStartup>(types.Startup);
startup.InitialiseOperatingSystem();
