import airtablewrapper  # For getting and posting info to AirTable
import barcodewrapper  # For creating barcode's based on registration info


PARTICIPANTS = airtablewrapper.get_participants()
BARCODE_DIR = "./barcodes/"

# Setting up the PyBarcode module
BARCODE_OPTIONS = {'font_size': 10, 'text': 'Testing',
                   'module_width': 0.75, 'module_height': 10}

# Iterate through each participant and generate a barcode
for participant in PARTICIPANTS:
    try:
        # If the participant already has a generated barcode, don't create a new one
        barcodewrapper.barcodeList.append(
            participant['fields']['Barcode']['text'])
        print("Participant already has the generated barcode")

    except KeyError:
        barcode = barcodewrapper.createBarcode(participant)
        participantName = airtablewrapper.get_full_name(participant)
        barcodeImg = barcode.save(
            BARCODE_DIR + participantName, BARCODE_OPTIONS)
        airtablewrapper.add_participant_barcode(participant, barcode)
