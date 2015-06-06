var down = false;

function onLoad() {

	var socket = io();

	var canvas = document.getElementById("theCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var ctx = canvas.getContext("2d");

	socket.on('l', function(msg) {
		var parsed = JSON.parse(msg);
		ctx.fillRect(parsed.x, parsed.y, 3, 3);
	});

	addEventListener("mousedown", function(e) {
		ctx.moveTo(e.pageX, e.pageY)
		down = true;
	}, false);

	addEventListener("mouseup", function(e) {
		down = false;
	}, false);

	addEventListener("mousemove", function(e) {
		if (down) {
			ctx.fillRect(e.pageX, e.pageY, 3, 3);
			socket.emit('l', '{"x":' + e.pageX + ',"y":' + e.pageY + '}');
		}
	}, false);

}