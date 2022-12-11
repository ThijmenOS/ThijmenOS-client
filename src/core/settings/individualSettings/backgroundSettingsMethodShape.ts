import { Path } from "@thijmen-os/common";

export default interface BackgroundSettingsMethodShape {
  Change(filePath: Path): Promise<void>;
  Get(): Promise<void>;
}
