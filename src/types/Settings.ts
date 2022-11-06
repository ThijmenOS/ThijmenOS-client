import { Path } from "@common/FileSystem";

export interface IBackgroundOptions {
  Change(filePath: Path): Promise<void>;
  Get(): Promise<void>;
}
