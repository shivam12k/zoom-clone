const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
let myVideoStream;
myVideo.muted = true;

console.log(videoGrid);

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});



// adding  media 

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        // const video = document.createElement('video')
        // call.on('stream', userVideoStream => {
        //     addVideoStream(video, userVideoStream);
        // })
    })

    socket.on('user-connected', (userId, stream) => {
        connectToNewUser(userId, stream);
    })

})


//socket 


peer.on('open', id => {

    socket.emit('join-room', ROOM_ID, id);
   
})

const connectToNewUser = (userId, stream) => {
    // console.log("new user is connected of user id", userId);
     console.log("stream", stream)
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
  
     call.on('stream', userVideoStream => {
         console.log("calling")
        addVideoStream(video, userVideoStream);
    })

    call.on('close', () => {
        console.log("video remove")
        video.remove()
    })
}

// function which render  video
const addVideoStream = (video, stream) => {
    console.log("video stream")
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();

    })
    videoGrid.append(video);
}
