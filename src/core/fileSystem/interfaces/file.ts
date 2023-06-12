import { FileAccess, FileAccessOptions } from "../enums/fileAccess";

interface FileProperties {
  userId: string;
  path: string;
  access: FileAccess;
  mode?: FileAccessOptions;
}

export default FileProperties;
