var express = require('express');

var app = express();

app.listen(3000, function() {});
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/build'));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/src/index.html');
});
