import random          # For adding random digits to the bar code
import barcodeWrapper  # For creating barcode's based on registration info
import airtableWrapper  # For getting and posting info to AirTable

listOfParticipants = airtableWrapper.getParticipants()
barcodeDir = "./barcodes/"

# Setting up the PyBarcode module
barcodeOptions = {'font_size': 10, 'text': 'Testing', 'module_width': 0.75, 'module_height': 10}


# Iterate through each participant and generate a barcode
for participant in listOfParticipants:
    try:
        # If the participant already has a generated barcode, don't create a new one
        barcodeWrapper.barcodeList.append(participant['fields']['Barcode']['text'])
        print("Participant already has the generated barcode")

    except KeyError:
        barcode = barcodeWrapper.createBarcode(participant)
        participantName = airtableWrapper.getFullName(participant)
        barcodeImg = barcode.save(barcodeDir + participantName, barcodeOptions)
        airtableWrapper.addParticipantBarcode(participant, barcode)
