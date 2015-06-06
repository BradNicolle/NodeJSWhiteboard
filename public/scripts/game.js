var down = false;

var userMap = {};

function onLoad() {

	var socket = io();

	var canvas = document.getElementById("theCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var ctx = canvas.getContext("2d");

//	ctx.moveTo(0, 0);

	socket.on('move', function(msg) {
		var parsed = JSON.parse(msg);
		if (userMap[parsed.id] == null) {
			ctx.beginPath();
		}
		else {
			var user = userMap[parsed.id];
			ctx.moveTo(user.x, user.y);
		}
		userMap[parsed.id] = parsed;
		ctx.lineTo(parsed.x, parsed.y);
		ctx.stroke();
	});

	socket.on('users', function(msg) {
		document.getElementById("counter_text").innerText = msg;
	});

	socket.on('release', function(msg) {
		if (msg in userMap) {
			userMap[msg] = null;
		}
	});

	addEventListener("mousedown", function(e) {
		ctx.moveTo(e.pageX, e.pageY)
		down = true;
	}, false);

	addEventListener("mouseup", function(e) {
		down = false;
		socket.emit('release');
	}, false);

	addEventListener("mousemove", function(e) {
		if (down) {
			ctx.lineTo(e.pageX, e.pageY);
			ctx.stroke();

			socket.emit('move', '{"x":' + e.pageX + ',"y":' + e.pageY + '}');
		}
	}, false);

}