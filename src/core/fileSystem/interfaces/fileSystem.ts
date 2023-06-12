import { FileAccess, FileAccessOptions } from "../enums/fileAccess";
import File from "../models/file";

interface FileSystem {
  Initialise(): void;
  ValidateAccess<T extends boolean = false>(
    path: string,
    operation: FileAccessOptions,
    fd?: boolean
  ): File | T;
  RegisterFile(
    path: string,
    userId: string,
    accessMap: FileAccess
  ): File | null;
}

export default FileSystem;
