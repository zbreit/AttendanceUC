var barcodeInput = document.getElementById('barcode-input');
var prevVal = barcodeInput.value;
var currentVal = barcodeInput.value;
var eventList = [];
var eventURL = 'https://api.airtable.com/v0/appAmvoUMZeuE3Avq/Events?api_key=';
var airtableKey;

function getApiKey() {
    var xhr = new XMLHttpRequest();
    var file_data = {};
    var api_key = '';

    xhr.open('GET', 'http://localhost:8000/js/config.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            file_data = JSON.parse(xhr.responseText);
            airtableKey = file_data['api_key'];
        }
    };
    xhr.send();
}

function focusBarcodeInput() {
    barcodeInput.focus();
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
    var barcodeRegEx = /\b\d{8}\b/ //Exactly 8 integers
    return barcodeRegEx.test(barcodeInput);
}

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

function sendBarcode(barcodeVal) {
    //DUMMY FUNCTION
    return;
}

function getEventList() {
    var airtableGetRequest = new XMLHttpRequest();
    var airtableEndPoint = eventURL + airtableKey
    airtableGetRequest.open('GET', airtableEndPoint, true); //TODO: fix API key security issue
    airtableGetRequest.onreadystatechange = function() {
        if (airtableGetRequest.readyState === 4 && airtableGetRequest.status === 200) {
            console.log("Connected to airtable");
            console.log(airtableGetRequest.responseText);
        }
    }
    airtableGetRequest.send();

}



document.addEventListener('DOMContentLoaded', function() {
    focusBarcodeInput();
    getApiKey();
    setTimeout(function() {
        console.log("waiting");
    }, 1000);
    eventList = getEventList();
});
var checker = setInterval('sendBarcodeIfValid()', 500);
