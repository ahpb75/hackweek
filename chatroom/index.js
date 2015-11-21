var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/chatroom',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

var usernames = {};
var userCount = 0;
var location = [];

io.on('connection',function(socket){

	socket.broadcast.emit('newuser',{msg:'new user connected'});


	socket.on('chat message', function(msg){
		console.log(msg);
		io.emit('chat message' , msg);
	});

	socket.on('location',function(msg){
		// location.push(msg);
		// console.log(msg);
		io.emit('location',msg);
	});

	userCount++;
        io.sockets.emit('userCount', { userCount: userCount });

    socket.on('disconnect', function() {
        userCount--;
        io.sockets.emit('userCount', { userCount: userCount });
        socket.broadcast.emit('userleave','a user leave');
        });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
