import dbClient from "../utils/db.js";

const createBtn = document.querySelector('#createBtn');
const confirmJoinBtn = document.querySelector('#confirmJoinBtn');
const joinBtn = document.querySelector('#joinBtn');


createBtn.addEventListener('click', async () => {
  const id = Math.round(Math.random() * 1000000);
  // navigates to video call window
  window.location.href = `/call/create/${id}`;
}, {once: true});

joinBtn.addEventListener('click', async () => {
  confirmJoinBtn.addEventListener('click', async () => {
    const roomId = document.getElementById('room-id');
    const docSnap = await dbClient.getDocById('room', roomId.value);
    console.log('Got room:', docSnap.exists());

    if (docSnap.exists()) window.location.href = `/call/join/${roomId.value}`;
  });
});