var express = require('express'),
	app = express(),
	http=require('http').Server(app),
	io = require('socket.io')(http);
	//,filePath = require('./Chatroom.html');
	
	
var userList = [];
var socketList = [];
app.get('/',function(req,res){
	//res.sendFile(filePath);
	res.sendfile('Chatroom.html');
});

app.get('/personalChat',function(req,res){
	
	//res.sendFile(filePath);
	var pvtChatUser = req.query.chatMan;
	res.sendfile('personalChat.html');
});


var previousChat = [];

var findSocketIndexByUser = function(user,socketsList){
	console.log('inside new function');
	for(var i=0,j=socketList.length;i<j;i++){
			if(typeof socketList[i] == 'undefined'){
				console.log('logged undefined ' + socketList[i]);
			}else{
				 if(socketList[i].user === user){
					return 	socketList[i];
					}
				}
			}
	}

io.on('connection',function(socket){
	socket.user = 'noUser'
	socketList.push(socket);
	//console.log(socket.user);
	//console.log(previousChat.length);
	
	//previous 10 chat lines will show to new chat user.
	for(var i=0,j=previousChat.length;i<j;i++){
			socket.emit('cm',previousChat[i]);
	}
		
	////chat request emitted from a user will emit request to requested user here
	socket.on('pmReq',function(msg){
	console.log('PM Req, msg: ' + msg);
	if( msg.indexOf('accepted') == -1 && msg.indexOf('denied') == -1 ){
		console.log('PM Req - new req');
			var indexReqSocket = socketList.indexOf(socket);
			var reqUser = socketList[indexReqSocket].user
			console.log(reqUser + ": requested to chat in person to :" );
			console.log(msg);
			
			//this loop to find the user to whom PM request has to be made
			console.log("number of sockets active:" +socketList.length);
			for(var i=0,j=socketList.length;i<j;i++){
			if(typeof socketList[i] == 'undefined'){
				console.log('logged undefined ' + socketList[i]);
			}else{
				 if(socketList[i].user === msg){
						socketList[i].emit('pmReq', reqUser);
					}
				}
			}
			
			
			console.log(socketList.length);
		} else if( msg.indexOf('accepted') != -1){ 
			var reqUser = msg.split('-')[1];
			var isocket = findSocketIndexByUser(reqUser);
			isocket.emit('pmReq','accepted');
		} else if(msg.indexOf('denied') != -1) {
			var isocket = findSocketIndexByUser(reqUser);
			isocket.emit('pmReq','accepted');
		}
	});
	
	
	socket.on('cm',function(msg){
		//var user = msg.split(':')[0];	
		//socket.user = user;
		//message emitting
		previousChat.push(msg);
		if (previousChat.length > 10)
			previousChat.shift();
			
			
		
		io.emit('cm',msg);
		//console.log(msg);
	});
	
	socket.on('ul',function(user){
		
		console.log(user + ': user has connected');	
		socket.user = user;
		console.log(userList);
		//if(userList.indexOf(user) == -1){
			userList.push(user);
		//}
		console.log(userList);
		io.emit('ul',userList);
	});

	
	socket.on('disconnect',function(user){

		console.log(userList.indexOf(socket.user));
		if(userList.indexOf(socket.user) != -1){
			userList.splice(userList.indexOf(socket.user),1);
		}
		var i = socketList.indexOf(socket);
		delete socketList[i];
	
		console.log(socket.user + ':  user has disconnected');
	});
	
	
	
	
});

http.listen(1335,function(){
console.log('listeninig for pings on 1335');
});