const path = require('path');
const express = require('express');
const socket = require('socket.io');
var http = require('http');
const publicpath = path.join(__dirname,'../public');
var port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.use(express.static(publicpath));
io.on('connection',(socket)=>{
    console.log('New Connection');


    socket.on('createMessage', (message)=>{
    console.log('new message', message);
    io.emit('newMessage',{
        'from': message.from,
        'text': message.text,
        'createdAt': new Date().getTime()
    });
});
socket.on('disconnect',()=>{
        console.log('Disconnect');
    })
})

server.listen(port,()=>{
    console.log(`server is on port${port}`);
});