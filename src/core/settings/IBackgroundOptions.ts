import { Path } from "@thijmen-os/common";

export interface IBackgroundOptions {
  Change(filePath: Path): Promise<void>;
  Get(): Promise<void>;
}
