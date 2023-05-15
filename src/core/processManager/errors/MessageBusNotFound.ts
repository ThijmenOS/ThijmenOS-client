import Exit from "@providers/error/systemErrors/Exit";

class MessageBusNotFOund extends Exit {
  constructor() {
    super(7, "MSG_BUS_NOT_FOUND");
  }
}

export default MessageBusNotFOund;
