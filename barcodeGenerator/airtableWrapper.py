"""
## Airtable Wrapper

This airtable module provides helper functions to easily send and
receive data from our Airtable. This wrapper requires the `requests`
module to be installed. The following functions are defined:

- `get_participants()` --> Returns a list of particpants from the airtable
- `send_request()`     --> A helper function to interface with `requests`
- `get_full_name(participant)` --> Returns the full name of a participant
"""

import requests  # For interfacing with the registration info on AirTable
import json

# Stores a global list of participants
attendeesList = []


class API(object):
    """A class to store basic information about API's"""

    def __init__(self, url, req_params):
        self.url = url
        self.req_params = req_params

    def __repr__(self):
        return '{}(url={}, req_params={})'.format(self.__class__.__name__, self.url, self.req_params)


# AirTable request variables
airtableConfigFile = open('airtableSecret.json')
airtableConfigs = json.load(airtableConfigFile)
AIRTABLE_KEY = airtableConfigs['API_KEY']
AIRTABLE_URL = airtableConfigs['URL']
airtableParams = {
    'View': "Main View",
    'api_key': AIRTABLE_KEY
}

def get_participants():
    """Grabs a list of participants from airtable. Exits the program on error"""
    get_req = send_request('get', AIRTABLE_URL, params=airtableParams)
    attendees_list = get_req.json()['records']
    while('offset' in get_req.json()):
        print("Exceeded 100 record limit. Issuing another request...")
        airtableParams['offset'] = get_req.json()['offset']
        get_req = send_request('get', AIRTABLE_URL, params=airtableParams)
        attendees_list += get_req.json()['records']
    print("Retrieved %d participants from airtable" % (len(attendees_list)))
    return attendees_list


def send_request(requestMethod, url, **kwargs):
    """Issues API requests with more verbose output"""
    try:
        print('Performing the ' + requestMethod + ' request...')
        req = requests.request(requestMethod, url, **kwargs)
        req.raise_for_status()
        print('Successfully connected to "%s" with a status of %s.\n' %
              (req.url, req.status_code))
    # If there's an error with the request, provide advice to fix it and exit the program
    except requests.exceptions.HTTPError:
        print('You\'re getting a %s HTTP status with this URL:\n"%s"' %
              (req.status_code, req.url))
        if(kwargs):
            print('And these arguments: ')
            for kw in kwargs:
                print(kw, ':', kwargs[kw])
        exit()
    return req


def get_full_name(participant):
    """Returns the full name of a given participant"""
    return participant['fields']['First Name'].strip() + \
        ' ' + participant['fields']['Last Name'].strip()


def add_participant_barcode(participant, barcode):
    """Update participant in airtable with their barcode and their barcode image"""
    patchURL = AIRTABLE_URL + "/" + participant['id']

    barcodeObj = {
        'text': barcode.ean,
        'type': 'ean8'
    }
    participantData = {
        'fields': {
            'Barcode': barcodeObj
        }
    }
    print("Updating data for %s..." % (get_full_name(participant)))
    patchReq = send_request(
        'patch', patchURL, params=airtableParams, json=participantData)
