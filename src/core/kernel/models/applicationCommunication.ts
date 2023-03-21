import { EventName } from "@ostypes/ProcessTypes";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";

interface ApplicationCommunicationModel<T> {
  worker: Worker | Window;
  data: T;
  eventName: EventName;
}

export default ApplicationCommunicationModel;
