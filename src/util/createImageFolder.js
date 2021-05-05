const fs = require("fs");
const path = require("path");

//dirpath = /students
const createDir = (dirPath) => {
  const appDir = path.dirname(require.main.filename);

  fs.mkdirSync(`${appDir}/${dirPath}`, { recursive: true }, (error) => {
    if (error) {
      console.error("An error occured while creating dir: ", error);
    }
  });
};

const createFile = (filePath, fileContent) => {
  fs.writeFile(filePath, fileContent, (error) => {
    if (error) {
      console.error("An error occured while creating file: ", error);
    }
  });
};

const deleteFolder = (path) => {
  fs.unlink(path, (error) => {
    if (error) {
      console.error("An error occured while deleting folder: ", error);
    }
  });
};

module.exports = {
  createDir,
  createFile,
  deleteFolder,
};
