import { ApplicationMetaData } from "@thijmen-os/common";
import {
  ApplicationInstance,
  ChildProcess,
  GlobalProcess,
} from "./baseProcess";

interface ProcessesShape {
  RegisterRunningProcess(newProcess: ApplicationInstance | ChildProcess): void;
  checkIfApplicationIsAvailableProcess(
    applicationIdentifier: string
  ): ApplicationMetaData;
  FindApplicationInstance(
    applicationIdentifier: string
  ): ApplicationInstance | false;
  FindProcess(processIdentifier: string): GlobalProcess | false;
}

export default ProcessesShape;
