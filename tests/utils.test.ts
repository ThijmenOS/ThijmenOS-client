import types from "@ostypes/types";
import IUtils from "@utils/IUtils";
import javascriptOs from "../inversify.config";

describe("test", () => {
  const sut: IUtils = javascriptOs.get<IUtils>(types.Utils);

  const result = sut.GenerateUUID();

  expect(typeof result).toBe("string");
});
