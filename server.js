// Creating a express server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); // Passing the server created to socket.io 

const { ExpressPeerServer } = require("peer");

// Set up Express.js
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('dashboard')
});

// Set up Socket.io
io.on('connection', socket => {
  // Server starts listening for connections
  // Maintaining a dictionary for mapping userId for a particular dashboardId
  socket.on('join', (userId) => {
    socket.join()
    // Tell that another peer has joined
    socket.emit('joined')
    socket.broadcast.emit('userJoined',{userId:userId})
    
    socket.on('disconnect', () => {
      // Send an alert to other users
      socket.broadcast.emit('userDisconnected', {userId: userId});
      // Close the socket connection
      socket.disconnect();
    });
  })
})

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const peerServer = ExpressPeerServer(server, {
	path: "/myapp",
});
app.use("/peerjs", peerServer);
