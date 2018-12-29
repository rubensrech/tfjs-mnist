const PNG = require('pngjs').PNG;
const model = require('./model');

function recognizeDigit(req, res) {
    var imgBase64 = req.body.base64;
    imgBase64 = imgBase64.split(',')[1];
    var imgData = Buffer.from(imgBase64, 'base64');    
    
    let img = new PNG({ filterType: 4, colorType: 0 }).parse(imgData);
    img.on('parsed', function() {
        let imgSize = this.height * this.width;
        const bytesBuffer = new ArrayBuffer(1 * imgSize * 4);
        const bytesView = new Float32Array(bytesBuffer, 0, imgSize);

        for (var j = 0; j < this.data.length / 4; j++) {
            bytesView[j] = this.data[j * 4] / 255;
        }

        model.predict(bytesView).then(function(a) {
            res.json({ result: a });
        });
    });
}

module.exports = function(app) {

    app.post('/api/recognize-digit', recognizeDigit);

};

