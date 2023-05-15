import MqFlag from "./messageQueueFlags";

interface MessageBusSession {
  pid: number;
  flags: Array<MqFlag>;
}

export default MessageBusSession;
