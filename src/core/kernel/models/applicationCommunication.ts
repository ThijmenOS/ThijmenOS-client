import { EventName } from "@ostypes/ProcessTypes";

interface ApplicationCommunicationModel<T> {
  processIdentifier: string;
  data: T;
  eventName: EventName;
}

export default ApplicationCommunicationModel;
