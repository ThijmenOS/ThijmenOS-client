enum FileAccessOptions {
  r = "r",
  w = "w",
  x = "x",
}

type FileAccess = { [key in FileAccessOptions]: boolean };

export { FileAccessOptions, FileAccess };
