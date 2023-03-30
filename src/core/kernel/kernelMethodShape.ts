import { JsOsCommunicationMessage } from "./kernelTypes";

export default interface KernelMethodShape {
  loadKernel(): void;
  ProcessMethod(props: JsOsCommunicationMessage): void;
}
