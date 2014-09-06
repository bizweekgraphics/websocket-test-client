var express = require('express');
var app = express();
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var server = app.listen(6000, function() {
    console.log('Listening on port %d', server.address().port);
});

var socketOrigin = argv.u;
var io = require('socket.io-client')


// Interpreted from the command line; more on this below
var clientCount = argv.c;
var connectedCount = 0

var heartbeatInterval = 25 * 1000;
var idx = 0;
var intervalID;

var makeConnection = function() {
  client = io.connect(socketOrigin, { "force new connection": true });


  client.on('connect', function() {
    console.log('connected to websockets')
    connectedCount++
    console.log("Connceted Count:" + connectedCount)
  })

  client.on('new message', function(message) {
    console.log(message)
  })

  client.on('disconnect', function() {
    connectedCount -= 1
    console.log("Disconnect! Connected Count:" + connectedCount)
  })

  console.log(idx)


  idx++;
  if (idx === clientCount) {
    clearInterval(intervalID);
  }
};

intervalID = setInterval(makeConnection, heartbeatInterval/clientCount);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
});