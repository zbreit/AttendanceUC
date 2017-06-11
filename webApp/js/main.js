//(function() { //Create a module to make all variables anonymous
    var barcodeInput = document.getElementById('barcode-input');
    var eventDropdown = document.getElementById('event-dropdown');
    var notificationBar = document.getElementById('notification');
    var prevVal = barcodeInput.value;
    var currentVal = prevVal;
    var baseURL = "https://api.airtable.com/v0/appAmvoUMZeuE3Avq/"
    var apiKeyParam = "?api_key="
    var eventURL = baseURL + 'Events' + apiKeyParam;
    var attendanceURL = baseURL + "List%20of%20Atendees" + apiKeyParam;
    var attendEventURL = baseURL + "List%20of%20Atendees/"
    var airtableKey;
    var eventDict;
    var eventList = [];
    var barcodeList = [];
    var participantIds = [];
    var participantNames = [];
    var participantEvents = [];
    var gatheredApiKey = new Event('apiKeyRetrieved');
    var gatheredEventList = new Event('eventListRetrieved');

    document.addEventListener('apiKeyRetrieved', function() {
        getEventList();
        getBarcodeList();
    }, false);

    document.addEventListener('eventListRetrieved', updateEventList, false);

    function getBarcodeList() {
        barcodeReq = new XMLHttpRequest();
        barcodeEndpoint = attendanceURL + airtableKey
        barcodeReq.open('GET', barcodeEndpoint, true);
        barcodeReq.onreadystatechange = function() {
            if (barcodeReq.readyState === 4 && barcodeReq.status === 200) {
                listOfAttendees = JSON.parse(barcodeReq.responseText);
                listOfAttendees['records'].forEach(function(participant, index, array) {
                    var participantId = participant['id'];
                    var participantName = participant['fields']['First Name'] + " " + participant['fields']['Last Name'];
                    var barcodeNum = participant['fields']['Barcode']['text'];
                    var listOfEvents = participant['fields']['Events'];
                    if(listOfEvents === undefined) {
                        listOfEvents = [];
                    }
                    //Ensures that the name and barcode have the same index in their respective arrays
                    barcodeList.push(barcodeNum);
                    participantIds.push(participantId);
                    participantNames.push(participantName);
                    participantEvents.push(listOfEvents);
                });
            }
        }
        barcodeReq.send();
    }

    function getApiKey() {
        var xhr = new XMLHttpRequest();
        var file_data = {};

        xhr.open('GET', 'http://212.237.22.247/config.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                file_data = JSON.parse(xhr.responseText);
                airtableKey = file_data['api_key'];
                document.dispatchEvent(gatheredApiKey);
            }
        };
        xhr.send();
        //airtableKey = 'keyMBUvruNJcIPtjx';
        //document.dispatchEvent(gatheredApiKey);
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
        var passesRegex = barcodeRegEx.test(barcodeInput);
        var barcodeInList = barcodeList.includes(barcodeInput); //If the barcode can be found in the list of barcodes
        return (passesRegex && barcodeInList);
    }

    function sendBarcodeIfValid() {
        currentVal = barcodeInput.value;
        if (hasInputChanged()) {
            console.log('Input Value Change');
            if (isValidBarcode(currentVal)) {
                console.log('Valid Barcode')
                attendEvent(currentVal);
            }
        }
    }

    function attendEvent(barcodeVal) {
        var eventId = getCurrentEventID();
        var participantIndex = getParticipantIndex(barcodeVal);
        var participantId = getParticipantId(participantIndex);
        var attendReq = new XMLHttpRequest();
        if(!participantEvents[participantIndex].includes(eventId)) {
            participantEvents[participantIndex].push(eventId);
        }
        else {
          var errorMessage = "Participant already attended this event";
          displayNotification(errorMessage);
          resetInput();
          return;
        }
         //TODO: Check if the event is already added
        var paramObj = {
            "fields" : {
                "Events": participantEvents[participantIndex]
            }
        };
        var attendReqEndpoint = attendEventURL + participantId;
        attendReq.open('PATCH', attendReqEndpoint, true);
        attendReq.setRequestHeader("Content-Type", "application/json");
        attendReq.setRequestHeader("Authorization", "Bearer " + airtableKey)
        attendReq.onreadystatechange = function() {
            if (attendReq.readyState === 4 && attendReq.status === 200) {
                console.log("Attended Event!");
                var message = getSuccessMessage(participantIndex);
                displayNotification(message);
                resetInput();
            }
        };
        attendReq.send(JSON.stringify(paramObj));
    }

    function resetInput() {
        console.log("Resetting input");
        barcodeInput.value = null;
    }

    function getCurrentEventID() {
        return eventDropdown.options[eventDropdown.selectedIndex].value;
    }

    function getParticipantIndex(barcodeNum) {
        return barcodeList.indexOf(barcodeNum);
    }

    function getParticipantId(index) {
        return participantIds[index];
    }

    function getSuccessMessage(index) {
        var currentEventName = eventDropdown.options[eventDropdown.selectedIndex].textContent;
        var participantName = participantNames[index];
        return participantName + " successfully signed into " + currentEventName + "!"
    }

    function displayNotification(message) {
        notificationBar.innerHTML = null; //Clear the current message
        notificationBar.innerHTML = message;
        console.log(message);
        notificationBar.classList.add("active");
        window.setTimeout(function() {
            notificationBar.classList.remove("active");
        }, 5000);
    }

    function getEventList() {
        var airtableGetRequest = new XMLHttpRequest();
        var airtableEndPoint = eventURL + airtableKey
        airtableGetRequest.open('GET', airtableEndPoint, true);
        airtableGetRequest.onreadystatechange = function() {
            if (airtableGetRequest.readyState === 4 && airtableGetRequest.status === 200) {
                console.log("Retrieved Event List");
                eventDict = JSON.parse(airtableGetRequest.responseText);
                document.dispatchEvent(gatheredEventList);
            }
        }
        airtableGetRequest.send();
    }

    function updateEventList() {
        var eventDropdown = document.getElementById('event-dropdown');
        eventDict["records"].forEach(function(currentVal, index, array) {
            var event = document.createElement("option");
            var eventName = currentVal['fields']['Name'];
            var eventId = currentVal['id'];
            var eventText = document.createTextNode(eventName);
            var valueAttribute = document.createAttribute('value');
            valueAttribute.value = eventId;
            event.setAttributeNode(valueAttribute);
            event.appendChild(eventText);
            eventDropdown.appendChild(event);
        });
        var hackUCId = 'reca3ek48KVQtSjsS';
        eventDropdown.value = hackUCId;
    }


    document.addEventListener('DOMContentLoaded', function() {
        focusBarcodeInput();
        getApiKey();
    });

    var checker = setInterval(sendBarcodeIfValid, 500);
// }());
