export default interface IErrorManager {
  RaiseError(error: string): void;
  FatalError(): void;
  FileTypeNotSupportedError(): void;
}
