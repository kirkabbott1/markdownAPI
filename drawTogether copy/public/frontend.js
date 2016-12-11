var socket = io();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var mousebool = false;

drawCircle = function(x,y) {
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  coords = [x, y];
  socket.emit('draw', coords);
  // socket.on('sent draw', function(coords) {
  //   console.log('got coords, ', coords);
  // });
}
$('#canvas').on('mousemove', function(poopevent) {
  if (mousebool) {
    drawCircle(poopevent.pageX, poopevent.pageY)
  }
});
$('#canvas').on('mousedown', function(poopevent) {
  mousebool = true;
});
$('#canvas').on('mouseup', function(poopevent) {
  mousebool = false;
});

socket.on('sent draw', function(coords) {
  console.log('got coords, ', coords);
  drawCircle(coords[0], coords[1]);
});
