var express = require('express'),
	app = express(),
	http=require('http').Server(app),
	io = require('socket.io')(http);
	//,filePath = require('./Chatroom.html');
	
	
var userList = [];
app.get('/',function(req,res){
	//res.sendFile(filePath);
	res.sendfile('Chatroom.html');
});

app.get('/personalChat',function(req,res){
	//res.sendFile(filePath);
	res.sendfile('personalChat.html');
});


io.on('connection',function(socket){
	

	console.log('a user has connected');	
	
		socket.on('cm',function(msg){
		
		
		//message emitting
		io.emit('cm',msg);
		//console.log(msg);
	});
	
	socket.on('ul',function(user){
		console.log(userList);
		//if(userList.indexOf(user) == -1){
			userList.push(user);
		//}
		console.log(userList);
		io.emit('ul',userList);
	});

	socket.on('depart',function(user){
	//var user = msg.split(';')[0];
	
		if(userlist.indexof(user) != -1){
			userlist.splice(userlist.indexof(user,1));
		}
		console.log(user + ':  user has disconnected');
	});
	
	socket.on('disconnect',function(user){
	//var user = msg.split(';')[0];
	
	//	if(userList.indexOf(user) != -1){
	//		userList.splice(userList.indexOf(user,1));
	//	}
		console.log(user + ':  user has disconnected');
	});
	
	
	
	
});

http.listen(1335,function(){
console.log('listeninig for pings on 1335');
});