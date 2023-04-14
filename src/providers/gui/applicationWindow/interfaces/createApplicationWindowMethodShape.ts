import { ApplicationMetaData } from "@thijmen-os/common";
import ApplicationWindow from "../applicationWindow";

export default interface CreateApplicationWindowMethodShape {
  Application(fileIcon: any | ApplicationMetaData): ApplicationWindow;
}
