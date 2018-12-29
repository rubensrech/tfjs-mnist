const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const fs = require('fs');

const data = require('./data');

// Constants

const DEFAULT_MODEL_PATH = __dirname + '/../backup.model';

// Variables

let model;

// Support functions

function createModel() {
    const model = tf.sequential();
    const optimizer = 'rmsprop';

    // CONV: 16 filters
    model.add(tf.layers.conv2d({
        inputShape: [data.IMAGE_HEIGHT, data.IMAGE_WIDTH, 1],
        kernelSize: 3,
        filters: 16,
        activation: 'relu'
    }));
    // MAXPOOL: 2x2
    model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
    // CONV: 32 filters
    model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
    // MAXPOOL: 2x2
    model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
    // CONV: 32 filters
    model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
    // FLATTEN
    model.add(tf.layers.flatten({}));
    // DENSE
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    // DENSE
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    console.log("New model created!");
    
    return model;
};

async function initModel(forceCreate = false) {
    if (forceCreate) {
        model = createModel();
        return model;
    }

    // Model already initialized
    if (model) return model;

    // Load pre-trained model
    let backupAvailable = fs.existsSync(DEFAULT_MODEL_PATH);
    if (backupAvailable) {
        const optimizer = 'rmsprop';

        model = await tf.loadModel(`file://${DEFAULT_MODEL_PATH}/model.json`);
        model.compile({
            optimizer: optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });

        console.log("Pre-trained model loaded!");
        
        return model;
    }
    
    // No pre-trained model available => create one
    model = createModel();
    return model;
}

// Public functions

exports.train = async function(epochs, modelSavePath = DEFAULT_MODEL_PATH) {
    await initModel(true);

    const LEARNING_RATE = 0.01;

    // Parameters
    const batchSize = 320;
    const validationSplit = 0.15;   // 15% of training data for validation
    const trainEpochs = epochs;

    // Data
    await data.loadData();
    const trainData = data.getTrainData();

    // Train
    const totalNumBatches = Math.ceil(trainData.images.shape[0] * (1 - validationSplit) / batchSize) * trainEpochs;
    let trainBatchCount = 0;

    await model.fit(trainData.images, trainData.labels, {
        batchSize,
        validationSplit,
        epochs: trainEpochs,
        callbacks: {
            onBatchEnd: async (batch, logs) => {
                trainBatchCount++;
                console.log(`\nProgress: ${trainBatchCount / totalNumBatches * 100}%`);
                await tf.nextFrame();
            },
            // onEpochEnd: async (epoch, logs) =>  {
            //     await tf.nextFrame();
            // }
        }
    });

    // Save model
    await model.save(`file://${modelSavePath}`);
    console.log(`Saved model to path: ${modelSavePath}`);
};

exports.evaluate = async function() {
    await initModel();

    // Data
    await data.loadData();
    const testData = data.getTestData();

    // Evaluate
    console.log('Evaluating model on test data...');
    const evalOutput = model.evaluate(testData.images, testData.labels);
    console.log('> Loss:', evalOutput[0].dataSync()[0].toFixed(3));
    console.log('> Accuracy:', evalOutput[1].dataSync()[0].toFixed(3));
};

exports.predict = async function(imgBytes) {
    await initModel();

    let x = tf.tensor4d(imgBytes, [1, 28, 28, 1]);
    const netOut = model.predict(x);
    const predictions = Array.from(netOut.argMax(1).dataSync());
    return predictions[0];
};
