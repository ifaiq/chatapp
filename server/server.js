const path = require('path');
const express = require('express');
const socket = require('socket.io');
var http = require('http');
var {message, Locmessage} = require('./message');
const {isRealString} = require('./validation');
const {Users} = require('./users');



const publicpath = path.join(__dirname,'../public');
var port = process.env.PORT || 3000;
var users = new Users();

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.use(express.static(publicpath));


io.on('connection',(socket)=>{
    console.log('New Connection');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
          return callback('Name and room name are required.');
        }
    
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
    
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', message('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', message('Admin', `${params.name} has joined.`));
        callback();
      });
    





//     socket.emit('newMessage',message('Admin', 'Hello!'));
//     socket.broadcast.emit('newMessage',message('hi', 'join'));

//     socket.on('createMessage', (mess,callback)=>{
//     console.log('createMessage', mess);
// callback("This is from server");
// io.emit('newMessage', message(mess.from, mess.text));
// callback();

// });


socket.on('createMessage', (mess, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(mess.text)) {
      io.to(user.room).emit('newMessage', message(user.name, mess.text));
    }

    callback();
  });


  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', Locmessage(user.name, coords.latitude, coords.longitude));  
    }
  });



// socket.on('createLocationMessage', (coords) => {
//     io.emit('newLocMessage', Locmessage('Admin', coords.latitude, coords.longitude));
//   });

socket.on('disconnect',()=>{
        console.log('Disconnect');
        var user = users.removeUser(socket.id);

        if (user) {
          io.to(user.room).emit('updateUserList', users.getUserList(user.room));
          io.to(user.room).emit('newMessage', message('Admin', `${user.name} has left.`));
        }

    });
});

server.listen(port,()=>{
    console.log(`server is on port${port}`);
});