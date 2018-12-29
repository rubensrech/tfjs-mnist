$('document').ready(function() {
    var input = $('input#imgPicker')[0];
    var imgPrev = $('img#imgPreview');
    var resultEl = $('span#result');

    function recognize(imgData, callback) {
        $.ajax({
            type: "POST",
            url: '/api/recognize-digit',
            dataType: 'JSON',
            data: { base64: imgData },
            success: function(resp) {
                callback(resp.result);
            }
        });
    }

    function newDigit() {
        var file = input.files[0];
        var fileReader = new FileReader();
        fileReader.onloadend = function(e) {
            var imgData = fileReader.result;

            imgPrev.attr('src', imgData).show();
            resultEl.html('Recognizing...');

            recognize(imgData, function(digit) {
                resultEl.html('The digit is: ' + digit);
            });
        };
        fileReader.readAsDataURL(file);
    }

    input.addEventListener('change', newDigit);
});