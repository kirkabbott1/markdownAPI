var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket) {
  console.log('logged in');
  socket.on('draw', function(coords) {
    console.log(coords);
    io.emit('sent draw', coords);
  });
});






http.listen(8000, function() {
  console.log('listening 8000')
})
