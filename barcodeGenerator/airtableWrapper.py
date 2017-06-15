import os        # For accessing the API key environment variable
import requests  # For interfacing with the registration info on AirTable

# AirTable request variables
airtableKey = 'keyMBUvruNJcIPtjx'
airtableURL = 'https://api.airtable.com/v0/appAmvoUMZeuE3Avq/List%20of%20Atendees'
airtableParams = {
    'View': "Main View",
    'api_key': airtableKey
}

# Filestack request variables
filestackURL = 'https://www.filestackapi.com/api/store/S3'
filestackKey = 'AfIoeNsWvRLWTI33vycMQz'
filestackParams = {
    'key': filestackKey
}


def getParticipants():
    """Grabs a list of participants from airtable. Exits the program on error"""
    getReq = sendRequest('get', airtableURL, params=airtableParams)
    return getReq.json()['records']


def sendRequest(requestMethod, url, **kwargs):
    try:
        print('Performing the ' + requestMethod + ' request...')
        req = requests.request(requestMethod, url, **kwargs)
        req.raise_for_status()
        print('Successfully connected to "%s" with a status of %s.\n' % (req.url, req.status_code))
    # If there's an error with the request, provide advice to fix it and exit the program
    except requests.exceptions.HTTPError:
        print('You\'re getting a %s HTTP status with this URL:\n"%s"' % (req.status_code, req.url))
        if(kwargs != None):
            print('And these arguments: ')
            for kw in kwargs:
                print(kw, ':', kwargs[kw])
        exit()
    return req


def getFullName(participant):
    """Returns the full name of a given participant"""
    return participant['fields']['First Name'].strip() + ' ' + participant['fields']['Last Name'].strip()


def filestackUpload(fileName):
    """Upload the image file to filestack and return its URL"""
    barcodeFile = {
        'fileUpload': open('./barcodes/' + fileName, 'rb')
    }
    filestackReq = sendRequest('post', filestackURL, params=filestackParams, files=barcodeFile)
    return filestackReq.json()


def addParticipantBarcode(participant, barcode):
    """Update participant in airtable with their barcode and their barcode image"""
    patchURL = airtableURL + "/" + participant['id']
    fileName = getFullName(participant) + '.png'
    fileURL = filestackUpload(fileName)['url']
    barcodeObj = {
        'text': barcode.get_fullcode(),
        'type': 'ean8'
    }
    barcodeImgFile = [{
        'url': fileURL,
        'filename': fileName
    }]
    participantData = {
        'fields': {
            'Barcode': barcodeObj,
            'Barcode Image': barcodeImgFile
        }
    }
    print("Updating data for %s..." % (getFullName(participant)))
    patchReq = sendRequest('patch', patchURL, params=airtableParams, json=participantData)
