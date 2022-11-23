import { Path } from "@thijmenos/common";

export interface IBackgroundOptions {
  Change(filePath: Path): Promise<void>;
  Get(): Promise<void>;
}
