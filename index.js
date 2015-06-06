var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var num_users = 0;

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket) {
	console.log('a user connected');
	num_users++;
	updateUsers();

	socket.on('move', function(msg) {
		console.log(msg);
		var parsed = JSON.parse(msg);
		socket.broadcast.emit('move', '{"id":"' + socket.id + '","x":' + parsed.x + ',"y":' + parsed.y + '}');
	});

	socket.on('release', function(msg) {
		console.log(socket.id + " released");
		socket.broadcast.emit('release', socket.id);
	});

	socket.on('disconnect', function() {
		console.log('a user disconnected');
		num_users--;
		updateUsers();
	});

});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function updateUsers() {
	io.emit('users', num_users);
}
