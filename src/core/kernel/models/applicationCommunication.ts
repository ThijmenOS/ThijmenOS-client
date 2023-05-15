import { BaseProcess } from "@core/processManager/processes/baseProcess";
import Exit from "@providers/error/systemErrors/Exit";
interface ApplicationCommunicationModel<T> {
  worker: BaseProcess;
  exit: Exit<T>;
}

export default ApplicationCommunicationModel;
