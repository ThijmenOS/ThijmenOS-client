import { ApplicationMetaData } from "@interface/application/applicationProperties";
import FileIcon from "fileIcon/fileIcon";
import Window from "window/window";

export interface ICreateWindow {
  Application(fileIcon: FileIcon | ApplicationMetaData): Window;
  InitWindow(): Window;
}
