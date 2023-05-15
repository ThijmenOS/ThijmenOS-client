import Exit from "@providers/error/systemErrors/Exit";

class MsgBusAlreadyExists extends Exit {
  constructor() {
    super(7, "MSG_BUS_ALREADY_EXITS");
  }
}

export default MsgBusAlreadyExists;
