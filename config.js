const path = require("path");

const rootPath = __dirname;
console.log(rootPath);

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public", "uploads"),
  db: {
    name: "exam12",
    url: "mongodb://localhost/"
  },
  getDbUrl() {
    return this.db.url + this.db.name
  }
};