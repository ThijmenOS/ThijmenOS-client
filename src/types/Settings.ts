import { Path } from "javascriptOS-common/types";

export interface IBackgroundOptions {
  Change(filePath: Path): Promise<void>;
  Get(): Promise<void>;
}
