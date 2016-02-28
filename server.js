var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');

var app = express();

app.listen(process.env.PORT || 3000, function() {});
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/src/index.html');
});

app.put('/save', function(req, res) {
    fs.writeFile('assets/applications/' + req.body.applicationId + '.json', JSON.stringify(req.body.formData), function() {
        res.end();
    });
});
