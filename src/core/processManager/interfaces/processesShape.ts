import Exit from "@providers/error/systemErrors/Exit";
import { ApplicationInstance } from "../processes/baseProcess";

interface ProcessesShape {
  RegisterProcess(process: ApplicationInstance): void;
  FindProcess(pid: string): ApplicationInstance | Exit;
  RemoveProcess(pid: string): Exit;
}

export default ProcessesShape;
