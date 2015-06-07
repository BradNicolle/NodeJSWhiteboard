var socket = io();

var canvas;
var ctx;

var down = false;

var userMap = {};

function onLoad() {

	canvas = document.getElementById("theCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx = canvas.getContext("2d");

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

	addEventListener("mousedown", downHandler, true);
	addEventListener("touchstart", downHandler, true);
	addEventListener("mouseup", upHandler, true);
	addEventListener("touchend", upHandler, true);
	addEventListener("mousemove", moveHandler, true);
	addEventListener("touchmove", moveHandler, true);
}

function downHandler(e) {
	document.getElementById("eventBox").innerText = "down " + e.type;
	var x, y;
	if (e.type == "touchstart") {
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY;
	}
	else {
		x = e.pageX;
		y = e.pageY;
	}
	ctx.moveTo(x, y);
	down = true;
	e.preventDefault();
}

function upHandler(e) {
	document.getElementById("eventBox").innerText = "up " + e.type;
	down = false;
	socket.emit('release');
	e.preventDefault();
}

function moveHandler(e) {
	document.getElementById("eventBox").innerText = "move " + e.type;
	var x, y;
	if (e.type == "touchmove") {
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY;
	}
	else {
		x = e.pageX;
		y = e.pageY;
	}
	if (down) {
			ctx.lineTo(x, y);
			ctx.stroke();

			socket.emit('move', '{"x":' + x + ',"y":' + y + '}');
	}
	e.preventDefault();
}