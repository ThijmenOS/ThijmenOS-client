//DI
import ApplicationNotFoundError from "./errors/applicationNotFound";
import FatalError from "./errors/fatalError";
import NoApplicationForFiletypeError from "./errors/noApplicationForFiletypeError";

class ErrorManager {
  static fatalError = FatalError;
  static applicationNotFoundError = ApplicationNotFoundError;
  static noApplicationForFiletypeError = NoApplicationForFiletypeError;
}

export default ErrorManager;
