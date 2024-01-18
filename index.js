const WebSocket = require('ws');
const server = new WebSocket.Server({
  port: 8080
});

let sockets = [];
server.on('listening', function() {
	console.log('Server is listening on port 8080');
});

let lastLeaderboard = null;
server.on('connection', function(socket) {
  sockets.push(socket);

	console.log('open');
	if (lastLeaderboard) {
		socket.send(JSON.stringify({
			action: 'update',
			leaderBoard: lastLeaderboard
		}))
	}

  // When you receive a message, send that message to every socket.
	socket.on('message', function (msg) {
		const data = (msg.toString())
		console.log({ data })
		try {
			const json = JSON.parse(data)
			if (json.action === 'update') {
				lastLeaderboard = json.leaderBoard;
;			}
		} catch (e) {
			console.error(e)
		}
    sockets.filter(s => s !== socket).forEach(s => s.send(data))
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});
