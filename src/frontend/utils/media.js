class Media {
  static async openUserMedia () {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    return stream;
  }
}

export default Media;