import ErrorManager from "./ErrorManager";

export default interface IErrorManager {
  RaiseError(): ErrorManager;
}
