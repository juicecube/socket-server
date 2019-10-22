var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, () => {
    console.log('listening for requests on port 4000,');
});


var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // chatroom page
    handle_chatroom_page(socket);

    // editor page
    handle_whiteboard_page(socket);

    // whiteboard page
    handle_editor_page(socket);

});

// chatroom page
var numUsers = 0;
var handle_chatroom_page = (socket) => {
  var addedUser = false;

  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', (username) => {
    if (addedUser) return;
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
};

// whiteboard page
var handle_whiteboard_page = (socket) => {
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

// editor page
var handle_editor_page = (socket) => {}