var http = require('http');
var fs = require('fs');
var app = require('express')();


var clients = [];
var spawnPosition = [[0,0,0],[20,0,10],[-20,0,10],[20,0,-10],[-20,0,-10]];
var server = http.Server(app);
var index =0;

app.get('/',function(req,res){
    fs.readFile('./index.html','utf-8',function(err,content){
        res.writeHead(200,{ "content-type":"text/html" });
        res.end(content);
    });
});
var io = require('socket.io').listen(server);

io.on('connection',function(socket){
	var currentPlayer ={};
	socket.on('new player',function(data){
		currentPlayer = data;
		//console.log(data);
		socket.broadcast.emit('new player joined',data);
		for(var i=0;i<clients.length;i++){
			socket.emit('client already connected',clients[i]);
		}
		clients.push(data);
	});
	socket.on('update transform',function(data){
		//console.log(data);
		socket.broadcast.emit('other player moved',data);
	});
});


server.listen(process.env.PORT ||3000);