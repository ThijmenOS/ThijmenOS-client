import { ApplicationInstance, Process } from "./baseProcess";

interface ProcessesShape {
  RegisterProcess(process: ApplicationInstance): void;
  FindProcess(pid: string): Process | null;
  RemoveProcess(pid: string): void;
}

export default ProcessesShape;
