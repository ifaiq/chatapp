var socket = io();
socket.on('connect',function(){
    console.log('New Connection');

});
socket.on('disconnect',function(){
    console.log('Disconnect');
})


socket.on('newMessage',function(email){
    console.log('New Email', email);
    
    
    })