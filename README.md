# Digits recognition (MNIST dataset)
A small system that is capable of recognizing handwritten digits using convolutional neural network to predict MNIST dataset inputs.

## Getting Started
### Prerequisites
To run the code locally, you need the following dependencies installed:
* [Node.js](https://nodejs.org/en/])
* [NPM CLI](https://docs.npmjs.com/cli/npm)
 
### Installing
Get source code and install node modules: 
```
git clone https://github.com/rubensrech/tfjs-mnist
cd tfjs-mnist
npm install
```
## Running

### Starting the server
First, you need to start the *node* server:
```
node index.js
```

### Opening the front-end
After starting the server, open in your browser:
http://localhost:3000/

## Testing
Some *png* images of digits are available in `examples` directory.
You can use them for testing pourposes.
The source code includes a model that was pre-trained (and will be auto-loaded) using grayscale 28x28 images (from MNIST dataset).

## Authors

* **Rubens Luiz Rech Junior** - rlrjunior@inf.ufrgs.br

