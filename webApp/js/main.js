var barcodeInput = document.getElementById('barcode-input');
var prevVal = barcodeInput.value;
var currentVal = barcodeInput.value;


function focusBarcodeInput() {
    barcodeInput.focus();
}

document.addEventListener('DOMContentLoaded', focusBarcodeInput);

function sendBarcodeIfValid() {
    currentVal = barcodeInput.value;
    if (hasInputChanged()) {
        console.log('Input Value Change');
        if (isValidBarcode(currentVal)) {
            console.log('Valid Barcode')
            sendBarcode(currentVal);
        }
    }
}

function hasInputChanged() {
    if (currentVal !== prevVal) {
        prevVal = currentVal;
        return true;
    } else {
        return false;
    }
}

function isValidBarcode(barcodeInput) {
    var barcodeRegEx = /\b\d{8}\b/
    return barcodeRegEx.test(barcodeInput);
}

function sendBarcode(barcodeVal) {
    //DUMMY FUNCTION
    return;
}

var checker = setInterval('sendBarcodeIfValid()', 500);
