var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, () => {
    console.log('listening for requests on port 4000,');
});

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    socket.on('send', (data) => {
        socket.broadcast.emit('receive', data);
    });

});
