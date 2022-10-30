import { injectable } from "inversify";
import IErrorManager from "./IErrorManager";

@injectable()
class ErrorManager implements IErrorManager {
  public RaiseError(error: string) {
    throw new Error(error);
  }
}

export default ErrorManager;
