var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('l', function(msg) {
		console.log(msg);
		socket.broadcast.emit('l', msg);
	});
});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
