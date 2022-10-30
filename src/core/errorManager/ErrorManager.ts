/* <Class Documentation>

  <Class Description>
    The ErrorManager class is to correctly handle errors that occure within the operating system. When there are errors in other classes and methods they will class this class to handle it correctly with a message and worst case a blue screen

*/

//DI
import { injectable } from "inversify";

//Interfaces
import IErrorManager from "./IErrorManager";

@injectable()
class ErrorManager implements IErrorManager {
  public RaiseError(error: string) {
    throw new Error(error);
  }
}

export default ErrorManager;
