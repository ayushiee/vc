const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
const { SSL_OP_NO_TICKET } = require('constants');

app.set('view engine', 'ejs');
app.use(express.static('public')); //all files stored in public folder

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`) //gives a dynamic url
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {  //event
        socket.join(roomId); //joining room with current user
        socket.to(roomId).broadcast.emit('user-connected', userId) //broadcastsa msg to all the userIdjoined

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000);