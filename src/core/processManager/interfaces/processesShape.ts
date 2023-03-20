import { ApplicationInstance, GlobalProcess } from "./baseProcess";

interface ProcessesShape {
  RegisterProcess(newProcess: ApplicationInstance): void;
  FindProcess(processIdentifier: string): GlobalProcess | null;
}

export default ProcessesShape;
