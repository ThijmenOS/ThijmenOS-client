import { ApplicationInstance } from "@core/processManager/interfaces/baseProcess";
import { EventName } from "@ostypes/ProcessTypes";
interface ApplicationCommunicationModel<T> {
  worker: ApplicationInstance;
  data: T;
  eventName: EventName;
}

export default ApplicationCommunicationModel;
