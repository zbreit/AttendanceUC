import airtablewrapper  # For getting and posting info to AirTable
import barcodewrapper   # For creating barcode's based on registration info

# Iterate through each participant and generate a barcode
for participant in airtablewrapper.get_participants():
    try:
        # If the participant already has a generated barcode, don't create a new one
        barcodewrapper.barcodeList.append(
            participant['fields']['Barcode']['text'])
        print("Participant already has the generated barcode")

    except KeyError:
        barcode = barcodewrapper.createBarcode(participant)
        participantName = airtablewrapper.get_full_name(participant)
        airtablewrapper.add_participant_barcode(participant, barcode)
