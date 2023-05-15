import Exit from "@providers/error/systemErrors/Exit";

class CantDeleteMessageBus extends Exit {
  constructor() {
    super(7, "CANT_DELETE_MESSAGE_BUS");
  }
}

export default CantDeleteMessageBus;
