const container = document.querySelector('#containerId');
const hangupBtn = document.querySelector('#hangupBtn');
const fullScreenIcon = document.querySelector('#fullscreen-icon');
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');
const videoFrameSwitch = document.querySelector('#video-frame-switch');
const mic = document.querySelector('#mic');
const camera = document.querySelector('#camera');

function main() {
  // toggle fullscreen
  fullScreenIcon.addEventListener('click', () => {
    container.classList.toggle('container');
    container.classList.toggle('customContainer');
    container.classList.toggle('container-fluid');
    container.classList.toggle('fullscreen-container');
  });

  // switch between mini video stream and large video stream
  videoFrameSwitch.addEventListener('click', () => {
    localVideo.classList.toggle('miniVideo');
    localVideo.classList.toggle('largeVideo');

    remoteVideo.classList.toggle('largeVideo');
    remoteVideo.classList.toggle('miniVideo');
  });

  // exit call
  hangupBtn.addEventListener('click', () => {
    // code to redirect to home page
    console.log('To be implemented');
  });

  // toggle mic on/off
  mic.addEventListener('click', () => {
    mic.firstChild.classList.toggle('bi-mic-fill');
    mic.firstChild.classList.toggle('bi-mic-mute-fill');
    mic.firstChild.classList.toggle('text-danger');
  });

  // toggle camera on/off
  camera.addEventListener('click', () => {
    camera.firstChild.classList.toggle('bi-camera-video-fill');
    camera.firstChild.classList.toggle('bi-camera-video-off-fill');
    camera.firstChild.classList.toggle('text-danger');
  });
}

/*
  Some of the code will need further implementation

  toggle fullscreen => complete
  switch between mini video stream and large video stream => complete
  exit call => incomplete
  toggle mic on/off => incomplete
  toggle camera on/off => incomplete

 */
main()
// module.exports = main;