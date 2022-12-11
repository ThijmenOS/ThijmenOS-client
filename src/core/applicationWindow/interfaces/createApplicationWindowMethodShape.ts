import { ApplicationMetaData } from "@thijmen-os/common";
import Window from "../applicationWindow";

export default interface createApplicationWindowMethodShape {
  Application(fileIcon: any | ApplicationMetaData): Window;
}
