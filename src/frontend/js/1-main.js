import dbClient from "../utils/db.js";
import Media from "../utils/media.js";
import {
  onSnapshot,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomId = null;
// const configuration = {
//   iceServers: [
//     { urls: 'stun:stun.relay.metered.ca:80' },
//     {
//       urls: 'turn:global.relay.metered.ca:80',
//       username: '9ec551072160e83ff2afd0b2',
//       credential: 'gvm3pbOROCXc7jSX'
//     },
//     {
//       urls: 'turn:global.relay.metered.ca:80?transport=tcp',
//       username: '9ec551072160e83ff2afd0b2',
//       credential: 'gvm3pbOROCXc7jSX'
//     },
//     {
//       urls: 'turn:global.relay.metered.ca:443',
//       username: '9ec551072160e83ff2afd0b2',
//       credential: 'gvm3pbOROCXc7jSX'
//     },
//     {
//       urls: 'turns:global.relay.metered.ca:443?transport=tcp',
//       username: '9ec551072160e83ff2afd0b2',
//       credential: 'gvm3pbOROCXc7jSX'
//     }
//   ]
// };

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun1.l.google.com:19302'
    },
    {
      urls:  'stun:stun2.l.google.com:19302'
    },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
  ]
};

// const iceServers = await fetch('/ice-servers').then((res) => res.json());
// (async () => {
//   const iceServers = fetch('/ice-servers').then((res) => res.json());
//   console.log(`iceServers: ${iceServers}`);
//   configuration.iceServers = iceServers;
// })();

const container = document.querySelector('#containerId');
const hangupBtn = document.querySelector('#hangupBtn');
const fullScreenIcon = document.querySelector('#fullscreen-icon');
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');
const videoFrameSwitch = document.querySelector('#video-frame-switch');
const mic = document.querySelector('#mic');
const camera = document.querySelector('#camera');


function addTracksToPeerConnection(constraints) {
  if (constraints.audio) {
    const [track] = localStream.getAudioTracks();
    peerConnection.addTrack(track, localStream);
  }
  if (constraints.video) {
    const [track] = localStream.getVideoTracks();
    peerConnection.addTrack(track, localStream);
  }
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', async (event) => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
    if (peerConnection.connectionState === 'disconnected') {
      if (remoteStream) {
        console.log('Remote Disconnected, Stoping remote tracks now');
        remoteStream.getTracks().forEach((track) => track.stop());
        remoteStream = null;
      }
      await deleteRoom(roomId);
      roomId = null;
    }
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

function deleteRoom(roomId) {
  return new Promise(async (resolve) => {
    if (roomId) {
      const roomDocRef = dbClient.getDocRef('room', roomId);
      const calleeCandidates = await getDocs(collection(roomDocRef, 'calleeCandidates'));
      calleeCandidates.forEach(async (candidate) => {
        await deleteDoc(candidate.ref);
      });
      const callerCandidates = await getDocs(collection(roomDocRef, 'callerCandidates'));
      callerCandidates.forEach(async (candidate) => {
        await deleteDoc(candidate.ref);
      });
      await deleteDoc(roomDocRef);
    }
    resolve({});
  });
}


async function createRoom() {
  localStream = await Media.openUserMedia();
  remoteStream = new MediaStream();

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  const constraints = { video: true, audio: true };
  addTracksToPeerConnection(constraints);
  localVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  registerPeerConnectionListeners();

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    }
  };

  const roomDocRef = await dbClient.createDoc('room', roomWithOffer);
  roomId = roomDocRef.id;

  const displayId = document.querySelector('#displayId');
  const copyId = document.querySelector('#copyId');
  displayId.value = `Line-Id  |  ${roomId}`;
  displayId.parentElement.hidden = false;

  copyId.addEventListener('click', async () => {
    displayId.select();
    displayId.setSelectionRange(0, 1000); // For mobile devices
    await navigator.clipboard.writeText(roomId);
    copyId.classList.toggle('bi-clipboard');
    copyId.classList.toggle('bi-clipboard-check-fill');
  });


  // Code for collecting ICE candidates below
  const callerCandidatesCollection = collection(roomDocRef, 'callerCandidates');

  peerConnection.addEventListener('icecandidate', async (event) => {
    if (event.candidate) {
      const json = event.candidate.toJSON();
      await addDoc(callerCandidatesCollection, json);
    }
  });
  // Code for collecting ICE candidates above

  peerConnection.addEventListener('track', (event) => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track, remoteStream);
    });
  });

  // Listening for remote session description below
  onSnapshot(roomDocRef, async (snapshot) => {
    const data = snapshot.data();
    console.log('Got updated room:', data);
    if (!peerConnection.currentRemoteDescription && data.answer) {
      const answer = new RTCSessionDescription(data.answer);
      console.log('Set remote description: ', answer);
      await peerConnection.setRemoteDescription(answer);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  onSnapshot(collection(roomDocRef, 'calleeCandidates'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        console.log(`added calleIceCandidate: ${candidate}`);
        peerConnection.addIceCandidate(candidate);
      }
    });
  });
  // Listen for remote ICE candidates above
}

