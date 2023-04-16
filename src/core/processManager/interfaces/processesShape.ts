import { ApplicationInstance, Process } from "./baseProcess";

interface ProcessesShape {
  RegisterProcess(newProcess: ApplicationInstance): void;
  FindProcess(processIdentifier: string): Process | null;
}

export default ProcessesShape;
