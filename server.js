var express = require('express')
  , fs = require('fs')
var app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/build'))

port = 5555;
app.listen(port);
console.log("port", port);
