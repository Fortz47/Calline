import path from "path";

class Appcontroller {
  static homePage (req, res) {
    const rootPath = path.join(__dirname, '../frontend/html');
    res.sendFile('0-index.html', { root: rootPath});
  }

  static async iceServers(req, res) {
    const API_KEY = process.env.ICE_SERVER_API_KEY;
    const appName = 'calline-video-chat';
    const response = await fetch(`https://${appName}.metered.live/api/v1/turn/credentials?apiKey=${API_KEY}`);
    const iceServers = await response.json();
    res.send(iceServers);
  }

  static firebaseApiKey(req, res) {
    res.send(process.env.FIREBASE_API_KEY);
  }
}

export default Appcontroller;