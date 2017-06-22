//(function() { //Create a module to make all variables anonymous
    // Grab the pertinent elements from the DOM
    var barcodeInput = document.getElementById('barcode-input');
    var eventDropdown = document.getElementById('event-dropdown');
    var notificationBar = document.getElementById('notification');
    var hackpointsPopup = document.getElementById('hackpoints-notification');
    var pointValText = document.getElementById('point-value');
    // The Airtable Basic information
    var baseURL = 'https://api.airtable.com/v0/appzBX90ZCoEcaxry/';
    var apiKeyParam = '?api_key='
    var eventURL = baseURL + 'Events' + apiKeyParam;
    var attendanceURL = baseURL + 'List%20of%20Atendees' + apiKeyParam;
    var attendEventURL = baseURL + 'List%20of%20Atendees/';
    var hackUCEventId = 'recqLzFdQq6MTdsTk';
    // The airtable API Key
    var airtableKey;
    var eventJSON;
    var barcodeListOffset = "";
    var eventList = [];
    var barcodeList = [];
    var listOfAttendees = [];
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
        var barcodeReq = new XMLHttpRequest();
        barcodeEndpoint = attendanceURL + airtableKey + barcodeListOffset;
        barcodeReq.open('GET', barcodeEndpoint, true);
        barcodeReq.onreadystatechange = function() {
            if (barcodeReq.readyState === 4 && barcodeReq.status === 200) {
                var responseJSON = JSON.parse(barcodeReq.responseText);
                console.log(responseJSON);
                responseJSON['records'].forEach(function(participant, index, array) {
                    listOfAttendees.push(participant);
                });
                if('offset' in responseJSON) {
                    barcodeListOffset = "&offset=" + responseJSON['offset'];
                    console.log("Exceeded 100 record limit. Issuing another request...");
                    getBarcodeList();
                    return;
                }
                else {
                    console.log("Successfully retrieved", listOfAttendees.length, "records.");
                    listOfAttendees.forEach(function(participant, index, array) {
                        console.log("Processing barcode for participant", index + 1, "out of", listOfAttendees.length, "...");
                        try {
                            var participantId = participant['id'];
                            var participantName = participant['fields']['First Name'] + ' ' + participant['fields']['Last Name'];
                            var barcodeNum = participant['fields']['Barcode']['text'];
                            var listOfEvents = participant['fields']['Events'];
                            if(listOfEvents === undefined) {
                                listOfEvents = [];
                            }
                        }
                        catch(error) {
                            console.log("ERROR:", error);
                            console.log("Skipping over particpant...");
                            return;
                        }
                        // Ensures that the name and barcode have the same index in their respective arrays
                        barcodeList.push(barcodeNum);
                        participantIds.push(participantId);
                        participantNames.push(participantName);
                        participantEvents.push(listOfEvents);
                    });
                }
            }
        }
        barcodeReq.send();
    }

    function getApiKey() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://212.237.22.247/config.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                file_data = JSON.parse(xhr.responseText);
                airtableKey = file_data['api_key'];
                document.dispatchEvent(gatheredApiKey);
            }
        };
        xhr.send();
    }

    function focusBarcodeInput() {
        barcodeInput.focus();
    }

    function isValidBarcode(barcodeInput) {
        var barcodeRegEx = /\b\d{7}\b/ //Exactly 7 integers
        var passesRegex = barcodeRegEx.test(barcodeInput);
        var barcodeInList = barcodeList.includes(barcodeInput); //If the barcode can be found in the list of barcodes
        if(passesRegex && !barcodeInList) {
            resetInput();
            displayNotification('Invalid barcode');
        }
        return (passesRegex && barcodeInList);
    }

    function sendBarcodeIfValid() {
        currentVal = barcodeInput.value;
        if (isValidBarcode(currentVal)) {
                console.log('Valid Barcode')
                attendEvent(currentVal);
        }
    }

    function attendEvent(barcodeVal) {
        var eventId = getCurrentEventID();
        var participantIndex = getParticipantIndex(barcodeVal);
        var participantId = getParticipantId(participantIndex);
        var attendReq = new XMLHttpRequest();
        // If the participant hasn't already attended this event
        if(!participantEvents[participantIndex].includes(eventId)) {
            participantEvents[participantIndex].push(eventId);
        }
        else {
          var errorMessage = 'Participant already attended this event';
          displayNotification(errorMessage);
          resetInput();
          return;
        }
        if(eventId === hackUCEventId) {
            var paramObj = {
                'fields' : {
                    'Events': participantEvents[participantIndex],
                    'In Attendance': true
                }
            };
        }
        else {
            var paramObj = {
                'fields' : {
                    'Events': participantEvents[participantIndex]
                }
            };
        }
        var attendReqEndpoint = attendEventURL + participantId;
        attendReq.open('PATCH', attendReqEndpoint, true);
        attendReq.setRequestHeader('Content-Type', 'application/json');
        attendReq.setRequestHeader('Authorization', 'Bearer ' + airtableKey)
        attendReq.onreadystatechange = function() {
            if (attendReq.readyState === 4 && attendReq.status === 200) {
                console.log('Attended Event!');
                var message = getSuccessMessage(participantIndex);
                displayNotification(message);
                displayPointValue(eventId);
                resetInput();
            }
        };
        attendReq.send(JSON.stringify(paramObj));
    }

    function resetInput() {
        console.log('Resetting input');
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
        return participantName + ' successfully signed into ' + currentEventName;
    }

    function displayNotification(message) {
        notificationBar.innerHTML = null; //Clear the current message
        var notificationText = document.createTextNode(message);
        notificationBar.appendChild(notificationText);
        console.log(message);
        notificationBar.classList.add('active');
        window.setTimeout(function() {
            notificationBar.classList.remove('active');
        }, 3500);
    }

    function displayPointValue(eventId) {
        var pointValue = getPointValue(eventId);
        if(pointValue === 0) {
            return; // If the event isn't worth anything, don't display any point values
        }
        var pointNotification = '+' + pointValue.toString();
        pointValText.innerHTML = null;
        var pointValTextNode = document.createTextNode(pointNotification);
        pointValText.appendChild(pointValTextNode);
        hackpointsPopup.classList.add('active');
        window.setTimeout(function() {
            hackpointsPopup.classList.remove('active');
        }, 3500);
    }

    function getPointValue(eventId) {
        var pointValue = null;
        eventJSON['records'].forEach(function(currentVal, index, array) {
            if(currentVal['id'] === eventId) {
                pointValue = currentVal['fields']['Points'];
            }
        });
        if(pointValue === null) {
            console.log("ERROR: Invalid Event ID");
            return 0;
        }
        return pointValue;
    }

    function getEventList() {
        var airtableGetRequest = new XMLHttpRequest();
        var airtableEndPoint = eventURL + airtableKey
        airtableGetRequest.open('GET', airtableEndPoint, true);
        airtableGetRequest.onreadystatechange = function() {
            if (airtableGetRequest.readyState === 4 && airtableGetRequest.status === 200) {
                console.log('Retrieved Event List');
                eventJSON = JSON.parse(airtableGetRequest.responseText);
                document.dispatchEvent(gatheredEventList);
            }
        }
        airtableGetRequest.send();
    }

    function updateEventList() {
        var eventDropdown = document.getElementById('event-dropdown');
        eventJSON['records'].forEach(function(currentVal, index, array) {
            var event = document.createElement('option');
            var eventName = currentVal['fields']['Name'];
            var eventId = currentVal['id'];
            var eventText = document.createTextNode(eventName);
            var valueAttribute = document.createAttribute('value');
            valueAttribute.value = eventId;
            event.setAttributeNode(valueAttribute);
            event.appendChild(eventText);
            eventDropdown.appendChild(event);
        });
        eventDropdown.value = hackUCEventId;
    }


    document.addEventListener('DOMContentLoaded', function() {
        focusBarcodeInput();
        getApiKey();
    });

    var checker = setInterval(sendBarcodeIfValid, 500);
//}());
