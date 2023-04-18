import ApplicationWindow from "../applicationWindow";

export default interface ProcessConstructorMethods {
  Process(executionLocation: string, pid: string): Promise<HTMLIFrameElement>;
  Window(executionLocation: string): Promise<ApplicationWindow>;
}
