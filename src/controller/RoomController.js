import path from "path";

class RoomController {
  static async openRoom (req, res) {
    const rootPath = path.join(__dirname, '../frontend/html');
    res.sendFile('1-index.html', { root: rootPath});
  }
}

export default RoomController;