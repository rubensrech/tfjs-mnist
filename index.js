const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var express = require('express');
var bodyParser = require('body-parser');

const PNG = require('pngjs').PNG;

// let model = require('./model');
var app = express();
var port = 3000;

// > Configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended : 'true' }));        // parse application/x-www-form-urlencoded

// > Routes
app.post('/api/rec', function(req, res) {
    var imgBase64 = req.body.base64;
    imgBase64 = imgBase64.split(',')[1];
    var imgData = Buffer.from(imgBase64, 'base64');    
    console.log(imgData.length);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

// otherwise ...
app.all('*', function(req, res) {
    res.sendFile(__dirname + '/public/notfound.html');
});
 
app.listen(port);
console.log("App listening on port " + port);