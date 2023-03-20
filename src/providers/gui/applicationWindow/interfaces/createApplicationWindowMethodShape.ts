import { ApplicationMetaData } from "@thijmen-os/common";
import ApplicationWindow from "../applicationWindow";

export default interface createApplicationWindowMethodShape {
  Application(fileIcon: any | ApplicationMetaData): ApplicationWindow;
}
