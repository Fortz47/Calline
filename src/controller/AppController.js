import path from "path";

class Appcontroller {
  static homePage (req, res) {
    const rootPath = path.join(__dirname, '../frontend/html');
    res.sendFile('0-index.html', { root: rootPath});
  }
}

export default Appcontroller;