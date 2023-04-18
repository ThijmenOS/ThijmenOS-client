import { ApplicationInstance } from "@core/processManager/processes/baseProcess";
import Exit from "@providers/error/systemErrors/Exit";
interface ApplicationCommunicationModel<T> {
  worker: ApplicationInstance;
  exit: Exit<T>;
}

export default ApplicationCommunicationModel;
