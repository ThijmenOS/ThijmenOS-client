import IKernel from "@core/kernel/IKernel";
import types from "@ostypes/types";
import javascriptOs from "../inversify.config";

describe("test", () => {
  test("test", () => {
    const kernel = javascriptOs.get<IKernel>(types.Kernel);
    const sut = kernel.ListenToCommunication();

    window.top?.postMessage("test", "*");

    expect(sut).toBeCalled();
  });
});
