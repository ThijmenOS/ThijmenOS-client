import { JsOsCommunicationMessage } from "./kernelTypes";

export default interface KernelMethodShape {
  LoadKernel(): void;
  ProcessMethod(props: JsOsCommunicationMessage): void;
}
