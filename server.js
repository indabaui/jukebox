var express = require('express')
  , fs = require('fs')
var app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/build'))

app.get('/opportunities*', renderIndex)

function renderIndex(req, resp) {
  var stream = fs.createReadStream(__dirname + '/public/index.html', {encoding: 'utf8'})
  stream.pipe(resp);
}

port = 5555;
app.listen(port);
console.log("port", port);
