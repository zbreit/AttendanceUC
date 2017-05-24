import os        # For accessing the API key environment variable
import requests  # For interfacing with the registration info on AirTable

# AirTable request variables
airtableKey = os.environ['AIRTABLE_API_KEY']
airtableURL = os.environ['AIRTABLE_URL']
airtableParams = {'View': "Main View", 'api_key': airtableKey}


def getParticipants():
    """Grabs a list of participants from airtable. Exits the program on error"""
    getReq = connectToAirtable('get')
    return getReq.json()['records']


def connectToAirtable(requestMethod, **kwargs):
    try:
        print('Performing the ' + requestMethod + ' request...')
        req = requests.request(requestMethod, airtableURL, params=airtableParams, **kwargs)
        req.raise_for_status()
        print('Successfully connected to "%s" with a status of %s.\n' % (req.url, req.status_code))
    # If there's an error with the request, provide advice to fix it and exit the program
    except requests.exceptions.HTTPError:
        print('You\'re getting a %s HTTP status with this URL:\n"%s"' % (req.status_code, req.url))
        if(req.status_code == 404):
            print('Try fixing your $AIRTABLE_URL environment variable to fix the URL.')
        exit()
    return req


def getFullName(participant):
    """Returns the full name of a given participant"""
    return participant['fields']['First Name'] + participant['fields']['Last Name']


def addParticipantBarcode(participant, barcode, barcodeImg):
    """Update participant in airtable with their barcode and their barcode image"""
    patchURL = airtableURL + "/" + participant['id']
    barcodeNum = barcode.get_fullcode()
    fileName = getFullName(participant) + '.svg'
    barcodeImgFile = [{
        'url': './barcodes/' + fileName,
        'filename': fileName
    }]
    barcodeInfo = {
        "Barcode": barcodeNum,
        "Barcode Image": barcodeImgFile
    }
    patchReq = connectToAirtable('patch', json=barcodeInfo)