async function joinRoomById(roomId) {
  const roomDocRef = dbClient.getDocRef('room', roomId);
  const roomSnapshot = await getDoc(roomDocRef);
  localStream = await Media.openUserMedia();
  remoteStream = new MediaStream();

  peerConnection = new RTCPeerConnection(configuration);
  const constraints = { video: true, audio: true };
  addTracksToPeerConnection(constraints);
  localVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  registerPeerConnectionListeners();

  // Code for collecting ICE candidates below
  const calleeCandidatesCollection = collection(roomDocRef, 'calleeCandidates');

  peerConnection.addEventListener('icecandidate', async (event) => {
    if (event.candidate) {
      const json = event.candidate.toJSON();
      await addDoc(calleeCandidatesCollection, json);
    }
  });

  onSnapshot(collection(roomDocRef, 'callerCandidates'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    });
  });
  // Code for collecting ICE candidates above

  peerConnection.addEventListener('track', (event) => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track, remoteStream);
    });
  });

  // Code for creating SDP answer below
  const offer = roomSnapshot.data().offer;
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  const roomWithAnswer = {
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
  };
  await updateDoc(roomDocRef, roomWithAnswer);
  // Code for creating SDP answer above

  // Listening for remote ICE candidates below
  onSnapshot(collection(roomDocRef, 'callerCandidates'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    });
  });
  // Listening for remote ICE candidates above
}


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
hangupBtn.addEventListener('click', async () => {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
  await deleteRoom(roomId);
  window.location.href = '/';
});


// enable or disable video/audio
function toggleEnabled(tracks) {
  if (tracks === 'audio') {
    const audio = localStream.getAudioTracks()[0];
    audio.enabled = !audio.enabled;
  } else if (tracks === 'video') {
    const video = localStream.getVideoTracks()[0];
    video.enabled = !video.enabled;
  }
}


// toggle mic on/off
mic.addEventListener('click', () => {
  mic.firstChild.classList.toggle('bi-mic-fill');
  mic.firstChild.classList.toggle('bi-mic-mute-fill');
  mic.firstChild.classList.toggle('text-danger');
  toggleEnabled('audio');
});

// toggle camera on/off
camera.addEventListener('click', () => {
  camera.firstChild.classList.toggle('bi-camera-video-fill');
  camera.firstChild.classList.toggle('bi-camera-video-off-fill');
  camera.firstChild.classList.toggle('text-danger');
  toggleEnabled('video');
});


const uri = window.location.href.split('/');
roomId = uri.pop()
const isCreate = uri.pop() === 'create';
if (isCreate) {
  createRoom();
} else joinRoomById(roomId);
