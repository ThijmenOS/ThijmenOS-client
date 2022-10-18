//TODO: implement new backend api
class FileSystem {
  async showFilesInDir(path = ""): Promise<Array<string>> {
    return await $.get(
      `http://localhost:8080/filesystem/showUserFiles?dir=${path}`,
      (res) => res
    );
  }
  async openFile(filePath: string) {
    return await $.get(
      `http://localhost:8080/filesystem/openUserFile?file=${filePath}`,
      (res) => res
    );
  }
}

export default FileSystem;
