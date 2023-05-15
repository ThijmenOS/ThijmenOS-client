import Exit from "@providers/error/systemErrors/Exit";

class MessageBusSessionNotFound extends Exit {
  constructor() {
    super(7, "MESSAGE_BUS_SESSION_NOT_FOUND");
  }
}

export default MessageBusSessionNotFound;
