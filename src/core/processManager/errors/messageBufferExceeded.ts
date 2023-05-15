import Exit from "@providers/error/systemErrors/Exit";

class MessagebufferExceeded extends Exit {
  constructor() {
    super(7, "MESSAGE_BUFFER_EXCEEDED");
  }
}

export default MessagebufferExceeded;
