const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

let model = require('./model');


// Train
// let trainEpochs = 1;
// model.trainModel(trainEpochs);

// Evaluate
// model.evaluateModel();

model.predict();