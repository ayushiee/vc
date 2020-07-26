const socket = io('/');  //to connect to root path
const videoGrid = document.getElementById('video-grid'); //ref to grid where we place all video
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
})

const myVideo = document.createElement('video');
myVideo.muted = true; //mutes for self

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
 addVideoStream(myVideo, stream)
})

//send an event to server
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', userId => { //listening to event
    console.log(`User connected: ${userId}`)
})

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}