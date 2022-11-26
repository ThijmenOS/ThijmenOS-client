//geeft instantie van de class mee

import { ICommand } from "@ostypes/CommandTypes";

class Mediator {
  static send(command: ICommand) {
    return command.Handle();
  }
}

export default Mediator;
