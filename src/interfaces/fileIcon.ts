export interface Location {
  top: number;
  left: number;
}

export interface IFileIcon {
  Destory(): void;
  ConstructFileIcon(filePath: string): void;
}
