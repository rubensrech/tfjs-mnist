const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const express = require('express');
const bodyParser = require('body-parser');

const recognizer = require('./server/recognizer');

const app = express();
const port = 3000;

// > Configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended : 'true' }));        // parse application/x-www-form-urlencoded

// > Routes
recognizer(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

// otherwise ...
app.all('*', function(req, res) {
    res.sendFile(__dirname + '/public/notfound.html');
});
 
app.listen(port);
console.log("Server listening on port " + port);