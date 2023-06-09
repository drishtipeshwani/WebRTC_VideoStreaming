const socket = io('https://video-streaming.adaptable.app');
const peer = new Peer(undefined, {
  host: "video-streaming.adaptable.app",
  path:"/peerjs/myapp"
});

const video = document.getElementById('videoPlayer');
const fileInput = document.getElementById('fileInput');
const sendButton = document.getElementById('sendButton');

peer.on('open', function (id) {
  // Unique peer join the dashboard
  socket.emit('join', id);
  // Sender Side 
  socket.on('userJoined', (userId) => {
    alert('User Joined')
    const conn = peer.connect(userId.userId);
    conn.on('open', function () {
      sendButton.addEventListener('click', function () {
        const file = fileInput.files[0];
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = function (event) {
          const arrayBuffer = event.target.result;
          conn.send(arrayBuffer)
        }

      });
      conn.on('data', function (data) {
        const blob = new Blob([data]);
        const videoURL = window.URL.createObjectURL(blob);
        video.src = videoURL;
        video.play();
      });
    });
  })
  // Receiver Side 
  socket.on('joined', () => {
    peer.on('connection', (conn) => {
      conn.on('open', function () {
        sendButton.addEventListener('click', function () {
          const file = fileInput.files[0];
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
          fileReader.onload = function (event) {
            const arrayBuffer = event.target.result;
            conn.send(arrayBuffer)
          }

        });
        conn.on('data', function (data) {
          const blob = new Blob([data]);
          const videoURL = window.URL.createObjectURL(blob);
          video.src = videoURL;
          video.play();
        });
      });
    })
  })
  socket.on('userDisconnected',(userId)=>{
    alert('User disconnected')
  })
});






