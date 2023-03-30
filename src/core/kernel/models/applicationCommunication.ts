import { EventName } from "@ostypes/ProcessTypes";

interface ApplicationCommunicationModel<T> {
  worker: Worker | Window;
  data: T;
  eventName: EventName;
}

export default ApplicationCommunicationModel;
