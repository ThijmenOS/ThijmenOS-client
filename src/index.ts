import "reflect-metadata";
import javascriptOs from "../inversify.config";
import types from "./interfaces/types";
import { IStartup } from "@interface/startup";

const startup = javascriptOs.get<IStartup>(types.Startup);
startup.InitialiseOperatingSystem();
