const socket = io('/');  //to connect to root path
const videoGrid = document.getElementById('video-grid'); //ref to grid where we place all video
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
})

const myVideo = document.createElement('video');
myVideo.muted = true; //mutes for self
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    //attending new call on existing video platform
    myPeer.on('call', call => {
        call.answer(stream)

        //adding video to new user window
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    //to connect to other users
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

//send an event to server
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', userId => { //listening to event
    console.log(`User connected: ${userId}`)
})

//closing connection
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    //adding new user video 
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    //disconnecting video on call drop
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

