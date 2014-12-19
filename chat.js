var express = require('express'),
	app = express(),
	http=require('http').Server(app),
	io = require('socket.io')(http);
	//,filePath = require('./Chatroom.html');
	
	
	
app.get('/',function(req,res){
	//res.sendFile(filePath);
	res.sendfile('Chatroom.html');
});

io.on('connection',function(socket){
	console.log('a user has connected');
	socket.on('cm',function(msg){
		io.emit('cm',msg);
		console.log(msg);
	});
	socket.on('disconnect',function(msg){
		console.log('a user has disconnected');
	});
	
});

http.listen(1335,function(){
console.log('listeninig for pings on 1335');
});