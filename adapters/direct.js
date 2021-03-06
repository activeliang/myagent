var http = require('http');
var https = require('https');
var net = require('net');

exports.requestHandler = requestHandler;
exports.connectHandler = connectHandler;

function requestHandler(browserRequest, browserResponse, options, params) {
	var mod = options.protocol === "http:" ? http : https;
	var requestObj = mod.request(options, function(response){
		browserResponse.writeHead(response.statusCode, response.headers);
		response.pipe(browserResponse);
	});
	requestObj.on('error', function(e){
		browserResponse.writeHead(500);
		browserResponse.end(e.message + "\n" + e.stack);
	});
	browserRequest.pipe(requestObj)
}

function connectHandler(browserRequest, browserSocket, params) {
	var socket = net.connect(parseInt(params.port), params.host);
	socket.on('timeout', function(){
		browserSocket.end("forward server timeout");
	});
	socket.on('error', function(e){
		browserSocket.end('forward server error:' + e.message);
	});
	browserSocket.pipe(socket);
	socket.pipe(browserSocket);
}