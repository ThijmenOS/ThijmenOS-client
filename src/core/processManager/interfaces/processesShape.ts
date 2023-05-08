import Exit from "@providers/error/systemErrors/Exit";
import { BaseProcess } from "../processes/baseProcess";

interface ProcessesShape {
  RegisterProcess(process: BaseProcess): void;
  FindProcess(pid: number): BaseProcess | Exit;
  RemoveProcess(pid: number): Exit;
}

export default ProcessesShape;
