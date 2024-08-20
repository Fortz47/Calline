import path from "path";

class Appcontroller {
  static homePage (req, res) {
    const rootPath = path.join(__dirname, '../frontend/html');
    res.sendFile('0-index.html', { root: rootPath});
  }

  static async iceServers(req, res) {
    const API_KEY = '55c68405accc7dbed86697524a2b714229a1';
    const appName = 'calline-video-chat';
    const response = await fetch(`https://${appName}.metered.live/api/v1/turn/credentials?apiKey=${API_KEY}`);
    const iceServers = await response.json();
    console.log('iceServers:', iceServers);
    res.json(iceServers);
    // return iceServers;
  }
}

export default Appcontroller;