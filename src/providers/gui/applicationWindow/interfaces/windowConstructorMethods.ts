import ApplicationWindow from "../applicationWindow";

export default interface WindowConstructorMethods {
  Window(executionLocation: string, pid: number): Promise<ApplicationWindow>;
}
