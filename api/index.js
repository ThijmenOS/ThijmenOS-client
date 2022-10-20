import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
const port = 8080;

let baseDir = "userFiles\\";

function getFilesInDir(dir) {
  let targetDir = path.join(baseDir, dir);

  if (targetDir.indexOf(baseDir) !== 0) {
    return null;
  }

  let files = fs.readdirSync(targetDir);
  let ret = [];

  files.forEach((file) =>
    ret.push({
      filePath: dir + "/" + file,
      isDir: fs.lstatSync(path.join(targetDir, file)).isDirectory()
        ? true
        : false,
    })
  );

  return ret;
}

function readFile(dir) {
  let targetFile = path.join(baseDir, dir);

  if (targetFile.indexOf(baseDir) !== 0) return;

  return fs.readFileSync(targetFile, "utf8");
}

app.get("/filesystem/showUserFiles", (req, res) => {
  let requestedDir = req.query.dir || "";

  let result = getFilesInDir(requestedDir);

  res.send(result);
});

app.get("/filesystem/openUserFile", (req, res) => {
  let requestedFile = req.query.file;

  let result = readFile(requestedFile);

  res.send(result);
});

app.get("/filesystem/readRegisteredApplications", (req, res) => {
  let rawFile = readFile("C/Operating System/ThijmenOS data/applications.json");
  res.send(JSON.parse(rawFile));
});

app.listen(port, () => {
  console.log("api listening");
});
