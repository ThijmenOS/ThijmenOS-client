import { ApplicationMetaData } from "@thijmenos/common/types";
import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";

export default interface ICreateWindow {
  Application(fileIcon: FileIcon | ApplicationMetaData): Window;
  InitWindow(): Window;
}
